import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// prisma imported from lib

// GET /api/students/[id] - Get student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { 
          success: false,
          error: 'Siswa tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: student
    })
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal mengambil data siswa' 
      },
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
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'students:update'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }


    const { id } = await params
    const data = await request.json()

    const {
      name,
      nisn,
      grade,
      age,
      gender,
      parentName,
      notes,
      schoolId
    } = data

    // Validate required fields
    if (!name || !nisn || !grade || !age || !gender || !parentName || !schoolId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Semua field yang wajib harus diisi' 
        },
        { status: 400 }
      )
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id }
    })

    if (!existingStudent) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Siswa tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    // Check if NISN already exists (excluding current student)
    const nisnConflict = await prisma.student.findFirst({
      where: { 
        nisn,
        id: { not: id }
      }
    })

    if (nisnConflict) {
      return NextResponse.json(
        { 
          success: false,
          error: 'NISN sudah terdaftar' 
        },
        { status: 400 }
      )
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        name: name.trim(),
        nisn: nisn.trim(),
        grade: grade.trim(),
        age: parseInt(age),
        gender,
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
      success: true,
      data: {
        ...student,
        message: 'Siswa berhasil diperbarui'
      }
    })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal memperbarui siswa' 
      },
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
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'students:delete'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }


    const { id } = await params
    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id }
    })

    if (!student) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Siswa tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    await prisma.student.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Siswa berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal menghapus siswa' 
      },
      { status: 500 }
    )
  }
}
