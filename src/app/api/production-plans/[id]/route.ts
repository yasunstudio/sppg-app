import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const UpdateProductionPlanSchema = z.object({
  planDate: z.string().datetime().optional(),
  targetPortions: z.number().positive().optional(),
  menuId: z.string().uuid().optional(),
  kitchenId: z.string().uuid().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  plannedStartTime: z.string().datetime().optional(),
  plannedEndTime: z.string().datetime().optional(),
  actualStartTime: z.string().datetime().optional(),
  actualEndTime: z.string().datetime().optional(),
  notes: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productionPlan = await prisma.productionPlan.findUnique({
      where: { id: params.id },
      include: {
        menu: {
          select: {
            id: true,
            name: true,
            description: true,
            mealType: true,
            targetGroup: true,
            totalCalories: true,
            totalProtein: true,
            totalFat: true,
            totalCarbs: true,
            menuItems: {
              select: {
                id: true,
                name: true,
                category: true,
                servingSize: true,
                description: true,
              }
            }
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
            qualityScore: true,
            notes: true,
          },
          orderBy: { createdAt: 'desc' }
        },
        qualityChecks: {
          select: {
            id: true,
            checkpointType: true,
            status: true,
            checkedAt: true,
            checkedBy: true,
            temperature: true,
            visualInspection: true,
            notes: true,
          },
          orderBy: { checkedAt: 'desc' }
        },
        _count: {
          select: {
            batches: true,
            qualityChecks: true,
          }
        }
      },
    })

    if (!productionPlan) {
      return NextResponse.json(
        { error: 'Production plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(productionPlan)

  } catch (error) {
    console.error('Error fetching production plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = UpdateProductionPlanSchema.parse(body)

    // Check if production plan exists
    const existingPlan = await prisma.productionPlan.findUnique({
      where: { id: params.id },
    })

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Production plan not found' },
        { status: 404 }
      )
    }

    // Verify menu exists if being updated
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

    const updateData: any = {}
    
    if (validatedData.planDate) updateData.planDate = new Date(validatedData.planDate)
    if (validatedData.targetPortions) updateData.targetPortions = validatedData.targetPortions
    if (validatedData.menuId !== undefined) updateData.menuId = validatedData.menuId
    if (validatedData.kitchenId !== undefined) updateData.kitchenId = validatedData.kitchenId
    if (validatedData.status) updateData.status = validatedData.status
    if (validatedData.plannedStartTime) updateData.plannedStartTime = new Date(validatedData.plannedStartTime)
    if (validatedData.plannedEndTime) updateData.plannedEndTime = new Date(validatedData.plannedEndTime)
    if (validatedData.actualStartTime) updateData.actualStartTime = new Date(validatedData.actualStartTime)
    if (validatedData.actualEndTime) updateData.actualEndTime = new Date(validatedData.actualEndTime)
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes

    const updatedPlan = await prisma.productionPlan.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(updatedPlan)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating production plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if production plan exists
    const existingPlan = await prisma.productionPlan.findUnique({
      where: { id: params.id },
      include: {
        batches: {
          select: { id: true }
        }
      }
    })

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Production plan not found' },
        { status: 404 }
      )
    }

    // Check if plan has batches - prevent deletion if it does
    if (existingPlan.batches.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete production plan with associated batches' },
        { status: 400 }
      )
    }

    await prisma.productionPlan.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Production plan deleted successfully' })

  } catch (error) {
    console.error('Error deleting production plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
