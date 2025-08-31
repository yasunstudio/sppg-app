import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || [];
    if (!hasPermission(userRoles, 'quality.check')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    
    const qualityStandard = await prisma.qualityStandard.findUnique({
      where: { id: id },
    });

    if (!qualityStandard) {
      return NextResponse.json({ error: 'Quality standard not found' }, { status: 404 });
    }

    return NextResponse.json(qualityStandard);
  } catch (error) {
    console.error('Error fetching quality standard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || [];
    if (!hasPermission(userRoles, 'quality.check')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, description, targetValue, currentValue, unit, category, isActive } = body;

    if (!name || !description || targetValue === undefined || unit === undefined || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const qualityStandard = await prisma.qualityStandard.update({
      where: { id: id },
      data: {
        name,
        description,
        targetValue: parseFloat(targetValue),
        currentValue: currentValue !== undefined && currentValue !== null ? parseFloat(currentValue) : null,
        unit,
        category,
        isActive,
      },
    });

    return NextResponse.json(qualityStandard);
  } catch (error) {
    console.error('Error updating quality standard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || [];
    if (!hasPermission(userRoles, 'quality.check')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.qualityStandard.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Quality standard deleted successfully' });
  } catch (error) {
    console.error('Error deleting quality standard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
