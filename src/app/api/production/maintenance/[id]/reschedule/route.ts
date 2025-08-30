import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { newDate, reason } = await request.json()
    const { id } = await params
    const taskId = id

    // Validate input
    if (!newDate) {
      return NextResponse.json(
        { error: "New date is required" },
        { status: 400 }
      )
    }

    // Mock reschedule logic
    // In a real application, this would update the database
    console.log(`Rescheduling maintenance task ${taskId} to ${newDate}`)
    console.log(`Reason: ${reason}`)

    return NextResponse.json({
      success: true,
      message: "Maintenance task rescheduled successfully",
      data: {
        id: taskId,
        newScheduledDate: newDate,
        reason: reason,
        rescheduledAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Error rescheduling maintenance task:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
