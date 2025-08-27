import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "week" // week, month, quarter, year

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "quarter":
        const quarterStart = Math.floor(now.getMonth() / 3) * 3
        startDate = new Date(now.getFullYear(), quarterStart, 1)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Get production metrics
    const productionPlans = await prisma.productionPlan.findMany({
      where: {
        planDate: {
          gte: startDate,
          lte: now
        }
      },
      include: {
        menu: true,
        batches: {
          include: {
            qualityChecks: true
          }
        }
      }
    })

    const productionBatches = await prisma.productionBatch.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        }
      },
      include: {
        qualityChecks: true,
        resourceUsage: {
          include: {
            resource: true
          }
        }
      }
    })

    const qualityCheckpoints = await prisma.qualityCheckpoint.findMany({
      where: {
        checkedAt: {
          gte: startDate,
          lte: now
        }
      }
    })

    const rawMaterials = await prisma.rawMaterial.findMany({
      include: {
        inventory: {
          include: {
            supplier: true
          }
        }
      }
    })

    // Calculate analytics metrics
    const totalPlans = productionPlans.length
    const completedPlans = productionPlans.filter(p => p.status === "COMPLETED").length
    const totalBatches = productionBatches.length
    const completedBatches = productionBatches.filter(b => b.status === "COMPLETED").length
    const totalPortions = productionPlans.reduce((sum, p) => sum + p.targetPortions, 0)
    const actualPortions = productionBatches.reduce((sum, b) => sum + (b.actualQuantity || 0), 0)

    // Quality metrics
    const totalQualityChecks = qualityCheckpoints.length
    const passedQualityChecks = qualityCheckpoints.filter(q => q.status === "PASS").length
    const qualityPassRate = totalQualityChecks > 0 ? (passedQualityChecks / totalQualityChecks) * 100 : 0

    // Resource utilization
    const totalResources = await prisma.productionResource.count()
    const activeResources = await prisma.productionResource.count({
      where: { status: "IN_USE" }
    })
    const resourceUtilization = totalResources > 0 ? (activeResources / totalResources) * 100 : 0

    // Cost analysis
    const materialCosts = rawMaterials.reduce((sum, m) => {
      const totalStock = m.inventory.reduce((invSum, inv) => invSum + inv.quantity, 0)
      const avgPrice = m.inventory.length > 0 
        ? m.inventory.reduce((priceSum, inv) => priceSum + inv.unitPrice, 0) / m.inventory.length
        : 0
      return sum + (totalStock * avgPrice)
    }, 0)
    
    const lowStockItems = rawMaterials.filter(m => {
      const totalStock = m.inventory.reduce((invSum, inv) => invSum + inv.quantity, 0)
      return totalStock <= 10 // Threshold for low stock
    }).length

    // Daily production trend (last 7 days)
    const dailyTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const dayBatches = productionBatches.filter(b => 
        b.createdAt >= date && b.createdAt < nextDate
      )
      
      const dayPortions = dayBatches.reduce((sum, b) => sum + (b.actualQuantity || 0), 0)
      
      dailyTrend.push({
        date: date.toISOString().split('T')[0],
        portions: dayPortions,
        batches: dayBatches.length
      })
    }

    // Menu popularity
    const menuStats = productionPlans.reduce((acc: any, plan) => {
      const menuName = plan.menu?.name || 'Unknown'
      if (!acc[menuName]) {
        acc[menuName] = {
          name: menuName,
          portions: 0,
          plans: 0
        }
      }
      acc[menuName].portions += plan.targetPortions
      acc[menuName].plans += 1
      return acc
    }, {})

    const menuPopularity = Object.values(menuStats).sort((a: any, b: any) => 
      b.portions - a.portions
    ).slice(0, 5)

    // Quality trends by type
    const qualityByType = qualityCheckpoints.reduce((acc: any, qc) => {
      const type = qc.checkpointType
      if (!acc[type]) {
        acc[type] = {
          type,
          total: 0,
          passed: 0,
          failed: 0
        }
      }
      acc[type].total += 1
      if (qc.status === "PASS") acc[type].passed += 1
      if (qc.status === "FAIL") acc[type].failed += 1
      return acc
    }, {})

    const analytics = {
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString()
      },
      overview: {
        totalPlans,
        completedPlans,
        planCompletionRate: totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0,
        totalBatches,
        completedBatches,
        batchCompletionRate: totalBatches > 0 ? (completedBatches / totalBatches) * 100 : 0,
        totalPortions,
        actualPortions,
        portionEfficiency: totalPortions > 0 ? (actualPortions / totalPortions) * 100 : 0
      },
      quality: {
        totalChecks: totalQualityChecks,
        passedChecks: passedQualityChecks,
        failedChecks: totalQualityChecks - passedQualityChecks,
        passRate: qualityPassRate,
        qualityByType: Object.values(qualityByType)
      },
      resources: {
        totalResources,
        activeResources,
        availableResources: totalResources - activeResources,
        utilizationRate: resourceUtilization
      },
      costs: {
        materialInventoryValue: materialCosts,
        lowStockItems,
        totalMaterialTypes: rawMaterials.length
      },
      trends: {
        daily: dailyTrend,
        menuPopularity
      }
    }

    return NextResponse.json({
      success: true,
      data: analytics
    })

  } catch (error) {
    console.error("Error fetching production analytics:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch production analytics",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
