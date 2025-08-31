import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET single waste record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const wasteRecord = await prisma.wasteRecord.findUnique({
      where: { id },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    })

    if (!wasteRecord) {
      return NextResponse.json({
        success: false,
        error: 'Waste record not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: wasteRecord
    })
  } catch (error) {
    console.error('Error fetching waste record:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT (update) waste record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    // Validate required fields
    if (!data.wasteType || !data.source || !data.weight || !data.recordDate) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: wasteType, source, weight, recordDate'
      }, { status: 400 })
    }

    // Check if waste record exists
    const existingRecord = await prisma.wasteRecord.findUnique({
      where: { id }
    })

    if (!existingRecord) {
      return NextResponse.json({
        success: false,
        error: 'Waste record not found'
      }, { status: 404 })
    }

    // Update waste record
    const updatedRecord = await prisma.wasteRecord.update({
      where: { id },
      data: {
        recordDate: new Date(data.recordDate),
        wasteType: data.wasteType,
        source: data.source,
        weight: parseFloat(data.weight),
        notes: data.notes,
        schoolId: data.schoolId
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedRecord,
      message: 'Waste record updated successfully'
    })
  } catch (error) {
    console.error('Error updating waste record:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// DELETE waste record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if waste record exists
    const existingRecord = await prisma.wasteRecord.findUnique({
      where: { id }
    })

    if (!existingRecord) {
      return NextResponse.json({
        success: false,
        error: 'Waste record not found'
      }, { status: 404 })
    }

    // Delete waste record
    await prisma.wasteRecord.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Waste record deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting waste record:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
