import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      optimizationType = 'comprehensive', // 'workforce', 'equipment', 'comprehensive'
      optimizationPeriod = 30, // days
      targetFacilities = [], // specific facilities to optimize
      constraints = {},
      priorities = { cost: 0.4, efficiency: 0.3, sustainability: 0.3 }
    } = body

    // 1. Get current resource utilization data
    const resourceUtilization = await getCurrentResourceUtilization(targetFacilities, optimizationPeriod)

    // 2. Get operational demand patterns
    const demandPatterns = await getOperationalDemandPatterns(optimizationPeriod)

    // 3. Get resource capacity and costs
    const resourceCapacity = await getResourceCapacityData()

    // 4. Generate AI-powered optimization recommendations
    const optimizationResults = await generateResourceOptimizations({
      resourceUtilization,
      demandPatterns,
      resourceCapacity,
      optimizationType,
      optimizationPeriod,
      constraints,
      priorities
    })

    // 5. Calculate impact analysis
    const impactAnalysis = calculateOptimizationImpact(optimizationResults, resourceUtilization)

    // 6. Generate implementation roadmap
    const implementationRoadmap = generateImplementationRoadmap(optimizationResults)

    return NextResponse.json({
      success: true,
      data: {
        optimizationType,
        optimizationPeriod,
        currentState: {
          resourceUtilization,
          demandPatterns,
          resourceCapacity
        },
        optimizations: optimizationResults,
        impactAnalysis,
        implementationRoadmap,
        summary: {
          totalOptimizations: optimizationResults.length,
          estimatedCostSavings: impactAnalysis.costSavings,
          estimatedEfficiencyGain: impactAnalysis.efficiencyImprovement,
          sustainabilityImpact: impactAnalysis.sustainabilityScore,
          implementationPriority: getOverallPriority(optimizationResults)
        }
      }
    })

  } catch (error) {
    console.error('Resource optimization error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate resource optimizations' },
      { status: 500 }
    )
  }
}

// Get current resource utilization across facilities
async function getCurrentResourceUtilization(targetFacilities: string[], days: number) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get production resource usage
  const productionData = await prisma.productionBatch.findMany({
    where: {
      createdAt: { gte: startDate }
    },
    include: {
      resourceUsage: true,
      recipe: true
    }
  })

  // Get distribution resource usage
  const distributionData = await prisma.delivery.findMany({
    where: {
      createdAt: { gte: startDate }
    },
    include: {
      vehicle: true,
      driver: true
    }
  })

  // Aggregate resource utilization
  const resourceUtilization = {
    production: {
      totalBatches: productionData.length,
      avgBatchSize: productionData.reduce((sum, batch) => sum + (batch.actualQuantity || batch.plannedQuantity), 0) / Math.max(productionData.length, 1),
      totalResourceHours: productionData.reduce((sum, batch) => sum + calculateResourceHours(batch), 0),
      utilizationRate: calculateProductionUtilizationRate(productionData),
      efficiencyScore: calculateProductionEfficiency(productionData)
    },
    distribution: {
      totalDeliveries: distributionData.length,
      vehicleUtilization: calculateVehicleUtilization(distributionData),
      driverUtilization: calculateDriverUtilization(distributionData),
      routeEfficiency: calculateRouteEfficiency(distributionData),
      deliverySuccess: calculateDeliverySuccessRate(distributionData)
    },
    workforce: {
      // Mock workforce data since not fully implemented in schema
      totalHours: productionData.length * 8, // Assume 8 hours per batch
      productivity: 0.75, // 75% productivity
      availability: 0.9 // 90% availability
    }
  }

  return resourceUtilization
}

// Calculate resource hours for a production batch
function calculateResourceHours(batch: any): number {
  // Estimate based on batch size and complexity
  const baseHours = 4 // Base 4 hours per batch
  const sizeMultiplier = Math.log(Math.max(batch.plannedQuantity, 1)) / Math.log(100) // Scale with size
  const resourceHours = batch.resourceUsage?.reduce((sum: number, usage: any) => 
    sum + (usage.hoursUsed || 2), 0) || baseHours

  return Math.max(baseHours * sizeMultiplier, resourceHours)
}

// Calculate production utilization rate
function calculateProductionUtilizationRate(batches: any[]): number {
  if (batches.length === 0) return 0

  const totalCapacityHours = batches.length * 8 // Assume 8-hour capacity per batch slot
  const totalUsedHours = batches.reduce((sum, batch) => sum + calculateResourceHours(batch), 0)

  return Math.min(totalUsedHours / totalCapacityHours, 1)
}

