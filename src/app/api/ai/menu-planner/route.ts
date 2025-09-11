import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:create'
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

    console.log('🤖 AI Menu Planner - Starting request processing...')
    
    const body = await request.json()
    console.log('📊 Request body:', body)
    
    const { 
      plannerId,
      planningPeriod = 7, // days
      targetSchools = [], // specific schools or all
      nutritionalGoals = {},
      budgetConstraints = {},
      preferences = {},
      includeDiversityOptimization = true
    } = body

    // Validate planner ID
    if (!plannerId) {
      console.error('❌ Planner ID is required')
      return NextResponse.json(
        { success: false, error: 'Planner ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Getting available recipes...')
    // 1. Get available recipes with nutritional data
    const availableRecipes = await getAvailableRecipes()
    console.log(`✅ Found ${availableRecipes.length} available recipes`)

    console.log('🏫 Getting schools data...')
    // 2. Get schools and their requirements
    const targetSchoolsData = await getSchoolsData(targetSchools)
    console.log(`✅ Found ${targetSchoolsData.length} schools`)

    console.log('📦 Getting inventory data...')
    // 3. Get current inventory and costs
    const inventoryData = await getInventoryForPlanning()
    console.log(`✅ Found ${inventoryData.length} inventory items`)

    console.log('🎯 Generating optimized menu plans...')
    // 4. Generate AI-optimized menu plans
    const menuPlans = await generateOptimizedMenuPlans({
      availableRecipes,
      targetSchools: targetSchoolsData,
      inventoryData,
      planningPeriod,
      nutritionalGoals,
      budgetConstraints,
      preferences,
      includeDiversityOptimization
    })
    console.log(`✅ Generated ${menuPlans.length} menu plans`)

    console.log('🥗 Analyzing nutrition...')
    // 5. Generate nutritional analysis
    const nutritionalAnalysis = analyzeMenuNutrition(menuPlans)

    console.log('💰 Analyzing costs...')
    // 6. Generate cost analysis
    const costAnalysis = analyzeMenuCosts(menuPlans, inventoryData)

    // 7. Generate recommendations
    const recommendations = generateMenuRecommendations({
      menuPlans,
      nutritionalAnalysis,
      costAnalysis
    })

    return NextResponse.json({
      success: true,
      data: {
        planningPeriod,
        menuPlans: menuPlans.map(plan => ({
          day: plan.day,
          schoolName: plan.schoolName,
          totalCost: plan.totalCost,
          plannedMeals: plan.plannedMeals,
          costPerMeal: plan.costPerMeal,
          recipes: plan.selectedRecipes?.map((recipe: any) => ({
            id: recipe.id,
            name: recipe.name,
            description: recipe.description || '',
            category: recipe.category || 'main',
            servingSize: recipe.servingSize || 1,
            nutritionInfo: recipe.nutritionInfo || {},
            cost: recipe.cost || 0,
            estimatedCost: recipe.estimatedCost || recipe.cost || 0,
            complexity: recipe.complexity || 'medium',
            preparationTime: recipe.preparationTime || recipe.prepTime || 30
          })) || [],
          efficiency: plan.efficiency
        })),
        nutritionalAnalysis: {
          averageCalories: nutritionalAnalysis.dailyAverages.calories,
          averageProtein: nutritionalAnalysis.dailyAverages.protein,
          averageCarbs: nutritionalAnalysis.dailyAverages.carbohydrates,
          averageFat: nutritionalAnalysis.dailyAverages.fat,
          averageFiber: nutritionalAnalysis.dailyAverages.fiber,
          overallCompliance: nutritionalAnalysis.overallCompliance,
          complianceByDay: nutritionalAnalysis.complianceByDay,
          nutritionalTrends: nutritionalAnalysis.nutritionalTrends
        },
        costAnalysis: {
          averageCostPerMeal: costAnalysis.averageCostPerMeal,
          totalBudgetUsed: costAnalysis.totalCost,
          budgetEfficiency: Math.min(costAnalysis.averageCostPerMeal / 35000, 1), // Assume target 35k per meal
          costByDay: costAnalysis.costByDay,
          costTrends: costAnalysis.costByDay.slice(0, 20).map((day, index) => ({
            day: day.day,
            cost: day.costPerMeal,
            trend: index > 0 ? 
              (day.costPerMeal > costAnalysis.costByDay[index-1].costPerMeal ? 'up' : 'down') : 'stable'
          }))
        },
        recommendations,
        summary: {
          totalSchools: targetSchoolsData.length,
          totalMenuPlans: menuPlans.length,
          totalMeals: menuPlans.reduce((sum, plan) => sum + (plan.plannedMeals || 0), 0),
          averageCostPerMeal: costAnalysis.averageCostPerMeal,
          nutritionalCompliance: nutritionalAnalysis.overallCompliance,
          diversityScore: calculateOverallDiversityScore(menuPlans),
          feasibilityScore: menuPlans.reduce((sum, plan) => sum + (plan.feasibilityScore || 0), 0) / Math.max(menuPlans.length, 1),
          planningPeriod,
          dateRange: {
            start: new Date().toLocaleDateString('id-ID'),
            end: new Date(Date.now() + (planningPeriod - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID')
          },
          totalRecipesUsed: new Set(menuPlans.flatMap(plan => plan.selectedRecipes?.map((r: any) => r.id) || [])).size,
          averagePreparationTime: menuPlans.reduce((sum, plan) => {
            const avgTime = plan.selectedRecipes?.reduce((timeSum: number, recipe: any) => 
              timeSum + (recipe.prepTime || 0) + (recipe.cookTime || 0), 0) / Math.max(plan.selectedRecipes?.length || 1, 1)
            return sum + (avgTime || 0)
          }, 0) / Math.max(menuPlans.length, 1)
        }
      }
    })

  } catch (error) {
    console.error('❌ Menu planning error:', error)
    
    // Log specific error details
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate menu plans',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get available recipes with nutritional information
async function getAvailableRecipes() {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        isActive: true
      },
      include: {
        ingredients: {
          include: {
            item: true
          }
        }
      }
    })

    // Calculate nutritional info for each recipe
    return recipes.map(recipe => ({
      ...recipe,
      calculatedNutrition: calculateRecipeNutrition(recipe.ingredients),
      estimatedCost: calculateRecipeCost(recipe.ingredients),
      complexity: calculateRecipeComplexity(recipe),
      preparationTime: recipe.prepTime + recipe.cookTime
    }))
  } catch (error) {
    console.error('❌ Error getting available recipes:', error)
    throw new Error('Failed to fetch available recipes')
  }
}

