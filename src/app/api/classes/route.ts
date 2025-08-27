import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/classes - Get all classes with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const grade = searchParams.get('grade')
    const search = searchParams.get('search')

    const where: any = {}

    if (schoolId) {
      where.schoolId = schoolId
    }

    if (grade && grade !== 'ALL') {
      where.grade = parseInt(grade)
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { teacherName: { contains: search, mode: 'insensitive' } }
      ]
    }

    const classes = await prisma.class.findMany({
      where,
      include: {
        school: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' }
      ]
    })

    const classesWithCounts = classes.map(classData => ({
      id: classData.id,
      name: classData.name,
      grade: classData.grade,
      capacity: classData.capacity,
      currentCount: classData.currentCount,
      teacherName: classData.teacherName,
      notes: classData.notes,
      schoolName: classData.school.name,
      schoolId: classData.schoolId,
      createdAt: classData.createdAt,
      updatedAt: classData.updatedAt
    }))

    return NextResponse.json({
      data: classesWithCounts,
      total: classesWithCounts.length
    })
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

// POST /api/classes - Create new class
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const {
      name,
      grade,
      capacity,
      teacherName,
      notes,
      schoolId
    } = data

    // Validate required fields
    if (!name || !grade || !capacity || !schoolId) {
      return NextResponse.json(
        { error: 'Nama kelas, tingkat, kapasitas, dan sekolah harus diisi' },
        { status: 400 }
      )
    }

    // Verify school exists
    const school = await prisma.school.findUnique({
      where: { id: schoolId }
    })

    if (!school) {
      return NextResponse.json(
        { error: 'Sekolah tidak ditemukan' },
        { status: 404 }
      )
    }

    const classData = await prisma.class.create({
      data: {
        name: name.trim(),
        grade: parseInt(grade),
        capacity: parseInt(capacity),
        teacherName: teacherName?.trim() || null,
        notes: notes?.trim() || null,
        schoolId
      },
      include: {
        school: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      id: classData.id,
      name: classData.name,
      grade: classData.grade,
      capacity: classData.capacity,
      currentCount: classData.currentCount,
      teacherName: classData.teacherName,
      notes: classData.notes,
      schoolName: classData.school.name,
      schoolId: classData.schoolId,
      createdAt: classData.createdAt,
      updatedAt: classData.updatedAt
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
}
