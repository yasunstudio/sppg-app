/**
 * Permission Hooks  
 * React hooks for Database-Driven Permission System
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface Permission {
  id: string
  name: string
  displayName: string
  description: string
  category: string
  module: string
  action: string
  isActive: boolean
  isSystemPerm: boolean
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  color: string
  priority: number
  isSystemRole: boolean
}

export interface UserPermissionContext {
  userId: string
  roles: Role[]
  permissions: string[]
  isSuperAdmin: boolean
}

/**
 * Hook to fetch and manage all permissions
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/permissions')
      if (!response.ok) {
        throw new Error(`Failed to fetch permissions: ${response.statusText}`)
      }
      
      const data = await response.json()
      setPermissions(data.permissions || [])
    } catch (err) {
      console.error('Error fetching permissions:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  const refreshPermissions = useCallback(() => {
    fetchPermissions()
  }, [fetchPermissions])

  const createPermission = useCallback(async (permissionData: Omit<Permission, 'id'>) => {
    try {
      const response = await fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissionData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create permission: ${response.statusText}`)
      }
      
      await refreshPermissions()
      return await response.json()
    } catch (err) {
      console.error('Error creating permission:', err)
      throw err
    }
  }, [refreshPermissions])

  const updatePermission = useCallback(async (id: string, updates: Partial<Permission>) => {
    try {
      const response = await fetch(`/api/permissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update permission: ${response.statusText}`)
      }
      
      await refreshPermissions()
      return await response.json()
    } catch (err) {
      console.error('Error updating permission:', err)
      throw err
    }
  }, [refreshPermissions])

  const deletePermission = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/permissions/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete permission: ${response.statusText}`)
      }
      
      await refreshPermissions()
    } catch (err) {
      console.error('Error deleting permission:', err)
      throw err
    }
  }, [refreshPermissions])

  return {
    permissions,
    loading,
    error,
    refreshPermissions,
    createPermission,
    updatePermission,
    deletePermission
  }
}

/**
 * Hook to fetch and manage roles
 */
export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/roles')
      if (!response.ok) {
        throw new Error(`Failed to fetch roles: ${response.statusText}`)
      }
      
      const data = await response.json()
      setRoles(data.roles || [])
    } catch (err) {
      console.error('Error fetching roles:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const refreshRoles = useCallback(() => {
    fetchRoles()
  }, [fetchRoles])

  const createRole = useCallback(async (roleData: Omit<Role, 'id'>) => {
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create role: ${response.statusText}`)
      }
      
      await refreshRoles()
      return await response.json()
    } catch (err) {
      console.error('Error creating role:', err)
      throw err
    }
  }, [refreshRoles])

  const updateRole = useCallback(async (id: string, updates: Partial<Role>) => {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update role: ${response.statusText}`)
      }
      
      await refreshRoles()
      return await response.json()
    } catch (err) {
      console.error('Error updating role:', err)
      throw err
    }
  }, [refreshRoles])

  const deleteRole = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete role: ${response.statusText}`)
      }
      
      await refreshRoles()
    } catch (err) {
      console.error('Error deleting role:', err)
      throw err
    }
  }, [refreshRoles])

  const assignPermission = useCallback(async (roleId: string, permissionId: string) => {
    try {
      const response = await fetch(`/api/roles/${roleId}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissionId })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to assign permission: ${response.statusText}`)
      }
      
      await refreshRoles()
    } catch (err) {
      console.error('Error assigning permission:', err)
      throw err
    }
  }, [refreshRoles])

  const removePermission = useCallback(async (roleId: string, permissionId: string) => {
    try {
      const response = await fetch(`/api/roles/${roleId}/permissions/${permissionId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to remove permission: ${response.statusText}`)
      }
      
      await refreshRoles()
    } catch (err) {
      console.error('Error removing permission:', err)
      throw err
    }
  }, [refreshRoles])

  return {
    roles,
    loading,
    error,
    refreshRoles,
    createRole,
    updateRole,
    deleteRole,
    assignPermission,
    removePermission
  }
}

/**
 * Hook to manage user role assignments
 */
export function useUserRoles(userId?: string) {
  const [userRoles, setUserRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserRoles = useCallback(async (targetUserId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/user-roles?userId=${targetUserId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch user roles: ${response.statusText}`)
      }
      
      const data = await response.json()
      setUserRoles(data.roles || [])
    } catch (err) {
      console.error('Error fetching user roles:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      fetchUserRoles(userId)
    }
  }, [userId, fetchUserRoles])

  const assignRole = useCallback(async (targetUserId: string, roleId: string) => {
    try {
      const response = await fetch('/api/user-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId, roleId })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to assign role: ${response.statusText}`)
      }
      
      if (targetUserId === userId) {
        await fetchUserRoles(targetUserId)
      }
    } catch (err) {
      console.error('Error assigning role:', err)
      throw err
    }
  }, [userId, fetchUserRoles])

  const removeRole = useCallback(async (targetUserId: string, roleId: string) => {
    try {
      const response = await fetch('/api/user-roles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId, roleId })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to remove role: ${response.statusText}`)
      }
      
      if (targetUserId === userId) {
        await fetchUserRoles(targetUserId)
      }
    } catch (err) {
      console.error('Error removing role:', err)
      throw err
    }
  }, [userId, fetchUserRoles])

  const refreshUserRoles = useCallback(() => {
    if (userId) {
      fetchUserRoles(userId)
    }
  }, [userId, fetchUserRoles])

  return {
    userRoles,
    loading,
    error,
    assignRole,
    removeRole,
    refreshUserRoles
  }
}

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permission: string): { hasAccess: boolean; loading: boolean; error: string | null } {
  const { data: session } = useSession()
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkPermission = useCallback(async () => {
    if (!session?.user?.id || !permission) {
      setHasAccess(false)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/check-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          permission: permission,
          checkType: 'single'
        })
      })

      if (!response.ok) {
        throw new Error(`Permission check failed: ${response.statusText}`)
      }

      const result = await response.json()
      setHasAccess(result.hasAccess || false)
    } catch (err) {
      console.error('Error checking permission:', err)
      setError(err instanceof Error ? err.message : 'Permission check failed')
      setHasAccess(false)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id, permission])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  return { hasAccess, loading, error }
}

