import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

// prisma imported from lib

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'week' // week, month, year
    
    // Calculate date range based on period
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default: // week
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
    }

    // Get total menus count
    const totalMenus = await prisma.menu.count({
      where: {
        menuDate: {
          gte: startDate,
          lte: now
        }
      }
    })

    // Get menus by meal type
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

    // Get average nutrition per menu
    const nutritionStats = await prisma.menu.aggregate({
      where: {
        menuDate: {
          gte: startDate,
          lte: now
        }
      },
      _avg: {
        totalCalories: true,
        totalProtein: true,
        totalCarbs: true,
        totalFat: true,
        totalFiber: true
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

    const stats = {
      totalMenus,
      menusByMealType: menusByMealType.map(item => ({
        mealType: item.mealType,
        count: item._count.id
      })),
      averageNutrition: {
        calories: nutritionStats._avg.totalCalories || 0,
        protein: nutritionStats._avg.totalProtein || 0,
        carbohydrates: nutritionStats._avg.totalCarbs || 0,
        fat: nutritionStats._avg.totalFat || 0,
        fiber: nutritionStats._avg.totalFiber || 0
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
