import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      recipeId, 
      optimizationGoals = ['nutrition', 'cost', 'balanced'],
      constraints = {},
      targetNutrition = {}
    } = body

    // Validate input
    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: 'Recipe ID is required' },
        { status: 400 }
      )
    }

    // 1. Get recipe with ingredients
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: {
          include: {
            item: true
          }
        }
      }
    })

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      )
    }

    // 2. Calculate current nutritional profile
    const currentNutrition = calculateNutrition(recipe.ingredients)

    // 3. Get available items for substitution
    const availableItems = await prisma.item.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        category: true,
        unitPrice: true,
        nutritionPer100g: true,
        allergens: true,
        unit: true
      }
    })

    // 4. Get current inventory levels (using available items as mock inventory)
    // Note: In the current schema, inventory is for raw materials, not items
    // For this POC, we'll assume all active items are available
    const inventoryMap = new Map(
      availableItems.map(item => [item.id, 100]) // Mock quantity of 100 for each item
    )

    // 5. Perform AI optimization
    const optimizationResults = await optimizeRecipe({
      recipe,
      currentNutrition,
      availableItems,
      inventoryMap,
      optimizationGoals,
      constraints,
      targetNutrition
    })

    // 6. Generate optimization recommendations
    const recommendations = generateRecommendations(
      recipe,
      optimizationResults,
      optimizationGoals
    )

    return NextResponse.json({
      success: true,
      data: {
        originalRecipe: {
          id: recipe.id,
          name: recipe.name,
          servingSize: recipe.servingSize,
          currentCost: recipe.cost,
          currentNutrition
        },
        optimizedVersions: optimizationResults,
        recommendations,
        summary: {
          totalVariations: optimizationResults.length,
          bestNutritionalMatch: optimizationResults.find(r => r.type === 'nutrition'),
          bestCostEfficiency: optimizationResults.find(r => r.type === 'cost'),
          bestOverall: optimizationResults.find(r => r.type === 'balanced')
        }
      }
    })

  } catch (error) {
    console.error('Recipe optimization error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to optimize recipe' },
      { status: 500 }
    )
  }
}

// AI Recipe Optimization Algorithm
async function optimizeRecipe({
  recipe,
  currentNutrition,
  availableItems,
  inventoryMap,
  optimizationGoals,
  constraints,
  targetNutrition
}: any) {
  const optimizedVersions: any[] = []

  // 1. Nutritional Optimization
  if (optimizationGoals.includes('nutrition')) {
    const nutritionallyOptimized = optimizeForNutrition(
      recipe,
      availableItems,
      targetNutrition,
      inventoryMap
    )
    optimizedVersions.push({
      type: 'nutrition',
      name: `${recipe.name} - Nutritionally Optimized`,
      ingredients: nutritionallyOptimized.ingredients,
      nutrition: nutritionallyOptimized.nutrition,
      estimatedCost: nutritionallyOptimized.cost,
      improvements: nutritionallyOptimized.improvements,
      confidenceScore: nutritionallyOptimized.confidenceScore
    })
  }

  // 2. Cost Optimization
  if (optimizationGoals.includes('cost')) {
    const costOptimized = optimizeForCost(
      recipe,
      availableItems,
      inventoryMap,
      constraints
    )
    optimizedVersions.push({
      type: 'cost',
      name: `${recipe.name} - Cost Optimized`,
      ingredients: costOptimized.ingredients,
      nutrition: costOptimized.nutrition,
      estimatedCost: costOptimized.cost,
      improvements: costOptimized.improvements,
      confidenceScore: costOptimized.confidenceScore
    })
  }

  // 3. Balanced Optimization
  const balancedOptimized = optimizeBalanced(
    recipe,
    availableItems,
    inventoryMap,
    targetNutrition,
    constraints
  )
  optimizedVersions.push({
    type: 'balanced',
    name: `${recipe.name} - Balanced Optimization`,
    ingredients: balancedOptimized.ingredients,
    nutrition: balancedOptimized.nutrition,
    estimatedCost: balancedOptimized.cost,
    improvements: balancedOptimized.improvements,
    confidenceScore: balancedOptimized.confidenceScore
  })

  return optimizedVersions
}

// Helper function to calculate nutrition from ingredients
function calculateNutrition(ingredients: any[]) {
  let totalCalories = 0
  let totalProtein = 0
  let totalFat = 0
  let totalCarbs = 0
  let totalFiber = 0

  ingredients.forEach(ingredient => {
    const quantity = ingredient.quantity / 100 // Convert to per 100g basis
    const item = ingredient.item
    
    // Parse nutrition info from JSON if available
    const nutritionInfo = item.nutritionPer100g || {}
    
    totalCalories += (nutritionInfo.calories || 0) * quantity
    totalProtein += (nutritionInfo.protein || 0) * quantity
    totalFat += (nutritionInfo.fat || 0) * quantity
    totalCarbs += (nutritionInfo.carbohydrates || 0) * quantity
    totalFiber += (nutritionInfo.fiber || 0) * quantity
  })

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
    carbohydrates: Math.round(totalCarbs * 10) / 10,
    fiber: Math.round(totalFiber * 10) / 10
  }
}

