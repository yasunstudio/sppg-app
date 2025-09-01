import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  checkInventoryAvailability,
  calculateMaterialsForBatch,
} from "@/lib/inventory-utils";

// POST /api/production/batches/preview-impact - Preview inventory impact of production batch
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recipeId, targetPortions } = body;

    // Validate required fields
    if (!recipeId || !targetPortions) {
      return NextResponse.json(
        { error: "Recipe ID and target portions are required" },
        { status: 400 }
      );
    }

    // Get recipe with ingredients
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
                unitPrice: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    // Calculate required materials
    const requiredMaterials = await calculateMaterialsForBatch(recipeId, targetPortions);

    // Check inventory availability
    const availabilityCheck = await checkInventoryAvailability(requiredMaterials);

    // Get current inventory details for each required material
    const inventoryDetails = await Promise.all(
      requiredMaterials.map(async (material) => {
        // First, get the raw material info to ensure we always have the name and category
        const rawMaterial = await prisma.rawMaterial.findUnique({
          where: { id: material.rawMaterialId },
          select: {
            id: true,
            name: true,
            unit: true,
            category: true,
          },
        });

        if (!rawMaterial) {
          throw new Error(`Raw material not found: ${material.rawMaterialId}`);
        }

        const inventoryItems = await prisma.inventoryItem.findMany({
          where: {
            rawMaterialId: material.rawMaterialId,
            deletedAt: null,
          },
          include: {
            supplier: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc', // FIFO order
          },
        });

        const totalCurrentStock = inventoryItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        const averagePrice = inventoryItems.length > 0
          ? inventoryItems.reduce((sum, item) => sum + item.unitPrice, 0) / inventoryItems.length
          : 0;

        const estimatedCost = material.quantity * averagePrice;

        return {
          materialId: material.rawMaterialId,
          materialName: rawMaterial.name,
          category: rawMaterial.category,
          unit: material.unit,
          required: material.quantity,
          currentStock: totalCurrentStock,
          afterProduction: totalCurrentStock - material.quantity,
          isAvailable: totalCurrentStock >= material.quantity,
          shortfall: Math.max(0, material.quantity - totalCurrentStock),
          estimatedCost: estimatedCost,
          averagePrice: averagePrice,
          inventoryItems: inventoryItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            supplier: item.supplier?.name,
            qualityStatus: item.qualityStatus,
          })),
        };
      })
    );

    // Calculate totals
    const totalCost = inventoryDetails.reduce((sum, detail) => sum + detail.estimatedCost, 0);
    const scalingFactor = targetPortions / recipe.servingSize;
    
    // Calculate estimated production time
    const baseTime = recipe.prepTime + recipe.cookTime;
    const scalingOverhead = Math.max(1, Math.log(scalingFactor) * 10);
    const estimatedProductionTime = baseTime + scalingOverhead;

    return NextResponse.json({
      success: true,
      canProduce: availabilityCheck.success,
      batchInfo: {
        recipeName: recipe.name,
        originalServingSize: recipe.servingSize,
        targetPortions: targetPortions,
        scalingFactor: scalingFactor,
        estimatedProductionTime: Math.round(estimatedProductionTime),
        estimatedTotalCost: totalCost,
        costPerPortion: totalCost / targetPortions,
      },
      inventoryImpact: inventoryDetails,
      insufficientItems: availabilityCheck.insufficientItems || [],
      summary: {
        totalMaterials: inventoryDetails.length,
        availableMaterials: inventoryDetails.filter(d => d.isAvailable).length,
        insufficientMaterials: inventoryDetails.filter(d => !d.isAvailable).length,
        totalEstimatedCost: totalCost,
        worstCaseShortfall: inventoryDetails
          .filter(d => !d.isAvailable)
          .reduce((sum, d) => sum + d.shortfall, 0),
      },
    });
  } catch (error) {
    console.error("Error previewing inventory impact:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
