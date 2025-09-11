import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PermissionEngine } from "@/lib/permissions/core/permission-engine"

const permissionEngine = new PermissionEngine()

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { permissions } = await request.json()
    
    if (!Array.isArray(permissions)) {
      return NextResponse.json({ error: "Invalid permissions array" }, { status: 400 })
    }

    const results: { [key: string]: boolean } = {}
    
    for (const permission of permissions) {
      results[permission] = await permissionEngine.hasPermission(session.user.id, permission)
    }

    return NextResponse.json({ permissions: results })
  } catch (error) {
    console.error("Error checking permissions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userContext = await permissionEngine.getUserPermissionContext(session.user.id)
    
    return NextResponse.json({
      userId: userContext.userId,
      roles: userContext.roles,
      permissions: Array.from(userContext.permissions),
      highestPriority: userContext.highestPriority
    })
  } catch (error) {
    console.error("Error getting user permissions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
