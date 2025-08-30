import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { hasPermission } from "@/lib/permissions"

// Define route-to-permission mapping
const PROTECTED_ROUTES = {
  '/dashboard/users': ['users.view'],
  '/dashboard/roles': ['system.config'],
  '/dashboard/user-roles': ['users.edit', 'system.config'],
  '/dashboard/system-config': ['system.config'],
  '/dashboard/audit-logs': ['audit.view'],
  '/dashboard/admin': ['system.config'],
  '/dashboard/financial': ['finance.view'],
  '/dashboard/inventory': ['inventory.view'],
  '/dashboard/production': ['production.view'],
  '/dashboard/quality': ['quality.check'],
  '/dashboard/posyandu': ['posyandu.view'],
  '/dashboard/menu-planning': ['menus.view', 'nutrition.read'],
  '/dashboard/recipes': ['menus.view', 'nutrition.read'],
} as const

export async function middleware(request: NextRequest) {
  const session = await auth()

  if (!session && !request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Handle authenticated routes
  if (session) {
    // Redirect from auth pages if already logged in
    if (request.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Role-based access control for protected routes
    const path = request.nextUrl.pathname
    const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []

    // Check if current path requires specific permissions
    for (const [routePath, requiredPermissions] of Object.entries(PROTECTED_ROUTES)) {
      if (path.startsWith(routePath)) {
        // Check if user has any of the required permissions
        const hasAccess = requiredPermissions.some(permission => 
          hasPermission(userRoles, permission as any)
        )

        if (!hasAccess) {
          // Redirect to dashboard with error message
          const url = new URL("/dashboard", request.url)
          url.searchParams.set('error', 'access_denied')
          url.searchParams.set('message', 'You do not have permission to access this page')
          return NextResponse.redirect(url)
        }
        break
      }
    }

    // Legacy admin route protection (for backward compatibility)
    if (path.startsWith("/admin")) {
      const isAdmin = userRoles.some(role => ['SUPER_ADMIN', 'ADMIN'].includes(role))
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
}
