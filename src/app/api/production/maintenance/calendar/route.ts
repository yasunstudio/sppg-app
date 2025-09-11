import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'production:read'
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

    const url = new URL(request.url)
    const month = url.searchParams.get("month") || new Date().getMonth().toString()
    const year = url.searchParams.get("year") || new Date().getFullYear().toString()

    // Calculate date range for the selected month
    const startDate = new Date(parseInt(year), parseInt(month), 1)
    const endDate = new Date(parseInt(year), parseInt(month) + 1, 0, 23, 59, 59)

    // Mock data for maintenance calendar
    const maintenanceEvents = [
      {
        id: "cal-001",
        equipmentId: "resource-1",
        equipment: {
          name: "Kompor Gas Industrial",
          model: "Standard Model"
        },
        type: "preventive",
        scheduledDate: "2025-08-30T09:00:00.000Z",
        estimatedDuration: 120,
        priority: "medium",
        status: "scheduled",
        description: "Monthly gas burner cleaning and safety check",
        assignedTo: "Maintenance Team A"
      },
      {
        id: "cal-002",
        equipmentId: "cmewq8mop0000svnsi0mxzc28",
        equipment: {
          name: "Steam Cooker Unit",
          model: "SC-500"
        },
        type: "corrective",
        scheduledDate: "2025-08-31T14:00:00.000Z",
        estimatedDuration: 180,
        priority: "high",
        status: "scheduled",
        description: "Fix temperature control system malfunction",
        assignedTo: "Technician John Doe"
      },
      {
        id: "cal-003",
        equipmentId: "cmewq8wdl0001svnsz4s2d2ua",
        equipment: {
          name: "Industrial Mixer",
          model: "Standard Model"
        },
        type: "inspection",
        scheduledDate: "2025-09-02T08:00:00.000Z",
        estimatedDuration: 60,
        priority: "low",
        status: "scheduled",
        description: "Routine inspection of mixing blades and motor",
        assignedTo: "Maintenance Team B"
      },
      {
        id: "cal-004",
        equipmentId: "resource-1",
        equipment: {
          name: "Kompor Gas Industrial",
          model: "Standard Model"
        },
        type: "emergency",
        scheduledDate: "2025-09-05T16:30:00.000Z",
        estimatedDuration: 240,
        priority: "critical",
        status: "overdue",
        description: "Emergency repair of gas leak detection system",
        assignedTo: "Emergency Response Team"
      },
      {
        id: "cal-005",
        equipmentId: "cmewq8mop0000svnsi0mxzc28",
        equipment: {
          name: "Steam Cooker Unit",
          model: "SC-500"
        },
        type: "calibration",
        scheduledDate: "2025-09-10T10:00:00.000Z",
        estimatedDuration: 90,
        priority: "medium",
        status: "in_progress",
        description: "Steam pressure calibration and testing",
        assignedTo: "Technician Jane Smith"
      }
    ]

    // Filter events by the selected month and year
    const filteredEvents = maintenanceEvents.filter(event => {
      const eventDate = new Date(event.scheduledDate)
      return eventDate >= startDate && eventDate <= endDate
    })

    return NextResponse.json({
      success: true,
      data: filteredEvents,
      total: filteredEvents.length,
      month: parseInt(month),
      year: parseInt(year),
      message: "Maintenance calendar fetched successfully"
    })

  } catch (error) {
    console.error("Error fetching maintenance calendar:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
