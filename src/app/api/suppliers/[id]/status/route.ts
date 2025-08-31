import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isActive must be a boolean' },
        { status: 400 }
      )
    }

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id }
    })

    if (!existingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 }
      )
    }

    // Update supplier status
    const supplier = await prisma.supplier.update({
      where: { id },
      data: { isActive },
      include: {
        _count: {
          select: {
            purchaseOrders: true,
            inventory: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: supplier,
      message: `Supplier ${isActive ? 'activated' : 'deactivated'} successfully`
    })
  } catch (error) {
    console.error('Error updating supplier status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update supplier status' },
      { status: 500 }
    )
  }
}
