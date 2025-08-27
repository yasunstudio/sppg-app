import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const isActive = searchParams.get("isActive")

    // Build where clause
    const where: any = {
      ...(category && { category }),
      ...(isActive !== null && { isActive: isActive === "true" })
    }

    const qualityStandards = await prisma.qualityStandard.findMany({
      where,
      orderBy: { category: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: qualityStandards
    })

  } catch (error) {
    console.error("Error fetching quality standards:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch quality standards",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      description,
      targetValue,
      currentValue,
      unit,
      category,
      isActive = true
    } = body

    const qualityStandard = await prisma.qualityStandard.create({
      data: {
        name,
        description,
        targetValue,
        currentValue,
        unit,
        category,
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: qualityStandard
    })

  } catch (error) {
    console.error("Error creating quality standard:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create quality standard",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
