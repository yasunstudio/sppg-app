import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { ProductionBatchStatus, ProductionPlanStatus } from "@/generated/prisma";

// POST /api/production/batches/from-recipe - Create production batch from recipe
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      recipeId,
      targetPortions,
      scheduledDate,
      kitchenId,
      notes,
    } = body;

    // Validate required fields
    if (!recipeId || !targetPortions || !scheduledDate) {
      return NextResponse.json(
        { error: "Recipe ID, target portions, and scheduled date are required" },
        { status: 400 }
      );
    }

    // Get recipe with ingredients
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: {
          include: {
            item: true,
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

    if (!recipe.isActive) {
      return NextResponse.json(
        { error: "Cannot create batch from inactive recipe" },
        { status: 400 }
      );
    }

    // Calculate scaling factor
    const scalingFactor = targetPortions / recipe.servingSize;

    // Check inventory availability for all ingredients
    const inventoryCheck = await Promise.all(
      recipe.ingredients.map(async (ingredient) => {
        const scaledQuantity = ingredient.quantity * scalingFactor;
        
        // Get current inventory
        const inventory = await prisma.inventoryItem.findFirst({
          where: { rawMaterialId: ingredient.itemId },
        });

        const availableQuantity = inventory?.quantity || 0;
        const isAvailable = availableQuantity >= scaledQuantity;
        
        return {
          ingredient,
          scaledQuantity,
          availableQuantity,
          isAvailable,
          shortfall: isAvailable ? 0 : scaledQuantity - availableQuantity,
        };
      })
    );

    // Check if all ingredients are available
    const insufficientIngredients = inventoryCheck.filter(item => !item.isAvailable);
    
    if (insufficientIngredients.length > 0) {
      return NextResponse.json({
        error: "Insufficient inventory for production",
        insufficientIngredients: insufficientIngredients.map(item => ({
          itemName: item.ingredient.item?.name,
          required: item.scaledQuantity,
          available: item.availableQuantity,
          shortfall: item.shortfall,
          unit: item.ingredient.unit,
        })),
      }, { status: 400 });
    }

    // Calculate total ingredient cost for the batch
    const totalIngredientCost = recipe.ingredients.reduce((sum, ingredient) => {
      const itemCost = ingredient.item?.unitPrice || 0;
      const scaledQuantity = ingredient.quantity * scalingFactor;
      return sum + (itemCost * scaledQuantity);
    }, 0);

    // Calculate estimated production time (with overhead for scaling)
    const baseTime = recipe.prepTime + recipe.cookTime;
    const scalingOverhead = Math.max(1, Math.log(scalingFactor) * 10); // Additional time for larger batches
    const estimatedProductionTime = baseTime + scalingOverhead;

    // Create production batch with transaction
    const result = await prisma.$transaction(async (tx) => {
      // First create a production plan for this batch
      const productionPlan = await tx.productionPlan.create({
        data: {
          planDate: new Date(scheduledDate),
          targetPortions: targetPortions,
          status: ProductionPlanStatus.PLANNED,
          notes: notes || `Production plan for recipe: ${recipe.name}`,
        },
      });

      // Create the production batch
      const batch = await tx.productionBatch.create({
        data: {
          productionPlanId: productionPlan.id,
          batchNumber: `BATCH-${Date.now()}`,
          recipeId,
          plannedQuantity: targetPortions,
          actualQuantity: null,
          status: ProductionBatchStatus.PENDING,
          notes: notes || `Batch created from recipe: ${recipe.name}`,
        },
      });

      return { batch, productionPlan };
    });

    // Fetch the created batch with all relations
    const createdBatch = await prisma.productionBatch.findUnique({
      where: { id: result.batch.id },
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
        productionPlan: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      batch: createdBatch,
      scalingInfo: {
        originalServings: recipe.servingSize,
        targetPortions,
        scalingFactor,
        totalIngredients: recipe.ingredients.length,
        estimatedCost: totalIngredientCost,
        estimatedTime: estimatedProductionTime,
      },
      ingredientsList: recipe.ingredients.map((ingredient) => ({
        item: ingredient.item,
        originalQuantity: ingredient.quantity,
        scaledQuantity: ingredient.quantity * scalingFactor,
        unit: ingredient.unit,
        estimatedCost: (ingredient.item?.unitPrice || 0) * (ingredient.quantity * scalingFactor),
      })),
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating production batch from recipe:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