// Calculate nutritional information for a recipe
function calculateRecipeNutrition(ingredients: any[]) {
  let totalCalories = 0
  let totalProtein = 0
  let totalFat = 0
  let totalCarbs = 0
  let totalFiber = 0

  ingredients.forEach(ingredient => {
    const nutrition = ingredient.item.nutritionPer100g || {}
    const quantity = ingredient.quantity / 100 // Convert to per 100g

    totalCalories += (nutrition.calories || 0) * quantity
    totalProtein += (nutrition.protein || 0) * quantity
    totalFat += (nutrition.fat || 0) * quantity
    totalCarbs += (nutrition.carbohydrates || 0) * quantity
    totalFiber += (nutrition.fiber || 0) * quantity
  })

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
    carbohydrates: Math.round(totalCarbs * 10) / 10,
    fiber: Math.round(totalFiber * 10) / 10
  }
}

// Calculate estimated cost for a recipe
function calculateRecipeCost(ingredients: any[]) {
  return ingredients.reduce((total, ingredient) => {
    const unitPrice = ingredient.item?.unitPrice || 0
    const quantity = ingredient.quantity || 0
    return total + (unitPrice * quantity / 1000) // Assuming price per kg, quantity in grams
  }, 0)
}

// Calculate recipe complexity score
function calculateRecipeComplexity(recipe: any): number {
  let complexity = 1 // Base complexity

  // More ingredients = higher complexity
  complexity += recipe.ingredients.length * 0.1

  // Longer prep/cook time = higher complexity
  complexity += (recipe.prepTime + recipe.cookTime) / 60

  // Recipe difficulty
  const difficultyMultiplier = {
    'EASY': 1,
    'MEDIUM': 1.5,
    'HARD': 2
  }
  complexity *= (difficultyMultiplier as any)[recipe.difficulty] || 1

  return Math.min(complexity, 5) // Cap at 5
}

// Get schools data and requirements
async function getSchoolsData(targetSchools: string[]) {
  const whereClause = targetSchools.length > 0 && !targetSchools.includes('default')
    ? { id: { in: targetSchools } }
    : {} // Get all schools if no specific target or if 'default' is specified

  const schools = await prisma.school.findMany({
    where: whereClause,
    include: {
      classes: true,
      students: true
    }
  })

  return schools.map(school => ({
    ...school,
    totalStudents: school.students.length, // Use direct students relation
    estimatedMealsPerDay: school.students.length, // Same as totalStudents
    nutritionalRequirements: getSchoolNutritionalRequirements(school)
  }))
}

