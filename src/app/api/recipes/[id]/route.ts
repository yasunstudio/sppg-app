import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { RecipeCategory, RecipeDifficulty } from "@/generated/prisma";

// GET /api/recipes/[id] - Get a specific recipe
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
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                unit: true,
                unitPrice: true,
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

    // Calculate total cost
    const totalCost = recipe.ingredients.reduce((sum: number, ingredient: any) => {
      return sum + (ingredient.item?.unitPrice || 0) * ingredient.quantity;
    }, 0);

    return NextResponse.json({
      ...recipe,
      totalCost,
      costPerServing: recipe.servingSize > 0 ? totalCost / recipe.servingSize : 0,
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/recipes/[id] - Update a specific recipe
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

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!existingRecipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    const {
      name,
      description,
      category,
      difficulty,
      servingSize,
      prepTime,
      cookTime,
      instructions,
      isActive,
      ingredients,
      nutrition,
    } = body;

    // Update recipe using transaction
    const updatedRecipe = await prisma.$transaction(async (tx) => {
      // Update recipe
      const recipe = await tx.recipe.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(category && { category: category as RecipeCategory }),
          ...(difficulty && { difficulty: difficulty as RecipeDifficulty }),
          ...(servingSize && { servingSize }),
          ...(prepTime && { prepTime }),
          ...(cookTime && { cookTime }),
          ...(instructions && { instructions }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      // Update ingredients if provided
      if (ingredients && Array.isArray(ingredients)) {
        // Delete existing ingredients
        await tx.recipeIngredient.deleteMany({
          where: { recipeId: id },
        });

        // Create new ingredients
        if (ingredients.length > 0) {
          await tx.recipeIngredient.createMany({
            data: ingredients.map((ingredient: any) => ({
              recipeId: id,
              itemId: ingredient.itemId,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              notes: ingredient.notes || null,
            })),
          });
        }
      }

      // Update nutrition if provided - save to JSON field
      if (nutrition) {
        await tx.recipe.update({
          where: { id },
          data: {
            nutritionInfo: nutrition,
          },
        });
      }

      return recipe;
    });

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/recipes/[id] - Delete a specific recipe
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

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!existingRecipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    // Check if recipe is being used in production batches
    const activeBatches = await prisma.productionBatch.findFirst({
      where: {
        recipeId: id,
        status: {
          in: ["PENDING", "IN_PROGRESS"],
        },
      },
    });

    if (activeBatches) {
      return NextResponse.json(
        { error: "Cannot delete recipe that is being used in active production batches" },
        { status: 400 }
      );
    }

    // Soft delete recipe
    await prisma.recipe.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
