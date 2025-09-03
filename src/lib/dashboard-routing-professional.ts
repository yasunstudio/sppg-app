import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

/**
 * Professional URL mapping for cleaner routes
 */
export const PROFESSIONAL_ROUTES = {
  // Internal routes to clean URLs
  '/dashboard': '/home',
  '/dashboard/admin': '/admin',
  '/dashboard/financial': '/financial',
  '/dashboard/users': '/users',
  '/dashboard/schools': '/schools',
  '/dashboard/students': '/students',
  '/dashboard/classes': '/classes',
  '/dashboard/inventory': '/inventory',
  '/dashboard/raw-materials': '/materials',
  '/dashboard/suppliers': '/suppliers',
  '/dashboard/purchase-orders': '/orders',
  '/dashboard/production': '/production',
  '/dashboard/menu-planning': '/menu-planning',
  '/dashboard/recipes': '/recipes',
  '/dashboard/quality': '/quality',
  '/dashboard/distributions': '/distribution',
  '/dashboard/vehicles': '/vehicles',
  '/dashboard/drivers': '/drivers',
  '/dashboard/monitoring/reports': '/reports',
  '/dashboard/monitoring/analytics': '/analytics',
  '/dashboard/settings': '/settings',
  '/dashboard/notifications': '/notifications',
} as const

/**
 * Convert internal dashboard route to professional clean URL
 */
export function toProfessionalUrl(internalRoute: string): string {
  return PROFESSIONAL_ROUTES[internalRoute as keyof typeof PROFESSIONAL_ROUTES] || internalRoute.replace('/dashboard', '') || '/home'
}

/**
 * Convert clean URL back to internal dashboard route
 */
export function toInternalRoute(cleanUrl: string): string {
  for (const [internalRoute, cleanRoute] of Object.entries(PROFESSIONAL_ROUTES)) {
    if (cleanRoute === cleanUrl) {
      return internalRoute
    }
  }
  
  // Fallback: prepend /dashboard
  if (cleanUrl === '/home') return '/dashboard'
  return `/dashboard${cleanUrl}`
}

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
      return '/admin';
    }
    
    // Financial Dashboard - Financial analysis focus
    if (allPermissions.includes('budget.view') || 
        allPermissions.includes('budget.create') ||
        allPermissions.includes('finance.view')) {
      return '/financial';
    }
    
    // Kitchen Operations Dashboard - Main dashboard with full sidebar access
    if (allPermissions.includes('production.view') || 
        allPermissions.includes('production.create') ||
        allPermissions.includes('recipes.view') ||
        allPermissions.includes('inventory.view')) {
      return '/home';
    }
    
    // Default Basic Dashboard - Limited access
    return '/home';
    
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
    return '/admin';
  }
  
  // Financial roles - Financial dashboard
  if (userRoles.some(role => ['FINANCIAL_ANALYST'].includes(role))) {
    return '/financial';
  }
  
  // Kitchen operations roles - Main dashboard (with full sidebar access)
  if (userRoles.some(role => ['CHEF', 'NUTRITIONIST'].includes(role))) {
    return '/home';
  }
  
  // All other roles - Basic dashboard
  return '/home';
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
 * Uses professional clean URLs
 */
export async function redirectToDashboard(userRoles: string[]) {
  const dashboardRoute = await getDashboardRoute(userRoles);
  redirect(dashboardRoute);
}

// Dashboard role mapping for reference (returns clean URLs)
export const DASHBOARD_ROLES = {
  ADMIN: ['SUPER_ADMIN', 'ADMIN'],
  FINANCIAL: ['FINANCIAL_ANALYST'],
  KITCHEN: ['CHEF', 'NUTRITIONIST'],
  DELIVERY: ['DRIVER'],
  QUALITY: ['QUALITY_OFFICER'],
  BASIC: [], // Default for all other roles
} as const

/**
 * Get dashboard route by role type (returns clean URL)
 */
export function getDashboardByRoleType(roleType: keyof typeof DASHBOARD_ROLES): string {
  switch (roleType) {
    case 'ADMIN':
      return '/admin'
    case 'FINANCIAL':
      return '/financial'
    case 'KITCHEN':
      return '/home'
    case 'DELIVERY':
      return '/home'
    case 'QUALITY':
      return '/home'
    default:
      return '/home'
  }
}
