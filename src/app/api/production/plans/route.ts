import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const limit = parseInt(url.searchParams.get("limit") || "10")

    const where = status ? { status: status as any } : {}

    const productionPlans = await prisma.productionPlan.findMany({
      where,
      take: limit,
      orderBy: {
        planDate: "desc"
      },
      include: {
        menu: {
          select: {
            id: true,
            name: true,
            menuDate: true,
            mealType: true
          }
        },
        batches: {
          select: {
            id: true,
            status: true,
            startedAt: true,
            completedAt: true,
            actualQuantity: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: productionPlans,
      total: productionPlans.length
    })
  } catch (error) {
    console.error("Error fetching production plans:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch production plans" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      menuId,
      targetPortions,
      planDate,
      plannedStartTime,
      plannedEndTime,
      notes
    } = body

    const productionPlan = await prisma.productionPlan.create({
      data: {
        menuId,
        targetPortions,
        planDate: new Date(planDate),
        plannedStartTime: plannedStartTime ? new Date(plannedStartTime) : null,
        plannedEndTime: plannedEndTime ? new Date(plannedEndTime) : null,
        notes,
        status: "PLANNED"
      },
      include: {
        menu: {
          select: {
            id: true,
            name: true,
            menuDate: true,
            mealType: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: productionPlan
    })
  } catch (error) {
    console.error("Error creating production plan:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create production plan" },
      { status: 500 }
    )
  }
}
