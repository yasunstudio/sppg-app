import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { checkRoutePermissions } from "@/lib/permissions/middleware/permission-middleware"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes and API routes that don't need protection
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/public') ||
    pathname.includes('.') ||
    pathname === '/' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Get authentication token
  const token = await getToken({ 
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET 
  })

  // Redirect unauthenticated users to sign in
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(signInUrl)
  }

  // Check permission-based route protection
  const permissionResponse = await checkRoutePermissions(request, token)
  if (permissionResponse) {
    return permissionResponse
  }

  // Default dashboard routing based on user roles
  if (pathname === '/dashboard') {
    try {
      // Get user role to determine default dashboard
      const userId = token.sub
      if (!userId) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
      }

      // Simple role-based dashboard routing
      const response = await fetch(`${request.nextUrl.origin}/api/admin/user-roles/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token.sub}`
        }
      }).catch(() => null)

      if (response && response.ok) {
        const userData = await response.json()
        const roles = userData.roles || []
        
        // Determine default dashboard based on highest priority role
        const sortedRoles = roles.sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0))
        const primaryRole = sortedRoles[0]

        if (primaryRole) {
          switch (primaryRole.name) {
            case 'SUPER_ADMIN':
            case 'ADMIN':
              return NextResponse.redirect(new URL('/dashboard/admin', request.url))
            case 'CHEF':
              return NextResponse.redirect(new URL('/dashboard/production', request.url))
            case 'NUTRITIONIST':
              return NextResponse.redirect(new URL('/dashboard/menu', request.url))
            case 'QUALITY_CONTROL':
              return NextResponse.redirect(new URL('/dashboard/quality', request.url))
            case 'DISTRIBUTION_MANAGER':
              return NextResponse.redirect(new URL('/dashboard/logistics', request.url))
            case 'WAREHOUSE_MANAGER':
              return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
            case 'FINANCIAL_ANALYST':
              return NextResponse.redirect(new URL('/dashboard/finance', request.url))
            case 'SCHOOL_ADMIN':
              return NextResponse.redirect(new URL('/dashboard/school', request.url))
            case 'PRODUCTION_STAFF':
              return NextResponse.redirect(new URL('/dashboard/production', request.url))
            case 'DRIVER':
              return NextResponse.redirect(new URL('/dashboard/delivery', request.url))
            default:
              return NextResponse.redirect(new URL('/dashboard/overview', request.url))
          }
        }
      }
      
      // Fallback to overview if role detection fails
      return NextResponse.redirect(new URL('/dashboard/overview', request.url))
    } catch (error) {
      console.error('Error in dashboard routing:', error)
      return NextResponse.redirect(new URL('/dashboard/overview', request.url))
    }
  }

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
