import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Remove sensitive data
    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const bio = formData.get("bio") as string
    const dateOfBirth = formData.get("dateOfBirth") as string
    const gender = formData.get("gender") as string
    const image = formData.get("image") as File

    const updateData: any = {
      name: name || null,
      phone: phone || null,
      address: address || null,
    }

    // Handle email change (requires verification)
    if (email && email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser && existingUser.id !== session.user.id) {
        return new NextResponse("Email already in use", { status: 409 })
      }
      
      updateData.email = email
      updateData.emailVerified = null // Reset verification
    }

    // Handle image upload
    if (image && image.size > 0) {
      // In a real app, you'd upload to cloud storage
      // For now, we'll just store the filename
      updateData.image = `/uploads/profiles/${session.user.id}-${Date.now()}.jpg`
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    // Handle profile data - for now we'll store in user table directly
    // In the future, you can add a separate profile table
    if (bio || dateOfBirth || gender) {
      // These fields would need to be added to the User model in schema.prisma
      // For now, we'll skip profile-specific fields
    }

    // Get updated user with profile
    const finalUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    const { password, ...safeUser } = finalUser!

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Error updating profile:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
