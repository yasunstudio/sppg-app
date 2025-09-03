import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { hasPermission } from "@/lib/permissions"
import { getDashboardRouteSync } from "@/lib/dashboard-routing"

// Professional URL mapping - maps clean URLs to internal dashboard routes
const URL_REWRITES = {
  // Core Management
  '/home': '/dashboard',
  '/users': '/dashboard/users',
  '/schools': '/dashboard/schools',
  '/students': '/dashboard/students',
  '/classes': '/dashboard/classes',
  
  // Inventory & Materials
  '/inventory': '/dashboard/inventory',
  '/materials': '/dashboard/raw-materials',
  '/items': '/dashboard/items',
  '/suppliers': '/dashboard/suppliers',
  '/orders': '/dashboard/purchase-orders',
  '/orders/analytics': '/dashboard/purchase-orders/analytics',
  
  // Production & Planning
  '/production': '/dashboard/production',
  '/production-plans': '/dashboard/production-plans',
  '/resource-usage': '/dashboard/resource-usage',
  '/menu-planning': '/dashboard/menu-planning',
  '/menu-planning/create': '/dashboard/menu-planning/create',
  '/menu-planning/planning': '/dashboard/menu-planning/planning',
  '/menu-planning/nutrition': '/dashboard/menu-planning/nutrition',
  '/recipes': '/dashboard/recipes',
  '/recipes/new': '/dashboard/recipes/new',
  '/quality': '/dashboard/quality',
  '/quality-checks': '/dashboard/quality-checks',
  '/quality-checkpoints': '/dashboard/quality-checkpoints',
  '/nutrition-consultations': '/dashboard/nutrition-consultations',
  '/food-samples': '/dashboard/food-samples',
  
  // Distribution & Logistics
  '/distribution': '/dashboard/distributions',
  '/distributions': '/dashboard/distributions',
  '/distributions/schools': '/dashboard/distributions/schools',
  '/distributions/tracking': '/dashboard/distributions/tracking',
  '/distributions/routes': '/dashboard/distributions/routes',
  '/vehicles': '/dashboard/vehicles',
  '/drivers': '/dashboard/drivers',
  
  // Monitoring & Reports
  '/monitoring': '/dashboard/monitoring',
  '/monitoring/real-time': '/dashboard/monitoring/real-time',
  '/monitoring/analytics': '/dashboard/monitoring/analytics',
  '/monitoring/reports': '/dashboard/monitoring/reports',
  '/performance': '/dashboard/performance',
  '/reports': '/dashboard/monitoring/reports',
  '/analytics': '/dashboard/monitoring/analytics',
  
  // Financial
  '/financial': '/dashboard/financial',
  '/waste-management': '/dashboard/waste-management',
  '/feedback': '/dashboard/feedback',
  
  // Administration
  '/admin': '/dashboard/admin',
  '/settings': '/dashboard/settings',
  '/profile': '/dashboard/profile',
  '/notifications': '/dashboard/notifications',
  '/roles': '/dashboard/roles',
  '/user-roles': '/dashboard/user-roles',
  '/system-config': '/dashboard/system-config',
  '/audit-logs': '/dashboard/audit-logs',
} as const

