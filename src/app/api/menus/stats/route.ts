import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:read'
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

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'all' // week, month, year, all
    
    // Calculate date range based on period
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default: // all
        startDate = new Date('2025-01-01') // Show all data from 2025
        break
    }

    // Get total menus count (all time)
    const totalMenus = await prisma.menu.count()

    // Get approved menus count (use isActive as proxy for approved)
    const approvedMenus = await prisma.menu.count({
      where: {
        isActive: true
      }
    })

    // Get recent menus (current period)
    const recentMenus = await prisma.menu.count({
      where: {
        menuDate: {
          gte: startDate,
          lte: now
        }
      }
    })

    // Get average calories from all menus
    const averageNutrition = await prisma.menu.aggregate({
      _avg: {
        totalCalories: true,
        totalProtein: true,
        totalCarbs: true,
        totalFat: true,
        totalFiber: true
      }
    })

    // Get menus by meal type for current period
    const menusByMealType = await prisma.menu.groupBy({
      by: ['mealType'],
      where: {
        menuDate: {
          gte: startDate,
          lte: now
        }
      },
      _count: {
        id: true
      }
    })

    // Get most used ingredients
    const topIngredients = await prisma.menuItemIngredient.groupBy({
      by: ['rawMaterialId'],
      where: {
        menuItem: {
          menu: {
            menuDate: {
              gte: startDate,
              lte: now
            }
          }
        }
      },
      _count: {
        id: true
      },
      _sum: {
        quantity: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    })

    // Get ingredient details
    const ingredientIds = topIngredients.map(ing => ing.rawMaterialId)
    const ingredientDetails = await prisma.rawMaterial.findMany({
      where: {
        id: {
          in: ingredientIds
        }
      },
      select: {
        id: true,
        name: true,
        category: true,
        unit: true
      }
    })

    const topIngredientsWithDetails = topIngredients.map(ing => {
      const details = ingredientDetails.find(detail => detail.id === ing.rawMaterialId)
      return {
        ...ing,
        rawMaterial: details
      }
    })

    // Get menu trends (daily counts)
    const menuTrends = await prisma.menu.groupBy({
      by: ['menuDate'],
      where: {
        menuDate: {
          gte: startDate,
          lte: now
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        menuDate: 'asc'
      }
    })

    // Return data in the format expected by the frontend
    const stats = {
      totalMenus,
      approvedMenus,
      averageCalories: Math.round(averageNutrition._avg.totalCalories || 0),
      monthlyMenus: recentMenus,
      menusByMealType: menusByMealType.map(item => ({
        mealType: item.mealType,
        count: item._count.id
      })),
      averageNutrition: {
        calories: averageNutrition._avg.totalCalories || 0,
        protein: averageNutrition._avg.totalProtein || 0,
        carbohydrates: averageNutrition._avg.totalCarbs || 0,
        fat: averageNutrition._avg.totalFat || 0,
        fiber: averageNutrition._avg.totalFiber || 0
      },
      topIngredients: topIngredientsWithDetails.map(item => ({
        rawMaterial: item.rawMaterial,
        usageCount: item._count.id,
        totalQuantity: item._sum.quantity || 0
      })),
      menuTrends: menuTrends.map(item => ({
        date: item.menuDate.toISOString().split('T')[0],
        count: item._count.id
      })),
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString()
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Menu stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu statistics' },
      { status: 500 }
    )
  }
}
