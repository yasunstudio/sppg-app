import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/students/[id] - Get student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        school: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data siswa' },
      { status: 500 }
    )
  }
}

// PUT /api/students/[id] - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const {
      name,
      nis,
      grade,
      className,
      birthDate,
      gender,
      parentName,
      parentPhone,
      address,
      allergies,
      specialDiet,
      status,
      schoolId
    } = data

    // Validate required fields
    if (!name || !nis || !grade || !className || !birthDate || !gender || !status || !schoolId) {
      return NextResponse.json(
        { error: 'Semua field yang wajib harus diisi' },
        { status: 400 }
      )
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id }
    })

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if NIS already exists in the same school (excluding current student)
    const nisConflict = await prisma.student.findFirst({
      where: { 
        nis,
        schoolId,
        id: { not: id }
      }
    })

    if (nisConflict) {
      return NextResponse.json(
        { error: 'NIS sudah terdaftar di sekolah ini' },
        { status: 400 }
      )
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        name: name.trim(),
        nis: nis.trim(),
        grade: parseInt(grade),
        className: className.trim(),
        birthDate: new Date(birthDate),
        gender,
        parentName: parentName?.trim() || null,
        parentPhone: parentPhone?.trim() || null,
        address: address?.trim() || null,
        allergies: allergies || [],
        specialDiet: specialDiet?.trim() || null,
        status,
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
      message: 'Siswa berhasil diperbarui'
    })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { error: 'Gagal memperbarui siswa' },
      { status: 500 }
    )
  }
}

// DELETE /api/students/[id] - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      )
    }

    await prisma.student.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Siswa berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus siswa' },
      { status: 500 }
    )
  }
}
