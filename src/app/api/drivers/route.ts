import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"

export async function GET(request: NextRequest) {
  try {
    // Check authentication and permissions
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userRoles = session.user.roles?.map((ur: any) => ur.role.name) || []
    if (!hasPermission(userRoles, 'drivers.view')) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      )
    }

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
    // Check authentication and permissions
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userRoles = session.user.roles?.map((ur: any) => ur.role.name) || []
    if (!hasPermission(userRoles, 'drivers.create')) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      )
    }

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
