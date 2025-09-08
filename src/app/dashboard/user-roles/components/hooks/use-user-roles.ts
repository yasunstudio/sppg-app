"use client"

import { useState, useEffect, useCallback } from 'react'
import type { UserRole, UserRoleStats, UserRoleFilters, PaginationData } from '../utils/user-role-types'

interface UseUserRolesProps {
  filters: UserRoleFilters
  page?: number
  limit?: number
}

interface UseUserRolesReturn {
  userRoles: UserRole[]
  stats: UserRoleStats | null
  paginationData: PaginationData | null
  loading: boolean
  isFiltering: boolean
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Mock data for development
const mockUserRoles: UserRole[] = [
  {
    id: '1',
    userId: '1',
    roleId: '1',
    assignedAt: new Date().toISOString(),
    assignedBy: 'admin',
    isActive: true,
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: undefined,
    },
    role: {
      id: '1',
      name: 'ADMIN',
      description: 'Administrator dengan akses penuh',
      permissions: ['all'],
    },
    assignedByUser: {
      id: 'admin',
      name: 'Admin User',
      email: 'admin@example.com',
    },
  },
  {
    id: '2',
    userId: '2',
    roleId: '2',
    assignedAt: new Date().toISOString(),
    assignedBy: 'admin',
    isActive: true,
    user: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: undefined,
    },
    role: {
      id: '2',
      name: 'CHEF',
      description: 'Chef dengan akses dapur dan menu',
      permissions: ['kitchen.view', 'menu.manage'],
    },
    assignedByUser: {
      id: 'admin',
      name: 'Admin User',
      email: 'admin@example.com',
    },
  },
]

const mockStats: UserRoleStats = {
  total: 25,
  active: 22,
  inactive: 3,
  rolesCount: 4,
  recent30Days: 5,
}

export const useUserRoles = ({ filters, page = 1, limit = 10 }: UseUserRolesProps): UseUserRolesReturn => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [stats, setStats] = useState<UserRoleStats | null>(null)
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserRoles = useCallback(async () => {
    try {
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Filter mock data based on filters
      let filteredRoles = mockUserRoles
      
      if (filters.search) {
        filteredRoles = filteredRoles.filter(ur => 
          ur.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          ur.user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          ur.role.name.toLowerCase().includes(filters.search.toLowerCase())
        )
      }
      
      if (filters.role) {
        filteredRoles = filteredRoles.filter(ur => ur.role.name === filters.role)
      }
      
      if (filters.status) {
        const isActive = filters.status === 'active'
        filteredRoles = filteredRoles.filter(ur => ur.isActive === isActive)
      }
      
      // Pagination
      const totalItems = filteredRoles.length
      const totalPages = Math.ceil(totalItems / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedRoles = filteredRoles.slice(startIndex, endIndex)
      
      setUserRoles(paginatedRoles)
      setStats(mockStats)
      setPaginationData({
        currentPage: page,
        totalPages,
        totalCount: totalItems,
        itemsPerPage: limit,
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user roles')
    } finally {
      setLoading(false)
      setIsFiltering(false)
    }
  }, [filters, page, limit])

  const refetch = useCallback(async () => {
    setLoading(true)
    await fetchUserRoles()
  }, [fetchUserRoles])

  useEffect(() => {
    setIsFiltering(true)
    fetchUserRoles()
  }, [fetchUserRoles])

  return {
    userRoles,
    stats,
    paginationData,
    loading,
    isFiltering,
    isLoading: loading,
    error,
    refetch,
  }
}