// Calculate production efficiency
function calculateProductionEfficiency(batches: any[]): number {
  if (batches.length === 0) return 0

  const successfulBatches = batches.filter(batch => batch.status === 'COMPLETED').length
  return successfulBatches / batches.length
}

// Calculate vehicle utilization
function calculateVehicleUtilization(deliveries: any[]): number {
  if (deliveries.length === 0) return 0

  const vehicleUsage = new Map()
  
  deliveries.forEach(delivery => {
    if (delivery.vehicleId) {
      const count = vehicleUsage.get(delivery.vehicleId) || 0
      vehicleUsage.set(delivery.vehicleId, count + 1)
    }
  })

  // Assume each vehicle can handle 5 deliveries per day optimally
  const totalPossibleDeliveries = vehicleUsage.size * 5 * 30 // 30 days
  const actualDeliveries = deliveries.length

  return Math.min(actualDeliveries / Math.max(totalPossibleDeliveries, 1), 1)
}

// Calculate driver utilization
function calculateDriverUtilization(deliveries: any[]): number {
  if (deliveries.length === 0) return 0

  const driverUsage = new Map()
  
  deliveries.forEach(delivery => {
    if (delivery.driverId) {
      const count = driverUsage.get(delivery.driverId) || 0
      driverUsage.set(delivery.driverId, count + 1)
    }
  })

  // Assume each driver can handle 6 deliveries per day optimally
  const totalPossibleDeliveries = driverUsage.size * 6 * 30 // 30 days
  const actualDeliveries = deliveries.length

  return Math.min(actualDeliveries / Math.max(totalPossibleDeliveries, 1), 1)
}

// Calculate route efficiency
function calculateRouteEfficiency(deliveries: any[]): number {
  // Simple efficiency calculation based on completion rate and timing
  const completedDeliveries = deliveries.filter(d => d.status === 'DELIVERED').length
  const onTimeDeliveries = deliveries.filter(d => 
    d.status === 'DELIVERED' && 
    d.completionTime && 
    d.plannedTime &&
    d.completionTime <= d.plannedTime
  ).length

  const completionRate = deliveries.length > 0 ? completedDeliveries / deliveries.length : 0
  const onTimeRate = completedDeliveries > 0 ? onTimeDeliveries / completedDeliveries : 0

  return (completionRate + onTimeRate) / 2
}

// Calculate delivery success rate
function calculateDeliverySuccessRate(deliveries: any[]): number {
  if (deliveries.length === 0) return 0
  
  const successfulDeliveries = deliveries.filter(d => d.status === 'DELIVERED').length
  return successfulDeliveries / deliveries.length
}

// Get operational demand patterns
async function getOperationalDemandPatterns(days: number) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get production demand
  const productionDemand = await prisma.productionBatch.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: { gte: startDate }
    },
    _count: true,
    _sum: {
      plannedQuantity: true
    }
  })

  // Get distribution demand
  const distributionDemand = await prisma.delivery.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: { gte: startDate }
    },
    _count: true,
    _sum: {
      portionsDelivered: true
    }
  })

  return {
    production: analyzeDemandPattern(productionDemand, 'production'),
    distribution: analyzeDemandPattern(distributionDemand, 'distribution'),
    seasonality: calculateSeasonalDemandFactors(),
    trends: calculateDemandTrends(productionDemand, distributionDemand)
  }
}

// Analyze demand patterns
function analyzeDemandPattern(demandData: any[], type: string) {
  if (demandData.length === 0) {
    return {
      avgDailyDemand: 0,
      peakDemand: 0,
      demandVariability: 0,
      pattern: 'stable'
    }
  }

  const dailyDemands = demandData.map(d => d._count || 0)
  const avgDemand = dailyDemands.reduce((sum, d) => sum + d, 0) / dailyDemands.length
  const peakDemand = Math.max(...dailyDemands)
  const variance = dailyDemands.reduce((sum, d) => sum + Math.pow(d - avgDemand, 2), 0) / dailyDemands.length
  const variability = Math.sqrt(variance) / avgDemand

  let pattern = 'stable'
  if (variability > 0.5) pattern = 'volatile'
  else if (variability > 0.3) pattern = 'moderate'

  return {
    avgDailyDemand: avgDemand,
    peakDemand,
    demandVariability: variability,
    pattern
  }
}

