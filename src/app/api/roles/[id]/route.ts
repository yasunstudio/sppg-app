import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
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
      }
    })

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...role,
      userCount: role.users.length,
      permissionCount: role.permissions.length,
      isSystemRole: true,
      computedPermissions: role.permissions,
      effectivePermissions: role.permissions.length
    })

  } catch (error) {
    console.error('Error fetching role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { name, description, permissions } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      )
    }

    const existingRole = await prisma.role.findUnique({
      where: { id }
    })

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        permissions: permissions || existingRole.permissions
      }
    })

    return NextResponse.json(updatedRole)

  } catch (error) {
    console.error('Error updating role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        users: true
      }
    })

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    if (role.name === 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot delete ADMIN role' },
        { status: 403 }
      )
    }

    if (role.users.length > 0) {
      return NextResponse.json(
        { error: `Cannot delete role. ${role.users.length} user(s) still have this role.` },
        { status: 409 }
      )
    }

    await prisma.role.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
