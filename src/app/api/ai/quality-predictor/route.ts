import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      targetType = 'production', // 'production', 'distribution', 'inventory'
      targetIds = [], // specific items/batches to analyze
      predictionHorizon = 7, // days ahead
      includeEnvironmentalFactors = true,
      riskThreshold = 0.3 // 30% risk threshold for alerts
    } = body

    // 1. Get historical quality data
    const historicalQualityData = await getHistoricalQualityData(targetType, predictionHorizon * 4)

    // 2. Get current conditions and context
    const currentConditions = await getCurrentConditions(targetType, targetIds)

    // 3. Get environmental factors if enabled
    const environmentalFactors = includeEnvironmentalFactors ? 
      await getEnvironmentalFactors() : null

    // 4. Generate quality predictions using AI algorithms
    const qualityPredictions = await generateQualityPredictions({
      historicalData: historicalQualityData,
      currentConditions,
      environmentalFactors,
      predictionHorizon,
      targetType,
      riskThreshold
    })

    // 5. Generate quality alerts and recommendations
    const qualityAlerts = generateQualityAlerts(qualityPredictions, riskThreshold)
    const recommendations = generateQualityRecommendations(qualityPredictions)

    return NextResponse.json({
      success: true,
      data: {
        targetType,
        predictionHorizon,
        predictions: qualityPredictions,
        alerts: qualityAlerts,
        recommendations,
        summary: {
          totalItemsAnalyzed: qualityPredictions.length,
          highRiskItems: qualityPredictions.filter(p => p.riskLevel === 'high').length,
          mediumRiskItems: qualityPredictions.filter(p => p.riskLevel === 'medium').length,
          averageQualityScore: qualityPredictions.reduce((sum, p) => sum + p.predictedQualityScore, 0) / Math.max(qualityPredictions.length, 1),
          totalPotentialLoss: qualityPredictions.reduce((sum, p) => sum + (p.estimatedLoss || 0), 0)
        }
      }
    })

  } catch (error) {
    console.error('Quality prediction error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate quality predictions' },
      { status: 500 }
    )
  }
}

// Get historical quality data based on target type
async function getHistoricalQualityData(targetType: string, days: number) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  let qualityData: any[] = []

  switch (targetType) {
    case 'production':
      const productionBatches = await prisma.productionBatch.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        include: {
          qualityChecks: true,
          recipe: true
        }
      })

      qualityData = productionBatches.map(batch => ({
        id: batch.id,
        type: 'production',
        createdAt: batch.createdAt,
        qualityScore: batch.qualityScore || 0,
        status: batch.status,
        qualityChecks: batch.qualityChecks,
        recipeComplexity: calculateProductionComplexity(batch),
        temperatureLog: batch.temperatureLog
      }))
      break

    case 'inventory':
      const inventoryItems = await prisma.inventoryItem.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        include: {
          rawMaterial: {
            select: {
              id: true,
              name: true,
              category: true
            }
          }
        }
      })

      qualityData = inventoryItems.map(item => ({
        id: item.id,
        type: 'inventory',
        createdAt: item.createdAt,
        qualityStatus: item.qualityStatus,
        expiryDate: item.expiryDate,
        qualityChecks: [], // No direct relation in schema
        rawMaterial: item.rawMaterial
      }))
      break

    case 'distribution':
      const deliveries = await prisma.delivery.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        include: {
          driver: true
        }
      })

      qualityData = deliveries.map(delivery => ({
        id: delivery.id,
        type: 'distribution',
        createdAt: delivery.createdAt,
        status: delivery.status,
        plannedTime: delivery.plannedTime,
        arrivalTime: delivery.arrivalTime,
        // qualityChecks: [] // Not available in schema
      }))
      break
  }

  return qualityData
}

// Calculate production complexity score
function calculateProductionComplexity(batch: any): number {
  let complexity = 1

  // Recipe complexity factors
  if (batch.recipe) {
    complexity += (batch.recipe.prepTime + batch.recipe.cookTime) / 60 // Time factor
    complexity += batch.recipe.difficulty === 'HARD' ? 1 : batch.recipe.difficulty === 'MEDIUM' ? 0.5 : 0
  }

  // Batch size factor
  if (batch.plannedQuantity > 1000) complexity += 0.5

  return Math.min(complexity, 5)
}

