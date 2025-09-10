'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from '@/lib/toast'
import type { Role, RoleStats, RoleFilters } from '../utils/role-types'

interface UseRolesParams {
  filters?: RoleFilters
  page?: number
  limit?: number
}

interface UseRolesReturn {
  roles: Role[]
  stats: RoleStats
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    itemsPerPage: number
  } | null
  loading: boolean
  isFiltering: boolean
  error: string | null
  refreshRoles: () => void
  createRole: (data: any) => Promise<Role>
  updateRole: (id: string, data: any) => Promise<Role>
  deleteRole: (id: string) => Promise<void>
  searchRoles: (term: string) => void
  filterByType: (type: string) => void
  filterByPermission: (permission: string) => void
}

export function useRoles(params: UseRolesParams = {}): UseRolesReturn {
  const { filters = { searchTerm: '', selectedType: 'all', selectedPermission: 'all' }, page = 1, limit = 10 } = params
  
  const [roles, setRoles] = useState<Role[]>([])
  const [stats, setStats] = useState<RoleStats>({
    total: 0,
    active: 0,
    systemRoles: 0,
    customRoles: 0
  })
  const [pagination, setPagination] = useState<{
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    itemsPerPage: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = useCallback(async (isFilteringRequest = false) => {
    try {
      if (isFilteringRequest) {
        setIsFiltering(true)
      } else {
        setLoading(true)
      }
      
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.searchTerm && { search: filters.searchTerm }),
        ...(filters.selectedType !== 'all' && { type: filters.selectedType }),
        ...(filters.selectedPermission !== 'all' && { permission: filters.selectedPermission }),
      })
      
      const response = await fetch(`/api/roles?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch roles')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch roles')
      }
      
      setRoles(result.data || [])
      
      // Calculate stats from the role data
      const roleData = result.data || []
      const totalRoles = roleData.length
      const systemRoles = roleData.filter((role: any) => 
        ['SUPER_ADMIN', 'ADMIN', 'USER'].includes(role.name)
      ).length
      const customRoles = totalRoles - systemRoles
      const activeRoles = roleData.filter((role: any) => 
        role.userCount > 0
      ).length
      
      setStats({
        total: totalRoles,
        active: activeRoles,
        systemRoles,
        customRoles
      })
      
      if (result.pagination) {
        setPagination({
          currentPage: result.pagination.page,
          totalPages: result.pagination.totalPages,
          totalCount: result.pagination.total,
          hasMore: result.pagination.hasNext,
          itemsPerPage: result.pagination.limit
        })
      }
      
    } catch (error) {
      console.error('Error fetching roles:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      toast.error('Gagal memuat data role')
    } finally {
      setLoading(false)
      setIsFiltering(false)
    }
  }, [filters, page, limit])

  // Initial fetch
  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const refreshRoles = useCallback(() => {
    fetchRoles(true)
  }, [fetchRoles])

  const createRole = useCallback(async (data: any): Promise<Role> => {
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create role')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create role')
      }

      toast.success('Role berhasil dibuat')
      await refreshRoles()
      
      return result.data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal membuat role'
      toast.error(message)
      throw error
    }
  }, [refreshRoles])

  const updateRole = useCallback(async (id: string, data: any): Promise<Role> => {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update role')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update role')
      }

      toast.success('Role berhasil diperbarui')
      await refreshRoles()
      
      return result.data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal memperbarui role'
      toast.error(message)
      throw error
    }
  }, [refreshRoles])

  const deleteRole = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete role')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete role')
      }

      toast.success('Role berhasil dihapus')
      await refreshRoles()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal menghapus role'
      toast.error(message)
      throw error
    }
  }, [refreshRoles])

  const searchRoles = useCallback((term: string) => {
    // This would be handled by parent component updating filters
    // For now, just trigger a re-fetch
    fetchRoles(true)
  }, [fetchRoles])

  const filterByType = useCallback((type: string) => {
    // This would be handled by parent component updating filters
    fetchRoles(true)
  }, [fetchRoles])

  const filterByPermission = useCallback((permission: string) => {
    // This would be handled by parent component updating filters
    fetchRoles(true)
  }, [fetchRoles])

  return {
    roles,
    stats,
    pagination,
    loading,
    isFiltering,
    error,
    refreshRoles,
    createRole,
    updateRole,
    deleteRole,
    searchRoles,
    filterByType,
    filterByPermission
  }
}
