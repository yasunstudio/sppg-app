import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/students - Get all students with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const grade = searchParams.get('grade')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}

    if (schoolId) {
      where.schoolId = schoolId
    }

    if (grade && grade !== 'ALL') {
      where.grade = grade
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nisn: { contains: search, mode: 'insensitive' } },
        { parentName: { contains: search, mode: 'insensitive' } }
      ]
    }

    const students = await prisma.student.findMany({
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
        { name: 'asc' },
      ]
    })

    return NextResponse.json({
      data: students,
      total: students.length
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// POST /api/students - Create new student
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const {
      name,
      nisn,
      age,
      gender,
      grade,
      parentName,
      notes,
      schoolId
    } = data

    // Validate required fields
    if (!name || !nisn || !age || !gender || !grade || !parentName || !schoolId) {
      return NextResponse.json(
        { error: 'Semua field yang wajib harus diisi' },
        { status: 400 }
      )
    }

    // Check if NISN already exists in the same school
    const existingStudent = await prisma.student.findFirst({
      where: { 
        nisn,
        schoolId
      }
    })

    if (existingStudent) {
      return NextResponse.json(
        { error: 'NISN sudah terdaftar di sekolah ini' },
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

    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        nisn: nisn.trim(),
        age: parseInt(age),
        gender,
        grade: grade.trim(),
        parentName: parentName.trim(),
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
      ...student,
      message: 'Siswa berhasil ditambahkan'
    })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Gagal menambahkan siswa' },
      { status: 500 }
    )
  }
}
