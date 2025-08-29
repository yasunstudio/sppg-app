import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const priority = url.searchParams.get("priority")

    // Mock data for overdue maintenance tasks
    let overdueTasks = [
      {
        id: "overdue-001",
        equipmentId: "resource-1",
        equipment: {
          name: "Kompor Gas Industrial",
          model: "Standard Model"
        },
        type: "preventive",
        scheduledDate: "2025-08-20T09:00:00.000Z", // 9 days overdue
        estimatedDuration: 120,
        priority: "high",
        status: "overdue",
        description: "Monthly deep cleaning and gas safety inspection",
        assignedTo: "Maintenance Team A",
        notes: "Equipment currently in use, maintenance delayed"
      },
      {
        id: "overdue-002",
        equipmentId: "cmewq8mop0000svnsi0mxzc28",
        equipment: {
          name: "Steam Cooker Unit",
          model: "SC-500"
        },
        type: "corrective",
        scheduledDate: "2025-08-15T14:00:00.000Z", // 14 days overdue
        estimatedDuration: 180,
        priority: "critical",
        status: "overdue",
        description: "Critical repair of pressure relief valve",
        assignedTo: "Emergency Response Team",
        notes: "URGENT: Safety hazard identified, immediate attention required"
      },
      {
        id: "overdue-003",
        equipmentId: "cmewq8wdl0001svnsz4s2d2ua",
        equipment: {
          name: "Industrial Mixer",
          model: "Standard Model"
        },
        type: "calibration",
        scheduledDate: "2025-08-25T08:00:00.000Z", // 4 days overdue
        estimatedDuration: 90,
        priority: "medium",
        status: "overdue",
        description: "Speed and torque calibration check",
        assignedTo: "Technician Jane Smith",
        notes: "Parts ordered, waiting for delivery"
      },
      {
        id: "overdue-004",
        equipmentId: "resource-1",
        equipment: {
          name: "Kompor Gas Industrial",
          model: "Standard Model"
        },
        type: "inspection",
        scheduledDate: "2025-08-10T10:00:00.000Z", // 19 days overdue
        estimatedDuration: 60,
        priority: "critical",
        status: "overdue",
        description: "Emergency gas leak inspection following safety alert",
        assignedTo: "Safety Inspector",
        notes: "Equipment continues to operate with temporary safety measures"
      },
      {
        id: "overdue-005",
        equipmentId: "cmewq8mop0000svnsi0mxzc28",
        equipment: {
          name: "Steam Cooker Unit",
          model: "SC-500"
        },
        type: "cleaning",
        scheduledDate: "2025-08-27T07:00:00.000Z", // 2 days overdue
        estimatedDuration: 120,
        priority: "low",
        status: "overdue",
        description: "Weekly deep sanitization and descaling",
        assignedTo: "Cleaning Team",
        notes: "Can be rescheduled during next maintenance window"
      }
    ]

    // Filter by priority if specified
    if (priority && priority !== "" && priority !== "all") {
      overdueTasks = overdueTasks.filter(task => task.priority === priority)
    }

    // Only return tasks that are actually overdue (scheduled date is in the past)
    const now = new Date()
    overdueTasks = overdueTasks.filter(task => 
      new Date(task.scheduledDate) < now
    )

    // Sort by priority (critical first) then by how overdue they are
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    overdueTasks.sort((a, b) => {
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      // If same priority, sort by how overdue (oldest first)
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    })

    return NextResponse.json({
      success: true,
      data: overdueTasks,
      total: overdueTasks.length,
      message: "Overdue maintenance tasks fetched successfully"
    })

  } catch (error) {
    console.error("Error fetching overdue maintenance tasks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
