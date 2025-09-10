import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

// prisma imported from lib

// GET /api/schools/[id] - Get school by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            classes: true
          }
        }
      }
    })

    if (!school) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Sekolah tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    const schoolWithCounts = {
      id: school.id,
      name: school.name,
      principalName: school.principalName,
      principalPhone: school.principalPhone,
      address: school.address,
      notes: school.notes,
      latitude: school.latitude,
      longitude: school.longitude,
      studentsCount: school._count.students,
      classesCount: school._count.classes,
      totalStudents: school.totalStudents,
      registrationDate: school.createdAt.toISOString(),
      lastUpdated: school.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: schoolWithCounts
    })
  } catch (error) {
    console.error('Error fetching school:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal mengambil data sekolah' 
      },
      { status: 500 }
    )
  }
}

// PUT /api/schools/[id] - Update school
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    if (!name || !principalName || !principalPhone || !address) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Nama sekolah, nama kepala sekolah, telepon, dan alamat harus diisi' 
        },
        { status: 400 }
      )
    }

    // Check if school exists
    const existingSchool = await prisma.school.findUnique({
      where: { id }
    })

    if (!existingSchool) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Sekolah tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    // Check if school name already exists (excluding current school)
    const nameConflict = await prisma.school.findFirst({
      where: { 
        name: { equals: name, mode: 'insensitive' },
        id: { not: id }
      }
    })

    if (nameConflict) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Nama sekolah sudah terdaftar' 
        },
        { status: 400 }
      )
    }

    const updatedSchool = await prisma.school.update({
      where: { id },
      data: {
        name: name.trim(),
        address: address.trim(),
        principalName: principalName.trim(),
        principalPhone: principalPhone.trim(),
        totalStudents: totalStudents || existingSchool.totalStudents,
        notes: notes?.trim() || null,
        latitude: latitude || existingSchool.latitude,
        longitude: longitude || existingSchool.longitude
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedSchool.id,
        name: updatedSchool.name,
        address: updatedSchool.address,
        principalName: updatedSchool.principalName,
        principalPhone: updatedSchool.principalPhone,
        totalStudents: updatedSchool.totalStudents,
        notes: updatedSchool.notes,
        latitude: updatedSchool.latitude,
        longitude: updatedSchool.longitude
      },
      message: 'Sekolah berhasil diperbarui'
    })
  } catch (error) {
    console.error('Error updating school:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal memperbarui sekolah' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/schools/[id] - Delete school (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if school has students or classes
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            classes: true
          }
        }
      }
    })

    if (!school) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Sekolah tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    if (school._count.students > 0 || school._count.classes > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Tidak dapat menghapus sekolah yang masih memiliki siswa atau kelas' 
        },
        { status: 400 }
      )
    }

    // Soft delete
    await prisma.school.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      message: 'Sekolah berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting school:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal menghapus sekolah' 
      },
      { status: 500 }
    )
  }
}