// Calculate seasonal demand factors
function calculateSeasonalDemandFactors() {
  const month = new Date().getMonth() + 1 // 1-12
  
  // School feeding program seasonal patterns
  const seasonalMultipliers = [0.9, 0.9, 1.0, 1.0, 1.0, 0.8, 0.8, 0.9, 1.1, 1.1, 1.0, 0.9]
  
  return {
    currentMultiplier: seasonalMultipliers[month - 1],
    yearlyPattern: seasonalMultipliers
  }
}

// Calculate demand trends
function calculateDemandTrends(productionData: any[], distributionData: any[]) {
  const productionTrend = calculateTrendDirection(productionData)
  const distributionTrend = calculateTrendDirection(distributionData)

  return {
    production: productionTrend,
    distribution: distributionTrend,
    overall: (productionTrend + distributionTrend) / 2
  }
}

// Calculate trend direction (-1 to 1, where 1 is strong growth)
function calculateTrendDirection(data: any[]): number {
  if (data.length < 2) return 0

  const firstHalf = data.slice(0, Math.floor(data.length / 2))
  const secondHalf = data.slice(Math.floor(data.length / 2))

  const firstAvg = firstHalf.reduce((sum, d) => sum + (d._count || 0), 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, d) => sum + (d._count || 0), 0) / secondHalf.length

  if (firstAvg === 0) return 0
  
  const growthRate = (secondAvg - firstAvg) / firstAvg
  return Math.max(-1, Math.min(1, growthRate)) // Normalize to -1 to 1
}

// Get resource capacity data
async function getResourceCapacityData() {
  // Get vehicles
  const vehicles = await prisma.vehicle.findMany({
    where: { isActive: true }
  })

  // Get drivers  
  const drivers = await prisma.driver.findMany({
    where: { isActive: true }
  })

  return {
    vehicles: {
      total: vehicles.length,
      capacity: vehicles.reduce((sum, v) => sum + (v.capacity || 100), 0),
      avgCapacity: vehicles.length > 0 ? vehicles.reduce((sum, v) => sum + (v.capacity || 100), 0) / vehicles.length : 0,
      utilizationPotential: vehicles.length * 5 * 30 // 5 trips per day, 30 days
    },
    drivers: {
      total: drivers.length,
      workHours: drivers.length * 8 * 30, // 8 hours per day, 30 days
      utilizationPotential: drivers.length * 6 * 30 // 6 deliveries per day, 30 days
    },
    production: {
      // Mock production capacity
      dailyCapacity: 5000, // portions per day
      monthlyCapacity: 5000 * 30,
      equipmentUtilization: 0.75
    }
  }
}

// Generate AI-powered resource optimizations
async function generateResourceOptimizations({
  resourceUtilization,
  demandPatterns,
  resourceCapacity,
  optimizationType,
  optimizationPeriod,
  constraints,
  priorities
}: any) {
  const optimizations: any[] = []

  // Production optimizations
  if (optimizationType === 'comprehensive' || optimizationType === 'production') {
    optimizations.push(...generateProductionOptimizations(
      resourceUtilization.production,
      demandPatterns.production,
      resourceCapacity.production,
      priorities
    ))
  }

  // Distribution optimizations
  if (optimizationType === 'comprehensive' || optimizationType === 'distribution') {
    optimizations.push(...generateDistributionOptimizations(
      resourceUtilization.distribution,
      demandPatterns.distribution,
      resourceCapacity,
      priorities
    ))
  }

  // Workforce optimizations
  if (optimizationType === 'comprehensive' || optimizationType === 'workforce') {
    optimizations.push(...generateWorkforceOptimizations(
      resourceUtilization.workforce,
      demandPatterns,
      priorities
    ))
  }

  // Cross-functional optimizations
  if (optimizationType === 'comprehensive') {
    optimizations.push(...generateCrossFunctionalOptimizations(
      resourceUtilization,
      demandPatterns,
      resourceCapacity,
      priorities
    ))
  }

  return optimizations.sort((a, b) => b.priority - a.priority)
}

