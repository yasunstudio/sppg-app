import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

/**
 * Get appropriate dashboard route based on user roles (database-driven)
 * Returns professional clean URL
 */
export async function getDashboardRoute(userRoles: string[]): Promise<string> {
  try {
    // Get role permissions from database
    const roles = await prisma.role.findMany({
      where: {
        name: {
          in: userRoles
        }
      },
      select: {
        name: true,
        permissions: true
      }
    })
    
    // Combine all permissions from user's roles
    const allPermissions = roles.reduce((permissions: string[], role) => {
      return [...permissions, ...role.permissions]
    }, [])
    
    // Admin Dashboard - Full system access (user management permissions)
    if (allPermissions.includes('users.create') || 
        allPermissions.includes('users.edit')) {
      return '/dashboard/admin';
    }
    
    // Financial Dashboard - Financial analysis focus
    if (allPermissions.includes('budget.view') || 
        allPermissions.includes('budget.create') ||
        allPermissions.includes('finance.view')) {
      return '/dashboard/financial';
    }
    
    // Kitchen Operations Dashboard - Main dashboard with full sidebar access
    if (allPermissions.includes('production.view') || 
        allPermissions.includes('production.create') ||
        allPermissions.includes('recipes.view') ||
        allPermissions.includes('inventory.view')) {
      return '/dashboard';
    }
    
    // Default Basic Dashboard - Limited access
    return '/dashboard';
    
  } catch (error) {
    console.error('Error determining dashboard route:', error)
    // Safe fallback
    return '/home';
  }
}

/**
 * Synchronous fallback for middleware (uses hardcoded mapping)
 * This is used in middleware where database queries are not available
 * Returns professional clean URL
 */
export function getDashboardRouteSync(userRoles: string[]): string {
  // Admin roles - Full access
  if (userRoles.some(role => ['SUPER_ADMIN', 'ADMIN'].includes(role))) {
    return '/dashboard/admin';
  }
  
  // Financial roles - Financial dashboard
  if (userRoles.some(role => ['FINANCIAL_ANALYST'].includes(role))) {
    return '/dashboard/financial';
  }
  
  // Kitchen operations roles - Main dashboard (with full sidebar access)
  if (userRoles.some(role => ['CHEF', 'NUTRITIONIST'].includes(role))) {
    return '/dashboard';
  }
  
  // All other roles - Basic dashboard
  return '/dashboard';
}

/**
 * Check if user has required dashboard access (database-driven)
 */
export async function requireDashboardAccess(
  requiredPermissions: string[],
  userRoles: string[]
): Promise<boolean> {
  try {
    const roles = await prisma.role.findMany({
      where: {
        name: {
          in: userRoles
        }
      },
      select: {
        permissions: true
      }
    })
    
    const allPermissions = roles.reduce((permissions: string[], role) => {
      return [...permissions, ...role.permissions]
    }, [])
    
    return requiredPermissions.some(permission => 
      allPermissions.includes(permission)
    );
  } catch (error) {
    console.error('Error checking dashboard access:', error)
    return false;
  }
}

/**
 * Redirect to appropriate dashboard based on user roles (database-driven)
 */
export async function redirectToDashboard(userRoles: string[]) {
  const dashboardRoute = await getDashboardRoute(userRoles);
  redirect(dashboardRoute);
}

// Dashboard role mapping for reference (from database)
export const DASHBOARD_ROLES = {
  ADMIN: ['SUPER_ADMIN', 'ADMIN'],
  FINANCIAL: ['FINANCIAL_ANALYST'],
  BASIC: ['NUTRITIONIST', 'CHEF', 'QUALITY_CONTROLLER', 'DELIVERY_MANAGER', 'OPERATIONS_SUPERVISOR']
} as const;
