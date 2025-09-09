import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const distribution = await prisma.distribution.findUnique({
      where: { id },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            employeeId: true
          }
        },
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            type: true,
            capacity: true
          }
        },
        schools: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                address: true,
                latitude: true,
                longitude: true,
                totalStudents: true
              }
            }
          },
          orderBy: {
            routeOrder: 'asc'
          }
        },
        deliveries: {
          include: {
            school: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            deliveryOrder: 'asc'
          }
        }
      }
    })

    if (!distribution) {
      return NextResponse.json(
        { error: "Distribution not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(distribution)
  } catch (error) {
    console.error("Error fetching distribution:", error)
    return NextResponse.json(
      { error: "Failed to fetch distribution" },
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

    const {
      status,
      driverId,
      vehicleId,
      actualDuration,
      notes
    } = body

    const distribution = await prisma.distribution.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(driverId !== undefined && { driverId }),
        ...(vehicleId !== undefined && { vehicleId }),
        ...(actualDuration && { actualDuration }),
        ...(notes !== undefined && { notes })
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            type: true,
            capacity: true
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
        }
      }
    })

    return NextResponse.json(distribution)
  } catch (error) {
    console.error("Error updating distribution:", error)
    return NextResponse.json(
      { error: "Failed to update distribution" },
      { status: 500 }
    )
  }
}
