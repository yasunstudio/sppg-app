// ============================================================================
// PERMISSIONS API ROUTE (src/app/api/permissions/route.ts)
// Enhanced with Database-Driven Permission System
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

// GET: Fetch permissions with enhanced features
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view permissions
    const hasPermission = await permissionEngine.hasAnyPermission(session.user.id, [
      'system.config', 'users.view'
    ])

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const moduleParam = searchParams.get('module')
    const includeRoles = searchParams.get('includeRoles') === 'true'
    const search = searchParams.get('search') || ''
    const roleId = searchParams.get('roleId')
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // Special case: get permissions for a specific role
    if (roleId) {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
        select: {
          id: true,
          name: true,
          permissions: true
        }
      })

      if (!role) {
        return NextResponse.json(
          { error: 'Role not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          roleId: role.id,
          roleName: role.name,
          permissions: role.permissions || []
        }
      })
    }

    // Build where condition for permissions table
    const whereCondition = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { displayName: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ]
        } : {},
        category ? { category } : {},
        moduleParam ? { module: moduleParam } : {},
        { isActive: true }
      ].filter(condition => Object.keys(condition).length > 0)
    }

    // Get total count
    const totalCount = await prisma.permission.count({
      where: whereCondition.AND.length > 0 ? whereCondition : { isActive: true }
    })

    // Fetch permissions
    const permissions = await prisma.permission.findMany({
      where: whereCondition.AND.length > 0 ? whereCondition : { isActive: true },
      orderBy: [
        { category: 'asc' },
        { module: 'asc' },
        { name: 'asc' }
      ],
      skip: offset,
      take: limit
    })

    // If includeRoles is true, get role assignments for each permission
    let permissionsWithRoles = permissions
    
    if (includeRoles) {
      const rolesData = await prisma.role.findMany({
        select: {
          id: true,
          name: true,
          permissions: true,
          color: true
        }
      })

      permissionsWithRoles = permissions.map(permission => {
        const assignedRoles = rolesData
          .filter(role => role.permissions.includes(permission.name))
          .map(role => ({
            id: role.id,
            name: role.name,
            color: role.color
          }))

        return {
          ...permission,
          assignedRoles
        }
      })
    }

    // Group permissions by category for better organization
    const groupedPermissions = permissionsWithRoles.reduce((groups, permission) => {
      const category = permission.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(permission)
      return groups
    }, {} as Record<string, typeof permissionsWithRoles>)

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        permissions: permissionsWithRoles,
        grouped: groupedPermissions,
        categories: Object.keys(groupedPermissions).sort()
      },
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error in GET /api/permissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    )
  }
}

// POST: Create new permission (system admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to create permissions (system admin only)
    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'system.config')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { name, displayName, description, category, module, action } = body

    if (!name || !displayName || !category || !action) {
      return NextResponse.json(
        { error: 'Name, displayName, category, and action are required' },
        { status: 400 }
      )
    }

    // Check if permission already exists
    const existingPermission = await prisma.permission.findUnique({
      where: { name }
    })

    if (existingPermission) {
      return NextResponse.json(
        { error: 'Permission with this name already exists' },
        { status: 409 }
      )
    }

    // Create new permission
    const permission = await prisma.permission.create({
      data: {
        name,
        displayName,
        description: description || '',
        category,
        module: module || category,
        action,
        isSystemPerm: false,
        isActive: true
      }
    })

    // Clear permission cache
    permissionEngine.clearAllCaches()

    return NextResponse.json({
      success: true,
      data: permission,
      message: 'Permission created successfully'
    })

  } catch (error) {
    console.error('Error in POST /api/permissions:', error)
    return NextResponse.json(
      { error: 'Failed to create permission' },
      { status: 500 }
    )
  }
}

// PUT: Update existing permission
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to update permissions
    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'system.config')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { id, displayName, description, category, module, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Permission ID is required' },
        { status: 400 }
      )
    }

    // Check if permission exists
    const existingPermission = await prisma.permission.findUnique({
      where: { id }
    })

    if (!existingPermission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    // Prevent updating system permissions
    if (existingPermission.isSystemPerm) {
      return NextResponse.json(
        { error: 'Cannot update system permission' },
        { status: 403 }
      )
    }

    // Update permission
    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: {
        displayName: displayName || existingPermission.displayName,
        description: description !== undefined ? description : existingPermission.description,
        category: category || existingPermission.category,
        module: module || existingPermission.module,
        isActive: isActive !== undefined ? isActive : existingPermission.isActive,
        updatedAt: new Date()
      }
    })

    // Clear permission cache
    permissionEngine.clearAllCaches()

    return NextResponse.json({
      success: true,
      data: updatedPermission,
      message: 'Permission updated successfully'
    })

  } catch (error) {
    console.error('Error in PUT /api/permissions:', error)
    return NextResponse.json(
      { error: 'Failed to update permission' },
      { status: 500 }
    )
  }
}

// DELETE: Delete permission
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to delete permissions
    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'system.config')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const permissionId = searchParams.get('id')
    
    if (!permissionId) {
      return NextResponse.json(
        { error: 'Permission ID is required' },
        { status: 400 }
      )
    }

    // Check if permission exists
    const existingPermission = await prisma.permission.findUnique({
      where: { id: permissionId }
    })

    if (!existingPermission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    // Prevent deleting system permissions
    if (existingPermission.isSystemPerm) {
      return NextResponse.json(
        { error: 'Cannot delete system permission' },
        { status: 403 }
      )
    }

    // Check if permission is used in any roles
    const rolesWithPermission = await prisma.role.findMany({
      where: {
        permissions: {
          has: existingPermission.name
        }
      },
      select: {
        name: true
      }
    })

    if (rolesWithPermission.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete permission used in roles', 
          roles: rolesWithPermission.map(r => r.name)
        },
        { status: 409 }
      )
    }

    // Delete permission
    await prisma.permission.delete({
      where: { id: permissionId }
    })

    // Clear permission cache
    permissionEngine.clearAllCaches()

    return NextResponse.json({
      success: true,
      message: 'Permission deleted successfully'
    })

  } catch (error) {
    console.error('Error in DELETE /api/permissions:', error)
    return NextResponse.json(
      { error: 'Failed to delete permission' },
      { status: 500 }
    )
  }
}