// Define route-to-permission mapping (for internal dashboard routes)
const PROTECTED_ROUTES = {
  '/dashboard/users': ['users.view'],
  '/dashboard/roles': ['system.config'],
  '/dashboard/user-roles': ['users.edit', 'system.config'],
  '/dashboard/system-config': ['system.config'],
  '/dashboard/audit-logs': ['audit.view'],
  '/dashboard/admin': ['system.config'],
  '/dashboard/financial': ['financial.view'],
  '/dashboard/inventory': ['inventory.view'],
  '/dashboard/items': ['inventory.view'],
  '/dashboard/suppliers': ['suppliers.view'],
  '/dashboard/purchase-orders': ['purchase_orders.view'],
  '/dashboard/purchase-orders/analytics': ['purchase_orders.view'],
  '/dashboard/production': ['production.view'],
  '/dashboard/production-plans': ['production.view'],
  '/dashboard/resource-usage': ['production.view'],
  '/dashboard/quality': ['quality.check'],
  '/dashboard/quality-checks': ['quality.check'],
  '/dashboard/quality-checkpoints': ['quality.check'],
  '/dashboard/menu-planning': ['menus.view'],
  '/dashboard/menu-planning/create': ['menus.create'],
  '/dashboard/menu-planning/planning': ['menus.view'],
  '/dashboard/menu-planning/nutrition': ['menus.view'],
  '/dashboard/recipes': ['recipes.view'],
  '/dashboard/recipes/new': ['recipes.create'],
  '/dashboard/nutrition-consultations': ['nutrition.consult'],
  '/dashboard/students': ['students.view'],
  '/dashboard/food-samples': ['quality.check'],
  '/dashboard/drivers': ['drivers.view'],
  '/dashboard/waste-management': ['waste.view'],
  '/dashboard/raw-materials': ['inventory.view'],
  '/dashboard/distributions': ['distributions.view'],
  '/dashboard/distributions/schools': ['distributions.view'],
  '/dashboard/distributions/tracking': ['distributions.track'],
  '/dashboard/distributions/routes': ['distributions.view'],
  '/dashboard/vehicles': ['production.view'],
  '/dashboard/monitoring': ['reports.view'],
  '/dashboard/monitoring/real-time': ['reports.view'],
  '/dashboard/monitoring/analytics': ['analytics.view'],
  '/dashboard/monitoring/reports': ['reports.view'],
  '/dashboard/performance': ['reports.view'],
  '/dashboard/feedback': ['feedback.view'],
} as const

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.startsWith('/favicon.ico') ||
      /\.(png|jpg|jpeg|gif|svg)$/.test(pathname)) {
    return NextResponse.next()
  }

  // Handle authentication
  if (!session && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Handle authenticated routes
  if (session) {
    // Redirect from auth pages if already logged in
    if (pathname.startsWith("/auth")) {
      const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []
      const dashboardRoute = getDashboardRouteSync(userRoles)
      return NextResponse.redirect(new URL(dashboardRoute, request.url))
    }

    // Handle clean URL rewrites to internal dashboard routes
    const rewriteTarget = URL_REWRITES[pathname as keyof typeof URL_REWRITES]
    if (rewriteTarget) {
      // Check permissions for the internal route
      const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []
      
      const requiredPermissions = PROTECTED_ROUTES[rewriteTarget as keyof typeof PROTECTED_ROUTES]
      if (requiredPermissions) {
        const hasAccess = requiredPermissions.some(permission => 
          hasPermission(userRoles, permission as any)
        )

        if (!hasAccess) {
          // Redirect to appropriate dashboard with error message
          const dashboardRoute = getDashboardRouteSync(userRoles)
          const url = new URL(dashboardRoute, request.url)
          url.searchParams.set('error', 'access_denied')
          url.searchParams.set('message', 'You do not have permission to access this page')
          return NextResponse.redirect(url)
        }
      }

      // Rewrite to internal dashboard route
      const url = request.nextUrl.clone()
      url.pathname = rewriteTarget
      return NextResponse.rewrite(url)
    }

    // Handle dynamic routes (e.g., /menu-planning/[id]/edit)
    const dynamicRouteMatch = handleDynamicRoutes(pathname)
    if (dynamicRouteMatch) {
      const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []
      
      // Check permissions for dynamic routes
      const requiredPermissions = PROTECTED_ROUTES[dynamicRouteMatch.baseRoute as keyof typeof PROTECTED_ROUTES]
      if (requiredPermissions) {
        const hasAccess = requiredPermissions.some(permission => 
          hasPermission(userRoles, permission as any)
        )

        if (!hasAccess) {
          const dashboardRoute = getDashboardRouteSync(userRoles)
          const url = new URL(dashboardRoute, request.url)
          url.searchParams.set('error', 'access_denied')
          return NextResponse.redirect(url)
        }
      }

      // Rewrite to internal dashboard route
      const url = request.nextUrl.clone()
      url.pathname = dynamicRouteMatch.internalRoute
      return NextResponse.rewrite(url)
    }

    // Handle direct access to internal dashboard routes (redirect to clean URLs)
    if (pathname.startsWith("/dashboard")) {
      const cleanUrl = getCleanUrl(pathname)
      if (cleanUrl !== pathname) {
        return NextResponse.redirect(new URL(cleanUrl, request.url))
      }
    }

    // Legacy admin route protection (for backward compatibility)
    if (pathname.startsWith("/admin") && !URL_REWRITES[pathname as keyof typeof URL_REWRITES]) {
      const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []
      const isAdmin = userRoles.some(role => ['SUPER_ADMIN', 'ADMIN'].includes(role))
      if (!isAdmin) {
        const dashboardRoute = getDashboardRouteSync(userRoles)
        return NextResponse.redirect(new URL(dashboardRoute, request.url))
      }
    }
  }

  return NextResponse.next()
}

// Helper function to convert internal dashboard routes to clean URLs
function getCleanUrl(internalRoute: string): string {
  for (const [cleanUrl, internalUrl] of Object.entries(URL_REWRITES)) {
    if (internalUrl === internalRoute) {
      return cleanUrl
    }
  }
  
  // Special mappings
  if (internalRoute === '/dashboard' || internalRoute === '/dashboard/basic') {
    return '/home'
  }
  
  // If no mapping found, remove /dashboard prefix and redirect to home if empty
  const cleanPath = internalRoute.replace('/dashboard', '')
  return cleanPath || '/home'
}

// Helper function to handle dynamic routes
function handleDynamicRoutes(pathname: string): { baseRoute: string; internalRoute: string } | null {
  // Handle menu planning dynamic routes
  const menuPlanningEditMatch = pathname.match(/^\/menu-planning\/([^\/]+)\/edit$/)
  if (menuPlanningEditMatch) {
    return {
      baseRoute: '/dashboard/menu-planning',
      internalRoute: `/dashboard/menu-planning/${menuPlanningEditMatch[1]}/edit`
    }
  }

  const menuPlanningViewMatch = pathname.match(/^\/menu-planning\/([^\/]+)$/)
  if (menuPlanningViewMatch && !['create', 'planning', 'nutrition'].includes(menuPlanningViewMatch[1])) {
    return {
      baseRoute: '/dashboard/menu-planning',
      internalRoute: `/dashboard/menu-planning/${menuPlanningViewMatch[1]}`
    }
  }

  // Handle recipe dynamic routes
  const recipeEditMatch = pathname.match(/^\/recipes\/([^\/]+)\/edit$/)
  if (recipeEditMatch) {
    return {
      baseRoute: '/dashboard/recipes',
      internalRoute: `/dashboard/recipes/${recipeEditMatch[1]}/edit`
    }
  }

  const recipeViewMatch = pathname.match(/^\/recipes\/([^\/]+)$/)
  if (recipeViewMatch && recipeViewMatch[1] !== 'new') {
    return {
      baseRoute: '/dashboard/recipes',
      internalRoute: `/dashboard/recipes/${recipeViewMatch[1]}`
    }
  }

  // Handle user dynamic routes
  const userEditMatch = pathname.match(/^\/users\/([^\/]+)\/edit$/)
  if (userEditMatch) {
    return {
      baseRoute: '/dashboard/users',
      internalRoute: `/dashboard/users/${userEditMatch[1]}/edit`
    }
  }

  return null
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}
