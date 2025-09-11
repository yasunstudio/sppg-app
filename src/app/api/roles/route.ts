// ============================================================================
// ROLES API ROUTE (src/app/api/roles/route.ts)
// Enhanced with Database-Driven Permission System
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

// GET: Fetch roles
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'roles.view')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const includeUsers = searchParams.get('includeUsers') === 'true'

    const roles = await prisma.role.findMany({
      include: includeUsers ? {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      } : undefined,
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: roles
    })

  } catch (error) {
    console.error('Error in GET /api/roles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    )
  }
}

// POST: Create new role
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'roles.create')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, permissions, color, isActive = true } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      )
    }

    // Check if role already exists
    const existingRole = await prisma.role.findUnique({
      where: { name }
    })

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role with this name already exists' },
        { status: 409 }
      )
    }

    const role = await prisma.role.create({
      data: {
        name,
        description: description || '',
        permissions: permissions || [],
        color: color || '#3B82F6',
        isActive
      }
    })

    // Clear permission caches
    permissionEngine.clearAllCaches()

    return NextResponse.json({
      success: true,
      data: role,
      message: 'Role created successfully'
    })

  } catch (error) {
    console.error('Error in POST /api/roles:', error)
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    )
  }
}

// PUT: Update role
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'roles.update')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { id, name, description, permissions, color, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }

    const existingRole = await prisma.role.findUnique({
      where: { id }
    })

    if (!existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (permissions !== undefined) updateData.permissions = permissions
    if (color !== undefined) updateData.color = color
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedRole = await prisma.role.update({
      where: { id },
      data: updateData
    })

    // Clear permission caches
    permissionEngine.clearAllCaches()

    return NextResponse.json({
      success: true,
      data: updatedRole,
      message: 'Role updated successfully'
    })

  } catch (error) {
    console.error('Error in PUT /api/roles:', error)
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
}

// DELETE: Delete role
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'roles.delete')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const roleId = searchParams.get('id')

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }

    const existingRole = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        users: true
      }
    })

    if (!existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    // Check if role is assigned to users
    if (existingRole.users.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role that is assigned to users' },
        { status: 409 }
      )
    }

    await prisma.role.delete({
      where: { id: roleId }
    })

    // Clear permission caches
    permissionEngine.clearAllCaches()

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully'
    })

  } catch (error) {
    console.error('Error in DELETE /api/roles:', error)
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    )
  }
}
