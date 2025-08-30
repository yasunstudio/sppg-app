import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const participantId = searchParams.get('participantId')
    const programId = searchParams.get('programId')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (participantId) {
      where.participantId = participantId
    }

    if (programId) {
      where.programId = programId
    }

    if (status) {
      where.status = status
    }

    if (startDate || endDate) {
      where.startDate = {}
      if (startDate) {
        where.startDate.gte = new Date(startDate)
      }
      if (endDate) {
        where.startDate.lte = new Date(endDate)
      }
    }

    // Get nutrition plans with relations
    const nutritionPlans = await prisma.nutritionPlan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        participant: {
          select: {
            id: true,
            name: true,
            dateOfBirth: true,
            gender: true,
            participantType: true,
          }
        },
        program: {
          select: {
            id: true,
            name: true,
            description: true,
          }
        },
        recipes: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                description: true,
                nutritionInfo: true,
              }
            }
          }
        }
      }
    })

    // Get total count
    const total = await prisma.nutritionPlan.count({ where })

    // Calculate additional metrics for each plan
    const plansWithMetrics = nutritionPlans.map((plan: any) => {
      // Calculate duration in days
      const duration = plan.endDate 
        ? Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (24 * 60 * 60 * 1000))
        : null

      // Calculate days remaining
      const daysRemaining = plan.endDate 
        ? Math.ceil((new Date(plan.endDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
        : null

      // Calculate progress percentage
      const progressPercentage = plan.endDate 
        ? Math.max(0, Math.min(100, 
            Math.round(((Date.now() - new Date(plan.startDate).getTime()) / 
                       (new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime())) * 100)
          ))
        : null

      // Calculate total nutrition from recipes
      const totalNutrition = plan.recipes.reduce((acc: any, planRecipe: any) => {
        const recipe = planRecipe.recipe
        const portionMultiplier = parseFloat(planRecipe.portionSize?.toString() || '1')
        
        // Parse nutrition info from JSON
        const nutritionInfo = recipe.nutritionInfo ? (typeof recipe.nutritionInfo === 'string' ? JSON.parse(recipe.nutritionInfo) : recipe.nutritionInfo) : {}
        
        return {
          calories: acc.calories + (nutritionInfo.calories || 0) * portionMultiplier,
          protein: acc.protein + (nutritionInfo.protein || 0) * portionMultiplier,
          fat: acc.fat + (nutritionInfo.fat || 0) * portionMultiplier,
          carbs: acc.carbs + (nutritionInfo.carbs || 0) * portionMultiplier
        }
      }, { calories: 0, protein: 0, fat: 0, carbs: 0 })

      // Check if targets are being met
      const targetsMet = {
        calories: plan.targetCalories ? (totalNutrition.calories >= plan.targetCalories * 0.9) : null,
        protein: plan.targetProtein ? (totalNutrition.protein >= parseFloat(plan.targetProtein.toString()) * 0.9) : null,
        fat: plan.targetFat ? (totalNutrition.fat >= parseFloat(plan.targetFat.toString()) * 0.9) : null,
        carbs: plan.targetCarbs ? (totalNutrition.carbs >= parseFloat(plan.targetCarbs.toString()) * 0.9) : null
      }

      return {
        ...plan,
        duration,
        daysRemaining,
        progressPercentage,
        totalNutrition,
        targetsMet,
        isActive: plan.status === 'ACTIVE',
        isExpired: daysRemaining !== null && daysRemaining < 0,
        recipeCount: plan.recipes.length
      }
    })

    return NextResponse.json({
      success: true,
      data: plansWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalPlans: total,
        activePlans: plansWithMetrics.filter(p => p.isActive).length,
        expiredPlans: plansWithMetrics.filter(p => p.isExpired).length,
        completedPlans: plansWithMetrics.filter(p => p.status === 'COMPLETED').length,
        averageDuration: plansWithMetrics.filter(p => p.duration).length > 0 
          ? Math.round(plansWithMetrics.filter(p => p.duration).reduce((acc, p) => acc + (p.duration || 0), 0) / plansWithMetrics.filter(p => p.duration).length)
          : 0,
        averageRecipesPerPlan: plansWithMetrics.length > 0 
          ? Math.round(plansWithMetrics.reduce((acc, p) => acc + p.recipeCount, 0) / plansWithMetrics.length)
          : 0
      }
    })

  } catch (error) {
    console.error('Error fetching nutrition plans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch nutrition plans' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      participantId,
      programId,
      planName,
      description,
      targetCalories,
      targetProtein,
      targetFat,
      targetCarbs,
      dietaryRestrictions,
      supplementation,
      startDate,
      endDate,
      status
    } = body

    // Validate required fields
    if (!participantId || !planName || !startDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (participantId, planName, startDate)' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['ACTIVE', 'COMPLETED', 'CANCELLED', 'PAUSED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Check if participant exists
    const participant = await prisma.posyanduParticipant.findUnique({
      where: { id: participantId }
    })

    if (!participant) {
      return NextResponse.json(
        { success: false, error: 'Participant not found' },
        { status: 404 }
      )
    }

    // Check if program exists (if provided)
    if (programId) {
      const program = await prisma.posyanduProgram.findUnique({
        where: { id: programId }
      })

      if (!program) {
        return NextResponse.json(
          { success: false, error: 'Program not found' },
          { status: 404 }
        )
      }
    }

    // Validate date range
    if (endDate && new Date(endDate) <= new Date(startDate)) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Create the nutrition plan
    const nutritionPlan = await prisma.nutritionPlan.create({
      data: {
        participantId,
        programId,
        planName,
        description,
        targetCalories,
        targetProtein,
        targetFat,
        targetCarbs,
        dietaryRestrictions,
        supplementation,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'ACTIVE'
      },
      include: {
        participant: {
          select: {
            id: true,
            name: true,
            dateOfBirth: true,
            gender: true,
            participantType: true,
          }
        },
        program: {
          select: {
            id: true,
            name: true,
            description: true,
          }
        }
      }
    })

    // Calculate additional info
    const duration = nutritionPlan.endDate 
      ? Math.ceil((new Date(nutritionPlan.endDate).getTime() - new Date(nutritionPlan.startDate).getTime()) / (24 * 60 * 60 * 1000))
      : null

    return NextResponse.json({
      success: true,
      data: {
        ...nutritionPlan,
        duration,
        isActive: nutritionPlan.status === 'ACTIVE'
      },
      message: 'Nutrition plan created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating nutrition plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create nutrition plan' },
      { status: 500 }
    )
  }
}
