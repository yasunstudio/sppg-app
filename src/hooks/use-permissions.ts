/**
 * Permission Hooks  
 * React hooks for Database-Driven Permission System
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface UserPermissions {
  userId: string
  roles: Array<{
    id: string
    name: string
    priority: number
  }>
  permissions: string[]
  highestPriority: number
}

interface UsePermissionsReturn {
  permissions: string[]
  roles: Array<{
    id: string
    name: string
    priority: number
  }>
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePermissions(): UsePermissionsReturn {
  const { data: session, status } = useSession()
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = useCallback(async () => {
    if (!session?.user?.id || status !== 'authenticated') {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/permissions/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch permissions: ${response.status}`)
      }

      const data = await response.json()
      setUserPermissions(data)
    } catch (err) {
      console.error('Error fetching permissions:', err)
      setError(err instanceof Error ? err.message : 'Failed to load permissions')
      setUserPermissions(null)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id, status])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPermissions()
    } else if (status === 'unauthenticated') {
      setUserPermissions(null)
      setIsLoading(false)
      setError(null)
    }
  }, [fetchPermissions, status])

  const hasPermission = useCallback((permission: string): boolean => {
    if (!userPermissions) return false
    return userPermissions.permissions.includes(permission)
  }, [userPermissions])

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    if (!userPermissions) return false
    return permissions.some(permission => userPermissions.permissions.includes(permission))
  }, [userPermissions])

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    if (!userPermissions) return false
    return permissions.every(permission => userPermissions.permissions.includes(permission))
  }, [userPermissions])

  const refetch = useCallback(async () => {
    await fetchPermissions()
  }, [fetchPermissions])

  return {
    permissions: userPermissions?.permissions || [],
    roles: userPermissions?.roles || [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading,
    error,
    refetch,
  }
}

export default usePermissions
