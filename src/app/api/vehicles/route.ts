import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const isActive = searchParams.get("isActive")
    const type = searchParams.get("type")

    // Build where clause
    const where: any = {
      ...(isActive !== null && { isActive: isActive === "true" }),
      ...(type && { type }),
      deletedAt: null
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          _count: {
            select: {
              distributions: true,
              deliveries: true
            }
          }
        },
        orderBy: { plateNumber: "asc" },
        take: limit,
        skip: offset
      }),
      prisma.vehicle.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: vehicles,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch vehicles",
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
      plateNumber,
      type,
      capacity,
      lastService,
      notes
    } = body

    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber,
        type,
        capacity,
        lastService: lastService ? new Date(lastService) : null,
        notes
      }
    })

    return NextResponse.json({
      success: true,
      data: vehicle
    })

  } catch (error) {
    console.error("Error creating vehicle:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create vehicle",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
