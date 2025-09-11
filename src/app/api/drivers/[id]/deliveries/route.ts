import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { permissionEngine } from '@/lib/permissions/core/permission-engine';
import { prisma } from '@/lib/prisma';

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
      'drivers:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // First verify the driver exists
    const driver = await prisma.driver.findFirst({
      where: {
        OR: [
          { id: id },
          { employeeId: id }
        ],
        deletedAt: null
      }
    });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    // Build where conditions
    const where: any = {
      driverId: driver.id
    };

    if (status) {
      where.status = status;
    }

    if (startDate) {
      where.plannedTime = {
        ...where.plannedTime,
        gte: new Date(startDate)
      };
    }

    if (endDate) {
      where.plannedTime = {
        ...where.plannedTime,
        lte: new Date(endDate)
      };
    }

    // Get deliveries with related data
    const [deliveries, total] = await Promise.all([
      prisma.delivery.findMany({
        where,
        skip,
        take: limit,
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              employeeId: true,
              phone: true
            }
          },
          vehicle: {
            select: {
              id: true,
              plateNumber: true,
              type: true
            }
          },
          distribution: {
            select: {
              id: true,
              distributionDate: true
            }
          },
          school: {
            select: {
              id: true,
              name: true,
              address: true
            }
          }
        },
        orderBy: {
          plannedTime: 'desc'
        }
      }),
      prisma.delivery.count({ where })
    ]);

    // Calculate statistics
    const stats = await prisma.delivery.groupBy({
      by: ['status'],
      where: {
        driverId: driver.id
      },
      _count: {
        status: true
      }
    });

    const statusStats = stats.reduce((acc: any, stat: any) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        deliveries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          total,
          byStatus: statusStats
        },
        driver: {
          id: driver.id,
          name: driver.name,
          employeeId: driver.employeeId
        }
      }
    });

  } catch (error) {
    console.error('Driver deliveries fetch error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch driver deliveries',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
