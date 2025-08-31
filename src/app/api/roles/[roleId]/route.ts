import { NextRequest, NextResponse } from 'next/server'
import { getRoleByName, refreshRoleCache } from '@/lib/permissions/database-roles'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET: Fetch role by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { roleId } = await params
    
    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }

    // Get role by ID from database
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    })
    
    if (!role) {
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
            role: { id: roleId }
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        ...role,
        userCount,
        permissionCount: role.permissions.length
      }
    })
    
  } catch (error) {
    console.error('Error in GET /api/roles/[roleId]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch role' },
      { status: 500 }
    )
  }
}

// PUT: Update role
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { roleId } = await params
    const body = await request.json()
    const { name, description, permissions } = body
    
    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }
    
    if (!name || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Name and permissions array are required' },
        { status: 400 }
      )
    }
    
    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: roleId }
    })
    
    if (!existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }
    
    // Check if another role with the same name exists (excluding current role)
    if (name.toUpperCase() !== existingRole.name) {
      const duplicateRole = await prisma.role.findUnique({
        where: { 
          name: name.toUpperCase(),
          NOT: { id: roleId }
        }
      })
      
      if (duplicateRole) {
        return NextResponse.json(
          { error: 'A role with this name already exists' },
          { status: 409 }
        )
      }
    }
    
    const updatedRole = await prisma.role.update({
      where: { id: roleId },
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
      data: updatedRole
    })
    
  } catch (error) {
    console.error('Error in PUT /api/roles/[roleId]:', error)
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
}

// DELETE: Delete role
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { roleId } = await params
    
    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }
    
    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: roleId }
    })
    
    if (!existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }
    
    // Check if role is assigned to any users
    const userCount = await prisma.user.count({
      where: { 
        roles: { 
          some: { 
            role: { id: roleId }
          }
        }
      }
    })
    
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role that is assigned to users' },
        { status: 400 }
      )
    }
    
    await prisma.role.delete({
      where: { id: roleId }
    })
    
    // Refresh cache
    refreshRoleCache()
    
    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully'
    })
    
  } catch (error) {
    console.error('Error in DELETE /api/roles/[roleId]:', error)
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    )
  }
}
