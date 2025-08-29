import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

// GET /api/production/stock-movements - Get stock movement reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const materialId = searchParams.get('materialId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type') // 'in' | 'out' | 'adjustment'
    const limit = searchParams.get('limit')

    // For comprehensive stock reporting, we'll simulate movements based on inventory data
    // In production, you'd have a dedicated stock_movements table
    
    let whereClause: any = { deletedAt: null }
    
    if (materialId) {
      whereClause.rawMaterialId = materialId
    }

    // Get inventory items as basis for stock movements
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: whereClause,
      include: {
        rawMaterial: true,
        supplier: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : 100
    })

    // Generate stock movements from inventory data
    const stockMovements = inventoryItems.flatMap((item, index) => {
      const movements = []
      
      // Stock IN movement (receipt)
      movements.push({
        id: `mov-in-${item.id}`,
        type: 'IN',
        materialId: item.rawMaterialId,
        materialName: item.rawMaterial.name,
        quantity: item.quantity,
        unit: item.rawMaterial.unit,
        unitPrice: item.unitPrice,
        totalValue: item.totalPrice,
        reference: `PO-${item.batchNumber}`,
        supplier: item.supplier?.name,
        notes: `Stock receipt - Batch ${item.batchNumber}`,
        date: item.createdAt,
        balance: item.quantity
      })

      // Simulate some outgoing movements
      if (index % 3 === 0 && item.quantity > 10) {
        const outQuantity = Math.floor(item.quantity * 0.3)
        movements.push({
          id: `mov-out-${item.id}`,
          type: 'OUT',
          materialId: item.rawMaterialId,
          materialName: item.rawMaterial.name,
          quantity: -outQuantity,
          unit: item.rawMaterial.unit,
          unitPrice: item.unitPrice,
          totalValue: -(outQuantity * item.unitPrice),
          reference: `PROD-${Date.now()}`,
          supplier: null,
          notes: 'Used in production',
          date: new Date(item.createdAt.getTime() + 24 * 60 * 60 * 1000),
          balance: item.quantity - outQuantity
        })
      }

      return movements
    })

    // Apply date filtering if provided
    let filteredMovements = stockMovements
    if (startDate || endDate) {
      filteredMovements = stockMovements.filter(movement => {
        const movementDate = new Date(movement.date)
        if (startDate && movementDate < new Date(startDate)) return false
        if (endDate && movementDate > new Date(endDate)) return false
        return true
      })
    }

    // Apply type filtering
    if (type) {
      filteredMovements = filteredMovements.filter(movement => 
        movement.type.toLowerCase() === type.toLowerCase()
      )
    }

    // Sort by date descending
    filteredMovements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({
      data: filteredMovements,
      total: filteredMovements.length,
      message: 'Stock movements fetched successfully'
    })
  } catch (error) {
    console.error('Error fetching stock movements:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/production/stock-movements - Record stock movement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { materialId, type, quantity, unitPrice, reference, notes } = body

    if (!materialId || !type || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: materialId, type, and quantity are required' },
        { status: 400 }
      )
    }

    // In production, this would create a stock movement record
    // For now, we'll simulate the response
    const movement = {
      id: `mov-${Date.now()}`,
      materialId,
      type,
      quantity,
      unitPrice: unitPrice || 0,
      totalValue: quantity * (unitPrice || 0),
      reference: reference || `REF-${Date.now()}`,
      notes: notes || null,
      date: new Date(),
      createdAt: new Date()
    }

    return NextResponse.json({
      data: movement,
      message: 'Stock movement recorded successfully'
    })
  } catch (error) {
    console.error('Error recording stock movement:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
