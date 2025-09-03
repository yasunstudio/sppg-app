import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const driver = await prisma.driver.findFirst({
      where: {
        OR: [
          { id: id },
          { employeeId: id }
        ],
        deletedAt: null
      },
      include: {
        _count: {
          select: {
            distributions: true,
            deliveries: true
          }
        }
      }
    })

    if (!driver) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Driver not found" 
        },
        { status: 404 }
      )
    }

    // Calculate total deliveries count
    const totalDeliveries = await prisma.delivery.count({
      where: {
        driverId: driver.id
      }
    })

    const driverWithStats = {
      ...driver,
      totalDeliveries: totalDeliveries
    }

    return NextResponse.json({
      success: true,
      data: driverWithStats
    })

  } catch (error) {
    console.error("Error fetching driver:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch driver",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    if (!hasPermission(userRoles, 'drivers.edit')) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      )
    }

    const { id } = await params
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
      notes,
      isActive
    } = body

    const driver = await prisma.driver.updateMany({
      where: {
        OR: [
          { id: id },
          { employeeId: id }
        ],
        deletedAt: null
      },
      data: {
        employeeId,
        name,
        phone,
        email,
        licenseNumber,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
        address,
        emergencyContact,
        emergencyPhone,
        notes,
        isActive,
        updatedAt: new Date()
      }
    })

    if (driver.count === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Driver not found" 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Driver updated successfully"
    })

  } catch (error) {
    console.error("Error updating driver:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update driver",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    if (!hasPermission(userRoles, 'drivers.delete')) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      )
    }

    const { id } = await params

    const driver = await prisma.driver.updateMany({
      where: {
        OR: [
          { id: id },
          { employeeId: id }
        ],
        deletedAt: null
      },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    })

    if (driver.count === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Driver not found" 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Driver deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting driver:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete driver",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
