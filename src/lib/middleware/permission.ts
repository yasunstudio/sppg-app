import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { hasPermission, type Permission } from "@/lib/permissions"

export async function withPermission(
  permission: Permission,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const session = await auth()
      
      if (!session || !session.user) {
        return NextResponse.json(
          { error: "Unauthorized" }, 
          { status: 401 }
        )
      }

      // Get user roles from session
      const userRoles = session.user.role ? [session.user.role] : []
      
      if (!hasPermission(userRoles, permission)) {
        return NextResponse.json(
          { error: "Forbidden - Insufficient permissions" }, 
          { status: 403 }
        )
      }

      return handler(request)
    } catch (error) {
      console.error("Permission middleware error:", error)
      return NextResponse.json(
        { error: "Internal server error" }, 
        { status: 500 }
      )
    }
  }
}

export function createPermissionMiddleware(permission: Permission) {
  return (handler: (request: NextRequest) => Promise<NextResponse>) =>
    withPermission(permission, handler)
}
