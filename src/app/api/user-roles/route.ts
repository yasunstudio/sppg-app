// ============================================================================
// USER ROLES API ROUTE (src/app/api/user-roles/route.ts)
// Enhanced with Database-Driven Permission System
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

// GET: Fetch user-role assignments
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'users.view')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const roleId = searchParams.get('roleId')

    const whereCondition: any = {}
    if (userId) whereCondition.userId = userId
    if (roleId) whereCondition.roleId = roleId

    const userRoles = await prisma.userRole.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            permissions: true
          }
        }
      },
      orderBy: {
        assignedAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: userRoles
    })

  } catch (error) {
    console.error('Error in GET /api/user-roles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user roles' },
      { status: 500 }
    )
  }
}

// POST: Assign role to user
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'users.update')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, roleId } = body

    if (!userId || !roleId) {
      return NextResponse.json(
        { error: 'User ID and Role ID are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    // Check if user-role assignment already exists
    const existingAssignment = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId
        }
      }
    })

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'User already has this role' },
        { status: 409 }
      )
    }

    const userRole = await prisma.userRole.create({
      data: {
        userId,
        roleId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            permissions: true
          }
        }
      }
    })

    // Clear user permissions cache
    permissionEngine.clearAllCaches()

    return NextResponse.json({
      success: true,
      data: userRole,
      message: 'Role assigned to user successfully'
    })

  } catch (error) {
    console.error('Error in POST /api/user-roles:', error)
    return NextResponse.json(
      { error: 'Failed to assign role to user' },
      { status: 500 }
    )
  }
}

// DELETE: Remove role from user
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'users.update')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userRoleId = searchParams.get('id')
    const userId = searchParams.get('userId')
    const roleId = searchParams.get('roleId')

    if (!userRoleId && (!userId || !roleId)) {
      return NextResponse.json(
        { error: 'Either user-role ID or both user ID and role ID are required' },
        { status: 400 }
      )
    }

    let userRole;

    if (userRoleId) {
      userRole = await prisma.userRole.findUnique({
        where: { id: userRoleId }
      })
    } else {
      userRole = await prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: userId!,
            roleId: roleId!
          }
        }
      })
    }

    if (!userRole) {
      return NextResponse.json(
        { error: 'User-role assignment not found' },
        { status: 404 }
      )
    }

    await prisma.userRole.delete({
      where: { id: userRole.id }
    })

    // Clear user permissions cache
    permissionEngine.clearAllCaches()

    return NextResponse.json({
      success: true,
      message: 'Role removed from user successfully'
    })

  } catch (error) {
    console.error('Error in DELETE /api/user-roles:', error)
    return NextResponse.json(
      { error: 'Failed to remove role from user' },
      { status: 500 }
    )
  }
}
