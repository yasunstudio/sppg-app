import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// GET /api/schools - Get all schools with filters
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
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { principalName: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get schools with student and class counts
    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc'
        },
        include: {
          students: true,
          classes: true
        }
      }),
      prisma.school.count({ where })
    ])

    // Calculate stats
    const stats = {
      totalSchools: total,
      totalStudents: schools.reduce((sum, school) => sum + school.students.length, 0),
      totalClasses: schools.reduce((sum, school) => sum + school.classes.length, 0),
      averageStudentsPerSchool: total > 0 ? Math.round(schools.reduce((sum, school) => sum + school.students.length, 0) / total) : 0,
      schoolsWithClasses: schools.filter(school => school.classes.length > 0).length
    }

    // Transform response
    const schoolsWithCounts = schools.map(school => ({
      id: school.id,
      name: school.name,
      principalName: school.principalName,
      principalPhone: school.principalPhone,
      address: school.address,
      totalStudents: school.totalStudents,
      notes: school.notes,
      latitude: school.latitude,
      longitude: school.longitude,
      createdAt: school.createdAt,
      updatedAt: school.updatedAt,
      studentCount: school.students.length,
      classCount: school.classes.length
    }))

    return NextResponse.json({
      success: true,
      data: schoolsWithCounts,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch schools' 
      },
      { status: 500 }
    )
  }
}

// POST /api/schools - Create new school
export async function POST(request: NextRequest) {
  try {
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'schools:create'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const data = await request.json()

    const {
      name,
      principalName,
      principalPhone,
      address,
      totalStudents,
      notes,
      latitude,
      longitude
    } = data

    // Validate required fields
    if (!name || !principalName || !address) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Nama sekolah, nama kepala sekolah, dan alamat harus diisi' 
        },
        { status: 400 }
      )
    }

    // Check if school name already exists
    const existingSchool = await prisma.school.findFirst({
      where: { 
        name: { equals: name, mode: 'insensitive' }
      }
    })

    if (existingSchool) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Nama sekolah sudah terdaftar' 
        },
        { status: 400 }
      )
    }

    const school = await prisma.school.create({
      data: {
        name: name.trim(),
        principalName: principalName.trim(),
        principalPhone: principalPhone?.trim() || '',
        address: address.trim(),
        totalStudents: totalStudents || 0,
        notes: notes?.trim() || null,
        latitude: latitude || null,
        longitude: longitude || null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: school.id,
        name: school.name,
        principalName: school.principalName,
        principalPhone: school.principalPhone,
        address: school.address,
        totalStudents: school.totalStudents,
        notes: school.notes,
        latitude: school.latitude,
        longitude: school.longitude,
        createdAt: school.createdAt,
        updatedAt: school.updatedAt,
        studentCount: 0,
        classCount: 0
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating school:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create school' 
      },
      { status: 500 }
    )
  }
}
