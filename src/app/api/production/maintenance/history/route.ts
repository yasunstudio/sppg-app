import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const type = url.searchParams.get("type")
    const equipment = url.searchParams.get("equipment")
    const search = url.searchParams.get("search")

    // Mock data for maintenance history
    let maintenanceHistory = [
      {
        id: "hist-001",
        equipmentId: "resource-1",
        equipment: {
          name: "Kompor Gas Industrial",
          model: "Standard Model"
        },
        type: "preventive",
        scheduledDate: "2025-08-25T09:00:00.000Z",
        completedAt: "2025-08-25T11:30:00.000Z",
        estimatedDuration: 120,
        actualDuration: 150,
        priority: "medium",
        status: "completed",
        description: "Monthly gas burner cleaning and safety inspection",
        assignedTo: "Maintenance Team A",
        cost: 150,
        notes: "All burners cleaned and tested. Minor gas leak fixed."
      },
      {
        id: "hist-002",
        equipmentId: "cmewq8mop0000svnsi0mxzc28",
        equipment: {
          name: "Steam Cooker Unit",
          model: "SC-500"
        },
        type: "corrective",
        scheduledDate: "2025-08-20T14:00:00.000Z",
        completedAt: "2025-08-20T17:00:00.000Z",
        estimatedDuration: 120,
        actualDuration: 180,
        priority: "high",
        status: "completed",
        description: "Temperature sensor replacement and calibration",
        assignedTo: "Technician John Doe",
        cost: 350,
        notes: "Sensor replaced successfully. System tested and operating normally."
      },
      {
        id: "hist-003",
        equipmentId: "cmewq8wdl0001svnsz4s2d2ua",
        equipment: {
          name: "Industrial Mixer",
          model: "Standard Model"
        },
        type: "inspection",
        scheduledDate: "2025-08-15T08:00:00.000Z",
        completedAt: "2025-08-15T09:30:00.000Z",
        estimatedDuration: 60,
        actualDuration: 90,
        priority: "low",
        status: "completed",
        description: "Routine inspection of mixing blades and motor housing",
        assignedTo: "Maintenance Team B",
        cost: 75,
        notes: "Minor wear on mixing blades noted. Recommend replacement next month."
      },
      {
        id: "hist-004",
        equipmentId: "resource-1",
        equipment: {
          name: "Kompor Gas Industrial",
          model: "Standard Model"
        },
        type: "emergency",
        scheduledDate: "2025-08-10T16:30:00.000Z",
        completedAt: "2025-08-10T20:30:00.000Z",
        estimatedDuration: 180,
        actualDuration: 240,
        priority: "critical",
        status: "completed",
        description: "Emergency repair of gas leak in main supply line",
        assignedTo: "Emergency Response Team",
        cost: 500,
        notes: "Gas leak isolated and repaired. Full safety inspection completed."
      },
      {
        id: "hist-005",
        equipmentId: "cmewq8mop0000svnsi0mxzc28",
        equipment: {
          name: "Steam Cooker Unit",
          model: "SC-500"
        },
        type: "calibration",
        scheduledDate: "2025-08-05T10:00:00.000Z",
        completedAt: null,
        estimatedDuration: 90,
        actualDuration: null,
        priority: "medium",
        status: "cancelled",
        description: "Steam pressure calibration (cancelled due to equipment unavailability)",
        assignedTo: "Technician Jane Smith",
        cost: 0,
        notes: "Cancelled - equipment was assigned to production during scheduled time."
      },
      {
        id: "hist-006",
        equipmentId: "cmewq8wdl0001svnsz4s2d2ua",
        equipment: {
          name: "Industrial Mixer",
          model: "Standard Model"
        },
        type: "cleaning",
        scheduledDate: "2025-07-30T07:00:00.000Z",
        completedAt: "2025-07-30T09:00:00.000Z",
        estimatedDuration: 120,
        actualDuration: 120,
        priority: "low",
        status: "completed",
        description: "Deep cleaning and sanitization of mixing chamber",
        assignedTo: "Cleaning Team",
        cost: 100,
        notes: "Deep cleaning completed. All food safety standards met."
      }
    ]

    // Apply filters
    if (status && status !== "" && status !== "all") {
      maintenanceHistory = maintenanceHistory.filter(record => record.status === status)
    }

    if (type && type !== "" && type !== "all") {
      maintenanceHistory = maintenanceHistory.filter(record => record.type === type)
    }

    if (equipment && equipment !== "" && equipment !== "all") {
      maintenanceHistory = maintenanceHistory.filter(record => record.equipmentId === equipment)
    }

    if (search && search !== "") {
      const searchLower = search.toLowerCase()
      maintenanceHistory = maintenanceHistory.filter(record => 
        record.description.toLowerCase().includes(searchLower) ||
        record.equipment.name.toLowerCase().includes(searchLower) ||
        record.assignedTo.toLowerCase().includes(searchLower) ||
        (record.notes && record.notes.toLowerCase().includes(searchLower))
      )
    }

    // Sort by scheduled date (newest first)
    maintenanceHistory.sort((a, b) => 
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    )

    return NextResponse.json({
      success: true,
      data: maintenanceHistory,
      total: maintenanceHistory.length,
      message: "Maintenance history fetched successfully"
    })

  } catch (error) {
    console.error("Error fetching maintenance history:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
