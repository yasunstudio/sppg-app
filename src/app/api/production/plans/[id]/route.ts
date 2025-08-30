import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/production/plans/[id] - Get specific production plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const plan = await prisma.productionPlan.findUnique({
      where: { id },
      include: {
        batches: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                category: true,
                servingSize: true,
                prepTime: true,
                cookTime: true,
              },
            },
            qualityChecks: {
              select: {
                id: true,
                status: true,
                createdAt: true,
              },
            },
          },
        },
        menu: {
          select: {
            id: true,
            name: true,
            mealType: true,
          },
        },
        _count: {
          select: {
            batches: true,
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Production plan not found" },
        { status: 404 }
      );
    }

    // Get quality checks for the plan using polymorphic relation
    // Now using REAL data from database instead of fallback calculations
    let totalQualityChecksCount = 0;
    
    try {
      const planQualityChecks = await prisma.qualityCheck.findMany({
        where: {
          referenceType: 'ProductionPlan',
          referenceId: { startsWith: plan.id },
        },
      });

      const batchIds = plan.batches.map((batch: any) => batch.id);
      const batchQualityChecks = await prisma.qualityCheck.findMany({
        where: {
          referenceType: 'ProductionBatch',
          referenceId: { 
            in: batchIds.flatMap(id => [`${id}-production`, `${id}-packaging`])
          },
        },
      });
      
      totalQualityChecksCount = planQualityChecks.length + batchQualityChecks.length;
      console.log(`Found ${totalQualityChecksCount} real quality checks in database`);
      
    } catch (error) {
      console.error('Error fetching quality checks:', error);
      totalQualityChecksCount = 0;
    }

    // Calculate plan metrics
    const totalPlannedQuantity = plan.batches.reduce(
      (sum: number, batch: any) => sum + (batch.plannedQuantity || 0),
      0
    );

    const totalActualQuantity = plan.batches.reduce(
      (sum: number, batch: any) => sum + (batch.actualQuantity || 0),
      0
    );

    const completedBatches = plan.batches.filter(
      (batch: any) => batch.status === "COMPLETED"
    ).length;

    const efficiency = totalPlannedQuantity > 0 
      ? (totalActualQuantity / totalPlannedQuantity) * 100 
      : 0;

    const completionRate = plan.batches.length > 0
      ? (completedBatches / plan.batches.length) * 100
      : 0;

    const planWithMetrics = {
      ...plan,
      qualityChecks: [], // Empty array since we're using count instead
      metrics: {
        totalPlannedQuantity,
        totalActualQuantity,
        efficiency: Math.round(efficiency * 100) / 100,
        completedBatches,
        totalBatches: plan.batches.length,
        completionRate: Math.round(completionRate * 100) / 100,
        totalQualityChecks: totalQualityChecksCount,
        targetPortions: plan.targetPortions,
      },
    };

    return NextResponse.json(planWithMetrics);
  } catch (error) {
    console.error("Error fetching production plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/production/plans/[id] - Update production plan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      planDate,
      targetPortions,
      status,
      notes,
    } = body;

    const updatedPlan = await prisma.productionPlan.update({
      where: { id },
      data: {
        planDate: planDate ? new Date(planDate) : undefined,
        targetPortions: targetPortions ? parseInt(targetPortions) : undefined,
        status,
        notes,
        updatedAt: new Date(),
      },
      include: {
        batches: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("Error updating production plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/production/plans/[id] - Delete production plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if plan has any batches
    const plan = await prisma.productionPlan.findUnique({
      where: { id },
      include: {
        batches: true,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Production plan not found" },
        { status: 404 }
      );
    }

    if (plan.batches.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete plan with existing batches" },
        { status: 400 }
      );
    }

    await prisma.productionPlan.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Production plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting production plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
