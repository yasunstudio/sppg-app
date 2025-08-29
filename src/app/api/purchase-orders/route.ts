import { NextRequest, NextResponse } from 'next/server'

// POST /api/purchase-orders - Create new purchase order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { supplierId, orderDate, deliveryDate, notes, items, totalAmount } = body

    // Validate required fields
    if (!supplierId || !orderDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: supplierId, orderDate, and items are required' },
        { status: 400 }
      )
    }

    // For now, simulate creating a purchase order
    // In production, this would save to a database table
    const purchaseOrder = {
      id: `po-${Date.now()}`,
      supplierId,
      orderDate: new Date(orderDate),
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      totalAmount: totalAmount || 0,
      notes: notes || null,
      status: 'PENDING',
      items: items.map((item: any, index: number) => ({
        id: `item-${Date.now()}-${index}`,
        materialName: item.materialName || '',
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        totalPrice: (item.quantity || 0) * (item.unitPrice || 0),
        notes: item.notes || null
      })),
      createdAt: new Date()
    }

    // Simulate delay for realistic API behavior
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      data: purchaseOrder,
      message: 'Purchase order created successfully'
    })
  } catch (error) {
    console.error('Error creating purchase order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/purchase-orders - Get purchase orders (mock data for now)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    // Mock purchase orders data
    const mockPurchaseOrders = [
      {
        id: 'po-001',
        supplierId: 'supplier-1',
        supplier: { name: 'CV Sumber Rejeki' },
        orderDate: new Date('2025-08-25'),
        deliveryDate: new Date('2025-08-30'),
        totalAmount: 5500000,
        status: 'PENDING',
        notes: 'Urgent order for weekly stock',
        items: [
          { materialName: 'Beras Premium', quantity: 100, unitPrice: 25000 },
          { materialName: 'Minyak Goreng', quantity: 50, unitPrice: 55000 }
        ],
        createdAt: new Date('2025-08-25')
      },
      {
        id: 'po-002',
        supplierId: 'supplier-2',
        supplier: { name: 'PT Sumber Pangan Sehat' },
        orderDate: new Date('2025-08-20'),
        deliveryDate: new Date('2025-08-25'),
        totalAmount: 3200000,
        status: 'DELIVERED',
        notes: null,
        items: [
          { materialName: 'Daging Ayam', quantity: 80, unitPrice: 40000 }
        ],
        createdAt: new Date('2025-08-20')
      }
    ]

    let filteredOrders = mockPurchaseOrders
    if (status) {
      filteredOrders = mockPurchaseOrders.filter(order => order.status === status)
    }

    if (limit) {
      filteredOrders = filteredOrders.slice(0, parseInt(limit))
    }

    return NextResponse.json({
      data: filteredOrders,
      total: filteredOrders.length,
      message: 'Purchase orders fetched successfully'
    })
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
