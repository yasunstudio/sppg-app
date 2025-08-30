import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// prisma imported from lib

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const qualityCheckpoint = await prisma.qualityCheckpoint.findUnique({
      where: { id },
      include: {
        productionPlan: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
            menu: {
              select: {
                id: true,
                name: true,
                mealType: true
              }
            }
          }
        },
        batch: {
          select: {
            id: true,
            batchNumber: true,
            status: true
          }
        },
        checker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!qualityCheckpoint) {
      return NextResponse.json(
        { error: "Quality checkpoint not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(qualityCheckpoint)
  } catch (error) {
    console.error("Error fetching quality checkpoint:", error)
    return NextResponse.json(
      { error: "Failed to fetch quality checkpoint" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updatedCheckpoint = await prisma.qualityCheckpoint.update({
      where: { id },
      data: {
        checkpointType: body.checkpointType,
        status: body.status,
        productionPlanId: body.productionPlanId || null,
        batchId: body.batchId || null,
        temperature: body.temperature ? parseFloat(body.temperature) : null,
        visualInspection: body.visualInspection || null,
        tasteTest: body.tasteTest || null,
        textureEvaluation: body.textureEvaluation || null,
        correctiveAction: body.correctiveAction || null,
        photos: body.photos || [],
        metrics: body.metrics || {},
        notes: body.notes || null,
        checkedAt: body.checkedAt ? new Date(body.checkedAt) : undefined
      },
      include: {
        productionPlan: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
            menu: {
              select: {
                id: true,
                name: true,
                mealType: true
              }
            }
          }
        },
        batch: {
          select: {
            id: true,
            batchNumber: true,
            status: true
          }
        },
        checker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedCheckpoint)
  } catch (error) {
    console.error("Error updating quality checkpoint:", error)
    return NextResponse.json(
      { error: "Failed to update quality checkpoint" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.qualityCheckpoint.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Quality checkpoint deleted successfully" })
  } catch (error) {
    console.error("Error deleting quality checkpoint:", error)
    return NextResponse.json(
      { error: "Failed to delete quality checkpoint" },
      { status: 500 }
    )
  }
}
