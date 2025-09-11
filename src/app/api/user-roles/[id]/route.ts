import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

interface RouteParams {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params

    const userRole = await prisma.userRole.findUnique({
      where: { 
        id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: true
          }
        }
      }
    })

    if (!userRole) {
      return NextResponse.json(
        { 
          success: false, 
          error: "User role assignment tidak ditemukan" 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: userRole
    })

  } catch (error) {
    console.error("Error fetching user role:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal memuat detail user role assignment",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'user-roles:update'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params
    const body = await request.json()
    
    const {
      userId,
      roleId
    } = body

    // Check if user role exists
    const existingUserRole = await prisma.userRole.findUnique({
      where: { id }
    })

    if (!existingUserRole) {
      return NextResponse.json(
        { 
          success: false, 
          error: "User role assignment tidak ditemukan" 
        },
        { status: 404 }
      )
    }

    // Check if user exists
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return NextResponse.json(
          { 
            success: false, 
            error: "User tidak ditemukan" 
          },
          { status: 404 }
        )
      }
    }

    // Check if role exists
    if (roleId) {
      const role = await prisma.role.findUnique({
        where: { id: roleId }
      })

      if (!role) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Role tidak ditemukan" 
          },
          { status: 404 }
        )
      }
    }

    // Check for duplicate if userId or roleId is being changed
    if (userId || roleId) {
      const duplicateCheck = await prisma.userRole.findFirst({
        where: {
          userId: userId || existingUserRole.userId,
          roleId: roleId || existingUserRole.roleId,
          id: { not: id }
        }
      })

      if (duplicateCheck) {
        return NextResponse.json(
          { 
            success: false, 
            error: "User already has this role assigned" 
          },
          { status: 409 }
        )
      }
    }

    const updatedUserRole = await prisma.userRole.update({
      where: { id },
      data: {
        ...(userId && { userId }),
        ...(roleId && { roleId })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUserRole,
      message: "User role assignment updated successfully"
    })

  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal memperbarui user role assignment",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'user-roles:delete'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params

    // Check if user role exists
    const existingUserRole = await prisma.userRole.findUnique({
      where: { id }
    })

    if (!existingUserRole) {
      return NextResponse.json(
        { 
          success: false, 
          error: "User role assignment tidak ditemukan" 
        },
        { status: 404 }
      )
    }

    await prisma.userRole.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "User role assignment removed successfully"
    })

  } catch (error) {
    console.error("Error deleting user role:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal menghapus user role assignment",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
