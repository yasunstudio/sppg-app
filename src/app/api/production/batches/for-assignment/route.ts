import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const batches = await prisma.productionBatch.findMany({
      where: {
        status: "IN_PROGRESS"
      },
      include: {
        recipe: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20 // Limit to 20 most recent active batches
    })

    return NextResponse.json({
      success: true,
      data: batches
    })

  } catch (error) {
    console.error("Error fetching production batches for assignment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
