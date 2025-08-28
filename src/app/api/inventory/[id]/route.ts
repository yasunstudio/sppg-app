import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/inventory/[id] - Get single inventory item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        rawMaterial: {
          select: {
            id: true,
            name: true,
            category: true,
            unit: true,
            description: true
          }
        },
        supplier: {
          select: {
            id: true,
            name: true,
            contactName: true,
            email: true,
            phone: true,
            address: true
          }
        }
      }
    })

    if (!inventoryItem) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(inventoryItem)
  } catch (error) {
    console.error('Error fetching inventory item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/inventory/[id] - Update inventory item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      rawMaterialId,
      supplierId,
      quantity,
      unitPrice,
      expiryDate,
      batchNumber,
      qualityStatus
    } = body

    // Validate required fields
    if (!rawMaterialId || !quantity || !unitPrice) {
      return NextResponse.json(
        { error: 'Raw material, quantity, and unit price are required' },
        { status: 400 }
      )
    }

    // Check if inventory item exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      )
    }

    // Calculate total price
    const totalPrice = quantity * unitPrice

    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: {
        rawMaterialId,
        supplierId: supplierId || null,
        quantity: parseFloat(quantity),
        unitPrice: parseFloat(unitPrice),
        totalPrice,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        batchNumber: batchNumber || null,
        qualityStatus: qualityStatus || 'GOOD'
      },
      include: {
        rawMaterial: {
          select: {
            id: true,
            name: true,
            category: true,
            unit: true
          }
        },
        supplier: {
          select: {
            id: true,
            name: true,
            contactName: true
          }
        }
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating inventory item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/inventory/[id] - Delete inventory item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if inventory item exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting deletedAt
    await prisma.inventoryItem.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Inventory item deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting inventory item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
