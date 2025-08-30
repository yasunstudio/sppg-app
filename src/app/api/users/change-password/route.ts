import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true }
    })

    if (!user || !user.password) {
      return new NextResponse("User not found or no password set", { status: 404 })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    
    if (!isValidPassword) {
      return new NextResponse("Current password is incorrect", { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Error changing password:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
