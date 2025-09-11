import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { permissionEngine } from "@/lib/permissions/core/permission-engine"

export async function withPermission(
  permission: string,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const session = await auth()
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Unauthorized" }, 
          { status: 401 }
        )
      }

      // Check permission using database-driven system
      const hasPermission = await permissionEngine.hasPermission(
        session.user.id,
        permission
      );
      
      if (!hasPermission) {
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

export function createPermissionMiddleware(permission: string) {
  return (handler: (request: NextRequest) => Promise<NextResponse>) =>
    withPermission(permission, handler)
}
