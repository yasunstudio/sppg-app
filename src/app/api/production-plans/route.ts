import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

// Schema validation untuk ProductionPlan
const CreateProductionPlanSchema = z.object({
  planDate: z.string().datetime(),
  targetPortions: z.number().positive(),
  menuId: z.string().uuid().optional(),
  kitchenId: z.string().uuid().optional(),
  plannedStartTime: z.string().datetime().optional(),
  plannedEndTime: z.string().datetime().optional(),
  actualStartTime: z.string().datetime().optional(),
  actualEndTime: z.string().datetime().optional(),
  notes: z.string().optional(),
})

const UpdateProductionPlanSchema = CreateProductionPlanSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const menuId = searchParams.get('menuId')
    const kitchenId = searchParams.get('kitchenId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}
    
    if (search) {
      where.OR = [
        { notes: { contains: search, mode: 'insensitive' } },
        { menu: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (menuId) {
      where.menuId = menuId
    }

    if (kitchenId) {
      where.kitchenId = kitchenId
    }

    if (startDate && endDate) {
      where.planDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    // Get total count for pagination
    const total = await prisma.productionPlan.count({ where })

    // Get production plan data with relations
    const productionPlans = await prisma.productionPlan.findMany({
      where,
      skip,
      take: limit,
      include: {
        menu: {
          select: {
            id: true,
            name: true,
            description: true,
            mealType: true,
            targetGroup: true,
            totalCalories: true,
          }
        },
        batches: {
          select: {
            id: true,
            batchNumber: true,
            status: true,
            plannedQuantity: true,
            actualQuantity: true,
            startedAt: true,
            completedAt: true,
          }
        },
        qualityChecks: {
          select: {
            id: true,
            checkpointType: true,
            status: true,
            checkedAt: true,
          },
          orderBy: { checkedAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            batches: true,
            qualityChecks: true,
          }
        }
      },
      orderBy: { planDate: 'desc' },
    })

    // Calculate aggregated metrics
    const metrics = await prisma.productionPlan.aggregate({
      where,
      _sum: {
        targetPortions: true,
      },
      _avg: {
        targetPortions: true,
      },
      _count: true,
    })

    // Get status distribution
    const statusDistribution = await prisma.productionPlan.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true,
      },
    })

    return NextResponse.json({
      data: productionPlans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      metrics: {
        totalTargetPortions: metrics._sum?.targetPortions || 0,
        averageTargetPortions: metrics._avg?.targetPortions || 0,
        totalRecords: metrics._count,
      },
      statusDistribution: statusDistribution.reduce((acc, item) => {
        acc[item.status] = item._count.status
        return acc
      }, {} as Record<string, number>)
    })

  } catch (error) {
    console.error('Error fetching production plans:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = CreateProductionPlanSchema.parse(body)

    // Verify menu exists if provided
    if (validatedData.menuId) {
      const menu = await prisma.menu.findUnique({
        where: { id: validatedData.menuId }
      })

      if (!menu) {
        return NextResponse.json(
          { error: 'Menu not found' },
          { status: 404 }
        )
      }
    }

    const productionPlan = await prisma.productionPlan.create({
      data: {
        planDate: new Date(validatedData.planDate),
        targetPortions: validatedData.targetPortions,
        menuId: validatedData.menuId || null,
        kitchenId: validatedData.kitchenId || null,
        plannedStartTime: validatedData.plannedStartTime ? new Date(validatedData.plannedStartTime) : null,
        plannedEndTime: validatedData.plannedEndTime ? new Date(validatedData.plannedEndTime) : null,
        actualStartTime: validatedData.actualStartTime ? new Date(validatedData.actualStartTime) : null,
        actualEndTime: validatedData.actualEndTime ? new Date(validatedData.actualEndTime) : null,
        notes: validatedData.notes || null,
        status: 'PLANNED',
      },
      include: {
        menu: {
          select: {
            id: true,
            name: true,
            description: true,
            mealType: true,
            targetGroup: true,
          }
        },
        batches: {
          select: {
            id: true,
            batchNumber: true,
            status: true,
            plannedQuantity: true,
            actualQuantity: true,
          }
        },
        _count: {
          select: {
            batches: true,
            qualityChecks: true,
          }
        }
      },
    })

    return NextResponse.json(productionPlan, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating production plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
