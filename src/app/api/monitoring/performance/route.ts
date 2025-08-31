import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { startOfDay, endOfDay, subDays, format } from 'date-fns'

const prisma = new PrismaClient()

// Type definitions
interface ProductionMetric {
  id: string
  date: Date
  totalProduction: number
  targetProduction: number
  efficiency: number
  qualityScore: number
  wastageAmount: number
  costPerPortion: number
}

interface GroupedCount {
  status: string
  _count: { id: number }
}

interface DistributionWithSchools {
  id: string
  status: string
  totalPortions: number
  estimatedDuration: number | null
  actualDuration: number | null
  distributionDate: Date
  schools: Array<{
    plannedPortions: number
    actualPortions: number | null
  }>
}

interface WasteRecord {
  recordDate: Date
  wasteType: string
  weight: number
}

interface VehicleWithDistributions {
  id: string
  plateNumber: string
  type: string
  capacity: number
  isActive: boolean
  distributions: Array<{
    id: string
    totalPortions: number
    status: string
  }>
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7' // days
    const periodInt = parseInt(period)
    
    const endDate = new Date()
    const startDate = subDays(endDate, periodInt)

    // Get production metrics
    const productionMetrics: ProductionMetric[] = await prisma.productionMetrics.findMany({
      where: {
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Get delivery performance
    const deliveryPerformance = await prisma.delivery.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
    })

    // Get quality metrics
    const qualityMetrics = await prisma.qualityCheck.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
    })

    // Get distribution efficiency
    const distributions: DistributionWithSchools[] = await prisma.distribution.findMany({
      where: {
        distributionDate: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      select: {
        id: true,
        status: true,
        totalPortions: true,
        estimatedDuration: true,
        actualDuration: true,
        distributionDate: true,
        schools: {
          select: {
            plannedPortions: true,
            actualPortions: true,
          },
        },
      },
    })

    // Calculate efficiency metrics
    const distributionEfficiency = distributions.map((dist: DistributionWithSchools) => {
      const totalPlanned = dist.schools.reduce((sum: number, school) => sum + school.plannedPortions, 0)
      const totalActual = dist.schools.reduce((sum: number, school) => sum + (school.actualPortions || 0), 0)
      const portionEfficiency = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0
      
      const timeEfficiency = dist.estimatedDuration && dist.actualDuration 
        ? (dist.estimatedDuration / dist.actualDuration) * 100 
        : 0

      return {
        id: dist.id,
        date: format(new Date(dist.distributionDate), 'yyyy-MM-dd'),
        status: dist.status,
        portionEfficiency,
        timeEfficiency,
        totalPortions: dist.totalPortions,
        plannedPortions: totalPlanned,
        actualPortions: totalActual,
      }
    })

    // Get waste data
    const wasteRecords = await prisma.wasteRecord.findMany({
      where: {
        recordDate: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      select: {
        recordDate: true,
        wasteType: true,
        weight: true,
      },
    })

    // Aggregate waste by type and date
    const wasteByType = wasteRecords.reduce((acc: Record<string, Record<string, number>>, record) => {
      const dateKey = format(new Date(record.recordDate), 'yyyy-MM-dd')
      if (!acc[dateKey]) acc[dateKey] = {}
      if (!acc[dateKey][record.wasteType]) acc[dateKey][record.wasteType] = 0
      acc[dateKey][record.wasteType] += record.weight
      return acc
    }, {} as Record<string, Record<string, number>>)

    // Get vehicle utilization
    const vehicleMetrics: VehicleWithDistributions[] = await prisma.vehicle.findMany({
      select: {
        id: true,
        plateNumber: true,
        type: true,
        capacity: true,
        isActive: true,
        distributions: {
          where: {
            distributionDate: {
              gte: startOfDay(startDate),
              lte: endOfDay(endDate),
            },
          },
          select: {
            id: true,
            totalPortions: true,
            status: true,
          },
        },
      },
    })

    const vehicleUtilization = vehicleMetrics.map((vehicle: VehicleWithDistributions) => {
      const totalTrips = vehicle.distributions.length
      const completedTrips = vehicle.distributions.filter((d) => d.status === 'COMPLETED').length
      const totalPortions = vehicle.distributions.reduce((sum: number, d) => sum + d.totalPortions, 0)
      const utilizationRate = totalTrips > 0 ? (completedTrips / totalTrips) * 100 : 0
      const capacityUtilization = vehicle.capacity > 0 && totalTrips > 0 
        ? (totalPortions / (vehicle.capacity * totalTrips)) * 100 
        : 0

      return {
        id: vehicle.id,
        plateNumber: vehicle.plateNumber,
        type: vehicle.type,
        capacity: vehicle.capacity,
        isActive: vehicle.isActive,
        totalTrips,
        completedTrips,
        utilizationRate,
        capacityUtilization: Math.min(capacityUtilization || 0, 100), // Cap at 100% and handle NaN
      }
    })

    // Calculate overall KPIs
    const totalProduction = productionMetrics.reduce((sum: number, pm: ProductionMetric) => sum + pm.totalProduction, 0)
    const totalTarget = productionMetrics.reduce((sum: number, pm: ProductionMetric) => sum + pm.targetProduction, 0)
    const avgEfficiency = productionMetrics.length > 0 
      ? productionMetrics.reduce((sum: number, pm: ProductionMetric) => sum + pm.efficiency, 0) / productionMetrics.length 
      : 0
    const avgQualityScore = productionMetrics.length > 0 
      ? productionMetrics.reduce((sum: number, pm: ProductionMetric) => sum + pm.qualityScore, 0) / productionMetrics.length 
      : 0

    const totalDeliveries = deliveryPerformance.reduce((sum: number, dp: GroupedCount) => sum + dp._count.id, 0)
    const completedDeliveries = deliveryPerformance.find((dp: GroupedCount) => dp.status === 'COMPLETED')?._count.id || 0
    const deliverySuccessRate = totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0

    const totalQualityChecks = qualityMetrics.reduce((sum: number, qm: GroupedCount) => sum + qm._count.id, 0)
    const passedQualityChecks = qualityMetrics.find((qm: GroupedCount) => qm.status === 'PASSED')?._count.id || 0
    const qualityPassRate = totalQualityChecks > 0 ? (passedQualityChecks / totalQualityChecks) * 100 : 0

    const performanceData = {
      summary: {
        totalProduction,
        totalTarget,
        productionEfficiency: totalTarget > 0 ? (totalProduction / totalTarget) * 100 : 0,
        avgEfficiency,
        avgQualityScore,
        deliverySuccessRate,
        qualityPassRate,
        totalDeliveries,
        totalQualityChecks,
      },
      charts: {
        productionMetrics: productionMetrics.map((pm: ProductionMetric) => ({
          date: format(new Date(pm.date), 'yyyy-MM-dd'),
          production: pm.totalProduction,
          target: pm.targetProduction,
          efficiency: pm.efficiency,
          qualityScore: pm.qualityScore,
          wastage: pm.wastageAmount,
          cost: pm.costPerPortion,
        })),
        deliveryPerformance: deliveryPerformance.map((dp: GroupedCount) => ({
          status: dp.status,
          count: dp._count.id,
        })),
        qualityMetrics: qualityMetrics.map((qm: GroupedCount) => ({
          status: qm.status,
          count: qm._count.id,
        })),
        distributionEfficiency,
        wasteByType,
        vehicleUtilization,
      },
      trends: {
        productionTrend: productionMetrics.length > 1 
          ? ((productionMetrics[productionMetrics.length - 1].efficiency - productionMetrics[0].efficiency) / productionMetrics[0].efficiency) * 100
          : 0,
        qualityTrend: productionMetrics.length > 1 
          ? ((productionMetrics[productionMetrics.length - 1].qualityScore - productionMetrics[0].qualityScore) / productionMetrics[0].qualityScore) * 100
          : 0,
      }
    }

    return NextResponse.json({
      success: true,
      data: performanceData,
    })

  } catch (error) {
    console.error('Error fetching performance data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch performance data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
