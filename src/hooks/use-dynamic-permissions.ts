// ============================================================================
// DYNAMIC PERMISSION HOOKS (src/hooks/use-dynamic-permissions.ts)
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { permissionManager } from '@/lib/permissions/dynamic-permissions'

interface DynamicPermissionResult {
  hasAccess: boolean
  loading: boolean
  error: string | null
}

/**
 * Hook for checking permission using dynamic database-driven permissions
 */
export function useDynamicPermission(permission: string): DynamicPermissionResult {
  const { data: session } = useSession()
  const [result, setResult] = useState<DynamicPermissionResult>({
    hasAccess: false,
    loading: true,
    error: null
  })

  const userRole = session?.user?.roles?.[0]?.role.name

  useEffect(() => {
    if (!userRole || !permission) {
      setResult({ hasAccess: false, loading: false, error: null })
      return
    }

    let isMounted = true

    const checkPermission = async () => {
      try {
        setResult(prev => ({ ...prev, loading: true, error: null }))
        
        const hasAccess = await permissionManager.hasPermission(userRole, permission)
        
        if (isMounted) {
          setResult({ hasAccess, loading: false, error: null })
        }
      } catch (error) {
        console.error('Dynamic permission check error:', error)
        if (isMounted) {
          setResult({ 
            hasAccess: false, 
            loading: false, 
            error: error instanceof Error ? error.message : 'Permission check failed'
          })
        }
      }
    }

    checkPermission()

    return () => {
      isMounted = false
    }
  }, [userRole, permission])

  return result
}

/**
 * Hook for checking multiple permissions (ANY logic)
 */
export function useDynamicAnyPermission(permissions: string[]): DynamicPermissionResult {
  const { data: session } = useSession()
  const [result, setResult] = useState<DynamicPermissionResult>({
    hasAccess: false,
    loading: true,
    error: null
  })

  const userRole = session?.user?.roles?.[0]?.role.name

  useEffect(() => {
    if (!userRole || !permissions.length) {
      setResult({ hasAccess: false, loading: false, error: null })
      return
    }

    let isMounted = true

    const checkPermissions = async () => {
      try {
        setResult(prev => ({ ...prev, loading: true, error: null }))
        
        const hasAccess = await permissionManager.hasAnyPermission(userRole, permissions)
        
        if (isMounted) {
          setResult({ hasAccess, loading: false, error: null })
        }
      } catch (error) {
        console.error('Dynamic permission check error:', error)
        if (isMounted) {
          setResult({ 
            hasAccess: false, 
            loading: false, 
            error: error instanceof Error ? error.message : 'Permission check failed'
          })
        }
      }
    }

    checkPermissions()

    return () => {
      isMounted = false
    }
  }, [userRole, permissions])

  return result
}

/**
 * Hook for checking multiple permissions (ALL logic)
 */
export function useDynamicAllPermissions(permissions: string[]): DynamicPermissionResult {
  const { data: session } = useSession()
  const [result, setResult] = useState<DynamicPermissionResult>({
    hasAccess: false,
    loading: true,
    error: null
  })

  const userRole = session?.user?.roles?.[0]?.role.name

  useEffect(() => {
    if (!userRole || !permissions.length) {
      setResult({ hasAccess: false, loading: false, error: null })
      return
    }

    let isMounted = true

    const checkPermissions = async () => {
      try {
        setResult(prev => ({ ...prev, loading: true, error: null }))
        
        const hasAccess = await permissionManager.hasAllPermissions(userRole, permissions)
        
        if (isMounted) {
          setResult({ hasAccess, loading: false, error: null })
        }
      } catch (error) {
        console.error('Dynamic permission check error:', error)
        if (isMounted) {
          setResult({ 
            hasAccess: false, 
            loading: false, 
            error: error instanceof Error ? error.message : 'Permission check failed'
          })
        }
      }
    }

    checkPermissions()

    return () => {
      isMounted = false
    }
  }, [userRole, permissions])

  return result
}

/**
 * Hook for permission validation (admin only)
 */
export function usePermissionValidation() {
  const { data: session } = useSession()
  const [validation, setValidation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userRoles = session?.user?.roles?.map(r => r.role.name) || []
  const isSuperAdmin = userRoles.includes('SUPER_ADMIN')

  const validatePermissions = async () => {
    if (!isSuperAdmin) {
      setError('Unauthorized: SUPER_ADMIN role required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/permissions/validate')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Validation failed')
      }

      setValidation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed')
    } finally {
      setLoading(false)
    }
  }

  const refreshPermissions = async () => {
    if (!isSuperAdmin) {
      setError('Unauthorized: SUPER_ADMIN role required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/permissions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Refresh failed')
      }

      // Auto-validate after refresh
      await validatePermissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refresh failed')
    } finally {
      setLoading(false)
    }
  }

  return {
    validation,
    loading,
    error,
    validatePermissions,
    refreshPermissions,
    isSuperAdmin
  }
}

/**
 * Feature flag hook for choosing permission source
 */
export function usePermissionSource() {
  const [useDynamic, setUseDynamic] = useState(() => {
    // Check environment variable or local storage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('use_dynamic_permissions')
      if (stored) return stored === 'true'
    }
    return process.env.NEXT_PUBLIC_USE_DYNAMIC_PERMISSIONS === 'true'
  })

  const toggleSource = () => {
    const newValue = !useDynamic
    setUseDynamic(newValue)
    if (typeof window !== 'undefined') {
      localStorage.setItem('use_dynamic_permissions', String(newValue))
    }
  }

  return { useDynamic, toggleSource }
}
