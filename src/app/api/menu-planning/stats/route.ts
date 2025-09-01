import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const where: any = {
      deletedAt: null,
      isActive: true,
    }

    if (dateFrom || dateTo) {
      where.menuDate = {}
      if (dateFrom) {
        where.menuDate.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.menuDate.lte = new Date(dateTo)
      }
    }

    const [
      totalMenus,
      totalCalories,
      mealTypeDistribution,
      avgNutrition,
      upcomingMenus,
    ] = await Promise.all([
      // Total menus count
      prisma.menu.count({ where }),

      // Total calories sum
      prisma.menu.aggregate({
        where,
        _sum: {
          totalCalories: true,
        },
      }),

      // Meal type distribution
      prisma.menu.groupBy({
        by: ['mealType'],
        where,
        _count: {
          id: true,
        },
      }),

      // Average nutrition values
      prisma.menu.aggregate({
        where,
        _avg: {
          totalCalories: true,
          totalProtein: true,
          totalFat: true,
          totalCarbs: true,
          totalFiber: true,
        },
      }),

      // Upcoming menus for this week
      prisma.menu.count({
        where: {
          ...where,
          menuDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    // Calculate planned weeks (unique week dates)
    const menuDates = await prisma.menu.findMany({
      where,
      select: {
        menuDate: true,
      },
    })

    const uniqueWeeks = new Set(
      menuDates.map((menu) => {
        const date = new Date(menu.menuDate)
        const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()))
        return startOfWeek.toISOString().split('T')[0]
      })
    )

    // Calculate nutrition score based on balanced nutrition
    const calculateNutritionScore = (avg: any) => {
      if (!avg.totalCalories || !avg.totalProtein || !avg.totalCarbs || !avg.totalFat) {
        return 0
      }

      // Ideal ratios: Protein 10-35%, Carbs 45-65%, Fat 20-35%
      const proteinCals = (avg.totalProtein || 0) * 4
      const carbsCals = (avg.totalCarbs || 0) * 4
      const fatCals = (avg.totalFat || 0) * 9
      const totalCals = avg.totalCalories || 1

      const proteinPercent = (proteinCals / totalCals) * 100
      const carbsPercent = (carbsCals / totalCals) * 100
      const fatPercent = (fatCals / totalCals) * 100

      let score = 100

      // Deduct points for being outside ideal ranges
      if (proteinPercent < 10 || proteinPercent > 35) score -= 20
      if (carbsPercent < 45 || carbsPercent > 65) score -= 20
      if (fatPercent < 20 || fatPercent > 35) score -= 20

      return Math.max(0, Math.min(100, score))
    }

    const nutritionScore = calculateNutritionScore(avgNutrition._avg)

    const stats = {
      totalMenus,
      plannedWeeks: uniqueWeeks.size,
      totalCalories: totalCalories._sum.totalCalories || 0,
      avgNutritionScore: Math.round(nutritionScore),
      upcomingMenus,
      mealTypeDistribution: mealTypeDistribution.reduce((acc, item) => {
        acc[item.mealType] = item._count.id
        return acc
      }, {} as Record<string, number>),
      avgNutrition: {
        calories: Math.round(avgNutrition._avg.totalCalories || 0),
        protein: Math.round((avgNutrition._avg.totalProtein || 0) * 10) / 10,
        carbs: Math.round((avgNutrition._avg.totalCarbs || 0) * 10) / 10,
        fat: Math.round((avgNutrition._avg.totalFat || 0) * 10) / 10,
        fiber: Math.round((avgNutrition._avg.totalFiber || 0) * 10) / 10,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching menu planning stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
