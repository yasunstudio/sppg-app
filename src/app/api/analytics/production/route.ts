import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    
    const periodStart = new Date()
    periodStart.setDate(periodStart.getDate() - parseInt(period))

    // Base query filters
    const filters = {
      createdAt: {
        gte: periodStart
      }
    }

    // 1. Production Performance Metrics
    const batchStats = await prisma.productionBatch.groupBy({
      by: ['status'],
      where: filters,
      _count: {
        id: true
      }
    })

    const totalBatches = batchStats.reduce((sum, stat) => sum + stat._count.id, 0)
    const completedBatches = batchStats.find(stat => stat.status === 'COMPLETED')?._count.id || 0
    const inProgressBatches = batchStats.find(stat => stat.status === 'IN_PROGRESS')?._count.id || 0
    const rejectedBatches = batchStats.find(stat => stat.status === 'REJECTED')?._count.id || 0
    
    const successRate = totalBatches > 0 ? (completedBatches / totalBatches) * 100 : 0

    // 2. Quantity Analysis
    const quantityAnalysis = await prisma.productionBatch.findMany({
      where: {
        ...filters,
        status: 'COMPLETED',
        actualQuantity: { not: null }
      },
      select: {
        id: true,
        plannedQuantity: true,
        actualQuantity: true,
        batchNumber: true,
        createdAt: true
      }
    })

    const quantityMetrics = quantityAnalysis.map(batch => ({
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      plannedQuantity: batch.plannedQuantity,
      actualQuantity: batch.actualQuantity,
      quantityVariance: batch.actualQuantity && batch.plannedQuantity 
        ? ((batch.actualQuantity - batch.plannedQuantity) / batch.plannedQuantity) * 100 
        : 0,
      date: batch.createdAt
    }))

    const avgQuantityVariance = quantityMetrics.length > 0
      ? quantityMetrics.reduce((sum, metric) => sum + metric.quantityVariance, 0) / quantityMetrics.length
      : 0

    // 3. Time Efficiency Analysis
    const timeAnalysis = await prisma.productionBatch.findMany({
      where: {
        ...filters,
        status: 'COMPLETED',
        startedAt: { not: null },
        completedAt: { not: null }
      },
      select: {
        id: true,
        batchNumber: true,
        startedAt: true,
        completedAt: true
      }
    })

    const timeMetrics = timeAnalysis.map(batch => {
      const actualDuration = batch.completedAt && batch.startedAt 
        ? (new Date(batch.completedAt).getTime() - new Date(batch.startedAt).getTime()) / (1000 * 60) // minutes
        : 0

      return {
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        actualDuration,
        startedAt: batch.startedAt,
        completedAt: batch.completedAt
      }
    })

    const avgDuration = timeMetrics.length > 0
      ? timeMetrics.reduce((sum, metric) => sum + metric.actualDuration, 0) / timeMetrics.length
      : 0

    // 4. Quality Score Analysis
    const qualityAnalysis = await prisma.productionBatch.findMany({
      where: {
        ...filters,
        status: 'COMPLETED',
        qualityScore: { not: null }
      },
      select: {
        id: true,
        batchNumber: true,
        qualityScore: true,
        createdAt: true
      }
    })

    const qualityMetrics = qualityAnalysis.map(batch => ({
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      qualityScore: batch.qualityScore || 0,
      date: batch.createdAt
    }))

    const avgQualityScore = qualityMetrics.length > 0
      ? qualityMetrics.reduce((sum, metric) => sum + metric.qualityScore, 0) / qualityMetrics.length
      : 0

    // 5. Daily Production Trends
    const dailyProduction = await prisma.productionBatch.groupBy({
      by: ['createdAt'],
      where: filters,
      _count: {
        id: true
      },
      _sum: {
        actualQuantity: true,
        plannedQuantity: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const productionTrends = dailyProduction.map(day => ({
      date: day.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
      batchCount: day._count.id,
      totalActualQuantity: day._sum.actualQuantity || 0,
      totalPlannedQuantity: day._sum.plannedQuantity || 0
    }))

    // 6. Recipe Performance Analysis
    const recipeStats = await prisma.productionBatch.groupBy({
      by: ['recipeId'],
      where: {
        ...filters,
        recipeId: { not: null }
      },
      _count: {
        id: true
      },
      _avg: {
        qualityScore: true
      },
      _sum: {
        actualQuantity: true
      }
    })

    const recipes = await prisma.recipe.findMany({
      where: {
        id: {
          in: recipeStats.map(stat => stat.recipeId).filter(Boolean) as string[]
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    const recipePerformance = recipeStats.map(stat => {
      const recipe = recipes.find(r => r.id === stat.recipeId)
      return {
        recipeId: stat.recipeId,
        recipeName: recipe?.name || 'Unknown Recipe',
        batchCount: stat._count.id,
        avgQualityScore: stat._avg.qualityScore || 0,
        totalQuantity: stat._sum.actualQuantity || 0
      }
    }).sort((a, b) => b.avgQualityScore - a.avgQualityScore)

    // 7. Recent Activities
    const recentBatches = await prisma.productionBatch.findMany({
      where: filters,
      select: {
        id: true,
        batchNumber: true,
        status: true,
        plannedQuantity: true,
        actualQuantity: true,
        qualityScore: true,
        createdAt: true,
        startedAt: true,
        completedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // 8. Status Distribution
    const statusDistribution = batchStats.map(stat => ({
      status: stat.status,
      count: stat._count.id,
      percentage: totalBatches > 0 ? Math.round((stat._count.id / totalBatches) * 100) : 0
    }))

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalBatches,
          completedBatches,
          inProgressBatches,
          rejectedBatches,
          successRate: Math.round(successRate * 100) / 100,
          avgQuantityVariance: Math.round(avgQuantityVariance * 100) / 100,
          avgDuration: Math.round(avgDuration),
          avgQualityScore: Math.round(avgQualityScore * 100) / 100
        },
        statusDistribution,
        quantityMetrics,
        timeMetrics,
        qualityMetrics,
        productionTrends,
        recipePerformance,
        recentBatches,
        insights: {
          topPerformingRecipe: recipePerformance[0]?.recipeName || 'N/A',
          mostProductiveDay: productionTrends.reduce((max, day) => 
            day.totalActualQuantity > (max?.totalActualQuantity || 0) ? day : max, 
            productionTrends[0]
          ),
          recommendations: [
            avgQuantityVariance < -10 ? 'Review production planning - consistent quantity shortfalls detected' : null,
            rejectedBatches > totalBatches * 0.1 ? 'High rejection rate detected - review production processes' : null,
            avgQualityScore < 75 ? 'Quality improvement needed - implement additional quality controls' : null,
            avgDuration > 180 ? 'Production taking longer than expected - optimize workflows' : null
          ].filter(Boolean)
        }
      }
    })

  } catch (error) {
    console.error('Production analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch production analytics' },
      { status: 500 }
    )
  }
}
