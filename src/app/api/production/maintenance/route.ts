import { NextRequest, NextResponse } from 'next/server'

// GET /api/production/maintenance - Get maintenance records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get('upcoming') === 'true'
    
    // For now, return mock data since we don't have a maintenance table
    // In production, this would query a maintenance table
    const mockMaintenance = [
      {
        id: 'maint-001',
        equipmentId: 'eq-001',
        equipment: {
          name: 'Industrial Mixer',
          model: 'MX-2000'
        },
        type: 'preventive',
        scheduledDate: new Date('2025-08-30T09:00:00Z'),
        estimatedDuration: 120,
        priority: 'medium',
        status: 'scheduled',
        description: 'Regular cleaning and lubrication',
        assignedTo: 'Maintenance Team A'
      },
      {
        id: 'maint-002',
        equipmentId: 'eq-002',
        equipment: {
          name: 'Steam Cooker',
          model: 'SC-500'
        },
        type: 'corrective',
        scheduledDate: new Date('2025-08-31T14:00:00Z'),
        estimatedDuration: 180,
        priority: 'high',
        status: 'scheduled',
        description: 'Fix temperature sensor issue',
        assignedTo: 'Technician John Doe'
      },
      {
        id: 'maint-003',
        equipmentId: 'eq-003',
        equipment: {
          name: 'Refrigeration Unit',
          model: 'RF-300'
        },
        type: 'inspection',
        scheduledDate: new Date('2025-09-02T08:00:00Z'),
        estimatedDuration: 60,
        priority: 'low',
        status: 'scheduled',
        description: 'Monthly cooling system inspection',
        assignedTo: 'Maintenance Team B'
      }
    ]

    let filteredMaintenance = mockMaintenance
    if (upcoming) {
      const now = new Date()
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      filteredMaintenance = mockMaintenance.filter(m => 
        new Date(m.scheduledDate) >= now && new Date(m.scheduledDate) <= oneWeekFromNow
      )
    }

    return NextResponse.json({
      data: filteredMaintenance,
      total: filteredMaintenance.length,
      message: 'Maintenance records fetched successfully'
    })
  } catch (error) {
    console.error('Error fetching maintenance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/production/maintenance - Schedule new maintenance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      equipmentId, 
      type, 
      scheduledDate, 
      estimatedDuration, 
      priority, 
      description, 
      assignedTo, 
      notes 
    } = body

    // Validate required fields
    if (!equipmentId || !type || !scheduledDate || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: equipmentId, type, scheduledDate, and description are required' },
        { status: 400 }
      )
    }

    // For now, simulate creating maintenance record
    // In production, this would save to a maintenance table
    const maintenance = {
      id: `maint-${Date.now()}`,
      equipmentId,
      type,
      scheduledDate: new Date(scheduledDate),
      estimatedDuration: estimatedDuration || 60,
      priority: priority || 'medium',
      status: 'scheduled',
      description,
      assignedTo: assignedTo || null,
      notes: notes || null,
      createdAt: new Date()
    }

    // Simulate delay for realistic API behavior
    await new Promise(resolve => setTimeout(resolve, 300))

    return NextResponse.json({
      data: maintenance,
      message: 'Maintenance scheduled successfully'
    })
  } catch (error) {
    console.error('Error scheduling maintenance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
