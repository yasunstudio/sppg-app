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

    // First verify the driver exists
    const driver = await prisma.driver.findFirst({
      where: {
        OR: [
          { id: id },
          { employeeId: id }
        ],
        deletedAt: null
      }
    })

    if (!driver) {
      return NextResponse.json(
        { success: false, error: "Driver not found" },
        { status: 404 }
      )
    }

    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")
    const status = searchParams.get("status")

    // Build where clause for deliveries
    const where: any = {
      driverId: driver.id,
      ...(status && { status }),
    }

    // Fetch deliveries with related data
    const [deliveries, total] = await Promise.all([
      prisma.delivery.findMany({
        where,
        include: {
          distribution: {
            select: {
              id: true,
              distributionDate: true,
              status: true
            }
          },
          school: {
            select: {
              id: true,
              name: true,
              address: true
            }
          },
          vehicle: {
            select: {
              id: true,
              plateNumber: true,
              model: true,
              type: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset
      }),
      prisma.delivery.count({ where })
    ])

    // Transform data for response
    const transformedDeliveries = deliveries.map(delivery => ({
      id: delivery.id,
      status: delivery.status,
      deliveryOrder: delivery.deliveryOrder,
      plannedTime: delivery.plannedTime,
      departureTime: delivery.departureTime,
      arrivalTime: delivery.arrivalTime,
      completionTime: delivery.completionTime,
      portionsDelivered: delivery.portionsDelivered,
      notes: delivery.notes,
      school: delivery.school ? {
        id: delivery.school.id,
        name: delivery.school.name,
        address: delivery.school.address
      } : null,
      vehicle: delivery.vehicle ? {
        id: delivery.vehicle.id,
        plateNumber: delivery.vehicle.plateNumber,
        model: delivery.vehicle.model,
        type: delivery.vehicle.type
      } : null,
      distribution: delivery.distribution ? {
        id: delivery.distribution.id,
        date: delivery.distribution.distributionDate,
        status: delivery.distribution.status
      } : null,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt
    }))

    return NextResponse.json({
      success: true,
      data: transformedDeliveries,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error("Error fetching driver deliveries:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
