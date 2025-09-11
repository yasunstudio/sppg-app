import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const distributionId = searchParams.get('distributionId')
    const schoolId = searchParams.get('schoolId')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (distributionId) {
      where.distributionId = distributionId
    }
    if (schoolId) {
      where.schoolId = schoolId
    }
    // Status filtering will be handled through distribution status for now

    // Get distribution schools with related data
    const [distributionSchools, total] = await Promise.all([
      prisma.distributionSchool.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { distribution: { distributionDate: 'desc' } },
          { routeOrder: 'asc' }
        ],
        include: {
          distribution: {
            select: {
              id: true,
              distributionDate: true,
              status: true,
              totalPortions: true,
              estimatedDuration: true,
              actualDuration: true,
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
              }
            }
          },
          school: {
            select: {
              id: true,
              name: true,
              address: true,
              principalName: true,
              principalPhone: true,
              latitude: true,
              longitude: true,
              totalStudents: true
            }
          }
        }
      }),
      prisma.distributionSchool.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      data: distributionSchools,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching distribution schools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch distribution schools' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'distribution:create'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json()
    const { distributionSchools } = body

    // Bulk create distribution schools
    const result = await prisma.distributionSchool.createMany({
      data: distributionSchools,
      skipDuplicates: true
    })

    return NextResponse.json({
      message: 'Distribution schools created successfully',
      count: result.count
    })
  } catch (error) {
    console.error('Error creating distribution schools:', error)
    return NextResponse.json(
      { error: 'Failed to create distribution schools' },
      { status: 500 }
    )
  }
}
