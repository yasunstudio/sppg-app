import { prisma } from "@/lib/prisma";

interface InventoryDeductionItem {
  rawMaterialId: string;
  quantity: number;
  unit: string;
}

interface InventoryDeductionResult {
  success: boolean;
  error?: string;
  insufficientItems?: Array<{
    materialName: string;
    required: number;
    available: number;
    unit: string;
  }>;
  deductions?: Array<{
    inventoryItemId: string;
    originalQuantity: number;
    deductedQuantity: number;
    newQuantity: number;
  }>;
}

interface DeductionRecord {
  inventoryItemId: string;
  originalQuantity: number;
  deductedQuantity: number;
  newQuantity: number;
}

/**
 * Check if sufficient inventory is available for production
 */
export async function checkInventoryAvailability(
  items: InventoryDeductionItem[]
): Promise<InventoryDeductionResult> {
  try {
    const insufficientItems = [];

    for (const item of items) {
      // First, get the raw material info to ensure we always have the name
      const rawMaterial = await prisma.rawMaterial.findUnique({
        where: { id: item.rawMaterialId },
        select: {
          name: true,
          unit: true,
        },
      });

      if (!rawMaterial) {
        insufficientItems.push({
          materialName: `Unknown Material (${item.rawMaterialId})`,
          required: item.quantity,
          available: 0,
          unit: item.unit,
        });
        continue;
      }

      // Get total available quantity for this raw material
      const inventoryItems = await prisma.inventoryItem.findMany({
        where: {
          rawMaterialId: item.rawMaterialId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'asc', // FIFO - First In, First Out
        },
      });

      const totalAvailable = inventoryItems.reduce(
        (sum, inv) => sum + inv.quantity,
        0
      );

      if (totalAvailable < item.quantity) {
        insufficientItems.push({
          materialName: rawMaterial.name,
          required: item.quantity,
          available: totalAvailable,
          unit: item.unit,
        });
      }
    }

    if (insufficientItems.length > 0) {
      return {
        success: false,
        error: 'Insufficient inventory for production',
        insufficientItems,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error checking inventory availability:', error);
    return {
      success: false,
      error: 'Failed to check inventory availability',
    };
  }
}

/**
 * Deduct inventory items for production (FIFO method)
 */
export async function deductInventoryForProduction(
  items: InventoryDeductionItem[],
  batchId: string,
  userId: string
): Promise<InventoryDeductionResult> {
  try {
    const deductions: DeductionRecord[] = [];

    // Use transaction to ensure all deductions happen atomically
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        let remainingToDeduct = item.quantity;

        // Get inventory items for this raw material (FIFO order)
        const inventoryItems = await tx.inventoryItem.findMany({
          where: {
            rawMaterialId: item.rawMaterialId,
            deletedAt: null,
            quantity: {
              gt: 0,
            },
          },
          orderBy: {
            createdAt: 'asc', // FIFO
          },
        });

        for (const invItem of inventoryItems) {
          if (remainingToDeduct <= 0) break;

          const deductAmount = Math.min(invItem.quantity, remainingToDeduct);
          const newQuantity = invItem.quantity - deductAmount;

          // Update inventory item
          await tx.inventoryItem.update({
            where: { id: invItem.id },
            data: { quantity: newQuantity },
          });

          // Create audit log for inventory deduction
          await tx.auditLog.create({
            data: {
              action: 'INVENTORY_DEDUCT',
              entity: 'INVENTORY_ITEM',
              entityId: invItem.id,
              userId: userId,
              oldValues: {
                quantity: invItem.quantity,
                batchId,
                rawMaterialId: item.rawMaterialId,
              },
              newValues: {
                quantity: newQuantity,
                deductedAmount: deductAmount,
                reason: 'Production batch consumption',
              },
            },
          });

          deductions.push({
            inventoryItemId: invItem.id,
            originalQuantity: invItem.quantity,
            deductedQuantity: deductAmount,
            newQuantity: newQuantity,
          });

          remainingToDeduct -= deductAmount;
        }

        // If we still have remaining to deduct, something went wrong
        if (remainingToDeduct > 0) {
          throw new Error(
            `Insufficient inventory for material ${item.rawMaterialId}. Still need ${remainingToDeduct} ${item.unit}`
          );
        }
      }
    });

    return {
      success: true,
      deductions,
    };
  } catch (error) {
    console.error('Error deducting inventory:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to deduct inventory',
    };
  }
}

/**
 * Rollback inventory deductions (in case production is cancelled)
 */
export async function rollbackInventoryDeductions(
  batchId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find all inventory deductions for this batch
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        action: 'INVENTORY_DEDUCT',
        oldValues: {
          path: ['batchId'],
          equals: batchId,
        },
      },
    });

    await prisma.$transaction(async (tx) => {
      for (const log of auditLogs) {
        const oldValues = log.oldValues as any;
        const newValues = log.newValues as any;
        const inventoryItemId = log.entityId;
        const deductedAmount = newValues.deductedAmount;

        // Add back the deducted amount
        await tx.inventoryItem.update({
          where: { id: inventoryItemId },
          data: {
            quantity: {
              increment: deductedAmount,
            },
          },
        });

        // Create audit log for rollback
        await tx.auditLog.create({
          data: {
            action: 'INVENTORY_ROLLBACK',
            entity: 'INVENTORY_ITEM',
            entityId: inventoryItemId,
            userId: userId,
            oldValues: {
              originalBatchId: batchId,
              restoredAmount: deductedAmount,
            },
            newValues: {
              reason: 'Production batch cancelled/rolled back',
            },
          },
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error rolling back inventory:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to rollback inventory',
    };
  }
}

/**
 * Calculate required materials for production batch based on recipe
 */
export async function calculateMaterialsForBatch(
  recipeId: string,
  targetPortions: number
): Promise<InventoryDeductionItem[]> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: {
        include: {
          item: {
            select: {
              id: true,
              name: true,
              unit: true,
            },
          },
        },
      },
    },
  });

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  const scalingFactor = targetPortions / recipe.servingSize;

  // Aggregate materials to handle duplicate raw materials in recipe
  const materialMap = new Map<string, InventoryDeductionItem>();

  recipe.ingredients.forEach((ingredient) => {
    const materialId = ingredient.itemId;
    const scaledQuantity = ingredient.quantity * scalingFactor;

    if (materialMap.has(materialId)) {
      // Add to existing material quantity
      const existing = materialMap.get(materialId)!;
      existing.quantity += scaledQuantity;
    } else {
      // Create new material entry
      materialMap.set(materialId, {
        rawMaterialId: materialId,
        quantity: scaledQuantity,
        unit: ingredient.unit,
      });
    }
  });

  return Array.from(materialMap.values());
}
