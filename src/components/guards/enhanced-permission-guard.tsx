// ============================================================================
// ENHANCED PERMISSION GUARD (src/components/guards/enhanced-permission-guard.tsx)
// ============================================================================

'use client'

import { ReactNode } from 'react'
import { useDynamicPermission, useDynamicAnyPermission, useDynamicAllPermissions, usePermissionSource } from '@/hooks/use-dynamic-permissions'

interface EnhancedPermissionGuardProps {
  permission?: string | string[]
  children: ReactNode
  fallback?: ReactNode
  requireAll?: boolean
  // New props for enhanced functionality
  useDynamic?: boolean // Override global setting
  showMismatchWarning?: boolean // Show warning if file/db differ
  gracefulFallback?: boolean // Fallback to static if dynamic fails
}

export function EnhancedPermissionGuard({ 
  permission, 
  children, 
  fallback = null,
  requireAll = false,
  useDynamic: propUseDynamic,
  showMismatchWarning = false,
  gracefulFallback = true
}: EnhancedPermissionGuardProps) {
  const { useDynamic: globalUseDynamic } = usePermissionSource()
  const shouldUseDynamic = propUseDynamic ?? globalUseDynamic

  // Use dynamic permission system
  if (shouldUseDynamic && permission) {
    return (
      <DynamicPermissionGuard
        permission={permission}
        requireAll={requireAll}
        fallback={fallback}
        gracefulFallback={gracefulFallback}
        showMismatchWarning={showMismatchWarning}
      >
        {children}
      </DynamicPermissionGuard>
    )
  }

  // For now, if not using dynamic, just show content
  // In production, you would integrate with your existing static permission system
  return <>{children}</>
}

interface DynamicPermissionGuardProps {
  permission: string | string[]
  requireAll: boolean
  fallback: ReactNode
  gracefulFallback: boolean
  showMismatchWarning: boolean
  children: ReactNode
}

function DynamicPermissionGuard({
  permission,
  requireAll,
  fallback,
  gracefulFallback,
  showMismatchWarning,
  children
}: DynamicPermissionGuardProps) {
  const permissions = Array.isArray(permission) ? permission : [permission]
  
  // Choose the right hook based on logic required
  const singlePermission = permissions.length === 1 ? permissions[0] : ''
  const singleResult = useDynamicPermission(singlePermission)
  const anyResult = useDynamicAnyPermission(permissions.length > 1 ? permissions : [])
  const allResult = useDynamicAllPermissions(permissions.length > 1 && requireAll ? permissions : [])

  // Determine which result to use
  const result = permissions.length === 1 
    ? singleResult 
    : requireAll 
      ? allResult 
      : anyResult

  // Handle loading state
  if (result.loading) {
    return <div className="animate-pulse">Loading permissions...</div>
  }

  // Handle error state with graceful fallback
  if (result.error && gracefulFallback) {
    console.warn('Dynamic permission check failed, falling back to static:', result.error)
    return (
      <>
        {showMismatchWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2 text-sm text-yellow-800">
            ⚠️ Dynamic permissions unavailable, using static fallback
          </div>
        )}
        {children}
      </>
    )
  }

  // Handle error state without fallback
  if (result.error) {
    return <>{fallback}</>
  }

  // Handle permission check result
  if (!result.hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Convenience components for common use cases
export function DynamicAdminGuard({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <EnhancedPermissionGuard permission="admin.access" fallback={fallback} useDynamic={true}>
      {children}
    </EnhancedPermissionGuard>
  )
}

export function DynamicQualityGuard({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <EnhancedPermissionGuard permission="quality.check" fallback={fallback} useDynamic={true}>
      {children}
    </EnhancedPermissionGuard>
  )
}

export function DynamicUserManagementGuard({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <EnhancedPermissionGuard 
      permission={["users.create", "users.edit", "users.delete"]} 
      requireAll={false}
      fallback={fallback} 
      useDynamic={true}
    >
      {children}
    </EnhancedPermissionGuard>
  )
}

// HOC version for class components or complex logic
export function withEnhancedPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  permissionConfig: Omit<EnhancedPermissionGuardProps, 'children'>
) {
  return function EnhancedPermissionHOC(props: P) {
    return (
      <EnhancedPermissionGuard {...permissionConfig}>
        <WrappedComponent {...props} />
      </EnhancedPermissionGuard>
    )
  }
}
