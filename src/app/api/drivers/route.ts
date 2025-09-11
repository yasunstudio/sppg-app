import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { permissionEngine } from '@/lib/permissions/core/permission-engine';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'drivers:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const drivers = await prisma.driver.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ success: true, data: drivers });

  } catch (error) {
    console.error('Drivers GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'drivers:create'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const data = await request.json();

    const driver = await prisma.driver.create({
      data: {
        employeeId: data.employeeId,
        name: data.name,
        licenseNumber: data.licenseNumber,
        licenseType: data.licenseType,
        licenseExpiry: new Date(data.licenseExpiry),
        phone: data.phone || null
      }
    });

    return NextResponse.json({ success: true, data: driver });

  } catch (error) {
    console.error('Driver POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
