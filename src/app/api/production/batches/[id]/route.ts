import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductionBatchStatus } from "@/generated/prisma";
import {
  checkInventoryAvailability,
  deductInventoryForProduction,
  rollbackInventoryDeductions,
  calculateMaterialsForBatch,
} from "@/lib/inventory-utils";

// GET /api/production/batches/[id] - Get specific production batch
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
    const batch = await prisma.productionBatch.findUnique({
      where: { id },
      include: {
        recipe: {
          include: {
            ingredients: {
              include: {
                item: {
                  select: {
                    id: true,
                    name: true,
                    unit: true,
                    unitPrice: true,
                    category: true,
                  },
                },
              },
            },
          },
        },
        productionPlan: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
            status: true,
          },
        },
        qualityChecks: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
        resourceUsage: {
          include: {
            resource: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Production batch not found" },
        { status: 404 }
      );
    }

    // Calculate batch metrics
    const efficiency = batch.actualQuantity && batch.plannedQuantity 
      ? (batch.actualQuantity / batch.plannedQuantity) * 100 
      : 0;

    const duration = batch.startedAt && batch.completedAt
      ? Math.round((new Date(batch.completedAt).getTime() - new Date(batch.startedAt).getTime()) / (1000 * 60))
      : 0;

    // Calculate ingredient costs if recipe is available
    let ingredientBreakdown: any[] = [];
    let totalEstimatedCost = 0;

    if (batch.recipe && batch.recipe.ingredients) {
      const scalingFactor = batch.plannedQuantity / batch.recipe.servingSize;
      
      ingredientBreakdown = batch.recipe.ingredients.map((ingredient) => {
        const scaledQuantity = ingredient.quantity * scalingFactor;
        const itemCost = ingredient.item?.unitPrice || 0;
        const totalCost = itemCost * scaledQuantity;
        totalEstimatedCost += totalCost;

        return {
          item: ingredient.item,
          originalQuantity: ingredient.quantity,
          scaledQuantity,
          unit: ingredient.unit,
          unitCost: itemCost,
          totalCost,
          notes: ingredient.notes,
        };
      });
    }

    const batchWithMetrics = {
      ...batch,
      metrics: {
        efficiency: Math.round(efficiency * 100) / 100,
        durationMinutes: duration,
        estimatedCost: totalEstimatedCost,
        costPerPortion: batch.plannedQuantity > 0 ? totalEstimatedCost / batch.plannedQuantity : 0,
        isOnTime: batch.recipe && duration > 0 
          ? duration <= (batch.recipe.prepTime + batch.recipe.cookTime) 
          : null,
      },
      ingredientBreakdown,
    };

    return NextResponse.json(batchWithMetrics);
  } catch (error) {
    console.error("Error fetching production batch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/production/batches/[id] - Update production batch
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
      status,
      actualQuantity,
      qualityScore,
      temperatureLog,
      notes,
      startedAt,
      completedAt,
    } = body;

    // Check if batch exists
    const existingBatch = await prisma.productionBatch.findUnique({
      where: { id: id },
      include: {
        recipe: {
          include: {
            ingredients: {
              include: {
                item: true,
              },
            },
          },
        },
        productionPlan: true,
      },
    });

    if (!existingBatch) {
      return NextResponse.json(
        { error: "Production batch not found" },
        { status: 404 }
      );
    }

    // Handle inventory deduction when status changes to IN_PROGRESS
    if (status === ProductionBatchStatus.IN_PROGRESS && 
        existingBatch.status !== ProductionBatchStatus.IN_PROGRESS &&
        existingBatch.recipe) {
      
      // Calculate required materials
      const requiredMaterials = await calculateMaterialsForBatch(
        existingBatch.recipe.id,
        existingBatch.plannedQuantity
      );

      // Check inventory availability
      const availabilityCheck = await checkInventoryAvailability(requiredMaterials);
      
      if (!availabilityCheck.success) {
        return NextResponse.json(
          {
            error: availabilityCheck.error,
            insufficientItems: availabilityCheck.insufficientItems,
          },
          { status: 400 }
        );
      }

      // Deduct inventory
      const deductionResult = await deductInventoryForProduction(
        requiredMaterials,
        id,
        session.user.id
      );

      if (!deductionResult.success) {
        return NextResponse.json(
          { error: deductionResult.error },
          { status: 500 }
        );
      }
    }

    // Handle inventory rollback when status changes from IN_PROGRESS to PENDING/CANCELLED
    if ((status === ProductionBatchStatus.PENDING || status === ProductionBatchStatus.REJECTED) &&
        existingBatch.status === ProductionBatchStatus.IN_PROGRESS) {
      
      const rollbackResult = await rollbackInventoryDeductions(id, session.user.id);
      
      if (!rollbackResult.success) {
        console.error('Failed to rollback inventory:', rollbackResult.error);
        // Don't fail the request, but log the error
      }
    }

    // Prepare update data
    const updateData: any = {};
    
    if (status !== undefined) updateData.status = status;
    if (actualQuantity !== undefined) updateData.actualQuantity = actualQuantity;
    if (qualityScore !== undefined) updateData.qualityScore = qualityScore;
    if (temperatureLog !== undefined) updateData.temperatureLog = temperatureLog;
    if (notes !== undefined) updateData.notes = notes;
    if (startedAt !== undefined) updateData.startedAt = new Date(startedAt);
    if (completedAt !== undefined) updateData.completedAt = new Date(completedAt);

    // Auto-set timestamps based on status changes
    if (status === ProductionBatchStatus.IN_PROGRESS && !existingBatch.startedAt) {
      updateData.startedAt = new Date();
    }
    if (status === ProductionBatchStatus.COMPLETED && !existingBatch.completedAt) {
      updateData.completedAt = new Date();
    }

    // Update batch
    const updatedBatch = await prisma.productionBatch.update({
      where: { id: id },
      data: updateData,
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            category: true,
            servingSize: true,
          },
        },
        productionPlan: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
          },
        },
      },
    });

    return NextResponse.json(updatedBatch);
  } catch (error) {
    console.error("Error updating production batch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/production/batches/[id] - Delete production batch
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
    // Check if batch exists and its status
    const existingBatch = await prisma.productionBatch.findUnique({
      where: { id },
    });

    if (!existingBatch) {
      return NextResponse.json(
        { error: "Production batch not found" },
        { status: 404 }
      );
    }

    // Don't allow deletion of completed or in-progress batches
    if (existingBatch.status === ProductionBatchStatus.COMPLETED || 
        existingBatch.status === ProductionBatchStatus.IN_PROGRESS) {
      return NextResponse.json(
        { error: "Cannot delete completed or in-progress batches" },
        { status: 400 }
      );
    }

    // Delete batch
    await prisma.productionBatch.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Production batch deleted successfully" });
  } catch (error) {
    console.error("Error deleting production batch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
