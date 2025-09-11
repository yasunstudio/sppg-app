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
      'production:read'
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

    // Get active production batches
    const activeBatches = await prisma.productionBatch.findMany({
      where: {
        status: {
          in: ['PENDING', 'IN_PROGRESS', 'QUALITY_CHECK']
        }
      },
      include: {
        productionPlan: {
          include: {
            menu: {
              include: {
                menuItems: true
              }
            }
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      },
      take: 10
    });

    // Get recently completed batches
    const recentBatches = await prisma.productionBatch.findMany({
      where: {
        status: {
          in: ['COMPLETED', 'REJECTED']
        }
      },
      include: {
        productionPlan: {
          include: {
            menu: {
              include: {
                menuItems: true
              }
            }
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 10
    });

    // Transform data for frontend
    const transformBatch = (batch: any) => {
      const itemName = batch.productionPlan?.menu?.menuItems?.[0]?.name || 
                      batch.productionPlan?.menu?.name || 
                      `Batch ${batch.batchNumber}`;
      
      return {
        id: batch.id,
        planId: batch.productionPlanId,
        itemName,
        status: batch.status,
        plannedQuantity: batch.plannedQuantity || 0,
        actualQuantity: batch.actualQuantity || 0,
        startedAt: batch.startedAt?.toISOString() || new Date().toISOString(),
        completedAt: batch.completedAt?.toISOString(),
        estimatedDuration: 2.5, // Default estimated duration in hours
        actualDuration: batch.completedAt && batch.startedAt 
          ? (new Date(batch.completedAt).getTime() - new Date(batch.startedAt).getTime()) / (1000 * 60 * 60)
          : 0
      };
    };

    return NextResponse.json({
      activeBatches: activeBatches.map(transformBatch),
      recentBatches: recentBatches.map(transformBatch)
    });

  } catch (error) {
    console.error('Error fetching production details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch production details',
        activeBatches: [],
        recentBatches: []
      },
      { status: 500 }
    );
  }
}
