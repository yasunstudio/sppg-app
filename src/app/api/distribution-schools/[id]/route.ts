import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const distributionSchool = await prisma.distributionSchool.findUnique({
      where: { id },
      include: {
        distribution: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                phone: true,
                licenseNumber: true
              }
            },
            vehicle: {
              select: {
                id: true,
                plateNumber: true,
                type: true,
                capacity: true
              }
            }
          }
        },
        school: {
          select: {
            id: true,
            name: true,
            address: true,
            principalName: true,
            principalPhone: true,
            latitude: true,
            longitude: true,
            totalStudents: true
          }
        }
      }
    })

    if (!distributionSchool) {
      return NextResponse.json(
        { error: 'Distribution school not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(distributionSchool)
  } catch (error) {
    console.error('Error fetching distribution school:', error)
    return NextResponse.json(
      { error: 'Failed to fetch distribution school' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { actualPortions, notes, deliveryStatus, deliveryTime } = body

    // Update distribution school
    const updatedDistributionSchool = await prisma.distributionSchool.update({
      where: { id },
      data: {
        actualPortions,
        // Add timestamp tracking in the future when we add delivery tracking fields
      },
      include: {
        distribution: {
          select: {
            id: true,
            distributionDate: true,
            status: true
          }
        },
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
      message: 'Distribution school updated successfully',
      data: updatedDistributionSchool
    })
  } catch (error) {
    console.error('Error updating distribution school:', error)
    return NextResponse.json(
      { error: 'Failed to update distribution school' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await prisma.distributionSchool.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Distribution school deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting distribution school:', error)
    return NextResponse.json(
      { error: 'Failed to delete distribution school' },
      { status: 500 }
    )
  }
}
