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
            students: { where: { status: 'ACTIVE' } },
            classes: { where: { status: 'ACTIVE' } }
          }
        }
      }
    })

    if (!school) {
      return NextResponse.json(
        { error: 'Sekolah tidak ditemukan' },
        { status: 404 }
      )
    }

    const schoolWithCounts = {
      id: school.id,
      name: school.name,
      type: school.type,
      status: school.status,
      address: school.address,
      phone: school.phone,
      email: school.email,
      principalName: school.principalName,
      description: school.description,
      totalStudents: school._count.students,
      totalClasses: school._count.classes,
      registrationDate: school.createdAt.toISOString(),
      lastUpdated: school.updatedAt.toISOString()
    }

    return NextResponse.json(schoolWithCounts)
  } catch (error) {
    console.error('Error fetching school:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data sekolah' },
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
      type,
      status,
      address,
      phone,
      email,
      principalName,
      description
    } = data

    // Validate required fields
    if (!name || !type || !status || !address) {
      return NextResponse.json(
        { error: 'Nama, jenis, status, dan alamat sekolah harus diisi' },
        { status: 400 }
      )
    }

    // Check if school exists
    const existingSchool = await prisma.school.findUnique({
      where: { id }
    })

    if (!existingSchool) {
      return NextResponse.json(
        { error: 'Sekolah tidak ditemukan' },
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
        { error: 'Nama sekolah sudah terdaftar' },
        { status: 400 }
      )
    }

    const school = await prisma.school.update({
      where: { id },
      data: {
        name: name.trim(),
        type,
        status,
        address: address.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        principalName: principalName?.trim() || null,
        description: description?.trim() || null
      }
    })

    return NextResponse.json({
      id: school.id,
      name: school.name,
      type: school.type,
      status: school.status,
      address: school.address,
      phone: school.phone,
      email: school.email,
      principalName: school.principalName,
      description: school.description,
      message: 'Sekolah berhasil diperbarui'
    })
  } catch (error) {
    console.error('Error updating school:', error)
    return NextResponse.json(
      { error: 'Gagal memperbarui sekolah' },
      { status: 500 }
    )
  }
}

// PATCH /api/schools/[id] - Update school status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()

    if (!status || !['ACTIVE', 'INACTIVE', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 }
      )
    }

    const school = await prisma.school.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({
      id: school.id,
      status: school.status,
      message: 'Status sekolah berhasil diperbarui'
    })
  } catch (error) {
    console.error('Error updating school status:', error)
    return NextResponse.json(
      { error: 'Gagal memperbarui status sekolah' },
      { status: 500 }
    )
  }
}

// DELETE /api/schools/[id] - Delete school
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
        { error: 'Sekolah tidak ditemukan' },
        { status: 404 }
      )
    }

    if (school._count.students > 0 || school._count.classes > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus sekolah yang masih memiliki siswa atau kelas' },
        { status: 400 }
      )
    }

    await prisma.school.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Sekolah berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting school:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus sekolah' },
      { status: 500 }
    )
  }
}
