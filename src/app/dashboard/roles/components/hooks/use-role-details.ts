'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface RoleDetailsData {
  id: string
  name: string
  description: string | null
  permissions: string[]
  userCount: number
  permissionCount: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  _count?: {
    users: number
  }
}

interface UserData {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

interface UseRoleDetailsReturn {
  role: RoleDetailsData | null
  users: UserData[]
  isLoading: boolean
  isUsersLoading: boolean
  error: string | null
  refreshRole: () => Promise<void>
  refreshUsers: () => Promise<void>
}

export function useRoleDetails(roleId: string): UseRoleDetailsReturn {
  const [role, setRole] = useState<RoleDetailsData | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUsersLoading, setIsUsersLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRole = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/roles/${roleId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch role')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Role not found')
      }

      setRole(result.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load role'
      setError(errorMessage)
      console.error('Error fetching role:', err)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setIsUsersLoading(true)
      
      const response = await fetch(`/api/roles/${roleId}/users`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch role users')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch role users')
      }

      setUsers(result.data || [])
    } catch (err) {
      console.error('Error fetching role users:', err)
      // Don't show toast for users error, just log it
    } finally {
      setIsUsersLoading(false)
    }
  }

  const refreshRole = async () => {
    await fetchRole()
  }

  const refreshUsers = async () => {
    await fetchUsers()
  }

  // Initial fetch
  useEffect(() => {
    if (roleId) {
      fetchRole()
      fetchUsers()
    }
  }, [roleId])

  return {
    role,
    users,
    isLoading,
    isUsersLoading,
    error,
    refreshRole,
    refreshUsers
  }
}
