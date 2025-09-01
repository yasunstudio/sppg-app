import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/recipes/stats - Get recipe statistics
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all recipes with ingredients
    const [
      totalRecipes,
      activeRecipes,
      recipes
    ] = await Promise.all([
      prisma.recipe.count(),
      prisma.recipe.count({ where: { isActive: true } }),
      prisma.recipe.findMany({
        include: {
          ingredients: {
            include: {
              item: {
                select: {
                  unitPrice: true,
                },
              },
            },
          },
        },
      })
    ]);

    // Calculate averages
    let totalTime = 0;
    let totalCost = 0;
    
    for (const recipe of recipes) {
      // Total time (prep + cook)
      totalTime += recipe.prepTime + recipe.cookTime;
      
      // Calculate total cost for recipe
      const recipeCost = recipe.ingredients.reduce((sum, ingredient) => {
        const cost = ingredient.item?.unitPrice || 0;
        return sum + (cost * ingredient.quantity);
      }, 0);
      
      totalCost += recipeCost / (recipe.servingSize || 1); // Cost per serving
    }

    const avgTime = recipes.length > 0 ? Math.round(totalTime / recipes.length) : 0;
    const avgCost = recipes.length > 0 ? totalCost / recipes.length : 0;

    return NextResponse.json({
      totalRecipes,
      activeRecipes,
      avgTime,
      avgCost,
    });
  } catch (error) {
    console.error("Error fetching recipe stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
