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
  '/suppliers': '/dashboard/suppliers',
  '/orders': '/dashboard/purchase-orders',
  
  // Production & Planning
  '/production': '/dashboard/production',
  '/menu-planning': '/dashboard/menu-planning',
  '/recipes': '/dashboard/recipes',
  '/quality': '/dashboard/quality',
  
  // Distribution & Logistics
  '/distribution': '/dashboard/distributions',
  '/vehicles': '/dashboard/vehicles',
  '/drivers': '/dashboard/drivers',
  
  // Reports & Analytics
  '/reports': '/dashboard/monitoring/reports',
  '/analytics': '/dashboard/monitoring/analytics',
  '/financial': '/dashboard/financial',
  
  // Administration
  '/admin': '/dashboard/admin',
  '/settings': '/dashboard/settings',
  '/notifications': '/dashboard/notifications',
} as const

// Define route-to-permission mapping (updated for clean URLs)
const PROTECTED_ROUTES = {
  // Internal dashboard routes (for permission checking)
  '/dashboard/users': ['users.view'],
  '/dashboard/roles': ['system.config'],
  '/dashboard/user-roles': ['users.edit', 'system.config'],
  '/dashboard/system-config': ['system.config'],
  '/dashboard/audit-logs': ['audit.view'],
  '/dashboard/admin': ['system.config'],
  '/dashboard/financial': ['financial.view'],
  '/dashboard/inventory': ['inventory.view'],
  '/dashboard/suppliers': ['suppliers.view'],
  '/dashboard/purchase-orders': ['purchase_orders.view'],
  '/dashboard/production': ['production.view'],
  '/dashboard/quality': ['quality.check'],
  '/dashboard/quality-checks': ['quality.check'],
  '/dashboard/menu-planning': ['menus.view'],
  '/dashboard/recipes': ['recipes.view'],
  '/dashboard/nutrition-consultations': ['nutrition.consult'],
  '/dashboard/students': ['students.view'],
  '/dashboard/food-samples': ['quality.check'],
  '/dashboard/drivers': ['drivers.view'],
  '/dashboard/waste-management': ['waste.view'],
  '/dashboard/raw-materials': ['inventory.view'],
  '/dashboard/distributions': ['distributions.view'],
  '/dashboard/vehicles': ['production.view'],
  '/dashboard/monitoring/reports': ['reports.view'],
  '/dashboard/monitoring/analytics': ['analytics.view'],
} as const

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Handle authentication
  if (!session && !pathname.startsWith("/auth") && !pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Handle authenticated routes
  if (session) {
    // Redirect from auth pages if already logged in
    if (pathname.startsWith("/auth")) {
      const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []
      const dashboardRoute = getDashboardRouteSync(userRoles)
      // Convert internal dashboard route to clean URL
      const cleanUrl = getCleanUrl(dashboardRoute)
      return NextResponse.redirect(new URL(cleanUrl, request.url))
    }

    // Handle clean URL rewrites
    const rewriteTarget = URL_REWRITES[pathname as keyof typeof URL_REWRITES]
    if (rewriteTarget) {
      // Check permissions for the internal route
      const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []
      
      // Check if rewrite target requires specific permissions
      const requiredPermissions = PROTECTED_ROUTES[rewriteTarget as keyof typeof PROTECTED_ROUTES]
      if (requiredPermissions) {
        const hasAccess = requiredPermissions.some(permission => 
          hasPermission(userRoles, permission as any)
        )

        if (!hasAccess) {
          // Redirect to appropriate dashboard with error message
          const dashboardRoute = getDashboardRouteSync(userRoles)
          const cleanUrl = getCleanUrl(dashboardRoute)
          const url = new URL(cleanUrl, request.url)
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

    // Handle internal dashboard routes (when accessed directly)
    if (pathname.startsWith("/dashboard")) {
      const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []

      // Check permissions for internal dashboard routes
      for (const [routePath, requiredPermissions] of Object.entries(PROTECTED_ROUTES)) {
        if (pathname.startsWith(routePath)) {
          const hasAccess = requiredPermissions.some(permission => 
            hasPermission(userRoles, permission as any)
          )

          if (!hasAccess) {
            // Redirect to appropriate dashboard with error message
            const dashboardRoute = getDashboardRouteSync(userRoles)
            const cleanUrl = getCleanUrl(dashboardRoute)
            const url = new URL(cleanUrl, request.url)
            url.searchParams.set('error', 'access_denied')
            url.searchParams.set('message', 'You do not have permission to access this page')
            return NextResponse.redirect(url)
          }
          break
        }
      }
    }

    // Legacy admin route protection (for backward compatibility)
    if (pathname.startsWith("/admin")) {
      const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []
      const isAdmin = userRoles.some(role => ['SUPER_ADMIN', 'ADMIN'].includes(role))
      if (!isAdmin) {
        const dashboardRoute = getDashboardRouteSync(userRoles)
        const cleanUrl = getCleanUrl(dashboardRoute)
        return NextResponse.redirect(new URL(cleanUrl, request.url))
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
  
  // Fallback mapping for routes not in URL_REWRITES
  if (internalRoute === '/dashboard') return '/home'
  if (internalRoute === '/dashboard/admin') return '/admin'
  
  // If no mapping found, return as is but remove /dashboard prefix
  return internalRoute.replace('/dashboard', '') || '/home'
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
