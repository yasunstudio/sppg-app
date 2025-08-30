"use client";

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { hasPermission, getUserPermissions, hasRole, getPrimaryRole, getUserRoleDetails, type Permission, type UserRole } from '@/lib/permissions';

export function usePermissions() {
  const { data: session } = useSession();
  
  // Get user roles from session - handles both single role and multiple roles
  const userRoles = session?.user?.roles 
    ? session.user.roles.map((ur: any) => ur.role.name)
    : [];
  
  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(userRoles, permission);
  };
  
  const checkRole = (role: UserRole): boolean => {
    return hasRole(userRoles, role);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => checkPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => checkPermission(permission));
  };
  
  const primaryRole = getPrimaryRole(userRoles);
  const primaryRoleDetails = primaryRole ? getUserRoleDetails(primaryRole) : null;
  
  return {
    permissions: getUserPermissions(userRoles),
    hasPermission: checkPermission,
    hasRole: checkRole,
    hasAnyPermission,
    hasAllPermissions,
    userRoles,
    primaryRole,
    primaryRoleDetails,
    isAuthenticated: !!session?.user,
    isLoggedIn: !!session?.user,
    user: session?.user
  };
}

// Permission Guard Component
interface PermissionGuardProps {
  permission: Permission | Permission[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean; // if true, user must have ALL permissions; if false, user needs ANY permission
}

export function PermissionGuard({ 
  permission, 
  children, 
  fallback = null, 
  requireAll = false 
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  const hasAccess = Array.isArray(permission)
    ? requireAll 
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission)
    : hasPermission(permission);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Higher-Order Component for permission-based access
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: Permission | Permission[],
  requireAll = false
) {
  return function PermissionWrappedComponent(props: P) {
    const { hasPermission, hasAnyPermission, hasAllPermissions, isLoggedIn } = usePermissions();
    
    if (!isLoggedIn) {
      return <div>Please log in to access this content.</div>;
    }

    const hasAccess = Array.isArray(requiredPermission)
      ? requireAll 
        ? hasAllPermissions(requiredPermission)
        : hasAnyPermission(requiredPermission)
      : hasPermission(requiredPermission);

    if (!hasAccess) {
      return <div>You don't have permission to access this content.</div>;
    }

    return <Component {...props} />;
  };
}

// Role Guard Component
interface RoleGuardProps {
  role: UserRole | UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean;
}

export function RoleGuard({ 
  role, 
  children, 
  fallback = null, 
  requireAll = false 
}: RoleGuardProps) {
  const { hasRole } = usePermissions();
  
  const hasAccess = Array.isArray(role)
    ? requireAll 
      ? role.every(r => hasRole(r))
      : role.some(r => hasRole(r))
    : hasRole(role);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