// Get nutritional requirements for a school (based on student age groups)
function getSchoolNutritionalRequirements(school: any) {
  // Default nutritional requirements for school meals
  return {
    caloriesPerMeal: 550, // Average for school-age children
    proteinMin: 15, // grams
    fatMax: 20, // grams  
    carbohydratesMin: 60, // grams
    fiberMin: 5, // grams
    maxSodium: 600 // mg
  }
}

// Get inventory data for planning
async function getInventoryForPlanning() {
  // Since we don't have item inventory in schema, create mock data
  const items = await prisma.item.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      category: true,
      unitPrice: true,
      unit: true
    }
  })

  return items.map(item => ({
    ...item,
    availableQuantity: Math.floor(Math.random() * 500) + 100, // Mock 100-600 units
    costPerUnit: item.unitPrice || 0,
    freshnessRating: Math.floor(Math.random() * 5) + 1 // 1-5 rating
  }))
}

// AI-powered menu planning algorithm
async function generateOptimizedMenuPlans({
  availableRecipes,
  targetSchools,
  inventoryData,
  planningPeriod,
  nutritionalGoals,
  budgetConstraints,
  preferences,
  includeDiversityOptimization
}: any) {
  const menuPlans: any[] = []

  for (const school of targetSchools) {
    for (let day = 0; day < planningPeriod; day++) {
      const dayPlan = await optimizeDayMenu({
        school,
        day,
        availableRecipes,
        inventoryData,
        nutritionalGoals: { ...getSchoolNutritionalRequirements(school), ...nutritionalGoals },
        budgetConstraints,
        preferences,
        includeDiversityOptimization,
        previousDays: menuPlans.filter(p => p.schoolId === school.id && p.day < day)
      })

      menuPlans.push({
        id: `${school.id}-day${day}`,
        schoolId: school.id,
        schoolName: school.name,
        day: day + 1,
        date: new Date(Date.now() + day * 24 * 60 * 60 * 1000),
        plannedMeals: school.estimatedMealsPerDay,
        ...dayPlan
      })
    }
  }

  return menuPlans
}

// Optimize menu for a single day
async function optimizeDayMenu({
  school,
  day,
  availableRecipes,
  inventoryData,
  nutritionalGoals,
  budgetConstraints,
  preferences,
  includeDiversityOptimization,
  previousDays
}: any) {
  // Create inventory map for quick lookup
  const inventoryMap = new Map(inventoryData.map((item: any) => [item.id, item]))

  // Filter recipes based on inventory availability
  const feasibleRecipes = availableRecipes.filter((recipe: any) =>
    recipe.ingredients.every((ingredient: any) => {
      const inventoryItem = inventoryMap.get(ingredient.item.id) as any
      return inventoryItem && inventoryItem.availableQuantity >= ingredient.quantity
    })
  )

  // Score recipes based on multiple criteria
  const scoredRecipes = feasibleRecipes.map((recipe: any) => ({
    ...recipe,
    score: calculateRecipeScore({
      recipe,
      nutritionalGoals,
      budgetConstraints,
      preferences,
      previousDays,
      school
    })
  }))

  // Select optimal recipe combination
  const selectedRecipes = selectOptimalRecipeCombination({
    scoredRecipes,
    nutritionalGoals,
    budgetConstraints,
    mealsNeeded: school.estimatedMealsPerDay
  })

  return {
    selectedRecipes,
    estimatedCost: selectedRecipes.reduce((sum: number, recipe: any) => sum + (recipe.estimatedCost || 0), 0),
    nutritionalProfile: calculateCombinedNutrition(selectedRecipes),
    diversityScore: calculateDiversityScore(selectedRecipes, previousDays),
    feasibilityScore: calculateFeasibilityScore(selectedRecipes, inventoryData)
  }
}

