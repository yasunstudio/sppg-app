'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

export function usePermission(permission: string) {
  const { data: session } = useSession()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPermission = async () => {
      if (!session?.user?.id) {
        setHasPermission(false)
        setIsLoading(false)
        return
      }

      try {
        const result = await permissionEngine.hasPermission(session.user.id, permission)
        setHasPermission(result)
      } catch (error) {
        console.error('Error checking permission:', error)
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (session !== undefined) {
      checkPermission()
    }
  }, [session, permission])

  return { hasPermission, isLoading }
}

export function usePermissions(permissions: string[]) {
  const { data: session } = useSession()
  const [permissionResults, setPermissionResults] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPermissions = async () => {
      if (!session?.user?.id) {
        const defaultResults = permissions.reduce((acc, perm) => ({ ...acc, [perm]: false }), {})
        setPermissionResults(defaultResults)
        setIsLoading(false)
        return
      }

      try {
        const results: Record<string, boolean> = {}
        
        for (const permission of permissions) {
          results[permission] = await permissionEngine.hasPermission(session.user.id, permission)
        }
        
        setPermissionResults(results)
      } catch (error) {
        console.error('Error checking permissions:', error)
        const defaultResults = permissions.reduce((acc, perm) => ({ ...acc, [perm]: false }), {})
        setPermissionResults(defaultResults)
      } finally {
        setIsLoading(false)
      }
    }

    if (session !== undefined) {
      checkPermissions()
    }
  }, [session, permissions])

  const hasPermission = (permission: string) => permissionResults[permission] || false
  const hasAnyPermission = (perms: string[]) => perms.some(perm => permissionResults[perm])
  const hasAllPermissions = (perms: string[]) => perms.every(perm => permissionResults[perm])

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissionResults,
    isLoading
  }
}