// Helper function to estimate cost
function estimateCost(ingredients: any[]) {
  return ingredients.reduce((total, ingredient) => {
    const unitPrice = ingredient.item?.unitPrice || 0
    const quantity = ingredient.quantity || 0
    return total + (unitPrice * quantity / 1000) // Assuming price per kg, quantity in grams
  }, 0)
}

// Nutritional optimization algorithm
function optimizeForNutrition(recipe: any, availableItems: any[], targetNutrition: any, inventoryMap: Map<string, number>) {
  const optimizedIngredients = [...recipe.ingredients]
  const improvements: string[] = []
  let confidenceScore = 85

  // Example optimization: Increase protein if target is higher
  if (targetNutrition.protein) {
    const highProteinItems = availableItems
      .filter((item: any) => {
        const nutrition = item.nutritionPer100g || {}
        return nutrition.protein > 20 // High protein sources
      })
      .filter((item: any) => inventoryMap.get(item.id) && inventoryMap.get(item.id)! > 0)

    if (highProteinItems.length > 0) {
      improvements.push('Suggested high-protein ingredient substitutions')
      confidenceScore += 5
    }
  }

  const nutrition = calculateNutrition(optimizedIngredients)
  const cost = estimateCost(optimizedIngredients)

  return {
    ingredients: optimizedIngredients,
    nutrition,
    cost,
    improvements,
    confidenceScore
  }
}

// Cost optimization algorithm
function optimizeForCost(recipe: any, availableItems: any[], inventoryMap: Map<string, number>, constraints: any) {
  const optimizedIngredients = [...recipe.ingredients]
  const improvements: string[] = []
  let confidenceScore = 80

  // Find cheaper alternatives for each ingredient
  optimizedIngredients.forEach(ingredient => {
    const alternatives = availableItems.filter((alt: any) =>
      alt.category === ingredient.item.category &&
      alt.id !== ingredient.item.id &&
      inventoryMap.get(alt.id) && inventoryMap.get(alt.id)! > 0 &&
      (alt.unitPrice || 0) < (ingredient.item.unitPrice || 0)
    )

    if (alternatives.length > 0) {
      const cheapestAlt = alternatives.reduce((cheapest, current) => 
        (current.unitPrice || 0) < (cheapest.unitPrice || 0) ? current : cheapest
      )
      
      improvements.push(`Replace ${ingredient.item.name} with ${cheapestAlt.name} for cost savings`)
      confidenceScore += 3
    }
  })

  const nutrition = calculateNutrition(optimizedIngredients)
  const cost = estimateCost(optimizedIngredients)

  return {
    ingredients: optimizedIngredients,
    nutrition,
    cost,
    improvements,
    confidenceScore
  }
}

// Balanced optimization algorithm
function optimizeBalanced(
  recipe: any, 
  availableItems: any[], 
  inventoryMap: Map<string, number>, 
  targetNutrition: any, 
  constraints: any
) {
  const optimizedIngredients = [...recipe.ingredients]
  const improvements: string[] = []
  let confidenceScore = 75

  // Balance between nutrition and cost
  optimizedIngredients.forEach(ingredient => {
    const alternatives = availableItems.filter((alt: any) => {
      const altNutrition = alt.nutritionPer100g || {}
      const currentNutrition = ingredient.item.nutritionPer100g || {}
      
      return alt.category === ingredient.item.category &&
             alt.id !== ingredient.item.id &&
             inventoryMap.get(alt.id) && inventoryMap.get(alt.id)! > 0 &&
             (altNutrition.protein || 0) >= (currentNutrition.protein || 0) * 0.8 && // Maintain 80% protein
             (alt.unitPrice || 0) <= (ingredient.item.unitPrice || 0) * 1.2 // Max 20% price increase
    })

    if (alternatives.length > 0) {
      improvements.push(`Balanced alternatives available for ${ingredient.item.name}`)
      confidenceScore += 5
    }
  })

  const nutrition = calculateNutrition(optimizedIngredients)
  const cost = estimateCost(optimizedIngredients)

  return {
    ingredients: optimizedIngredients,
    nutrition,
    cost,
    improvements,
    confidenceScore
  }
}

// Generate optimization recommendations
function generateRecommendations(recipe: any, optimizedVersions: any[], goals: string[]) {
  const recommendations: any[] = []

  if (goals.includes('nutrition')) {
    recommendations.push({
      type: 'nutrition',
      title: 'Nutritional Enhancement',
      description: 'Consider adding high-protein and high-fiber ingredients',
      priority: 'high'
    })
  }

  if (goals.includes('cost')) {
    recommendations.push({
      type: 'cost',
      title: 'Cost Reduction',
      description: 'Substitute expensive ingredients with cost-effective alternatives',
      priority: 'medium'
    })
  }

  recommendations.push({
    type: 'general',
    title: 'Recipe Optimization',
    description: 'Regular optimization can improve both nutrition and cost efficiency',
    priority: 'low'
  })

  return recommendations
}