// Calculate recipe score based on multiple criteria
function calculateRecipeScore({
  recipe,
  nutritionalGoals,
  budgetConstraints,
  preferences,
  previousDays,
  school
}: any): number {
  let score = 0

  // Nutritional scoring (40% weight)
  const nutritionScore = calculateNutritionalScore(recipe.calculatedNutrition, nutritionalGoals)
  score += nutritionScore * 0.4

  // Cost scoring (25% weight)
  const maxBudget = budgetConstraints.maxCostPerMeal || 50000 // Default 50k IDR
  const recipeCost = recipe.estimatedCost || 0
  const costScore = Math.max(0, (maxBudget - recipeCost) / maxBudget)
  score += costScore * 0.25

  // Diversity scoring (20% weight) - avoid repetition
  const diversityScore = calculateRecipeDiversityScore(recipe, previousDays)
  score += diversityScore * 0.2

  // Preference scoring (10% weight)
  const preferenceScore = calculatePreferenceScore(recipe, preferences)
  score += preferenceScore * 0.1

  // Complexity scoring (5% weight) - prefer simpler recipes
  const complexityScore = Math.max(0, (5 - recipe.complexity) / 5)
  score += complexityScore * 0.05

  return Math.min(score, 1) // Cap at 1
}

// Calculate nutritional score
function calculateNutritionalScore(nutrition: any, goals: any): number {
  let score = 0
  let criteria = 0

  // Calories
  if (goals.caloriesPerMeal) {
    const calorieScore = 1 - Math.abs(nutrition.calories - goals.caloriesPerMeal) / goals.caloriesPerMeal
    score += Math.max(0, calorieScore)
    criteria++
  }

  // Protein
  if (goals.proteinMin) {
    const proteinScore = nutrition.protein >= goals.proteinMin ? 1 : nutrition.protein / goals.proteinMin
    score += proteinScore
    criteria++
  }

  // Fat
  if (goals.fatMax) {
    const fatScore = nutrition.fat <= goals.fatMax ? 1 : Math.max(0, 2 - nutrition.fat / goals.fatMax)
    score += fatScore
    criteria++
  }

  return criteria > 0 ? score / criteria : 0.5
}

// Calculate recipe diversity score
function calculateRecipeDiversityScore(recipe: any, previousDays: any[]): number {
  if (previousDays.length === 0) return 1

  // Check how recently this recipe was used
  const recentUse = previousDays.some((day: any) => 
    day.selectedRecipes?.some((r: any) => r.id === recipe.id)
  )

  // Check category diversity
  const recentCategories = previousDays.flatMap((day: any) => 
    day.selectedRecipes?.map((r: any) => r.category) || []
  )
  const categoryOveruse = recentCategories.filter(cat => cat === recipe.category).length

  let score = 1
  if (recentUse) score -= 0.5
  if (categoryOveruse >= 2) score -= 0.3

  return Math.max(0, score)
}

// Calculate preference score
function calculatePreferenceScore(recipe: any, preferences: any): number {
  let score = 0.5 // Default neutral score

  // Preferred categories
  if (preferences.preferredCategories?.includes(recipe.category)) {
    score += 0.3
  }

  // Avoided ingredients
  if (preferences.avoidedIngredients?.length > 0) {
    const hasAvoidedIngredient = recipe.ingredients.some((ing: any) =>
      preferences.avoidedIngredients.includes(ing.item.id)
    )
    if (hasAvoidedIngredient) score -= 0.5
  }

  return Math.max(0, Math.min(1, score))
}

// Select optimal recipe combination for a meal
function selectOptimalRecipeCombination({
  scoredRecipes,
  nutritionalGoals,
  budgetConstraints,
  mealsNeeded
}: any) {
  // Validate input
  if (!scoredRecipes || !Array.isArray(scoredRecipes) || scoredRecipes.length === 0) {
    console.warn('⚠️ No scored recipes available for selection')
    return []
  }

  // Sort recipes by score
  const sortedRecipes = scoredRecipes.sort((a: any, b: any) => {
    const scoreA = a?.score || 0
    const scoreB = b?.score || 0
    return scoreB - scoreA
  })

  // Simple selection - take top recipes that fit budget
  const selected = []
  let totalCost = 0
  const maxBudget = (budgetConstraints?.maxCostPerMeal || 50000) * (mealsNeeded || 1)

  for (const recipe of sortedRecipes) {
    if (!recipe) {
      console.warn('⚠️ Undefined recipe in sorted recipes')
      continue
    }
    
    const recipeCost = recipe.estimatedCost || recipe.cost || 0
    if (totalCost + recipeCost <= maxBudget) {
      selected.push(recipe)
      totalCost += recipeCost
      
      if (selected.length >= 3) break // Limit to 3 recipes per meal
    }
  }

  return selected.length > 0 ? selected : (sortedRecipes[0] ? [sortedRecipes[0]] : [])
}

