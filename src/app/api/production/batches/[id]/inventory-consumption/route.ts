import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// GET /api/production/batches/[id]/inventory-consumption - Get inventory consumption for a batch
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

        if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get production batch
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

    // Get all inventory deductions for this batch
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        action: 'INVENTORY_DEDUCT',
        oldValues: {
          path: ['batchId'],
          equals: id,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Get all rollbacks for this batch
    const rollbackLogs = await prisma.auditLog.findMany({
      where: {
        action: 'INVENTORY_ROLLBACK',
        oldValues: {
          path: ['originalBatchId'],
          equals: id,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Process deductions by inventory item
    const deductionsByItem = new Map();
    let totalDeductionValue = 0;

    for (const log of auditLogs) {
      const oldValues = log.oldValues as any;
      const newValues = log.newValues as any;
      const inventoryItemId = log.entityId;

      // Get inventory item details
      const inventoryItem = await prisma.inventoryItem.findUnique({
        where: { id: inventoryItemId },
        include: {
          rawMaterial: {
            select: {
              id: true,
              name: true,
              unit: true,
              category: true,
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (inventoryItem) {
        const deductedAmount = newValues.deductedAmount;
        const itemValue = deductedAmount * inventoryItem.unitPrice;
        totalDeductionValue += itemValue;

        const key = inventoryItem.rawMaterialId;
        if (!deductionsByItem.has(key)) {
          deductionsByItem.set(key, {
            materialId: inventoryItem.rawMaterialId,
            materialName: inventoryItem.rawMaterial?.name || 'Unknown',
            category: inventoryItem.rawMaterial?.category || 'OTHER',
            unit: inventoryItem.rawMaterial?.unit || '',
            deductions: [],
            totalDeducted: 0,
            totalValue: 0,
          });
        }

        const materialData = deductionsByItem.get(key);
        materialData.deductions.push({
          inventoryItemId: inventoryItemId,
          batchNumber: inventoryItem.batchNumber,
          supplier: inventoryItem.supplier?.name,
          deductedAmount: deductedAmount,
          unitPrice: inventoryItem.unitPrice,
          itemValue: itemValue,
          deductedAt: log.createdAt,
          deductedBy: log.user?.name || 'Unknown',
          originalQuantity: oldValues.quantity,
          newQuantity: oldValues.quantity - deductedAmount,
        });
        materialData.totalDeducted += deductedAmount;
        materialData.totalValue += itemValue;
      }
    }

    // Process rollbacks
    const rollbacksByItem = new Map();
    let totalRollbackValue = 0;

    for (const log of rollbackLogs) {
      const oldValues = log.oldValues as any;
      const inventoryItemId = log.entityId;
      const restoredAmount = oldValues.restoredAmount;

      const inventoryItem = await prisma.inventoryItem.findUnique({
        where: { id: inventoryItemId },
        include: {
          rawMaterial: {
            select: {
              id: true,
              name: true,
              unit: true,
              category: true,
            },
          },
        },
      });

      if (inventoryItem) {
        const itemValue = restoredAmount * inventoryItem.unitPrice;
        totalRollbackValue += itemValue;

        const key = inventoryItem.rawMaterialId;
        if (!rollbacksByItem.has(key)) {
          rollbacksByItem.set(key, {
            materialId: inventoryItem.rawMaterialId,
            materialName: inventoryItem.rawMaterial?.name || 'Unknown',
            rollbacks: [],
            totalRestored: 0,
            totalValue: 0,
          });
        }

        const materialData = rollbacksByItem.get(key);
        materialData.rollbacks.push({
          inventoryItemId: inventoryItemId,
          restoredAmount: restoredAmount,
          unitPrice: inventoryItem.unitPrice,
          itemValue: itemValue,
          rolledBackAt: log.createdAt,
          rolledBackBy: log.user?.name || 'Unknown',
        });
        materialData.totalRestored += restoredAmount;
        materialData.totalValue += itemValue;
      }
    }

    return NextResponse.json({
      success: true,
      batch: {
        id: batch.id,
        batchNumber: batch.batchNumber,
        status: batch.status,
        plannedQuantity: batch.plannedQuantity,
        actualQuantity: batch.actualQuantity,
        startedAt: batch.startedAt,
        completedAt: batch.completedAt,
        recipe: batch.recipe ? {
          id: batch.recipe.id,
          name: batch.recipe.name,
          servingSize: batch.recipe.servingSize,
        } : null,
        productionPlan: batch.productionPlan,
      },
      consumption: {
        deductions: Array.from(deductionsByItem.values()),
        rollbacks: Array.from(rollbacksByItem.values()),
        summary: {
          totalDeductions: auditLogs.length,
          totalRollbacks: rollbackLogs.length,
          totalDeductionValue: totalDeductionValue,
          totalRollbackValue: totalRollbackValue,
          netConsumptionValue: totalDeductionValue - totalRollbackValue,
          hasActiveConsumption: totalDeductionValue > totalRollbackValue,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching inventory consumption:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
