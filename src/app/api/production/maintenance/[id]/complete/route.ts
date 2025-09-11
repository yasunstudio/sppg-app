import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function POST(
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
      'production:create'
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

    const { completedAt, notes, actualDuration } = await request.json()
    const { id } = await params
    const taskId = id

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