// Calculate combined nutrition for selected recipes
function calculateCombinedNutrition(recipes: any[]) {
  if (!recipes || !Array.isArray(recipes)) {
    return { calories: 0, protein: 0, fat: 0, carbohydrates: 0, fiber: 0 }
  }
  
  return recipes.reduce((total, recipe) => {
    const nutrition = recipe?.calculatedNutrition || {}
    return {
      calories: total.calories + (nutrition.calories || 0),
      protein: total.protein + (nutrition.protein || 0),
      fat: total.fat + (nutrition.fat || 0),
      carbohydrates: total.carbohydrates + (nutrition.carbohydrates || 0),
      fiber: total.fiber + (nutrition.fiber || 0)
    }
  }, { calories: 0, protein: 0, fat: 0, carbohydrates: 0, fiber: 0 })
}

// Calculate diversity score for selected recipes
function calculateDiversityScore(recipes: any[], previousDays: any[]): number {
  const categories = new Set(recipes.map(r => r.category))
  const diversityScore = categories.size / Math.max(recipes.length, 1)
  
  // Bonus for avoiding recent categories
  const recentCategories = new Set(
    previousDays.flatMap(day => day.selectedRecipes?.map((r: any) => r.category) || [])
  )
  const noveltyBonus = recipes.filter(r => !recentCategories.has(r.category)).length / recipes.length
  
  return (diversityScore + noveltyBonus) / 2
}

// Calculate feasibility score
function calculateFeasibilityScore(recipes: any[], inventoryData: any[]): number {
  const inventoryMap = new Map(inventoryData.map(item => [item.id, item]))
  
  let totalFeasibility = 0
  let totalIngredients = 0

  recipes.forEach(recipe => {
    recipe.ingredients.forEach((ingredient: any) => {
      const inventoryItem = inventoryMap.get(ingredient.item.id)
      if (inventoryItem) {
        const availability = inventoryItem.availableQuantity / Math.max(ingredient.quantity, 1)
        totalFeasibility += Math.min(availability, 1)
      }
      totalIngredients++
    })
  })

  return totalIngredients > 0 ? totalFeasibility / totalIngredients : 0
}

// Analyze nutritional content of menu plans
function analyzeMenuNutrition(menuPlans: any[]) {
  const analysis = {
    overallCompliance: 0,
    dailyAverages: { calories: 0, protein: 0, fat: 0, carbohydrates: 0, fiber: 0 },
    complianceByDay: [] as any[],
    nutritionalTrends: [] as any[]
  }

  if (menuPlans.length === 0) return analysis

  // Calculate daily compliance and averages
  let totalCompliance = 0
  const nutritionTotals = { calories: 0, protein: 0, fat: 0, carbohydrates: 0, fiber: 0 }

  menuPlans.forEach((plan, index) => {
    const nutrition = plan.nutritionalProfile
    const compliance = calculateNutritionalCompliance(nutrition)
    
    analysis.complianceByDay.push({
      day: plan.day,
      schoolName: plan.schoolName,
      compliance,
      nutrition,
      mealsPlanned: plan.plannedMeals,
      nutritionPerMeal: {
        calories: Math.round((nutrition.calories || 0) / Math.max(plan.plannedMeals, 1)),
        protein: Math.round(((nutrition.protein || 0) / Math.max(plan.plannedMeals, 1)) * 10) / 10,
        carbohydrates: Math.round(((nutrition.carbohydrates || 0) / Math.max(plan.plannedMeals, 1)) * 10) / 10,
        fat: Math.round(((nutrition.fat || 0) / Math.max(plan.plannedMeals, 1)) * 10) / 10
      }
    })

    // Add nutritional trend data
    analysis.nutritionalTrends.push({
      day: plan.day,
      schoolName: plan.schoolName,
      calories: nutrition.calories || 0,
      protein: nutrition.protein || 0,
      carbohydrates: nutrition.carbohydrates || 0,
      fat: nutrition.fat || 0,
      fiber: nutrition.fiber || 0,
      complianceScore: compliance,
      balanceScore: calculateNutritionalBalance(nutrition)
    })

    totalCompliance += compliance
    Object.keys(nutritionTotals).forEach(key => {
      nutritionTotals[key as keyof typeof nutritionTotals] += nutrition[key] || 0
    })
  })

  analysis.overallCompliance = totalCompliance / menuPlans.length
  Object.keys(nutritionTotals).forEach(key => {
    analysis.dailyAverages[key as keyof typeof analysis.dailyAverages] = 
      Math.round((nutritionTotals[key as keyof typeof nutritionTotals] / menuPlans.length) * 10) / 10
  })

  return analysis
}

