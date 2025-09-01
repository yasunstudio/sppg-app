import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

// Schema validation untuk ResourceUsage
const CreateResourceUsageSchema = z.object({
  batchId: z.string().uuid(),
  resourceId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  plannedDuration: z.number().positive(), // minutes
  actualDuration: z.number().positive().optional(), // minutes
  efficiency: z.number().min(0).max(100).optional(), // percentage
  notes: z.string().optional(),
})

const UpdateResourceUsageSchema = CreateResourceUsageSchema.partial()

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
    const batchId = searchParams.get('batchId')
    const resourceId = searchParams.get('resourceId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}
    
    if (search) {
      where.OR = [
        { notes: { contains: search, mode: 'insensitive' } },
        { resource: { name: { contains: search, mode: 'insensitive' } } },
        { batch: { batchNumber: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (batchId) {
      where.batchId = batchId
    }

    if (resourceId) {
      where.resourceId = resourceId
    }

    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    // Get total count for pagination
    const total = await prisma.resourceUsage.count({ where })

    // Get resource usage data with relations
    const resourceUsages = await prisma.resourceUsage.findMany({
      where,
      skip,
      take: limit,
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
      orderBy: { startTime: 'desc' },
    })

    // Calculate aggregated metrics
    const metrics = await prisma.resourceUsage.aggregate({
      where,
      _sum: {
        plannedDuration: true,
        actualDuration: true,
      },
      _avg: {
        plannedDuration: true,
        actualDuration: true,
        efficiency: true,
      },
      _count: true,
    })

    return NextResponse.json({
      data: resourceUsages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      metrics: {
        totalPlannedDuration: metrics._sum?.plannedDuration || 0,
        totalActualDuration: metrics._sum?.actualDuration || 0,
        averagePlannedDuration: metrics._avg?.plannedDuration || 0,
        averageActualDuration: metrics._avg?.actualDuration || 0,
        averageEfficiency: metrics._avg?.efficiency || 0,
        totalRecords: metrics._count,
      }
    })

  } catch (error) {
    console.error('Error fetching resource usage:', error)
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
    const validatedData = CreateResourceUsageSchema.parse(body)

    // Verify production batch exists
    const productionBatch = await prisma.productionBatch.findUnique({
      where: { id: validatedData.batchId }
    })

    if (!productionBatch) {
      return NextResponse.json(
        { error: 'Production batch not found' },
        { status: 404 }
      )
    }

    // Verify production resource exists
    const productionResource = await prisma.productionResource.findUnique({
      where: { id: validatedData.resourceId }
    })

    if (!productionResource) {
      return NextResponse.json(
        { error: 'Production resource not found' },
        { status: 404 }
      )
    }

    // Calculate efficiency if both planned and actual duration are provided
    let efficiency = validatedData.efficiency
    if (!efficiency && validatedData.actualDuration && validatedData.plannedDuration) {
      efficiency = (validatedData.plannedDuration / validatedData.actualDuration) * 100
    }

    const resourceUsage = await prisma.resourceUsage.create({
      data: {
        batchId: validatedData.batchId,
        resourceId: validatedData.resourceId,
        startTime: new Date(validatedData.startTime),
        endTime: validatedData.endTime ? new Date(validatedData.endTime) : null,
        plannedDuration: validatedData.plannedDuration,
        actualDuration: validatedData.actualDuration || null,
        efficiency: efficiency || null,
        notes: validatedData.notes || null,
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

    return NextResponse.json(resourceUsage, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating resource usage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