// Get current conditions for quality prediction
async function getCurrentConditions(targetType: string, targetIds: string[]) {
  let conditions: any[] = []

  switch (targetType) {
    case 'production':
      const whereClause = targetIds.length > 0 ? 
        { id: { in: targetIds } } : 
        { status: { in: ['PENDING' as any, 'IN_PROGRESS' as any] } }
      
      const activeBatches = await prisma.productionBatch.findMany({
        where: whereClause,
        include: {
          recipe: {
            include: {
              ingredients: {
                include: {
                  item: true
                }
              }
            }
          },
          qualityChecks: true
        }
      })

      conditions = activeBatches.map(batch => ({
        id: batch.id,
        type: 'production',
        status: batch.status,
        plannedQuantity: batch.plannedQuantity,
        actualQuantity: batch.actualQuantity,
        startedAt: batch.startedAt,
        currentQualityScore: batch.qualityScore,
        recipeId: batch.recipeId,
        // qualityChecks: batch.qualityChecks, // Not available in include
        complexity: calculateProductionComplexity(batch)
      }))
      break

    case 'inventory':
      const inventoryConditions = await prisma.inventoryItem.findMany({
        where: targetIds.length > 0 ? { id: { in: targetIds } } : { qualityStatus: { not: 'REJECTED' as any } },
        include: {
          rawMaterial: true
        }
      })

      conditions = inventoryConditions.map(item => ({
        id: item.id,
        type: 'inventory',
        quantity: item.quantity,
        expiryDate: item.expiryDate,
        qualityStatus: item.qualityStatus,
        rawMaterialId: item.rawMaterialId,
        // qualityChecks: item.qualityChecks, // Not available
        daysSinceCreated: Math.floor((Date.now() - item.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
        daysUntilExpiry: item.expiryDate ? Math.floor((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null
      }))
      break

    case 'distribution':
      const pendingDeliveries = await prisma.delivery.findMany({
        where: targetIds.length > 0 ? { id: { in: targetIds } } : { status: { in: ['PENDING' as any, 'IN_TRANSIT' as any] } },
        include: {
          driver: true
        }
      })

      conditions = pendingDeliveries.map(delivery => ({
        id: delivery.id,
        type: 'distribution',
        status: delivery.status,
        plannedTime: delivery.plannedTime,
        driverId: delivery.driverId,
        // qualityChecks: delivery.qualityChecks, // Not available
        transitTime: delivery.plannedTime ? 
          Math.max(0, Math.floor((delivery.plannedTime.getTime() - Date.now()) / (1000 * 60 * 60))) : 0
      }))
      break
  }

  return conditions
}

// Get environmental factors that affect quality
async function getEnvironmentalFactors() {
  // In a real implementation, this would fetch from weather APIs, IoT sensors, etc.
  // For now, we'll simulate environmental data
  return {
    temperature: 28 + Math.random() * 8, // 28-36°C
    humidity: 60 + Math.random() * 30, // 60-90%
    airQuality: Math.floor(Math.random() * 100), // 0-100 AQI
    seasonalFactor: calculateSeasonalFactor(),
    weatherCondition: getRandomWeatherCondition()
  }
}

// Calculate seasonal factor for quality prediction
function calculateSeasonalFactor(): number {
  const month = new Date().getMonth() + 1 // 1-12
  
  // Seasonal quality impact (1.0 = normal, <1.0 = challenging conditions)
  const seasonalPattern = [0.9, 0.9, 0.95, 1.0, 0.85, 0.8, 0.8, 0.8, 0.9, 1.0, 1.0, 0.95]
  return seasonalPattern[month - 1] || 1.0
}

// Get random weather condition for simulation
function getRandomWeatherCondition(): string {
  const conditions = ['sunny', 'cloudy', 'rainy', 'stormy', 'humid']
  return conditions[Math.floor(Math.random() * conditions.length)]
}

// AI-powered quality prediction algorithm
async function generateQualityPredictions({
  historicalData,
  currentConditions,
  environmentalFactors,
  predictionHorizon,
  targetType,
  riskThreshold
}: any) {
  const predictions: any[] = []

  for (const condition of currentConditions) {
    const prediction = await predictQualityForItem({
      condition,
      historicalData,
      environmentalFactors,
      predictionHorizon,
      targetType
    })

    // Calculate risk level
    const riskLevel = prediction.qualityRisk > riskThreshold ? 'high' :
                     prediction.qualityRisk > riskThreshold * 0.6 ? 'medium' : 'low'

    predictions.push({
      ...prediction,
      riskLevel,
      estimatedLoss: calculateEstimatedLoss(prediction, condition)
    })
  }

  return predictions.sort((a, b) => b.qualityRisk - a.qualityRisk)
}

// Predict quality for individual item/batch
async function predictQualityForItem({
  condition,
  historicalData,
  environmentalFactors,
  predictionHorizon,
  targetType
}: any) {
  let baseQualityScore = 0.8 // Default 80% quality score
  let qualityRisk = 0.1 // Default 10% risk

  // Historical pattern analysis
  const relevantHistory = historicalData.filter((item: any) => 
    item.type === targetType && isSimilarCondition(item, condition)
  )

  if (relevantHistory.length > 0) {
    const avgHistoricalQuality = relevantHistory.reduce((sum: number, item: any) => 
      sum + getQualityScoreFromItem(item), 0) / relevantHistory.length
    baseQualityScore = avgHistoricalQuality
  }

  // Environmental impact analysis
  if (environmentalFactors) {
    const environmentalImpact = calculateEnvironmentalImpact(environmentalFactors, targetType)
    baseQualityScore *= environmentalImpact.qualityMultiplier
    qualityRisk += environmentalImpact.riskIncrease
  }

  // Time-based degradation
  const timeDegradation = calculateTimeDegradation(condition, predictionHorizon, targetType)
  baseQualityScore *= timeDegradation.qualityMultiplier
  qualityRisk += timeDegradation.riskIncrease

  // Condition-specific factors
  const conditionFactors = calculateConditionSpecificFactors(condition, targetType)
  baseQualityScore *= conditionFactors.qualityMultiplier
  qualityRisk += conditionFactors.riskIncrease

  return {
    itemId: condition.id,
    itemType: targetType,
    currentQualityScore: getQualityScoreFromCondition(condition),
    predictedQualityScore: Math.max(0, Math.min(1, baseQualityScore)),
    qualityRisk: Math.max(0, Math.min(1, qualityRisk)),
    confidenceLevel: calculatePredictionConfidence(relevantHistory.length, environmentalFactors),
    factors: {
      environmental: environmentalFactors ? calculateEnvironmentalImpact(environmentalFactors, targetType) : null,
      timeBased: timeDegradation,
      conditionSpecific: conditionFactors
    }
  }
}

// Check if historical item has similar conditions
function isSimilarCondition(historicalItem: any, currentCondition: any): boolean {
  if (historicalItem.type !== currentCondition.type) return false

  switch (currentCondition.type) {
    case 'production':
      return historicalItem.recipeComplexity && currentCondition.complexity &&
             Math.abs(historicalItem.recipeComplexity - currentCondition.complexity) < 1
    case 'inventory':
      return historicalItem.rawMaterial?.category === currentCondition.rawMaterial?.category
    case 'distribution':
      return Math.abs(historicalItem.transitTime - currentCondition.transitTime) < 2 // Within 2 hours
    default:
      return true
  }
}

// Get quality score from historical item
function getQualityScoreFromItem(item: any): number {
  switch (item.type) {
    case 'production':
      return item.qualityScore || 0.8
    case 'inventory':
      const qualityStatusScore = {
        'GOOD': 0.9,
        'FAIR': 0.7,
        'POOR': 0.4,
        'EXPIRED': 0.1
      }
      return qualityStatusScore[item.qualityStatus as keyof typeof qualityStatusScore] || 0.8
    case 'distribution':
      return item.qualityChecks?.length > 0 ? 0.85 : 0.8
    default:
      return 0.8
  }
}

// Get current quality score from condition
function getQualityScoreFromCondition(condition: any): number {
  switch (condition.type) {
    case 'production':
      return condition.currentQualityScore || 0.8
    case 'inventory':
      const qualityStatusScore = {
        'GOOD': 0.9,
        'FAIR': 0.7,
        'POOR': 0.4,
        'EXPIRED': 0.1
      }
      return qualityStatusScore[condition.qualityStatus as keyof typeof qualityStatusScore] || 0.8
    case 'distribution':
      return 0.8 // Assume good initial quality for distribution
    default:
      return 0.8
  }
}

// Calculate environmental impact on quality
function calculateEnvironmentalImpact(environmental: any, targetType: string) {
  let qualityMultiplier = 1.0
  let riskIncrease = 0

  // Temperature impact
  if (environmental.temperature > 32) {
    qualityMultiplier *= 0.95
    riskIncrease += 0.05
  } else if (environmental.temperature > 35) {
    qualityMultiplier *= 0.9
    riskIncrease += 0.1
  }

  // Humidity impact
  if (environmental.humidity > 80) {
    qualityMultiplier *= 0.95
    riskIncrease += 0.05
  }

  // Weather condition impact
  if (environmental.weatherCondition === 'stormy') {
    qualityMultiplier *= 0.9
    riskIncrease += 0.1
  } else if (environmental.weatherCondition === 'rainy') {
    qualityMultiplier *= 0.95
    riskIncrease += 0.05
  }

  // Seasonal factor
  qualityMultiplier *= environmental.seasonalFactor

  return { qualityMultiplier, riskIncrease }
}

// Calculate time-based quality degradation
function calculateTimeDegradation(condition: any, predictionHorizon: number, targetType: string) {
  let qualityMultiplier = 1.0
  let riskIncrease = 0

  switch (targetType) {
    case 'production':
      // Production quality degrades if not completed quickly
      if (condition.status === 'IN_PROGRESS') {
        const hoursInProgress = condition.startedAt ? 
          (Date.now() - condition.startedAt.getTime()) / (1000 * 60 * 60) : 0
        if (hoursInProgress > 4) {
          qualityMultiplier *= Math.max(0.8, 1 - (hoursInProgress - 4) * 0.05)
          riskIncrease += Math.min(0.2, (hoursInProgress - 4) * 0.02)
        }
      }
      break

    case 'inventory':
      // Inventory quality degrades over time, especially near expiry
      if (condition.daysUntilExpiry !== null) {
        if (condition.daysUntilExpiry <= 3) {
          qualityMultiplier *= 0.7
          riskIncrease += 0.3
        } else if (condition.daysUntilExpiry <= 7) {
          qualityMultiplier *= 0.85
          riskIncrease += 0.15
        }
      }
      break

    case 'distribution':
      // Distribution quality degrades with longer transit times
      if (condition.transitTime > 8) {
        qualityMultiplier *= Math.max(0.7, 1 - (condition.transitTime - 8) * 0.02)
        riskIncrease += Math.min(0.2, (condition.transitTime - 8) * 0.01)
      }
      break
  }

  return { qualityMultiplier, riskIncrease }
}

// Calculate condition-specific quality factors
function calculateConditionSpecificFactors(condition: any, targetType: string) {
  let qualityMultiplier = 1.0
  let riskIncrease = 0

  switch (targetType) {
    case 'production':
      // High complexity recipes have higher risk
      if (condition.complexity > 3) {
        qualityMultiplier *= 0.95
        riskIncrease += 0.05
      }
      
      // Large batches have higher risk
      if (condition.plannedQuantity > 1000) {
        qualityMultiplier *= 0.97
        riskIncrease += 0.03
      }
      break

    case 'inventory':
      // Older inventory has higher risk
      if (condition.daysSinceCreated > 30) {
        qualityMultiplier *= 0.9
        riskIncrease += 0.1
      }
      break

    case 'distribution':
      // No additional condition-specific factors for now
      break
  }

  return { qualityMultiplier, riskIncrease }
}

// Calculate prediction confidence level
function calculatePredictionConfidence(historicalDataPoints: number, hasEnvironmentalData: boolean): number {
  let confidence = 0.5 // Base confidence

  // More historical data = higher confidence
  confidence += Math.min(0.3, historicalDataPoints * 0.02)

  // Environmental data improves confidence
  if (hasEnvironmentalData) confidence += 0.1

  // Real-time monitoring improves confidence
  confidence += 0.1

  return Math.min(0.95, confidence)
}

// Calculate estimated loss from quality degradation
function calculateEstimatedLoss(prediction: any, condition: any): number {
  const baseLoss = condition.plannedQuantity || condition.quantity || 100
  const lossRate = prediction.qualityRisk
  
  // Rough estimate: loss = quantity * risk * unit_value
  const estimatedUnitValue = 10000 // 10k IDR per unit (approximate)
  
  return Math.round(baseLoss * lossRate * estimatedUnitValue)
}

// Generate quality alerts
function generateQualityAlerts(predictions: any[], riskThreshold: number) {
  const alerts: any[] = []

  predictions.forEach(prediction => {
    if (prediction.qualityRisk > riskThreshold) {
      alerts.push({
        itemId: prediction.itemId,
        itemType: prediction.itemType,
        severity: prediction.riskLevel === 'high' ? 'critical' : 'warning',
        riskLevel: prediction.riskLevel,
        currentQuality: prediction.currentQualityScore,
        predictedQuality: prediction.predictedQualityScore,
        qualityRisk: prediction.qualityRisk,
        estimatedLoss: prediction.estimatedLoss,
        message: generateAlertMessage(prediction),
        actionRequired: generateActionRequired(prediction)
      })
    }
  })

  return alerts.sort((a, b) => b.qualityRisk - a.qualityRisk)
}

// Generate alert message
function generateAlertMessage(prediction: any): string {
  const riskPercentage = Math.round(prediction.qualityRisk * 100)
  const itemType = prediction.itemType

  if (prediction.riskLevel === 'high') {
    return `High quality risk (${riskPercentage}%) detected for ${itemType} item ${prediction.itemId}`
  } else {
    return `Medium quality risk (${riskPercentage}%) detected for ${itemType} item ${prediction.itemId}`
  }
}

// Generate required actions
function generateActionRequired(prediction: any): string[] {
  const actions: string[] = []

  if (prediction.qualityRisk > 0.5) {
    actions.push('Immediate quality inspection required')
  }

  if (prediction.itemType === 'production' && prediction.qualityRisk > 0.3) {
    actions.push('Monitor temperature and preparation conditions')
  }

  if (prediction.itemType === 'inventory' && prediction.qualityRisk > 0.3) {
    actions.push('Check expiry dates and storage conditions')
  }

  if (prediction.itemType === 'distribution' && prediction.qualityRisk > 0.3) {
    actions.push('Verify delivery timeline and transport conditions')
  }

  if (prediction.estimatedLoss > 500000) { // > 500k IDR
    actions.push('Consider preventive measures to reduce potential loss')
  }

  return actions
}

// Generate quality recommendations
function generateQualityRecommendations(predictions: any[]) {
  const recommendations: any[] = []

  // High risk items recommendation
  const highRiskItems = predictions.filter(p => p.riskLevel === 'high')
  if (highRiskItems.length > 0) {
    recommendations.push({
      type: 'quality_risk',
      priority: 'high',
      title: 'Address High Quality Risk Items',
      description: `${highRiskItems.length} items have high quality risk. Immediate action required.`,
      affectedItems: highRiskItems.length,
      potentialLoss: highRiskItems.reduce((sum, item) => sum + (item.estimatedLoss || 0), 0)
    })
  }

  // Environmental monitoring recommendation
  const environmentallyAffected = predictions.filter(p => 
    p.factors?.environmental && (p.factors.environmental.riskIncrease > 0.05)
  )
  if (environmentallyAffected.length > 0) {
    recommendations.push({
      type: 'environmental',
      priority: 'medium',
      title: 'Enhance Environmental Monitoring',
      description: 'Environmental conditions are affecting quality. Consider improved monitoring and controls.',
      affectedItems: environmentallyAffected.length
    })
  }

  // Process improvement recommendation
  const productionIssues = predictions.filter(p => 
    p.itemType === 'production' && p.qualityRisk > 0.2
  )
  if (productionIssues.length > 0) {
    recommendations.push({
      type: 'process_improvement',
      priority: 'medium',
      title: 'Optimize Production Processes',
      description: 'Production quality can be improved through process optimization.',
      affectedItems: productionIssues.length
    })
  }

  return recommendations
}
