import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:create'
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

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, roleIds } = await request.json()

    if (!userId || !Array.isArray(roleIds)) {
      return NextResponse.json(
        { error: 'User ID and role IDs array are required' },
        { status: 400 }
      )
    }

    // Remove existing roles for the user
    await prisma.userRole.deleteMany({
      where: { userId }
    })

    // Add new roles
    const userRoles = roleIds.map(roleId => ({
      userId,
      roleId
    }))

    await prisma.userRole.createMany({
      data: userRoles
    })

    // Return updated user with roles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error assigning roles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
