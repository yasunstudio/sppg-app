import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const UpdateResourceUsageSchema = z.object({
  batchId: z.string().uuid().optional(),
  resourceId: z.string().uuid().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  plannedDuration: z.number().positive().optional(),
  actualDuration: z.number().positive().optional(),
  efficiency: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resourceUsage = await prisma.resourceUsage.findUnique({
      where: { id },
      include: {
        batch: {
          select: {
            id: true,
            batchNumber: true,
            startedAt: true,
            completedAt: true,
            status: true,
            plannedQuantity: true,
            actualQuantity: true,
            productionPlan: {
              select: {
                id: true,
                planDate: true,
                targetPortions: true,
                menu: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          }
        },
        resource: {
          select: {
            id: true,
            name: true,
            type: true,
            capacityPerHour: true,
            location: true,
            status: true,
            specifications: true,
          }
        },
      },
    })

    if (!resourceUsage) {
      return NextResponse.json(
        { error: 'Resource usage not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(resourceUsage)

  } catch (error) {
    console.error('Error fetching resource usage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = UpdateResourceUsageSchema.parse(body)

    // Check if resource usage exists
    const existingResourceUsage = await prisma.resourceUsage.findUnique({
      where: { id },
    })

    if (!existingResourceUsage) {
      return NextResponse.json(
        { error: 'Resource usage not found' },
        { status: 404 }
      )
    }

    // Verify batch exists if being updated
    if (validatedData.batchId) {
      const batch = await prisma.productionBatch.findUnique({
        where: { id: validatedData.batchId }
      })
      if (!batch) {
        return NextResponse.json(
          { error: 'Production batch not found' },
          { status: 404 }
        )
      }
    }

    // Verify resource exists if being updated
    if (validatedData.resourceId) {
      const resource = await prisma.productionResource.findUnique({
        where: { id: validatedData.resourceId }
      })
      if (!resource) {
        return NextResponse.json(
          { error: 'Production resource not found' },
          { status: 404 }
        )
      }
    }

    // Calculate efficiency if both planned and actual duration are provided
    let efficiency = validatedData.efficiency
    const actualDuration = validatedData.actualDuration || existingResourceUsage.actualDuration
    const plannedDuration = validatedData.plannedDuration || existingResourceUsage.plannedDuration

    if (!efficiency && actualDuration && plannedDuration) {
      efficiency = (plannedDuration / actualDuration) * 100
    }

    const updatedResourceUsage = await prisma.resourceUsage.update({
      where: { id },
      data: {
        ...(validatedData.batchId && { batchId: validatedData.batchId }),
        ...(validatedData.resourceId && { resourceId: validatedData.resourceId }),
        ...(validatedData.startTime && { startTime: new Date(validatedData.startTime) }),
        ...(validatedData.endTime && { endTime: new Date(validatedData.endTime) }),
        ...(validatedData.plannedDuration && { plannedDuration: validatedData.plannedDuration }),
        ...(validatedData.actualDuration && { actualDuration: validatedData.actualDuration }),
        ...(efficiency && { efficiency }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
      },
      include: {
        batch: {
          select: {
            id: true,
            batchNumber: true,
            startedAt: true,
            completedAt: true,
            status: true,
            productionPlan: {
              select: {
                id: true,
                planDate: true,
                targetPortions: true,
                menu: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          }
        },
        resource: {
          select: {
            id: true,
            name: true,
            type: true,
            capacityPerHour: true,
            location: true,
            status: true,
          }
        },
      },
    })

    return NextResponse.json(updatedResourceUsage)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating resource usage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if resource usage exists
    const existingResourceUsage = await prisma.resourceUsage.findUnique({
      where: { id },
    })

    if (!existingResourceUsage) {
      return NextResponse.json(
        { error: 'Resource usage not found' },
        { status: 404 }
      )
    }

    await prisma.resourceUsage.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Resource usage deleted successfully' })

  } catch (error) {
    console.error('Error deleting resource usage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
