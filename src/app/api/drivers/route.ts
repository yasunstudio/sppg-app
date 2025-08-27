import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const isActive = searchParams.get("isActive")

    // Build where clause
    const where: any = {
      ...(isActive !== null && { isActive: isActive === "true" }),
      deletedAt: null
    }

    const [drivers, total] = await Promise.all([
      prisma.driver.findMany({
        where,
        include: {
          _count: {
            select: {
              distributions: true,
              deliveries: true
            }
          }
        },
        orderBy: { name: "asc" },
        take: limit,
        skip: offset
      }),
      prisma.driver.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: drivers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error("Error fetching drivers:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch drivers",
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
      employeeId,
      name,
      phone,
      email,
      licenseNumber,
      licenseExpiry,
      address,
      emergencyContact,
      emergencyPhone,
      notes
    } = body

    const driver = await prisma.driver.create({
      data: {
        employeeId,
        name,
        phone,
        email,
        licenseNumber,
        licenseExpiry: new Date(licenseExpiry),
        address,
        emergencyContact,
        emergencyPhone,
        notes
      }
    })

    return NextResponse.json({
      success: true,
      data: driver
    })

  } catch (error) {
    console.error("Error creating driver:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create driver",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
