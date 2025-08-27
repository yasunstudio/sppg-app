import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/classes/[id] - Get class by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        school: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            students: { where: { status: 'ACTIVE' } }
          }
        }
      }
    })

    if (!classData) {
      return NextResponse.json(
        { error: 'Kelas tidak ditemukan' },
        { status: 404 }
      )
    }

    const classWithCounts = {
      ...classData,
      currentStudents: classData._count.students
    }

    return NextResponse.json(classWithCounts)
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data kelas' },
      { status: 500 }
    )
  }
}

// PUT /api/classes/[id] - Update class
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const {
      name,
      grade,
      capacity,
      teacherName,
      schedule,
      room,
      description,
      status,
      schoolId
    } = data

    // Validate required fields
    if (!name || !grade || !capacity || !status || !schoolId) {
      return NextResponse.json(
        { error: 'Nama, tingkat, kapasitas, status, dan sekolah harus diisi' },
        { status: 400 }
      )
    }

    // Check if class exists
    const existingClass = await prisma.class.findUnique({
      where: { id }
    })

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Kelas tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if class name already exists in the same school and grade (excluding current class)
    const nameConflict = await prisma.class.findFirst({
      where: { 
        name: { equals: name, mode: 'insensitive' },
        grade: parseInt(grade),
        schoolId,
        id: { not: id }
      }
    })

    if (nameConflict) {
      return NextResponse.json(
        { error: 'Nama kelas sudah ada di tingkat yang sama' },
        { status: 400 }
      )
    }

    // Check if new capacity is not less than current student count
    const currentStudents = await prisma.student.count({
      where: { 
        classId: id,
        status: 'ACTIVE'
      }
    })

    if (parseInt(capacity) < currentStudents) {
      return NextResponse.json(
        { error: `Kapasitas tidak boleh kurang dari jumlah siswa saat ini (${currentStudents})` },
        { status: 400 }
      )
    }

    const classData = await prisma.class.update({
      where: { id },
      data: {
        name: name.trim(),
        grade: parseInt(grade),
        capacity: parseInt(capacity),
        teacherName: teacherName?.trim() || null,
        schedule: schedule?.trim() || null,
        room: room?.trim() || null,
        description: description?.trim() || null,
        status,
        schoolId
      },
      include: {
        school: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            students: { where: { status: 'ACTIVE' } }
          }
        }
      }
    })

    return NextResponse.json({
      ...classData,
      currentStudents: classData._count.students,
      message: 'Kelas berhasil diperbarui'
    })
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Gagal memperbarui kelas' },
      { status: 500 }
    )
  }
}

// DELETE /api/classes/[id] - Delete class
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if class has students
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      }
    })

    if (!classData) {
      return NextResponse.json(
        { error: 'Kelas tidak ditemukan' },
        { status: 404 }
      )
    }

    if (classData._count.students > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus kelas yang masih memiliki siswa' },
        { status: 400 }
      )
    }

    await prisma.class.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Kelas berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus kelas' },
      { status: 500 }
    )
  }
}
