// ============================================================================
// ROLE PERMISSION HOOKS (src/hooks/use-role-permissions.ts)
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface PermissionCheckResult {
  hasAccess: boolean
  loading: boolean
  error: string | null
}

// Helper function to get primary role (first role or ADMIN if exists)
function getPrimaryRole(roles: { role: { name: string } }[] | undefined): string | null {
  if (!roles || roles.length === 0) return null
  
  // Check if user has ADMIN role
  const adminRole = roles.find(r => r.role.name === 'ADMIN')
  if (adminRole) return 'ADMIN'
  
  // Return first role
  return roles[0]?.role.name || null
}

// Hook for checking single permission
export function usePermission(permission: string): PermissionCheckResult {
  const { data: session } = useSession()
  const [result, setResult] = useState<PermissionCheckResult>({
    hasAccess: false,
    loading: true,
    error: null
  })

  const userRole = getPrimaryRole(session?.user?.roles)

  useEffect(() => {
    if (!userRole || !permission) {
      setResult({ hasAccess: false, loading: false, error: null })
      return
    }

    const checkPermission = async () => {
      try {
        const response = await fetch('/api/auth/check-permission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: userRole,
            permission,
            checkType: 'single'
          })
        })

        const data = await response.json()
        
        if (data.success) {
          setResult({ hasAccess: data.hasAccess, loading: false, error: null })
        } else {
          setResult({ hasAccess: false, loading: false, error: data.error })
        }
      } catch (error) {
        setResult({ 
          hasAccess: false, 
          loading: false, 
          error: 'Failed to check permission' 
        })
      }
    }

    checkPermission()
  }, [userRole, permission])

  return result
}

// Hook for checking multiple permissions (any)
export function useAnyPermission(permissions: string[]): PermissionCheckResult {
  const { data: session } = useSession()
  const [result, setResult] = useState<PermissionCheckResult>({
    hasAccess: false,
    loading: true,
    error: null
  })

  const userRole = getPrimaryRole(session?.user?.roles)

  useEffect(() => {
    if (!userRole || !permissions?.length) {
      setResult({ hasAccess: false, loading: false, error: null })
      return
    }

    const checkPermissions = async () => {
      try {
        const response = await fetch('/api/auth/check-permission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: userRole,
            permissions,
            checkType: 'any'
          })
        })

        const data = await response.json()
        
        if (data.success) {
          setResult({ hasAccess: data.hasAccess, loading: false, error: null })
        } else {
          setResult({ hasAccess: false, loading: false, error: data.error })
        }
      } catch (error) {
        setResult({ 
          hasAccess: false, 
          loading: false, 
          error: 'Failed to check permissions' 
        })
      }
    }

    checkPermissions()
  }, [userRole, JSON.stringify(permissions)])

  return result
}

// Hook for checking module access
export function useModuleAccess(module: string): PermissionCheckResult {
  const { data: session } = useSession()
  const [result, setResult] = useState<PermissionCheckResult>({
    hasAccess: false,
    loading: true,
    error: null
  })

  const userRole = getPrimaryRole(session?.user?.roles)

  useEffect(() => {
    if (!userRole || !module) {
      setResult({ hasAccess: false, loading: false, error: null })
      return
    }

    const checkModuleAccess = async () => {
      try {
        const response = await fetch('/api/auth/check-permission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: userRole,
            module,
            checkType: 'module'
          })
        })

        const data = await response.json()
        
        if (data.success) {
          setResult({ hasAccess: data.hasAccess, loading: false, error: null })
        } else {
          setResult({ hasAccess: false, loading: false, error: data.error })
        }
      } catch (error) {
        setResult({ 
          hasAccess: false, 
          loading: false, 
          error: 'Failed to check module access' 
        })
      }
    }

    checkModuleAccess()
  }, [userRole, module])

  return result
}

// Hook for getting current user role info
export function useCurrentRole() {
  const { data: session } = useSession()
  const [roleInfo, setRoleInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userRole = getPrimaryRole(session?.user?.roles)

  useEffect(() => {
    if (!userRole) {
      setRoleInfo(null)
      setLoading(false)
      return
    }

    const fetchRoleInfo = async () => {
      try {
        const response = await fetch(`/api/roles?role=${userRole}`)
        const data = await response.json()
        
        if (data.success) {
          setRoleInfo(data.data)
          setError(null)
        } else {
          setError(data.error)
        }
      } catch (error) {
        setError('Failed to fetch role info')
      } finally {
        setLoading(false)
      }
    }

    fetchRoleInfo()
  }, [userRole])

  return { roleInfo, loading, error }
}

// Utility hook for admin checks
export function useIsAdmin(): boolean {
  const { data: session } = useSession()
  return session?.user?.roles?.some(r => r.role.name === 'ADMIN') || false
}

// Utility hook for manager level checks
export function useIsManager(): boolean {
  const { data: session } = useSession()
  const managerRoles = ['ADMIN', 'KEPALA_SPPG', 'AHLI_GIZI']
  return session?.user?.roles?.some(r => managerRoles.includes(r.role.name)) || false
}

// Utility hook for staff level checks
export function useIsStaff(): boolean {
  const { data: session } = useSession()
  const staffRoles = [
    'STAFF_PERSIAPAN', 'STAFF_PRODUKSI', 'STAFF_PEMORSIAN', 
    'STAFF_PACKING', 'STAFF_DISTRIBUSI', 'STAFF_KEBERSIHAN', 
    'STAFF_PENCUCIAN'
  ]
  return session?.user?.roles?.some(r => staffRoles.includes(r.role.name)) || false
}
