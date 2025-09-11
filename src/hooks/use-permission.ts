/**
 * Individual Permission Hook 
 * React hook for checking specific permissions via API
 */

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface UsePermissionReturn {
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  isLoading: boolean
  error: string | null
}

export function usePermission(permissions: string[] = []): UsePermissionReturn {
  const { data: session, status } = useSession()
  const [permissionResults, setPermissionResults] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkPermissions = async () => {
      if (status !== 'authenticated' || !session?.user?.id || permissions.length === 0) {
        setPermissionResults({})
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/permissions/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ permissions })
        })

        if (!response.ok) {
          throw new Error(`Failed to check permissions: ${response.status}`)
        }

        const data = await response.json()
        setPermissionResults(data.permissions || {})
      } catch (err) {
        console.error('Error checking permissions:', err)
        setError(err instanceof Error ? err.message : 'Failed to check permissions')
        // Set all permissions to false on error
        const defaultResults = permissions.reduce((acc, perm) => ({ ...acc, [perm]: false }), {})
        setPermissionResults(defaultResults)
      } finally {
        setIsLoading(false)
      }
    }

    checkPermissions()
  }, [session?.user?.id, status, JSON.stringify(permissions)]) // Use JSON.stringify to compare array

  const hasPermission = (permission: string) => permissionResults[permission] || false
  const hasAnyPermission = (perms: string[]) => perms.some(perm => permissionResults[perm])
  const hasAllPermissions = (perms: string[]) => perms.every(perm => permissionResults[perm])

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading,
    error,
  }
}

export default usePermission
