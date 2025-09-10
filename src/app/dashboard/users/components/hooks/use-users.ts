'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User, UserStats, UserFilters } from '../utils/user-types'

interface UseUsersParams {
  filters?: UserFilters
  page?: number
  limit?: number
}

interface UseUsersReturn {
  users: User[]
  stats: UserStats | null
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    itemsPerPage: number
  } | null
  loading: boolean
  error: string | null
  refreshUsers: () => void
  createUser: (data: any) => Promise<User>
  updateUser: (id: string, data: any) => Promise<User>
  deleteUser: (id: string) => Promise<void>
  searchUsers: (term: string) => void
  filterByStatus: (status: string) => void
  filterByRole: (role: string) => void
}

export function useUsers(params: UseUsersParams = {}): UseUsersReturn {
  const { filters, page = 1, limit = 20 } = params
  
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [pagination, setPagination] = useState<{
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    itemsPerPage: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const queryParams = new URLSearchParams({
        offset: ((page - 1) * limit).toString(),
        limit: limit.toString(),
        ...(filters?.selectedStatus && filters.selectedStatus !== 'all' && { 
          isActive: filters.selectedStatus === 'active' ? 'true' : 'false' 
        }),
        ...(filters?.selectedRole && filters.selectedRole !== 'all' && { role: filters.selectedRole }),
        ...(filters?.searchTerm && { search: filters.searchTerm })
      })

      const response = await fetch(`/api/users?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch users')
      }

      setUsers(result.data || [])
      setStats(result.stats || null)
      setPagination(result.pagination || null)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, page, limit])

  const refreshUsers = useCallback(() => {
    fetchUsers()
  }, [fetchUsers])

  const createUser = useCallback(async (data: any): Promise<User> => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create user')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create user')
    }

    // Refresh the list after creating
    await fetchUsers()
    
    return result.data
  }, [fetchUsers])

  const updateUser = useCallback(async (id: string, data: any): Promise<User> => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update user')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update user')
    }

    // Refresh the list after updating
    await fetchUsers()
    
    return result.data
  }, [fetchUsers])

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete user')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete user')
    }

    // Refresh the list after deleting
    await fetchUsers()
  }, [fetchUsers])

  const searchUsers = useCallback((term: string) => {
    // This would be handled by refetching with new search term
    // The actual implementation would update filters and refetch
    console.log('Search users:', term)
  }, [])

  const filterByStatus = useCallback((status: string) => {
    // This would be handled by refetching with new status filter
    console.log('Filter by status:', status)
  }, [])

  const filterByRole = useCallback((role: string) => {
    // This would be handled by refetching with new role filter
    console.log('Filter by role:', role)
  }, [])

  // Effect to fetch users when dependencies change
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    stats,
    pagination,
    loading,
    error,
    refreshUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    filterByStatus,
    filterByRole
  }
}