// Generate production optimizations
function generateProductionOptimizations(production: any, demand: any, capacity: any, priorities: any) {
  const optimizations: any[] = []

  // Utilization optimization
  if (production.utilizationRate < 0.7) {
    optimizations.push({
      type: 'production_utilization',
      title: 'Improve Production Utilization',
      description: `Current utilization is ${Math.round(production.utilizationRate * 100)}%. Optimize scheduling to increase efficiency.`,
      impact: {
        costSavings: 50000 * (0.8 - production.utilizationRate), // IDR savings
        efficiencyGain: (0.8 - production.utilizationRate) * 100, // % improvement
        sustainabilityScore: 0.2
      },
      priority: 0.8,
      effort: 'medium',
      timeframe: '1-2 months',
      actions: [
        'Implement production scheduling optimization',
        'Balance workload distribution',
        'Reduce setup and changeover times'
      ]
    })
  }

  // Batch size optimization
  if (production.avgBatchSize < 300) {
    optimizations.push({
      type: 'batch_optimization',
      title: 'Optimize Batch Sizes',
      description: 'Increase batch sizes to improve economy of scale and reduce per-unit costs.',
      impact: {
        costSavings: 25000, // IDR per month
        efficiencyGain: 15, // % improvement
        sustainabilityScore: 0.3
      },
      priority: 0.7,
      effort: 'low',
      timeframe: '2-4 weeks',
      actions: [
        'Analyze optimal batch sizes by recipe',
        'Implement demand-based batch planning',
        'Train staff on new batch procedures'
      ]
    })
  }

  return optimizations
}

// Generate distribution optimizations
function generateDistributionOptimizations(distribution: any, demand: any, capacity: any, priorities: any) {
  const optimizations: any[] = []

  // Vehicle utilization
  if (distribution.vehicleUtilization < 0.6) {
    optimizations.push({
      type: 'vehicle_utilization',
      title: 'Optimize Vehicle Utilization',
      description: `Vehicle utilization is ${Math.round(distribution.vehicleUtilization * 100)}%. Improve route planning and load optimization.`,
      impact: {
        costSavings: 75000, // IDR per month
        efficiencyGain: 25, // % improvement
        sustainabilityScore: 0.4 // Reduced fuel consumption
      },
      priority: 0.9,
      effort: 'medium',
      timeframe: '1-3 months',
      actions: [
        'Implement route optimization software',
        'Consolidate delivery routes',
        'Improve load planning'
      ]
    })
  }

  // Route efficiency
  if (distribution.routeEfficiency < 0.7) {
    optimizations.push({
      type: 'route_optimization',
      title: 'Enhance Route Efficiency',
      description: 'Optimize delivery routes to reduce travel time and fuel consumption.',
      impact: {
        costSavings: 40000, // IDR per month
        efficiencyGain: 20, // % improvement
        sustainabilityScore: 0.5
      },
      priority: 0.8,
      effort: 'medium',
      timeframe: '2-4 weeks',
      actions: [
        'Use GPS and traffic data for routing',
        'Implement dynamic route adjustment',
        'Train drivers on efficient driving practices'
      ]
    })
  }

  return optimizations
}

// Generate workforce optimizations
function generateWorkforceOptimizations(workforce: any, demand: any, priorities: any) {
  const optimizations: any[] = []

  // Productivity improvement
  if (workforce.productivity < 0.8) {
    optimizations.push({
      type: 'workforce_productivity',
      title: 'Enhance Workforce Productivity',
      description: `Current productivity is ${Math.round(workforce.productivity * 100)}%. Implement training and process improvements.`,
      impact: {
        costSavings: 100000, // IDR per month
        efficiencyGain: 30, // % improvement
        sustainabilityScore: 0.1
      },
      priority: 0.85,
      effort: 'high',
      timeframe: '3-6 months',
      actions: [
        'Provide skills training programs',
        'Implement performance monitoring',
        'Optimize work processes and procedures'
      ]
    })
  }

  return optimizations
}

// Generate cross-functional optimizations
function generateCrossFunctionalOptimizations(utilization: any, demand: any, capacity: any, priorities: any) {
  const optimizations: any[] = []

  // Integrated planning optimization
  optimizations.push({
    type: 'integrated_planning',
    title: 'Implement Integrated Resource Planning',
    description: 'Coordinate production and distribution planning for optimal resource allocation.',
    impact: {
      costSavings: 150000, // IDR per month
      efficiencyGain: 35, // % improvement
      sustainabilityScore: 0.6
    },
    priority: 0.95,
    effort: 'high',
    timeframe: '4-8 months',
    actions: [
      'Implement integrated planning system',
      'Establish cross-functional planning team',
      'Develop coordinated KPIs and metrics'
    ]
  })

  return optimizations
}

