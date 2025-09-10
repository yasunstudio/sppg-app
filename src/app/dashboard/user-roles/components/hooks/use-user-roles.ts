'use client'

import { useState, useEffect, useCallback } from 'react'
import type { UserRole, UserRoleStats, UserRoleFilters } from '../utils/user-role-types'

interface UseUserRolesParams {
  filters?: UserRoleFilters
  page?: number
  limit?: number
}

interface UseUserRolesReturn {
  userRoles: UserRole[]
  stats: UserRoleStats
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    itemsPerPage: number
  } | null
  loading: boolean
  error: string | null
  refreshUserRoles: () => void
  createUserRole: (data: any) => Promise<UserRole>
  updateUserRole: (id: string, data: any) => Promise<UserRole>
  deleteUserRole: (id: string) => Promise<void>
  searchUserRoles: (term: string) => void
  filterByRole: (role: string) => void
  filterByStatus: (status: string) => void
  filterByUser: (user: string) => void
}

export function useUserRoles(params: UseUserRolesParams = {}): UseUserRolesReturn {
  const { filters, page = 1, limit = 10 } = params
  
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [stats, setStats] = useState<UserRoleStats>({
    total: 0,
    active: 0,
    inactive: 0,
    rolesCount: 0,
    usersCount: 0,
    recent30Days: 0,
    roleBreakdown: []
  })
  const [pagination, setPagination] = useState<{
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    itemsPerPage: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(filters?.searchTerm || '')
  const [selectedRole, setSelectedRole] = useState(filters?.selectedRole || '')
  const [selectedStatus, setSelectedStatus] = useState(filters?.selectedStatus || 'all')
  const [selectedUser, setSelectedUser] = useState(filters?.selectedUser || '')

  const fetchUserRoles = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedRole && selectedRole !== 'all' && { role: selectedRole }),
        ...(selectedStatus && selectedStatus !== 'all' && { status: selectedStatus }),
        ...(selectedUser && selectedUser !== 'all' && { user: selectedUser }),
      })

      const response = await fetch(`/api/user-roles?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user roles')
      }

      const data = await response.json()
      
      setUserRoles(data.data || [])
      setStats(data.stats || {
        total: 0,
        active: 0,
        inactive: 0,
        suspended: 0,
        rolesCount: 0,
        usersCount: 0,
        recent30Days: 0
      })
      setPagination(data.pagination || {
        currentPage: page,
        totalPages: 1,
        totalCount: 0,
        hasMore: false,
        itemsPerPage: limit
      })
    } catch (err) {
      console.error('Error fetching user roles:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setUserRoles([])
      setStats({
        total: 0,
        active: 0,
        inactive: 0,
        rolesCount: 0,
        usersCount: 0,
        recent30Days: 0,
        roleBreakdown: []
      })
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchTerm, selectedRole, selectedStatus, selectedUser])

  useEffect(() => {
    fetchUserRoles()
  }, [fetchUserRoles])

  const refreshUserRoles = useCallback(() => {
    fetchUserRoles()
  }, [fetchUserRoles])

  const createUserRole = useCallback(async (data: any): Promise<UserRole> => {
    try {
      const response = await fetch('/api/user-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create user role')
      }

      const newUserRole = await response.json()
      await refreshUserRoles()
      return newUserRole
    } catch (err) {
      console.error('Error creating user role:', err)
      throw err
    }
  }, [refreshUserRoles])

  const updateUserRole = useCallback(async (id: string, data: any): Promise<UserRole> => {
    try {
      const response = await fetch(`/api/user-roles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user role')
      }

      const updatedUserRole = await response.json()
      await refreshUserRoles()
      return updatedUserRole
    } catch (err) {
      console.error('Error updating user role:', err)
      throw err
    }
  }, [refreshUserRoles])

  const deleteUserRole = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/user-roles/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user role')
      }

      await refreshUserRoles()
    } catch (err) {
      console.error('Error deleting user role:', err)
      throw err
    }
  }, [refreshUserRoles])

  const searchUserRoles = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const filterByRole = useCallback((role: string) => {
    setSelectedRole(role)
  }, [])

  const filterByStatus = useCallback((status: string) => {
    setSelectedStatus(status)
  }, [])

  const filterByUser = useCallback((user: string) => {
    setSelectedUser(user)
  }, [])

  return {
    userRoles,
    stats,
    pagination,
    loading,
    error,
    refreshUserRoles,
    createUserRole,
    updateUserRole,
    deleteUserRole,
    searchUserRoles,
    filterByRole,
    filterByStatus,
    filterByUser,
  }
}
