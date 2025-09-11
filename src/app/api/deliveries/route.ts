import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// prisma imported from lib;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:read'
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

    const deliveries = await prisma.delivery.findMany({
      include: {
        distribution: {
          select: {
            id: true,
            distributionDate: true,
            totalPortions: true,
            status: true
          }
        },
        school: {
          select: {
            name: true,
            address: true,
            principalPhone: true
          }
        },
        driver: {
          select: {
            name: true,
            phone: true,
            licenseNumber: true
          }
        },
        vehicle: {
          select: {
            plateNumber: true,
            type: true,
            capacity: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: deliveries,
      count: deliveries.length
    });
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deliveries' },
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
      'deliveries:create'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      distributionId,
      schoolId,
      driverId,
      vehicleId,
      deliveryOrder,
      plannedTime,
      portionsDelivered,
      notes
    } = body;

    const delivery = await prisma.delivery.create({
      data: {
        distributionId,
        schoolId,
        driverId,
        vehicleId,
        deliveryOrder,
        plannedTime: plannedTime ? new Date(plannedTime) : null,
        portionsDelivered,
        notes,
        status: 'PENDING'
      },
      include: {
        distribution: true,
        school: { select: { name: true } },
        driver: { select: { name: true } },
        vehicle: { select: { plateNumber: true } }
      }
    });

    return NextResponse.json({
      success: true,
      data: delivery,
      message: 'Delivery created successfully'
    });
  } catch (error) {
    console.error('Error creating delivery:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create delivery' },
      { status: 500 }
    );
  }
}
