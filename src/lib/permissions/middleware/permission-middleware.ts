/**
 * Permission Middleware
 * Route protection middleware for permission-based access control
 */

import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

export interface RoutePermission {
  path: string
  permissions: string[]
  requireAll?: boolean // If true, user needs ALL permissions; if false, ANY permission
  minimumPriority?: number
  roles?: string[]
}

// Define route permissions
export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Admin routes
  {
    path: '/dashboard/admin',
    permissions: ['system.config', 'users.view'],
    requireAll: false,
    minimumPriority: 80
  },
  {
    path: '/dashboard/admin/users',
    permissions: ['users.view', 'users.edit'],
    requireAll: false,
    minimumPriority: 80
  },
  {
    path: '/dashboard/admin/roles',
    permissions: ['system.config'],
    requireAll: true,
    minimumPriority: 90
  },

  // Menu management
  {
    path: '/dashboard/menu',
    permissions: ['menus.view', 'menus.create'],
    requireAll: false
  },
  {
    path: '/dashboard/menu/create',
    permissions: ['menus.create'],
    requireAll: true
  },

  // Production routes
  {
    path: '/dashboard/production',
    permissions: ['production.view', 'production.create'],
    requireAll: false
  },
  {
    path: '/dashboard/kitchen',
    permissions: ['production.manage', 'recipes.create'],
    requireAll: false,
    roles: ['CHEF', 'PRODUCTION_STAFF']
  },

  // Quality control
  {
    path: '/dashboard/quality',
    permissions: ['quality.check', 'quality.create'],
    requireAll: false,
    roles: ['QUALITY_CONTROL', 'CHEF']
  },

  // Logistics and distribution
  {
    path: '/dashboard/logistics',
    permissions: ['logistics.plan', 'delivery.manage'],
    requireAll: false,
    roles: ['DISTRIBUTION_MANAGER', 'OPERATIONS_SUPERVISOR']
  },

  // Financial management
  {
    path: '/dashboard/finance',
    permissions: ['finance.view', 'budget.view'],
    requireAll: false,
    minimumPriority: 50,
    roles: ['ADMIN', 'FINANCIAL_ANALYST']
  },

  // School administration
  {
    path: '/dashboard/school',
    permissions: ['schools.view', 'students.view'],
    requireAll: false,
    roles: ['SCHOOL_ADMIN', 'OPERATIONS_SUPERVISOR', 'ADMIN']
  },

  // Inventory management
  {
    path: '/dashboard/inventory',
    permissions: ['inventory.view', 'inventory.edit'],
    requireAll: false,
    roles: ['WAREHOUSE_MANAGER', 'CHEF', 'ADMIN']
  }
]

export async function checkRoutePermissions(
  request: NextRequest,
  token: any
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname

  // Find matching route permission
  const routePermission = ROUTE_PERMISSIONS.find(rp => 
    pathname.startsWith(rp.path)
  )

  if (!routePermission) {
    // No specific permission required for this route
    return null
  }

  if (!token || !token.sub) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  const userId = token.sub

  try {
    // Check role-based access first
    if (routePermission.roles && routePermission.roles.length > 0) {
      const userContext = await permissionEngine.getUserPermissionContext(userId)
      const hasRequiredRole = routePermission.roles.some(roleName =>
        userContext.roles.some(role => role.name === roleName)
      )

      if (!hasRequiredRole) {
        return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url))
      }
    }

    // Check minimum priority
    if (routePermission.minimumPriority) {
      const hasMinPriority = await permissionEngine.hasMinimumPriority(
        userId, 
        routePermission.minimumPriority
      )

      if (!hasMinPriority) {
        return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url))
      }
    }

    // Check permissions
    if (routePermission.permissions.length > 0) {
      const hasPermission = routePermission.requireAll
        ? await permissionEngine.hasAllPermissions(userId, routePermission.permissions)
        : await permissionEngine.hasAnyPermission(userId, routePermission.permissions)

      if (!hasPermission) {
        return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url))
      }
    }

    // All checks passed
    return null

  } catch (error) {
    console.error('Error checking route permissions:', error)
    return NextResponse.redirect(new URL('/dashboard/error', request.url))
  }
}

// Higher-order component for protecting API routes
export function withPermissions(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  requiredPermissions: string[],
  options: {
    requireAll?: boolean
    minimumPriority?: number
    roles?: string[]
  } = {}
) {
  return async function protectedHandler(
    req: NextRequest, 
    context?: any
  ): Promise<NextResponse> {
    const token = await getToken({ req })

    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = token.sub

    try {
      // Check role-based access
      if (options.roles && options.roles.length > 0) {
        const userContext = await permissionEngine.getUserPermissionContext(userId)
        const hasRequiredRole = options.roles.some(roleName =>
          userContext.roles.some(role => role.name === roleName)
        )

        if (!hasRequiredRole) {
          return NextResponse.json(
            { error: 'Insufficient role permissions' },
            { status: 403 }
          )
        }
      }

      // Check minimum priority
      if (options.minimumPriority) {
        const hasMinPriority = await permissionEngine.hasMinimumPriority(
          userId,
          options.minimumPriority
        )

        if (!hasMinPriority) {
          return NextResponse.json(
            { error: 'Insufficient priority level' },
            { status: 403 }
          )
        }
      }

      // Check permissions
      if (requiredPermissions.length > 0) {
        const hasPermission = options.requireAll
          ? await permissionEngine.hasAllPermissions(userId, requiredPermissions)
          : await permissionEngine.hasAnyPermission(userId, requiredPermissions)

        if (!hasPermission) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        }
      }

      // All checks passed, call the original handler
      return handler(req, context)

    } catch (error) {
      console.error('Error in permission middleware:', error)
      return NextResponse.json(
        { error: 'Permission check failed' },
        { status: 500 }
      )
    }
  }
}
