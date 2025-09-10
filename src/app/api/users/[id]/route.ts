import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { 
        id,
        deletedAt: null 
      },
      include: {
        roles: {
          include: {
            role: true
          }
        },
        _count: {
          select: {
            auditLogs: true,
            notifications: true,
            orderedPurchases: true,
            receivedPurchases: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Pengguna tidak ditemukan" 
        },
        { status: 404 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    })

  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch user",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { 
        id,
        deletedAt: null 
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Pengguna tidak ditemukan" 
        },
        { status: 404 }
      )
    }

    const {
      email,
      username,
      name,
      phone,
      address,
      isActive
    } = body

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(email && { email: email.toLowerCase().trim() }),
        ...(username && { username: username.toLowerCase().trim() }),
        ...(name && { name: name.trim() }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        roles: {
          include: {
            role: true
          }
        },
        _count: {
          select: {
            auditLogs: true,
            notifications: true,
            orderedPurchases: true,
            receivedPurchases: true
          }
        }
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: "Pengguna berhasil diperbarui"
    })

  } catch (error) {
    console.error("Error updating user:", error)
    
    // Handle duplicate email/username
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Email atau username sudah digunakan",
          details: "Email atau username yang dimasukkan sudah terdaftar"
        },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update user",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { 
        id,
        deletedAt: null 
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Pengguna tidak ditemukan" 
        },
        { status: 404 }
      )
    }

    // Soft delete - set deletedAt timestamp
    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false
      }
    })

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil dihapus"
    })

  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete user",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
