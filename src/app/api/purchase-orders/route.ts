import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// GET /api/purchase-orders - Get all purchase orders with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Filters
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const supplierId = searchParams.get('supplierId') || ''
    const orderBy = searchParams.get('orderBy') || 'createdAt'
    const orderDirection = searchParams.get('orderDirection') || 'desc'

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { poNumber: { contains: search, mode: 'insensitive' } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } },
        { notes: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    // Execute queries
    const [purchaseOrders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              contactName: true,
              email: true,
              phone: true,
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
            }
          },
          _count: {
            select: {
              items: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { [orderBy]: orderDirection },
      }),
      prisma.purchaseOrder.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: purchaseOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('GET /api/purchase-orders error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/purchase-orders - Create new purchase order
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'purchase-orders:create'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      supplierId,
      expectedDelivery,
      notes,
      items,
      totalAmount,
    } = body

    // Validate required fields
    if (!supplierId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Supplier and at least one item are required' },
        { status: 400 }
      )
    }

    // Validate supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId }
    })

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }

    // Validate raw materials exist
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

    // Generate PO number
    const currentYear = new Date().getFullYear()
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
    const prefix = `PO${currentYear}${currentMonth}`
    
    const lastPO = await prisma.purchaseOrder.findFirst({
      where: {
        poNumber: { startsWith: prefix }
      },
      orderBy: { poNumber: 'desc' }
    })

    let sequence = 1
    if (lastPO) {
      const lastSequence = parseInt(lastPO.poNumber.slice(-4))
      sequence = lastSequence + 1
    }

    const poNumber = `${prefix}${String(sequence).padStart(4, '0')}`

    // Create purchase order with items
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId,
        orderDate: new Date(),
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        status: 'PENDING',
        totalAmount: totalAmount || 0,
        notes,
        orderedBy: session.user.id,
        items: {
          create: items.map((item: any) => ({
            rawMaterialId: item.rawMaterialId,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            notes: item.notes,
          }))
        }
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            contactName: true,
            email: true,
            phone: true,
          }
        },
        orderedByUser: {
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
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: purchaseOrder,
      message: 'Purchase order created successfully'
    })
  } catch (error) {
    console.error('POST /api/purchase-orders error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create purchase order' },
      { status: 500 }
    )
  }
}
