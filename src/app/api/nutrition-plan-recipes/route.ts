import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const nutritionPlanId = searchParams.get('nutritionPlanId')
    const recipeId = searchParams.get('recipeId')
    const mealTime = searchParams.get('mealTime')
    const frequency = searchParams.get('frequency')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (nutritionPlanId) {
      where.nutritionPlanId = nutritionPlanId
    }

    if (recipeId) {
      where.recipeId = recipeId
    }

    if (mealTime) {
      where.mealTime = mealTime
    }

    if (frequency) {
      where.frequency = frequency
    }

    // Get nutrition plan recipes with relations
    const nutritionPlanRecipes = await prisma.nutritionPlanRecipe.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        nutritionPlan: {
          select: {
            id: true,
            planName: true,
            status: true,
            startDate: true,
            endDate: true,
            participant: {
              select: {
                id: true,
                name: true,
                gender: true,
                participantType: true,
              }
            }
          }
        },
        recipe: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            servingSize: true,
            prepTime: true,
            cookTime: true,
            nutritionInfo: true,
            allergenInfo: true,
          }
        }
      }
    })

    // Get total count
    const total = await prisma.nutritionPlanRecipe.count({ where })

    // Calculate additional metrics for each plan recipe
    const planRecipesWithMetrics = nutritionPlanRecipes.map((planRecipe: any) => {
      // Parse nutrition info from JSON
      const nutritionInfo = planRecipe.recipe.nutritionInfo 
        ? (typeof planRecipe.recipe.nutritionInfo === 'string' 
           ? JSON.parse(planRecipe.recipe.nutritionInfo) 
           : planRecipe.recipe.nutritionInfo) 
        : {}

      // Calculate adjusted nutrition based on portion size
      const portionMultiplier = parseFloat(planRecipe.portionSize?.toString() || '1')
      const adjustedNutrition = {
        calories: (nutritionInfo.calories || 0) * portionMultiplier,
        protein: (nutritionInfo.protein || 0) * portionMultiplier,
        fat: (nutritionInfo.fat || 0) * portionMultiplier,
        carbs: (nutritionInfo.carbs || 0) * portionMultiplier
      }

      // Calculate total preparation time
      const totalPrepTime = (planRecipe.recipe.prepTime || 0) + (planRecipe.recipe.cookTime || 0)

      // Check if plan is active
      const isActivePlan = planRecipe.nutritionPlan.status === 'ACTIVE'

      // Check if there are allergen warnings
      const hasAllergens = planRecipe.recipe.allergenInfo && planRecipe.recipe.allergenInfo.length > 0

      return {
        ...planRecipe,
        adjustedNutrition,
        totalPrepTime,
        isActivePlan,
        hasAllergens,
        portionMultiplier,
        frequencyType: planRecipe.frequency.toUpperCase(),
        mealCategory: planRecipe.mealTime
      }
    })

    return NextResponse.json({
      success: true,
      data: planRecipesWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalPlanRecipes: total,
        activePlans: planRecipesWithMetrics.filter(pr => pr.isActivePlan).length,
        recipesWithAllergens: planRecipesWithMetrics.filter(pr => pr.hasAllergens).length,
        mealTimeDistribution: {
          breakfast: planRecipesWithMetrics.filter(pr => pr.mealTime === 'BREAKFAST').length,
          lunch: planRecipesWithMetrics.filter(pr => pr.mealTime === 'LUNCH').length,
          dinner: planRecipesWithMetrics.filter(pr => pr.mealTime === 'DINNER').length,
          snack: planRecipesWithMetrics.filter(pr => pr.mealTime === 'SNACK').length
        },
        averageCaloriesPerRecipe: planRecipesWithMetrics.length > 0 
          ? Math.round(planRecipesWithMetrics.reduce((acc, pr) => acc + pr.adjustedNutrition.calories, 0) / planRecipesWithMetrics.length)
          : 0,
        averagePortionSize: planRecipesWithMetrics.length > 0 
          ? Math.round((planRecipesWithMetrics.reduce((acc, pr) => acc + pr.portionMultiplier, 0) / planRecipesWithMetrics.length) * 100) / 100
          : 0
      }
    })

  } catch (error) {
    console.error('Error fetching nutrition plan recipes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch nutrition plan recipes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nutritionPlanId,
      recipeId,
      frequency,
      portionSize,
      mealTime,
      notes
    } = body

    // Validate required fields
    if (!nutritionPlanId || !recipeId || !frequency || !portionSize || !mealTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (nutritionPlanId, recipeId, frequency, portionSize, mealTime)' },
        { status: 400 }
      )
    }

    // Validate meal time
    const validMealTimes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']
    if (!validMealTimes.includes(mealTime)) {
      return NextResponse.json(
        { success: false, error: 'Invalid meal time' },
        { status: 400 }
      )
    }

    // Validate portion size
    if (portionSize <= 0) {
      return NextResponse.json(
        { success: false, error: 'Portion size must be greater than 0' },
        { status: 400 }
      )
    }

    // Check if nutrition plan exists
    const nutritionPlan = await prisma.nutritionPlan.findUnique({
      where: { id: nutritionPlanId }
    })

    if (!nutritionPlan) {
      return NextResponse.json(
        { success: false, error: 'Nutrition plan not found' },
        { status: 404 }
      )
    }

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId }
    })

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      )
    }

    // Check if this combination already exists
    const existingPlanRecipe = await prisma.nutritionPlanRecipe.findFirst({
      where: {
        nutritionPlanId,
        recipeId,
        mealTime
      }
    })

    if (existingPlanRecipe) {
      return NextResponse.json(
        { success: false, error: 'This recipe is already assigned to this meal time in the nutrition plan' },
        { status: 409 }
      )
    }

    // Create the nutrition plan recipe
    const nutritionPlanRecipe = await prisma.nutritionPlanRecipe.create({
      data: {
        nutritionPlanId,
        recipeId,
        frequency,
        portionSize,
        mealTime,
        notes
      },
      include: {
        nutritionPlan: {
          select: {
            id: true,
            planName: true,
            status: true,
            participant: {
              select: {
                id: true,
                name: true,
                participantType: true,
              }
            }
          }
        },
        recipe: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            nutritionInfo: true,
            allergenInfo: true,
          }
        }
      }
    })

    // Calculate nutrition info for this portion
    const nutritionInfo = recipe.nutritionInfo 
      ? (typeof recipe.nutritionInfo === 'string' ? JSON.parse(recipe.nutritionInfo) : recipe.nutritionInfo) 
      : {}
    
    const portionMultiplier = parseFloat(portionSize.toString())
    const adjustedNutrition = {
      calories: (nutritionInfo.calories || 0) * portionMultiplier,
      protein: (nutritionInfo.protein || 0) * portionMultiplier,
      fat: (nutritionInfo.fat || 0) * portionMultiplier,
      carbs: (nutritionInfo.carbs || 0) * portionMultiplier
    }

    return NextResponse.json({
      success: true,
      data: {
        ...nutritionPlanRecipe,
        adjustedNutrition,
        portionMultiplier
      },
      message: 'Nutrition plan recipe created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating nutrition plan recipe:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create nutrition plan recipe' },
      { status: 500 }
    )
  }
}
