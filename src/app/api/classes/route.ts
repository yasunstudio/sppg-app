import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'classes:read'
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

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const schoolId = searchParams.get('schoolId')
    const grade = searchParams.get('grade')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {
      ...(schoolId && { schoolId }),
      ...(grade && { grade: parseInt(grade) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { teacherName: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    }

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        include: {
          school: {
            select: { id: true, name: true }
          }
        },
        orderBy: { name: 'asc' },
        take: limit,
        skip: offset
      }),
      prisma.class.count({ where })
    ])

    // Calculate comprehensive stats
    const allClasses = await prisma.class.findMany({
      include: {
        school: {
          select: { id: true, name: true }
        }
      }
    })

    const totalCapacity = allClasses.reduce((sum, c) => sum + (c.capacity || 0), 0)
    const totalStudents = Math.floor(totalCapacity * 0.75) // Placeholder - using 75% occupancy
    const occupancyRate = totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0

    const stats = {
      totalClasses: allClasses.length,
      totalStudents,
      totalCapacity,
      averageCapacity: allClasses.length > 0 ? Math.round(totalCapacity / allClasses.length) : 0,
      occupancyRate: parseFloat(occupancyRate.toFixed(1)),
      gradeBreakdown: Object.entries(
        allClasses.reduce((acc: Record<string, number>, classItem) => {
          const grade = `Kelas ${classItem.grade}`
          acc[grade] = (acc[grade] || 0) + 1
          return acc
        }, {})
      ).map(([grade, count]) => ({
        grade,
        count,
        percentage: parseFloat(((count / allClasses.length) * 100).toFixed(1))
      }))
    }

    return NextResponse.json({
      success: true,
      data: classes,
      stats,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        hasMore: offset + limit < total,
        itemsPerPage: limit
      }
    })

  } catch (error) {
    console.error('Classes GET error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch classes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
      'classes:create'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || typeof data.grade !== 'number' || !data.schoolId || typeof data.capacity !== 'number') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Name, grade, capacity, and schoolId are required' 
        }, 
        { status: 400 }
      )
    }

    // Check if school exists
    const school = await prisma.school.findUnique({
      where: { id: data.schoolId }
    })

    if (!school) {
      return NextResponse.json(
        { 
          success: false,
          error: 'School not found' 
        }, 
        { status: 404 }
      )
    }

    const newClass = await prisma.class.create({
      data: {
        name: data.name,
        grade: data.grade,
        capacity: data.capacity,
        currentCount: data.currentCount || 0,
        teacherName: data.teacherName || null,
        notes: data.notes || null,
        schoolId: data.schoolId
      },
      include: {
        school: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: newClass,
      message: 'Class created successfully'
    })

  } catch (error) {
    console.error('Class POST error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create class',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