// Calculate nutritional compliance score
function calculateNutritionalCompliance(nutrition: any): number {
  const targets = {
    calories: { min: 450, max: 650 },
    protein: { min: 15, max: 35 },
    fat: { min: 10, max: 25 },
    carbohydrates: { min: 60, max: 120 }
  }

  let compliance = 0
  let criteria = 0

  Object.keys(targets).forEach(key => {
    const value = nutrition[key] || 0
    const target = targets[key as keyof typeof targets]
    
    if (value >= target.min && value <= target.max) {
      compliance += 1
    } else if (value > 0) {
      // Partial compliance based on how close to range
      const distance = value < target.min ? 
        (target.min - value) / target.min :
        (value - target.max) / target.max
      compliance += Math.max(0, 1 - distance)
    }
    criteria++
  })

  return criteria > 0 ? compliance / criteria : 0
}

// Calculate nutritional balance score (macro distribution)
function calculateNutritionalBalance(nutrition: any): number {
  const totalCalories = nutrition.calories || 0
  if (totalCalories === 0) return 0

  // Calculate macro percentages
  const proteinCals = (nutrition.protein || 0) * 4
  const fatCals = (nutrition.fat || 0) * 9
  const carbCals = (nutrition.carbohydrates || 0) * 4

  const proteinPercent = (proteinCals / totalCalories) * 100
  const fatPercent = (fatCals / totalCalories) * 100
  const carbPercent = (carbCals / totalCalories) * 100

  // Ideal ranges for school meals
  const idealRanges = {
    protein: { min: 15, max: 25 }, // 15-25% of calories
    fat: { min: 25, max: 35 },     // 25-35% of calories
    carb: { min: 45, max: 65 }     // 45-65% of calories
  }

  let balanceScore = 0
  let criteria = 0

  // Score protein balance
  if (proteinPercent >= idealRanges.protein.min && proteinPercent <= idealRanges.protein.max) {
    balanceScore += 1
  } else {
    const proteinDistance = proteinPercent < idealRanges.protein.min ?
      (idealRanges.protein.min - proteinPercent) / idealRanges.protein.min :
      (proteinPercent - idealRanges.protein.max) / idealRanges.protein.max
    balanceScore += Math.max(0, 1 - proteinDistance)
  }
  criteria++

  // Score fat balance
  if (fatPercent >= idealRanges.fat.min && fatPercent <= idealRanges.fat.max) {
    balanceScore += 1
  } else {
    const fatDistance = fatPercent < idealRanges.fat.min ?
      (idealRanges.fat.min - fatPercent) / idealRanges.fat.min :
      (fatPercent - idealRanges.fat.max) / idealRanges.fat.max
    balanceScore += Math.max(0, 1 - fatDistance)
  }
  criteria++

  // Score carb balance
  if (carbPercent >= idealRanges.carb.min && carbPercent <= idealRanges.carb.max) {
    balanceScore += 1
  } else {
    const carbDistance = carbPercent < idealRanges.carb.min ?
      (idealRanges.carb.min - carbPercent) / idealRanges.carb.min :
      (carbPercent - idealRanges.carb.max) / idealRanges.carb.max
    balanceScore += Math.max(0, 1 - carbDistance)
  }
  criteria++

  return criteria > 0 ? balanceScore / criteria : 0
}

