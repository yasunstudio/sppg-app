// ============================================================================
// USERS HOOK (src/hooks/use-users.ts)
// ============================================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface User {
  id: string
  email: string
  username?: string
  name: string
  phone?: string
  address?: string
  avatar?: string
  isActive: boolean
  roles: {
    role: {
      id: string
      name: string
      description?: string
    }
  }[]
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  email: string
  username?: string
  name: string
  password: string
  phone?: string
  address?: string
  roleIds: string[]
}

export interface UpdateUserData {
  email?: string
  username?: string
  name?: string
  phone?: string
  address?: string
  isActive?: boolean
  roleIds?: string[]
}

export function useUsers() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Fetch users with pagination and filters
  const fetchUsers = useCallback(async (params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    isActive?: boolean
  }) => {
    if (!session?.user) return

    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.search) searchParams.append('search', params.search)
      if (params?.role) searchParams.append('role', params.role)
      if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString())

      const response = await fetch(`/api/users?${searchParams.toString()}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        })
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (error) {
      setError('Failed to fetch users')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [session?.user])

  // Create new user
  const createUser = async (userData: CreateUserData): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (data.success) {
        // Refresh users list
        await fetchUsers()
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to create user' }
    }
  }

  // Update user
  const updateUser = async (userId: string, userData: UpdateUserData): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (data.success) {
        // Update user in local state
        setUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, ...data.data } : user
          )
        )
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to update user' }
    }
  }

  // Delete user
  const deleteUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        // Remove user from local state
        setUsers(prev => prev.filter(user => user.id !== userId))
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to delete user' }
    }
  }

  // Toggle user active status
  const toggleUserStatus = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    const user = users.find(u => u.id === userId)
    if (!user) return { success: false, error: 'User not found' }

    return updateUser(userId, { isActive: !user.isActive })
  }

  // Get user by ID
  const getUserById = async (userId: string): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()

      if (data.success) {
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to fetch user' }
    }
  }

  // Reset user password
  const resetUserPassword = async (userId: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      })

      const data = await response.json()

      if (data.success) {
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to reset password' }
    }
  }

  // Refresh users list
  const refresh = useCallback(() => {
    fetchUsers({ 
      page: pagination.page, 
      limit: pagination.limit 
    })
  }, [fetchUsers, pagination.page, pagination.limit])

  // Initial load
  useEffect(() => {
    if (session?.user) {
      fetchUsers()
    }
  }, [session?.user, fetchUsers])

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUserById,
    resetUserPassword,
    refresh
  }
}
