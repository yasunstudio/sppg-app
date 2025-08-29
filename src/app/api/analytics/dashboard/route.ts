import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month"
    const category = searchParams.get("category") || "all"

    const now = new Date()
    let startDate: Date
    let endDate = now

    // Calculate date range based on period
    switch (period) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "quarter":
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3
        startDate = new Date(now.getFullYear(), quarterMonth, 1)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Production Analytics
    const productionData = await getProductionAnalytics(startDate, endDate, category)
    
    // Financial Analytics
    const financialData = await getFinancialAnalytics(startDate, endDate, category)
    
    // Distribution Analytics
    const distributionData = await getDistributionAnalytics(startDate, endDate, category)
    
    // Quality Analytics
    const qualityData = await getQualityAnalytics(startDate, endDate, category)

    return NextResponse.json({
      success: true,
      data: {
        period,
        category,
        startDate,
        endDate,
        production: productionData,
        financial: financialData,
        distribution: distributionData,
        quality: qualityData,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Analytics dashboard error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch analytics data",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

async function getProductionAnalytics(startDate: Date, endDate: Date, category: string) {
  try {
    // Get production batches
    const batches = await prisma.productionBatch.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        ...(category !== "all" && category === "production" ? {} : {})
      },
      include: {
        recipe: true,
        qualityChecks: true,
        productionPlan: true
      }
    })

    // Calculate production metrics
    const totalBatches = batches.length
    const completedBatches = batches.filter(b => b.status === "COMPLETED").length
    const efficiency = totalBatches > 0 ? (completedBatches / totalBatches) * 100 : 0

    // Calculate output volume
    const totalOutput = batches.reduce((sum, batch) => sum + (batch.actualQuantity || batch.plannedQuantity || 0), 0)

    // Calculate quality score from quality checks
    const qualityChecks = batches.flatMap(b => b.qualityChecks || [])
    const passedQuality = qualityChecks.filter(qc => qc.status === "PASS").length
    const qualityScore = qualityChecks.length > 0 ? (passedQuality / qualityChecks.length) * 100 : 100

    // Calculate estimated downtime (mock data for now)
    const downtime = Math.random() * 8 // 0-8 hours

    return {
      efficiency: Math.round(efficiency),
      output: totalOutput,
      quality: Math.round(qualityScore),
      downtime: Math.round(downtime * 10) / 10,
      totalBatches,
      completedBatches
    }

  } catch (error) {
    console.error("Production analytics error:", error)
    return {
      efficiency: 0,
      output: 0,
      quality: 0,
      downtime: 0,
      totalBatches: 0,
      completedBatches: 0
    }
  }
}

async function getFinancialAnalytics(startDate: Date, endDate: Date, category: string) {
  try {
    // Get financial transactions for cost calculation
    const transactions = await prisma.financialTransaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        ...(category !== "all" && category === "financial" ? {} : {})
      }
    })

    // Calculate total costs and revenue
    const totalCosts = transactions
      .filter(t => t.type === "EXPENSE")
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    const totalRevenue = transactions
      .filter(t => t.type === "INCOME")
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    // Calculate profit margin
    const profit = totalRevenue - totalCosts
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0

    // Mock cost efficiency and budget utilization (realistic calculations would need more data)
    const costEfficiency = 75 + Math.random() * 20 // 75-95%
    const budgetUtilization = 60 + Math.random() * 30 // 60-90%

    return {
      revenue: totalRevenue,
      costs: totalCosts,
      profit,
      profitMargin: Math.round(profitMargin * 10) / 10,
      costEfficiency: Math.round(costEfficiency),
      budgetUtilization: Math.round(budgetUtilization)
    }

  } catch (error) {
    console.error("Financial analytics error:", error)
    return {
      revenue: 0,
      costs: 0,
      profit: 0,
      profitMargin: 0,
      costEfficiency: 0,
      budgetUtilization: 0
    }
  }
}

async function getDistributionAnalytics(startDate: Date, endDate: Date, category: string) {
  try {
    // Get distributions
    const distributions = await prisma.distribution.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        ...(category !== "all" && category === "distribution" ? {} : {})
      },
      include: {
        schools: true,
        driver: true,
        vehicle: true
      }
    })

    const totalDistributions = distributions.length
    const completedDistributions = distributions.filter(d => d.status === "DELIVERED").length
    const successRate = totalDistributions > 0 ? (completedDistributions / totalDistributions) * 100 : 100

    // Calculate average delivery time (mock data)
    const avgTime = 2 + Math.random() * 4 // 2-6 hours

    // Mock route efficiency and customer satisfaction
    const routeEfficiency = 80 + Math.random() * 15 // 80-95%
    const satisfaction = 85 + Math.random() * 12 // 85-97%

    return {
      successRate: Math.round(successRate),
      avgTime: Math.round(avgTime * 10) / 10,
      routeEfficiency: Math.round(routeEfficiency),
      satisfaction: Math.round(satisfaction),
      totalDistributions,
      completedDistributions
    }

  } catch (error) {
    console.error("Distribution analytics error:", error)
    return {
      successRate: 0,
      avgTime: 0,
      routeEfficiency: 0,
      satisfaction: 0,
      totalDistributions: 0,
      completedDistributions: 0
    }
  }
}

async function getQualityAnalytics(startDate: Date, endDate: Date, category: string) {
  try {
    // Get quality checks
    const qualityChecks = await prisma.qualityCheck.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        ...(category !== "all" && category === "quality" ? {} : {})
      }
    })

    const totalChecks = qualityChecks.length
    const passedChecks = qualityChecks.filter(qc => qc.status === "GOOD").length
    const failedChecks = qualityChecks.filter(qc => qc.status === "POOR" || qc.status === "REJECTED").length
    const pendingChecks = qualityChecks.filter(qc => qc.status === "PENDING").length

    const passRate = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100
    const failRate = totalChecks > 0 ? (failedChecks / totalChecks) * 100 : 0

    return {
      totalChecks,
      passedChecks,
      failedChecks,
      pendingChecks,
      passRate: Math.round(passRate),
      failRate: Math.round(failRate * 10) / 10
    }

  } catch (error) {
    console.error("Quality analytics error:", error)
    return {
      totalChecks: 0,
      passedChecks: 0,
      failedChecks: 0,
      pendingChecks: 0,
      passRate: 0,
      failRate: 0
    }
  }
}
