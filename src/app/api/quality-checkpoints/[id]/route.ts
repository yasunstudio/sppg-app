import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateQualityCheckpointSchema = z.object({
  productionPlanId: z.string().optional(),
  batchId: z.string().optional(),
  checkpointType: z.enum(['RAW_MATERIAL', 'PRODUCTION', 'PACKAGING', 'DISTRIBUTION']).optional(),
  status: z.enum(['PASS', 'FAIL', 'CONDITIONAL', 'PENDING', 'REWORK_REQUIRED']).optional(),
  temperature: z.number().optional(),
  visualInspection: z.string().optional(),
  tasteTest: z.string().optional(),
  textureEvaluation: z.string().optional(),
  correctiveAction: z.string().optional(),
  photos: z.array(z.string()).optional(),
  metrics: z.record(z.string(), z.number()).optional(),
  notes: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const checkpoint = await prisma.qualityCheckpoint.findUnique({
      where: {
        id
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

    if (!checkpoint) {
      return NextResponse.json(
        { error: 'Quality checkpoint not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(checkpoint)
  } catch (error) {
    console.error('Error fetching quality checkpoint:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quality checkpoint' },
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
    const body = await request.json()
    const data = updateQualityCheckpointSchema.parse(body)

    const checkpoint = await prisma.qualityCheckpoint.update({
      where: {
        id
      },
      data: {
        ...data,
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

    return NextResponse.json(checkpoint)
  } catch (error) {
    console.error('Error updating quality checkpoint:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update quality checkpoint' },
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
    await prisma.qualityCheckpoint.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ message: 'Quality checkpoint deleted successfully' })
  } catch (error) {
    console.error('Error deleting quality checkpoint:', error)
    return NextResponse.json(
      { error: 'Failed to delete quality checkpoint' },
      { status: 500 }
    )
  }
}
