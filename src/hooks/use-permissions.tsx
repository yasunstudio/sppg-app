// ============================================================================
// PERMISSIONS HOOKS & COMPONENTS (src/hooks/use-permissions.tsx)
// ============================================================================

'use client'

import { ReactNode } from 'react'
import { usePermission, useModuleAccess, useIsAdmin, useIsManager, useIsStaff } from './use-role-permissions'

// Permission Guard Component
interface PermissionGuardProps {
  permission?: string | string[]
  module?: string
  children: ReactNode
  fallback?: ReactNode
  requireAdmin?: boolean
  requireManager?: boolean
  requireStaff?: boolean
  requireAll?: boolean
}

export function PermissionGuard({ 
  permission, 
  module, 
  children, 
  fallback = null,
  requireAdmin = false,
  requireManager = false,
  requireStaff = false,
  requireAll = false
}: PermissionGuardProps) {
  const isAdmin = useIsAdmin()
  const isManager = useIsManager()
  const isStaff = useIsStaff()
  
  // Convert permission to array for consistent handling
  const permissionArray = permission 
    ? (typeof permission === 'string' ? [permission] : permission)
    : []
  
  // Always call usePermission hooks (up to 5 permissions max)
  const perm1 = permissionArray[0] || ''
  const perm2 = permissionArray[1] || ''
  const perm3 = permissionArray[2] || ''
  const perm4 = permissionArray[3] || ''
  const perm5 = permissionArray[4] || ''
  
  const permission1 = usePermission(perm1)
  const permission2 = usePermission(perm2)
  const permission3 = usePermission(perm3)
  const permission4 = usePermission(perm4)
  const permission5 = usePermission(perm5)
  
  const moduleResult = useModuleAccess(module || '')
  
  // Check permissions based on requireAll flag
  const hasPermissionAccess = permissionArray.length === 0 ? true : (() => {
    const results = [permission1, permission2, permission3, permission4, permission5]
      .slice(0, permissionArray.length)
      .map(result => result.hasAccess)
    
    return requireAll 
      ? results.every(hasAccess => hasAccess)
      : results.some(hasAccess => hasAccess)
  })()
  
  // Admin bypass
  if (requireAdmin && !isAdmin) {
    return <>{fallback}</>
  }
  
  if (requireManager && !isManager) {
    return <>{fallback}</>
  }
  
  if (requireStaff && !isStaff) {
    return <>{fallback}</>
  }
  
  // Permission check
  if (permission && !hasPermissionAccess) {
    return <>{fallback}</>
  }
  
  if (module && !moduleResult.hasAccess) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Role Guard Component
interface RoleGuardProps {
  roles: string[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const isAdmin = useIsAdmin()
  const isManager = useIsManager()
  const isStaff = useIsStaff()
  
  // Check if user has any of the required roles
  const hasRole = roles.some(role => {
    switch (role) {
      case 'ADMIN':
        return isAdmin
      case 'MANAGER':
        return isManager
      case 'STAFF':
        return isStaff
      default:
        return false
    }
  })
  
  if (!hasRole) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Admin Only Guard
interface AdminGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  return (
    <PermissionGuard requireAdmin fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

// Manager Level Guard
interface ManagerGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ManagerGuard({ children, fallback = null }: ManagerGuardProps) {
  return (
    <PermissionGuard requireManager fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

// usePermissions hook for backward compatibility
export function usePermissions() {
  const isAdmin = useIsAdmin()
  const isManager = useIsManager()
  const isStaff = useIsStaff()
  
  // Pre-fetch common permissions to avoid conditional hooks
  const createUserPermission = usePermission('CREATE_USER')
  const readUserPermission = usePermission('READ_USER')
  const usersModuleAccess = useModuleAccess('users')
  
  return {
    isAdmin,
    isManager,
    isStaff,
    // Use the pre-fetched results
    hasCreateUserPermission: createUserPermission.hasAccess,
    hasReadUserPermission: readUserPermission.hasAccess,
    canAccessUsersModule: usersModuleAccess.hasAccess,
    // Legacy methods (deprecated)
    hasPermission: (permission: string) => {
      // This is a simplified fallback - for real-time checks, use usePermission hook directly
      return isAdmin // Admin has all permissions
    },
    canAccessModule: (module: string) => {
      // This is a simplified fallback - for real-time checks, use useModuleAccess hook directly
      return isAdmin // Admin has all module access
    }
  }
}

// Permission hook with loading state
export function usePermissionWithLoading(permission: string) {
  return usePermission(permission)
}

// Module access hook with loading state
export function useModuleAccessWithLoading(module: string) {
  return useModuleAccess(module)
}
