import { auth } from "@/app/api/auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

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

    // Role-based access control
    const userRole = session.user?.role
    const path = request.nextUrl.pathname

    // Admin only routes
    if (path.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
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