// Analyze menu costs
function analyzeMenuCosts(menuPlans: any[], inventoryData: any[]) {
  const totalCost = menuPlans.reduce((sum, plan) => sum + (plan.estimatedCost || 0), 0)
  const totalMeals = menuPlans.reduce((sum, plan) => sum + (plan.plannedMeals || 0), 0)
  const averageCostPerMeal = totalMeals > 0 ? totalCost / totalMeals : 0

  // Calculate cost efficiency metrics
  const costByDay = menuPlans.map(plan => ({
    day: plan.day,
    schoolName: plan.schoolName,
    totalCost: plan.estimatedCost || 0,
    plannedMeals: plan.plannedMeals || 0,
    costPerMeal: (plan.plannedMeals || 0) > 0 ? (plan.estimatedCost || 0) / (plan.plannedMeals || 0) : 0,
    recipes: plan.selectedRecipes || [],
    efficiency: calculateCostEfficiency(plan)
  }))

  // Calculate cost trends
  const costTrends = costByDay.map((day, index) => {
    const previousDay = index > 0 ? costByDay[index - 1] : null
    const trend = previousDay ? 
      (day.costPerMeal > previousDay.costPerMeal ? 'increase' : 
       day.costPerMeal < previousDay.costPerMeal ? 'decrease' : 'stable') : 'baseline'
    
    return {
      day: day.day,
      schoolName: day.schoolName,
      costPerMeal: day.costPerMeal,
      trend,
      variance: previousDay ? 
        Math.abs(day.costPerMeal - previousDay.costPerMeal) / Math.max(previousDay.costPerMeal, 1) : 0
    }
  })

  // Calculate budget utilization
  const targetBudgetPerMeal = 35000 // Target 35k IDR per meal
  const budgetUtilization = averageCostPerMeal / targetBudgetPerMeal
  const budgetEfficiency = Math.max(0, Math.min(1, (targetBudgetPerMeal - averageCostPerMeal) / targetBudgetPerMeal + 0.5))

  return {
    totalCost,
    averageCostPerMeal,
    costByDay,
    costTrends,
    budgetUtilization,
    budgetEfficiency,
    costAnalysis: {
      lowestCostMeal: Math.min(...costByDay.map(d => d.costPerMeal)),
      highestCostMeal: Math.max(...costByDay.map(d => d.costPerMeal)),
      costVariance: calculateCostVariance(costByDay),
      savingsOpportunity: Math.max(0, averageCostPerMeal - 30000) // Potential savings vs 30k target
    }
  }
}

// Calculate cost efficiency for a menu plan
function calculateCostEfficiency(plan: any): number {
  const costPerMeal = (plan.plannedMeals || 0) > 0 ? (plan.estimatedCost || 0) / (plan.plannedMeals || 0) : 0
  const targetCost = 35000 // Target cost per meal
  
  if (costPerMeal === 0) return 0
  if (costPerMeal <= targetCost) {
    return 1 - (costPerMeal / targetCost) + 0.5 // Bonus for being under budget
  } else {
    return Math.max(0, 1 - ((costPerMeal - targetCost) / targetCost))
  }
}

// Calculate cost variance across days
function calculateCostVariance(costByDay: any[]): number {
  if (costByDay.length === 0) return 0
  
  const costs = costByDay.map(d => d.costPerMeal)
  const average = costs.reduce((sum, cost) => sum + cost, 0) / costs.length
  const variance = costs.reduce((sum, cost) => sum + Math.pow(cost - average, 2), 0) / costs.length
  
  return Math.sqrt(variance) // Standard deviation
}

// Calculate overall diversity score
function calculateOverallDiversityScore(menuPlans: any[]): number {
  if (menuPlans.length === 0) return 0

  const allRecipes = menuPlans.flatMap(plan => plan.selectedRecipes || [])
  const uniqueRecipes = new Set(allRecipes.map(r => r.id))
  const categories = new Set(allRecipes.map(r => r.category))

  const recipeVariety = uniqueRecipes.size / Math.max(allRecipes.length, 1)
  const categoryVariety = categories.size / Math.max(allRecipes.length, 1)

  return (recipeVariety + categoryVariety) / 2
}

