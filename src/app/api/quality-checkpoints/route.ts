import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createQualityCheckpointSchema = z.object({
  productionPlanId: z.string().optional(),
  batchId: z.string().optional(),
  checkpointType: z.enum(['RAW_MATERIAL', 'PRODUCTION', 'PACKAGING', 'DISTRIBUTION']),
  checkedBy: z.string(),
  status: z.enum(['PASS', 'FAIL', 'CONDITIONAL', 'PENDING', 'REWORK_REQUIRED']),
  temperature: z.number().optional(),
  visualInspection: z.string().optional(),
  tasteTest: z.string().optional(),
  textureEvaluation: z.string().optional(),
  correctiveAction: z.string().optional(),
  photos: z.array(z.string()).optional(),
  metrics: z.record(z.string(), z.number()).optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}

    if (type) {
      where.checkpointType = type
    }

    if (status) {
      where.status = status
    }

    if (startDate && endDate) {
      where.checkedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const [checkpoints, total] = await Promise.all([
      prisma.qualityCheckpoint.findMany({
        where,
        include: {
          checker: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          productionPlan: {
            select: {
              id: true,
              planDate: true,
              targetPortions: true,
              menu: {
                select: {
                  name: true
                }
              }
            }
          },
          batch: {
            select: {
              id: true,
              batchNumber: true
            }
          }
        },
        orderBy: {
          checkedAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.qualityCheckpoint.count({ where })
    ])

    // Get statistics
    const stats = await prisma.qualityCheckpoint.groupBy({
      by: ['status'],
      _count: {
        status: true
      },
      where: {
        checkedAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
        }
      }
    })

    const statistics = {
      total: await prisma.qualityCheckpoint.count(),
      pass: stats.find(s => s.status === 'PASS')?._count.status || 0,
      fail: stats.find(s => s.status === 'FAIL')?._count.status || 0,
      conditional: stats.find(s => s.status === 'CONDITIONAL')?._count.status || 0,
      rework: stats.find(s => s.status === 'REWORK_REQUIRED')?._count.status || 0,
      pending: stats.find(s => s.status === 'PENDING')?._count.status || 0,
    }

    return NextResponse.json({
      checkpoints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      statistics
    })
  } catch (error) {
    console.error('Error fetching quality checkpoints:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quality checkpoints' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createQualityCheckpointSchema.parse(body)

    const checkpoint = await prisma.qualityCheckpoint.create({
      data: {
        ...data,
        checkedAt: new Date(),
        photos: data.photos || [],
        metrics: data.metrics || {}
      },
      include: {
        checker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        productionPlan: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
            menu: {
              select: {
                name: true
              }
            }
          }
        },
        batch: {
          select: {
            id: true,
            batchNumber: true
          }
        }
      }
    })

    return NextResponse.json(checkpoint, { status: 201 })
  } catch (error) {
    console.error('Error creating quality checkpoint:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create quality checkpoint' },
      { status: 500 }
    )
  }
}