// Calculate optimization impact
function calculateOptimizationImpact(optimizations: any[], currentUtilization: any) {
  const totalCostSavings = optimizations.reduce((sum, opt) => sum + (opt.impact?.costSavings || 0), 0)
  const avgEfficiencyGain = optimizations.reduce((sum, opt) => sum + (opt.impact?.efficiencyGain || 0), 0) / Math.max(optimizations.length, 1)
  const avgSustainabilityScore = optimizations.reduce((sum, opt) => sum + (opt.impact?.sustainabilityScore || 0), 0) / Math.max(optimizations.length, 1)

  return {
    costSavings: totalCostSavings,
    efficiencyImprovement: avgEfficiencyGain,
    sustainabilityScore: avgSustainabilityScore,
    roiEstimate: totalCostSavings * 12, // Annual savings
    paybackPeriod: calculatePaybackPeriod(optimizations),
    riskAssessment: assessImplementationRisk(optimizations)
  }
}

// Calculate payback period
function calculatePaybackPeriod(optimizations: any[]): number {
  const totalInvestment = optimizations.reduce((sum, opt) => {
    const effortCost = { low: 50000, medium: 200000, high: 500000 }
    return sum + (effortCost[opt.effort as keyof typeof effortCost] || 200000)
  }, 0)

  const monthlySavings = optimizations.reduce((sum, opt) => sum + (opt.impact?.costSavings || 0), 0)

  return monthlySavings > 0 ? totalInvestment / monthlySavings : 999
}

// Assess implementation risk
function assessImplementationRisk(optimizations: any[]): string {
  const highEffortCount = optimizations.filter(opt => opt.effort === 'high').length
  const totalCount = optimizations.length

  if (highEffortCount / totalCount > 0.6) return 'high'
  if (highEffortCount / totalCount > 0.3) return 'medium'
  return 'low'
}

// Generate implementation roadmap
function generateImplementationRoadmap(optimizations: any[]) {
  const phases = {
    immediate: optimizations.filter(opt => opt.timeframe.includes('week')),
    shortTerm: optimizations.filter(opt => opt.timeframe.includes('1-2 months') || opt.timeframe.includes('2-4 weeks')),
    mediumTerm: optimizations.filter(opt => opt.timeframe.includes('3-6 months') || opt.timeframe.includes('1-3 months')),
    longTerm: optimizations.filter(opt => opt.timeframe.includes('4-8 months') || opt.timeframe.includes('6+ months'))
  }

  return {
    phases,
    dependencies: identifyDependencies(optimizations),
    milestones: generateMilestones(phases),
    resources: estimateResourceRequirements(optimizations)
  }
}

// Identify optimization dependencies
function identifyDependencies(optimizations: any[]): any[] {
  const dependencies: any[] = []

  // Simple dependency logic
  const integrationOpt = optimizations.find(opt => opt.type === 'integrated_planning')
  if (integrationOpt) {
    const dependentOpts = optimizations.filter(opt => 
      opt.type.includes('utilization') || opt.type.includes('optimization')
    )
    dependentOpts.forEach(opt => {
      dependencies.push({
        prerequisite: opt.type,
        dependent: integrationOpt.type,
        reason: 'Individual optimizations should be completed before integration'
      })
    })
  }

  return dependencies
}

// Generate implementation milestones
function generateMilestones(phases: any) {
  return {
    month1: `Complete ${phases.immediate.length} immediate optimizations`,
    month3: `Implement ${phases.shortTerm.length} short-term improvements`,
    month6: `Execute ${phases.mediumTerm.length} medium-term initiatives`,
    month12: `Finalize ${phases.longTerm.length} long-term transformations`
  }
}

// Estimate resource requirements
function estimateResourceRequirements(optimizations: any[]) {
  const effortCosts = { low: 50000, medium: 200000, high: 500000 }
  
  return {
    totalInvestment: optimizations.reduce((sum, opt) => 
      sum + (effortCosts[opt.effort as keyof typeof effortCosts] || 200000), 0),
    personnelHours: optimizations.reduce((sum, opt) => {
      const hours = { low: 40, medium: 160, high: 400 }
      return sum + (hours[opt.effort as keyof typeof hours] || 160)
    }, 0),
    externalSupport: optimizations.filter(opt => opt.effort === 'high').length > 0
  }
}

// Get overall priority
function getOverallPriority(optimizations: any[]): string {
  if (optimizations.length === 0) return 'low'
  
  const avgPriority = optimizations.reduce((sum, opt) => sum + opt.priority, 0) / optimizations.length
  
  if (avgPriority >= 0.8) return 'high'
  if (avgPriority >= 0.6) return 'medium'
  return 'low'
}