/**
 * Hook to validate multiple permissions
 */
export function usePermissionValidator() {
  const { data: session } = useSession()

  const validatePermissions = useCallback(async (permissions: string[], checkType: 'any' | 'all' = 'any') => {
    if (!session?.user?.id || !permissions.length) {
      return { hasAccess: false, results: {} }
    }

    try {
      const response = await fetch('/api/auth/check-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          permissions,
          checkType
        })
      })

      if (!response.ok) {
        throw new Error(`Permission validation failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (err) {
      console.error('Error validating permissions:', err)
      return { hasAccess: false, results: {}, error: err instanceof Error ? err.message : 'Validation failed' }
    }
  }, [session?.user?.id])

  const hasAnyPermission = useCallback(async (permissions: string[]) => {
    const result = await validatePermissions(permissions, 'any')
    return result.hasAccess
  }, [validatePermissions])

  const hasAllPermissions = useCallback(async (permissions: string[]) => {
    const result = await validatePermissions(permissions, 'all')
    return result.hasAccess
  }, [validatePermissions])

  const hasModuleAccess = useCallback(async (module: string) => {
    if (!session?.user?.id) return false

    try {
      const response = await fetch('/api/auth/check-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          module,
          checkType: 'module'
        })
      })

      if (!response.ok) return false

      const result = await response.json()
      return result.hasAccess || false
    } catch (err) {
      console.error('Error checking module access:', err)
      return false
    }
  }, [session?.user?.id])

  const getUserContext = useCallback(async (): Promise<UserPermissionContext | null> => {
    if (!session?.user?.id) return null

    try {
      const response = await fetch(`/api/users/${session.user.id}/permissions`)
      if (!response.ok) return null

      return await response.json()
    } catch (err) {
      console.error('Error getting user context:', err)
      return null
    }
  }, [session?.user?.id])

  return {
    validatePermissions,
    hasAnyPermission,
    hasAllPermissions,
    hasModuleAccess,
    getUserContext
  }
}

// Legacy compatibility exports for smooth migration
export const useDynamicPermission = usePermission
export const usePermissionValidation = usePermissionValidator
