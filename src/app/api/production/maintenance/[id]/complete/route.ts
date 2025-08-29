import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { completedAt, notes, actualDuration } = await request.json()
    const taskId = params.id

    // Validate input
    if (!completedAt) {
      return NextResponse.json(
        { error: "Completion date is required" },
        { status: 400 }
      )
    }

    // Mock completion logic
    // In a real application, this would update the database
    console.log(`Marking maintenance task ${taskId} as completed`)
    console.log(`Completed at: ${completedAt}`)
    console.log(`Notes: ${notes}`)

    return NextResponse.json({
      success: true,
      message: "Maintenance task marked as completed",
      data: {
        id: taskId,
        status: "completed",
        completedAt: completedAt,
        notes: notes,
        actualDuration: actualDuration,
        updatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Error completing maintenance task:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
