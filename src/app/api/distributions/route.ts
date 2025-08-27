import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const schoolId = searchParams.get('schoolId')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }
    if (schoolId) {
      where.schools = {
        some: {
          schoolId: parseInt(schoolId)
        }
      }
    }

    // Get distributions with related data
    const [distributions, total] = await Promise.all([
      prisma.distribution.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          distributionDate: 'desc'
        },
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              phone: true,
              rating: true
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
                  longitude: true
                }
              }
            }
          }
        }
      }),
      prisma.distribution.count({ where })
    ])

    return NextResponse.json({
      data: distributions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching distributions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch distributions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      distributionDate,
      status,
      totalPortions,
      notes,
      estimatedDuration,
      driverId,
      vehicleId,
      schools // Array of {schoolId, plannedPortions, routeOrder}
    } = body

    // Create distribution with schools, driver, and vehicle
    const distribution = await prisma.distribution.create({
      data: {
        distributionDate: new Date(distributionDate),
        status,
        totalPortions,
        notes,
        estimatedDuration,
        driverId: driverId || null,
        vehicleId: vehicleId || null,
        schools: {
          create: schools.map((school: any) => ({
            schoolId: school.schoolId,
            plannedPortions: school.plannedPortions,
            routeOrder: school.routeOrder
          }))
        }
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            rating: true
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

    return NextResponse.json(distribution, { status: 201 })
  } catch (error) {
    console.error('Error creating distribution:', error)
    return NextResponse.json(
      { error: 'Failed to create distribution' },
      { status: 500 }
    )
  }
}
