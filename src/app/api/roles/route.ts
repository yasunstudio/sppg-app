// ============================================================================
// ROLES API ROUTE (src/app/api/roles/route.ts)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getAllRoles, getRoleByName, refreshRoleCache } from '@/lib/permissions/database-roles'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET: Fetch all roles with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const refresh = searchParams.get('refresh') === 'true'
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const permissions = searchParams.get('permissions') || ''
    
    if (refresh) {
      refreshRoleCache()
    }
    
    if (role) {
      // Get specific role
      const roleData = await getRoleByName(role)
      if (!roleData) {
        return NextResponse.json(
          { error: 'Role not found' },
          { status: 404 }
        )
      }
      
      // Get user count for this role
      const userCount = await prisma.user.count({
        where: { 
          roles: { 
            some: { 
              role: { name: roleData.name }
            }
          }
        }
      })
      
      return NextResponse.json({
        success: true,
        data: {
          ...roleData,
          userCount
        }
      })
    } else {
      // Get all roles with user counts and pagination
      const roles = await getAllRoles(!refresh)
      
      // Filter roles based on search and permissions
      let filteredRoles = roles.filter(role => {
        const matchesSearch = !search || 
          role.name.toLowerCase().includes(search.toLowerCase()) ||
          role.description?.toLowerCase().includes(search.toLowerCase())
        
        let matchesPermissions = true
        if (permissions === 'high') {
          matchesPermissions = role.permissions.length >= 20
        } else if (permissions === 'medium') {
          matchesPermissions = role.permissions.length >= 10 && role.permissions.length < 20
        } else if (permissions === 'low') {
          matchesPermissions = role.permissions.length < 10
        }
        
        return matchesSearch && matchesPermissions
      })
      
      const total = filteredRoles.length
      const totalPages = Math.ceil(total / limit)
      const skip = (page - 1) * limit
      
      // Apply pagination
      const paginatedRoles = filteredRoles.slice(skip, skip + limit)
      
      const rolesWithCounts = await Promise.all(
        paginatedRoles.map(async (role) => {
          const userCount = await prisma.user.count({
            where: { 
              roles: { 
                some: { 
                  role: { name: role.name }
                }
              }
            }
          })
          
          return {
            ...role,
            userCount,
            permissionCount: role.permissions.length
          }
        })
      )
      
      return NextResponse.json({
        success: true,
        data: rolesWithCounts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      })
    }
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
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, permissions } = body
    
    if (!name || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Name and permissions array are required' },
        { status: 400 }
      )
    }
    
    // Check if role already exists
    const existingRole = await getRoleByName(name)
    if (existingRole) {
      return NextResponse.json(
        { error: 'Role already exists' },
        { status: 409 }
      )
    }
    
    const newRole = await prisma.role.create({
      data: {
        name: name.toUpperCase(),
        description: description || null,
        permissions
      }
    })
    
    // Refresh cache
    refreshRoleCache()
    
    return NextResponse.json({
      success: true,
      data: newRole
    }, { status: 201 })
    
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
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, permissions } = body
    
    if (!name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      )
    }
    
    const existingRole = await getRoleByName(name)
    if (!existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }
    
    const updatedRole = await prisma.role.update({
      where: { id: existingRole.id },
      data: {
        description: description !== undefined ? description : existingRole.description,
        permissions: permissions || existingRole.permissions
      }
    })
    
    // Refresh cache
    refreshRoleCache()
    
    return NextResponse.json({
      success: true,
      data: updatedRole
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
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const roleName = searchParams.get('role')
    
    if (!roleName) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      )
    }
    
    // Prevent deletion of ADMIN role
    if (roleName === 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot delete ADMIN role' },
        { status: 403 }
      )
    }
    
    const existingRole = await getRoleByName(roleName)
    if (!existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }
    
    // Check if role is assigned to any users
    const usersWithRole = await prisma.user.findMany({
      where: { 
        roles: { 
          some: { 
            role: { name: roleName }
          }
        }
      }
    })
    
    if (usersWithRole.length > 0) {
      return NextResponse.json(
        { error: `Cannot delete role. ${usersWithRole.length} user(s) still have this role.` },
        { status: 409 }
      )
    }
    
    await prisma.role.delete({
      where: { id: existingRole.id }
    })
    
    // Refresh cache
    refreshRoleCache()
    
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
