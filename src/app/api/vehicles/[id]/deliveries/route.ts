import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";
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

    const { id: vehicleId } = await params;
    
    // Get recent deliveries for this vehicle (last 10 deliveries)
    const deliveries = await prisma.delivery.findMany({
      where: {
        vehicleId: vehicleId,
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        distribution: {
          select: {
            id: true,
            distributionDate: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Transform the data to match the expected format
    const formattedDeliveries = deliveries.map(delivery => ({
      id: delivery.id,
      deliveryDate: delivery.arrivalTime || delivery.plannedTime || delivery.distribution.distributionDate,
      status: delivery.status,
      school: {
        id: delivery.school?.id || '',
        name: delivery.school?.name || 'Tidak Diketahui',
        address: delivery.school?.address || 'Alamat tidak tersedia',
      },
      portionsDelivered: delivery.portionsDelivered || 0,
      notes: delivery.notes,
      distributionId: delivery.distributionId,
    }));

    return NextResponse.json({
      success: true,
      data: formattedDeliveries,
    });
  } catch (error) {
    console.error('Error fetching vehicle deliveries:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data riwayat pengiriman kendaraan' 
      },
      { status: 500 }
    );
  }
}
