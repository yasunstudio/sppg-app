import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'drivers:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;

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

    // Build where clause for distributions
    const where: any = {
      driverId: driver.id,
      ...(status && { status }),
    }

    // Fetch distributions with related data
    const [distributions, total] = await Promise.all([
      prisma.distribution.findMany({
        where,
        include: {
          vehicle: {
            select: {
              id: true,
              plateNumber: true,
              model: true,
              type: true
            }
          },
          schools: {
            include: {
              school: {
                select: {
                  id: true,
                  name: true,
                  address: true
                }
              }
            }
          },
          deliveries: {
            select: {
              id: true,
              status: true,
              deliveryOrder: true,
              portionsDelivered: true,
              school: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              deliveries: true,
              schools: true
            }
          }
        },
        orderBy: { distributionDate: "desc" },
        take: limit,
        skip: offset
      }),
      prisma.distribution.count({ where })
    ])

    // Transform data for response
    const transformedDistributions = distributions.map(distribution => ({
      id: distribution.id,
      distributionDate: distribution.distributionDate,
      status: distribution.status,
      totalPortions: distribution.totalPortions,
      notes: distribution.notes,
      estimatedDuration: distribution.estimatedDuration,
      actualDuration: distribution.actualDuration,
      vehicle: distribution.vehicle ? {
        id: distribution.vehicle.id,
        plateNumber: distribution.vehicle.plateNumber,
        model: distribution.vehicle.model,
        type: distribution.vehicle.type
      } : null,
      schools: distribution.schools.map(ds => ({
        id: ds.school.id,
        name: ds.school.name,
        address: ds.school.address,
        plannedPortions: ds.plannedPortions,
        actualPortions: ds.actualPortions,
        routeOrder: ds.routeOrder
      })),
      deliveries: distribution.deliveries.map(delivery => ({
        id: delivery.id,
        status: delivery.status,
        deliveryOrder: delivery.deliveryOrder,
        portionsDelivered: delivery.portionsDelivered,
        school: delivery.school
      })),
      stats: {
        totalDeliveries: distribution._count.deliveries,
        totalSchools: distribution._count.schools,
        completedDeliveries: distribution.deliveries.filter(d => d.status === 'DELIVERED').length,
        totalDeliveredPortions: distribution.deliveries.reduce((sum, d) => sum + (d.portionsDelivered || 0), 0)
      },
      createdAt: distribution.createdAt,
      updatedAt: distribution.updatedAt
    }))

    return NextResponse.json({
      success: true,
      data: transformedDistributions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error("Error fetching driver distributions:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
