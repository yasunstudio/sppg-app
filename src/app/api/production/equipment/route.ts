import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

// GET /api/production/equipment - Get all equipment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    let whereClause: any = { 
      type: 'EQUIPMENT'
    }

    if (status) {
      whereClause.status = status
    }

    const equipment = await prisma.productionResource.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    })

    // Add model field for better display
    const enrichedEquipment = equipment.map(item => ({
      ...item,
      model: item.specifications ? 
        (typeof item.specifications === 'object' && item.specifications !== null ? 
          (item.specifications as any).model || 'Standard Model' : 'Standard Model') : 
        'Standard Model'
    }))

    return NextResponse.json({
      data: enrichedEquipment,
      total: enrichedEquipment.length,
      message: 'Equipment fetched successfully'
    })
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/production/equipment - Create new equipment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, capacityPerHour, location, specifications } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const equipment = await prisma.productionResource.create({
      data: {
        name,
        type: 'EQUIPMENT',
        capacityPerHour: capacityPerHour || null,
        location: location || null,
        specifications: specifications || null,
        status: 'AVAILABLE'
      }
    })

    return NextResponse.json({
      data: equipment,
      message: 'Equipment created successfully'
    })
  } catch (error) {
    console.error('Error creating equipment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
