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
    const roleId = id

    const role = await prisma.role.findUnique({
      where: { id: roleId },
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

    return NextResponse.json(role)
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
    const roleId = id

    const { name, description, permissions } = await request.json()

    const role = await prisma.role.update({
      where: { id: roleId },
      data: {
        name,
        description,
        permissions
      }
    })

    return NextResponse.json(role)
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
    const roleId = id

    // Check if role has users assigned
    const roleWithUsers = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    })

    if (!roleWithUsers) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    if (roleWithUsers._count.users > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role with assigned users' },
        { status: 400 }
      )
    }

    await prisma.role.delete({
      where: { id: roleId }
    })

    return NextResponse.json({ message: 'Role deleted successfully' })
  } catch (error) {
    console.error('Error deleting role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