// Generate menu recommendations
function generateMenuRecommendations({
  menuPlans,
  nutritionalAnalysis,
  costAnalysis
}: any) {
  const recommendations: any[] = []

  // Nutritional recommendations
  if (nutritionalAnalysis.overallCompliance < 0.8) {
    recommendations.push({
      type: 'nutrition',
      priority: 'high',
      title: 'Improve Nutritional Balance',
      description: `Menu plans show ${Math.round((1-nutritionalAnalysis.overallCompliance) * 100)}% nutritional compliance gap. Critical areas need immediate attention.`,
      actionItems: [
        `Increase protein content to meet minimum 15g per meal (current: ${Math.round(nutritionalAnalysis.dailyAverages.protein)}g)`,
        `Balance carbohydrate intake within 60-120g range (current: ${Math.round(nutritionalAnalysis.dailyAverages.carbohydrates)}g)`,
        `Add more fiber-rich vegetables and whole grains`,
        'Consider fortified ingredients for micronutrient enhancement'
      ],
      impact: 'high',
      estimatedImprovement: '25-30% compliance increase'
    })
  }

  // Cost optimization recommendations
  if (costAnalysis.averageCostPerMeal > 40000) {
    recommendations.push({
      type: 'cost',
      priority: 'high',
      title: 'Urgent Cost Optimization Required',
      description: `Average meal cost of ${Math.round(costAnalysis.averageCostPerMeal).toLocaleString('id-ID')} IDR exceeds target by ${Math.round(((costAnalysis.averageCostPerMeal - 35000) / 35000) * 100)}%.`,
      actionItems: [
        'Substitute expensive proteins with cost-effective alternatives (tofu, tempeh)',
        'Implement bulk purchasing strategies for staple ingredients',
        'Optimize portion sizes while maintaining nutritional value',
        'Source local seasonal vegetables to reduce costs'
      ],
      impact: 'high',
      estimatedSavings: `${Math.round(costAnalysis.averageCostPerMeal - 35000).toLocaleString('id-ID')} IDR per meal`
    })
  } else if (costAnalysis.averageCostPerMeal > 35000) {
    recommendations.push({
      type: 'cost',
      priority: 'medium',
      title: 'Cost Optimization Opportunity',
      description: `Meal costs slightly above target. Focus on efficiency improvements.`,
      actionItems: [
        'Review ingredient sourcing for better pricing',
        'Optimize recipe combinations for cost-effectiveness',
        'Consider seasonal menu adjustments'
      ],
      impact: 'medium',
      estimatedSavings: `${Math.round(costAnalysis.averageCostPerMeal - 30000).toLocaleString('id-ID')} IDR potential savings per meal`
    })
  }

  // Diversity recommendations
  const diversityScore = calculateOverallDiversityScore(menuPlans)
  if (diversityScore < 0.6) {
    recommendations.push({
      type: 'variety',
      priority: diversityScore < 0.4 ? 'high' : 'medium',
      title: 'Enhance Menu Diversity',
      description: `Menu diversity score of ${Math.round(diversityScore * 100)}% indicates limited variety. Students need more engaging meal options.`,
      actionItems: [
        'Introduce recipes from different food categories',
        'Rotate protein sources more frequently (fish, poultry, legumes)',
        'Add culturally diverse dishes to maintain student interest',
        'Implement weekly theme-based menus (e.g., Traditional Monday, Healthy Tuesday)'
      ],
      impact: 'medium',
      estimatedImprovement: `${Math.round((0.8 - diversityScore) * 100)}% diversity increase potential`
    })
  }

  // Quality and feasibility recommendations
  const avgFeasibility = menuPlans.reduce((sum: number, plan: any) => sum + (plan.feasibilityScore || 0), 0) / menuPlans.length
  if (avgFeasibility < 0.7) {
    recommendations.push({
      type: 'operations',
      priority: 'high',
      title: 'Improve Operational Feasibility',
      description: `Low feasibility score (${Math.round(avgFeasibility * 100)}%) indicates potential execution challenges.`,
      actionItems: [
        'Review ingredient availability and supply chain reliability',
        'Simplify complex recipes for mass production',
        'Ensure adequate kitchen equipment and staff capacity',
        'Implement buffer stock management for critical ingredients'
      ],
      impact: 'high',
      estimatedImprovement: 'Reduce preparation time by 20-30%'
    })
  }

  // Seasonal and sustainability recommendations
  recommendations.push({
    type: 'sustainability',
    priority: 'low',
    title: 'Enhance Sustainability Practices',
    description: 'Implement environmentally conscious menu planning practices.',
    actionItems: [
      'Prioritize locally sourced ingredients',
      'Include more plant-based protein options',
      'Plan menus around seasonal produce availability',
      'Minimize food waste through accurate portion planning'
    ],
    impact: 'low',
    estimatedBenefit: 'Long-term cost reduction and environmental impact'
  })

  // Nutrition education recommendations
  if (nutritionalAnalysis.overallCompliance > 0.8) {
    recommendations.push({
      type: 'education',
      priority: 'low',
      title: 'Nutrition Education Enhancement',
      description: 'Leverage well-balanced menus for educational opportunities.',
      actionItems: [
        'Create educational materials about meal nutritional benefits',
        'Implement "Ingredient of the Week" program',
        'Engage students in understanding balanced nutrition',
        'Share nutritional success stories with parents'
      ],
      impact: 'low',
      estimatedBenefit: 'Increased student engagement and nutritional awareness'
    })
  }

  return recommendations.slice(0, 6) // Limit to top 6 recommendations
}
