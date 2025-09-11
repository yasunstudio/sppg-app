import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RecipeCategory, RecipeDifficulty } from "@/generated/prisma";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// GET /api/recipes - Fetch all recipes with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'recipes:read'
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

        if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const difficulty = url.searchParams.get("difficulty") as RecipeDifficulty | null;
    const search = url.searchParams.get("search");
    const category = url.searchParams.get("category") as RecipeCategory | null;
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {};
    
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
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
          _count: {
            select: {
              productionBatches: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.recipe.count({ where }),
    ]);

    // Calculate total cost for each recipe with proper unit conversion
    const recipesWithCost = recipes.map((recipe) => {
      const totalCost = recipe.ingredients.reduce((sum: number, ingredient: any) => {
        const unitPrice = ingredient.item?.unitPrice || 0;
        const quantity = ingredient.quantity;
        const unit = ingredient.unit.toLowerCase();
        const itemUnit = ingredient.item?.unit?.toLowerCase() || 'kg';

        // Convert quantity to match inventory unit pricing
        let convertedQuantity = quantity;

        // Handle unit conversions
        if (itemUnit === 'kg' && (unit === 'gram' || unit === 'g')) {
          convertedQuantity = quantity / 1000; // grams to kg
        } else if (itemUnit === 'liter' && (unit === 'ml' || unit === 'milliliter')) {
          convertedQuantity = quantity / 1000; // ml to liter
        } else if (itemUnit === unit) {
          convertedQuantity = quantity; // same unit
        }

        return sum + (unitPrice * convertedQuantity);
      }, 0);

      return {
        ...recipe,
        totalCost,
        costPerServing: recipe.servingSize > 0 ? totalCost / recipe.servingSize : 0,
      };
    });

    return NextResponse.json({
      recipes: recipesWithCost,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'recipes:create'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const body = await request.json();
    const {
      name,
      description,
      category,
      difficulty,
      prepTime,
      cookTime,
      servingSize,
      instructions,
      ingredients,
      nutritionInfo,
      allergenInfo,
      cost,
    } = body;

    // Validate required fields
    if (!name || !category || !instructions || !ingredients?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Process instructions - convert string to array if needed
    let processedInstructions = instructions;
    if (instructions && typeof instructions === 'string') {
      // Split by lines and clean up
      processedInstructions = instructions
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);
    }

    // Create recipe with transaction
    const recipe = await prisma.$transaction(async (tx) => {
      // Create the recipe
      const newRecipe = await tx.recipe.create({
        data: {
          name,
          description,
          category,
          difficulty: difficulty || RecipeDifficulty.MEDIUM,
          prepTime: prepTime || 0,
          cookTime: cookTime || 0,
          servingSize: servingSize || 1,
          instructions: processedInstructions,
          nutritionInfo,
          allergenInfo: allergenInfo || [],
          cost,
          isActive: true,
        },
      });

      // Create ingredients
      if (ingredients?.length > 0) {
        await tx.recipeIngredient.createMany({
          data: ingredients.map((ingredient: any) => ({
            recipeId: newRecipe.id,
            itemId: ingredient.itemId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            notes: ingredient.notes,
          })),
        });
      }

      return newRecipe;
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
