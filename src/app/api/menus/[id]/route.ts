import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menus/[id] - Get specific menu
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        menuItems: {
          include: {
            ingredients: {
              include: {
                rawMaterial: {
                  include: {
                    inventory: {
                      take: 1,
                      orderBy: {
                        createdAt: 'desc'
                      }
                    }
                  }
                },
              },
            },
          },
        },
        productionPlans: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
            status: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipes: {
          select: {
            id: true,
            name: true,
            category: true,
            servingSize: true,
            prepTime: true,
            cookTime: true,
          },
        },
      },
    });

    if (!menu) {
      return NextResponse.json(
        { error: "Menu not found" },
        { status: 404 }
      );
    }

    // Calculate menu metrics
    const totalIngredients = menu.menuItems.reduce(
      (sum: number, item: any) => sum + item.ingredients.length,
      0
    );

    const totalEstimatedCost = menu.menuItems.reduce(
      (sum: number, item: any) => {
        const itemCost = item.ingredients.reduce((itemSum: number, ingredient: any) => {
          const latestInventory = ingredient.rawMaterial?.inventory?.[0];
          const unitPrice = latestInventory?.unitPrice || 0;
          return itemSum + (unitPrice * ingredient.quantity);
        }, 0);
        return sum + itemCost;
      },
      0
    );

    const totalServingSize = menu.menuItems.reduce(
      (sum: number, item: any) => sum + item.servingSize, 
      0
    );

    const costPerPortion = totalServingSize > 0 
      ? totalEstimatedCost / totalServingSize
      : 0;

    const nutritionSummary = {
      totalCalories: menu.totalCalories || 0,
      totalProtein: menu.totalProtein || 0,
      totalFat: menu.totalFat || 0,
      totalCarbs: menu.totalCarbs || 0,
      totalFiber: menu.totalFiber || 0,
    };

    const menuWithMetrics = {
      ...menu,
      metrics: {
        totalIngredients,
        totalEstimatedCost,
        costPerPortion,
        totalMenuItems: menu.menuItems.length,
        totalProductionPlans: menu.productionPlans.length,
        totalRecipes: menu.recipes.length,
        nutritionSummary,
      },
    };

    return NextResponse.json(menuWithMetrics);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/menus/[id] - Update menu
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        menuDate: body.menuDate ? new Date(body.menuDate) : undefined,
        totalCalories: body.totalCalories,
        totalProtein: body.totalProtein,
        totalFat: body.totalFat,
        totalCarbs: body.totalCarbs,
        totalFiber: body.totalFiber,
        updatedAt: new Date(),
      },
      include: {
        menuItems: {
          include: {
            ingredients: {
              include: {
                rawMaterial: true,
              },
            },
          },
        },
        productionPlans: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMenu);
  } catch (error) {
    console.error("Error updating menu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/menus/[id] - Delete menu
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if menu exists and can be deleted
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        productionPlans: true,
      },
    });

    if (!menu) {
      return NextResponse.json(
        { error: "Menu not found" },
        { status: 404 }
      );
    }

    // Check if menu has active production plans
    const activePlans = menu.productionPlans.filter(
      plan => plan.status === 'PLANNED' || plan.status === 'IN_PROGRESS'
    );

    if (activePlans.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete menu with active production plans" },
        { status: 400 }
      );
    }

    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Menu deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
