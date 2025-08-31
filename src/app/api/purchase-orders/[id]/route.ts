import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/purchase-orders/[id] - Get single purchase order
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            contactName: true,
            email: true,
            phone: true,
            address: true,
          }
        },
        orderedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        receivedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        items: {
          include: {
            rawMaterial: {
              select: {
                id: true,
                name: true,
                category: true,
                unit: true,
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!purchaseOrder) {
      return NextResponse.json(
        { success: false, error: 'Purchase order not found' },
        { status: 404 }
      )
    }

    // Transform the data to match component expectations
    const transformedData = {
      ...purchaseOrder,
      orderedBy: purchaseOrder.orderedByUser,
      receivedBy: purchaseOrder.receivedByUser,
    }

    return NextResponse.json({
      success: true,
      data: transformedData
    })
  } catch (error) {
    console.error('GET /api/purchase-orders/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/purchase-orders/[id] - Update purchase order
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      supplierId,
      expectedDelivery,
      actualDelivery,
      status,
      notes,
      items,
      totalAmount,
    } = body

    // Validate purchase order exists
    const existingPO = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true }
    })

    if (!existingPO) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      )
    }

    // Validate supplier exists if changed
    if (supplierId && supplierId !== existingPO.supplierId) {
      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId }
      })

      if (!supplier) {
        return NextResponse.json(
          { error: 'Supplier not found' },
          { status: 404 }
        )
      }
    }

    // Validate raw materials if items are provided
    if (items && Array.isArray(items)) {
      const rawMaterialIds = items.map((item: any) => item.rawMaterialId)
      const rawMaterials = await prisma.rawMaterial.findMany({
        where: { id: { in: rawMaterialIds } }
      })

      if (rawMaterials.length !== rawMaterialIds.length) {
        return NextResponse.json(
          { error: 'One or more raw materials not found' },
          { status: 404 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (supplierId) updateData.supplierId = supplierId
    if (expectedDelivery !== undefined) {
      updateData.expectedDelivery = expectedDelivery ? new Date(expectedDelivery) : null
    }
    if (actualDelivery !== undefined) {
      updateData.actualDelivery = actualDelivery ? new Date(actualDelivery) : null
    }
    if (status) {
      updateData.status = status
      // Set receivedBy when status changes to delivered or partially received
      if ((status === 'DELIVERED' || status === 'PARTIALLY_RECEIVED') && !existingPO.receivedBy) {
        updateData.receivedBy = session.user.id
      }
    }
    if (notes !== undefined) updateData.notes = notes
    if (totalAmount !== undefined) updateData.totalAmount = totalAmount

    // Update purchase order and items in transaction
    const updatedPurchaseOrder = await prisma.$transaction(async (tx) => {
      // Update purchase order
      const po = await tx.purchaseOrder.update({
        where: { id },
        data: updateData
      })

      // Update items if provided
      if (items && Array.isArray(items)) {
        // Delete existing items
        await tx.purchaseOrderItem.deleteMany({
          where: { purchaseOrderId: id }
        })

        // Create new items
        await tx.purchaseOrderItem.createMany({
          data: items.map((item: any) => ({
            purchaseOrderId: id,
            rawMaterialId: item.rawMaterialId,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            notes: item.notes,
          }))
        })
      }

      // Return updated purchase order with relations
      return await tx.purchaseOrder.findUnique({
        where: { id },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              contactName: true,
              email: true,
              phone: true,
              address: true,
            }
          },
          orderedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          receivedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          items: {
            include: {
              rawMaterial: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  unit: true,
                }
              }
            },
            orderBy: { createdAt: 'asc' }
          }
        }
      })
    })

    // Transform the data to match component expectations
    const transformedData = {
      ...updatedPurchaseOrder,
      orderedBy: updatedPurchaseOrder?.orderedByUser,
      receivedBy: updatedPurchaseOrder?.receivedByUser,
    }

    return NextResponse.json({
      success: true,
      data: transformedData,
      message: 'Purchase order updated successfully'
    })
  } catch (error) {
    console.error('PUT /api/purchase-orders/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update purchase order' },
      { status: 500 }
    )
  }
}

// DELETE /api/purchase-orders/[id] - Delete purchase order
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if purchase order exists
    const existingPO = await prisma.purchaseOrder.findUnique({
      where: { id }
    })

    if (!existingPO) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      )
    }

    // Only allow deletion if status is PENDING or CANCELLED
    if (existingPO.status !== 'PENDING' && existingPO.status !== 'CANCELLED') {
      return NextResponse.json(
        { error: 'Only pending or cancelled purchase orders can be deleted' },
        { status: 400 }
      )
    }

    // Delete purchase order (items will be deleted due to cascade)
    await prisma.purchaseOrder.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Purchase order deleted successfully'
    })
  } catch (error) {
    console.error('DELETE /api/purchase-orders/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete purchase order' },
      { status: 500 }
    )
  }
}
