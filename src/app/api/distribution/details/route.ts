import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

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

    // Get active distributions
    const activeDistributions = await prisma.distribution.findMany({
      where: {
        status: {
          in: ['PREPARING', 'IN_TRANSIT']
        }
      },
      include: {
        schools: {
          include: {
            school: true
          }
        },
        driver: true
      },
      orderBy: {
        distributionDate: 'desc'
      },
      take: 10
    });

    // Get recently completed distributions
    const recentDistributions = await prisma.distribution.findMany({
      where: {
        status: {
          in: ['COMPLETED', 'DELIVERED', 'CANCELLED']
        }
      },
      include: {
        schools: {
          include: {
            school: true
          }
        },
        driver: true
      },
      orderBy: {
        distributionDate: 'desc'
      },
      take: 10
    });

    // Transform data for frontend
    const transformDistribution = (distribution: any) => ({
      id: distribution.id,
      schoolName: distribution.schools?.[0]?.school?.name || 'Multiple Schools',
      driverName: distribution.driver?.name || 'Unassigned Driver',
      status: distribution.status,
      scheduledAt: distribution.distributionDate?.toISOString() || new Date().toISOString(),
      actualDeliveryTime: distribution.actualDeliveryTime?.toISOString(),
      estimatedDuration: distribution.estimatedDuration || 90, // minutes
      actualDuration: distribution.actualDuration || null,
      portionCount: distribution.totalPortions || 0,
      route: `Route ${distribution.schools?.length || 1}`
    });

    return NextResponse.json({
      activeDistributions: activeDistributions.map(transformDistribution),
      recentDistributions: recentDistributions.map(transformDistribution)
    });

  } catch (error) {
    console.error('Error fetching distribution details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch distribution details',
        activeDistributions: [],
        recentDistributions: []
      },
      { status: 500 }
    );
  }
}
