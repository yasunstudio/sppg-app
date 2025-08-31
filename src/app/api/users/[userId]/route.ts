import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"
import type { ApiUser, ApiUserUpdateInput } from "@/lib/types/api"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || []
    if (!hasPermission(userRoles, 'users.view')) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { userId } = await params
    const { searchParams } = new URL(request.url)
    const include = searchParams.get("include") || ""
    
    const includeRoles = include.includes('roles')

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        roles: includeRoles ? {
          select: {
            assignedAt: true,
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                permissions: true
              }
            }
          }
        } : {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        },
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json({
      user: user,
      data: user
    })
  } catch (error) {
    console.error("[USER_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || []
    if (!hasPermission(userRoles, 'users.edit')) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await request.json()
    const { name, email, role, status } = body
    const { userId } = await params

    // Build update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (status !== undefined) updateData.isActive = status === 'ACTIVE'

    // Handle role update if provided
    if (role) {
      // First delete existing roles
      await prisma.userRole.deleteMany({
        where: {
          userId: userId
        }
      })
    }
    
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...updateData,
        ...(role && {
          roles: {
            create: {
              role: {
                connect: {
                  name: role,
                },
              },
            },
          },
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        roles: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      ...user,
      status: user.isActive ? 'ACTIVE' : 'INACTIVE',
      role: (user.roles as any)[0]?.role?.name || 'VIEWER'
    })
  } catch (error) {
    console.error("[USER_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || []
    if (!hasPermission(userRoles, 'users.delete')) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { userId } = await params

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            auditLogs: true,
            createdMenus: true,
            notifications: true,
            qualityCheckpoints: true
          }
        }
      }
    })

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Use soft delete if user has related data, hard delete if not
    const hasRelatedData = 
      existingUser._count.auditLogs > 0 ||
      existingUser._count.createdMenus > 0 ||
      existingUser._count.notifications > 0 ||
      existingUser._count.qualityCheckpoints > 0

    if (hasRelatedData) {
      // Soft delete - mark as deleted but keep data for audit trail
      await prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date(),
          isActive: false,
          email: `deleted_${Date.now()}_${existingUser.email}` // Prevent email conflicts
        }
      })
    } else {
      // Hard delete - remove user and cascading relations
      await prisma.$transaction(async (tx) => {
        // Delete user roles first
        await tx.userRole.deleteMany({
          where: { userId: userId }
        })

        // Delete accounts (NextAuth)
        await tx.account.deleteMany({
          where: { userId: userId }
        })

        // Delete sessions (NextAuth)
        await tx.session.deleteMany({
          where: { userId: userId }
        })

        // Finally delete the user
        await tx.user.delete({
          where: { id: userId }
        })
      })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[USER_DELETE]", error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return new NextResponse("Cannot delete user with existing data. User has been deactivated instead.", { status: 409 })
      }
    }
    
    return new NextResponse("Internal error", { status: 500 })
  }
}
