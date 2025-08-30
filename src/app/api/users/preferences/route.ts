import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // For now, return default preferences
    // In the future, you can add a preferences table
    const preferences = {
      notifications: true,
      theme: "system",
      language: "id"
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error fetching preferences:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    
    // For now, just return success
    // In the future, save to preferences table
    console.log("Updating preferences for user:", session.user.id, body)

    return NextResponse.json({ message: "Preferences updated successfully" })
  } catch (error) {
    console.error("Error updating preferences:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
