import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'classes:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        school: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: classData
    });

  } catch (error) {
    console.error('Class GET error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch class',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'classes:update'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, grade, schoolId, capacity } = body;

    // Validate required fields
    if (!name || !grade) {
      return NextResponse.json(
        { error: 'Name and grade are required' },
        { status: 400 }
      );
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        grade,
        schoolId,
        capacity: capacity ? parseInt(capacity) : undefined
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedClass
    });

  } catch (error) {
    console.error('Class PUT error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update class',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'classes:delete'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if class exists
    const existingClass = await prisma.class.findUnique({
      where: { id },
      include: {
        school: true
      }
    });

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    // Check if class has current count > 0
    if (existingClass.currentCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete class with students. Please move students to another class first.' },
        { status: 400 }
      );
    }

    await prisma.class.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Class deleted successfully' 
    });

  } catch (error) {
    console.error('Class DELETE error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete class',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
