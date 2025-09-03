import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // Get suppliers with pagination and stats
    const [suppliers, total, activeCount, totalPurchaseOrders] = await Promise.all([
      prisma.supplier.findMany({
        where,
        include: {
          _count: {
            select: {
              purchaseOrders: true,
              inventoryItems: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.supplier.count({ where }),
      prisma.supplier.count({ where: { isActive: true } }),
      prisma.purchaseOrder.count()
    ])

    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    // Calculate stats
    const inactiveCount = total - activeCount
    const averageOrdersPerSupplier = total > 0 ? totalPurchaseOrders / total : 0

    const stats = {
      totalSuppliers: total,
      activeSuppliers: activeCount,
      inactiveSuppliers: inactiveCount,
      totalPurchaseOrders,
      averageOrdersPerSupplier
    }

    return NextResponse.json({
      success: true,
      data: suppliers,
      stats,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: total,
        hasMore
      }
    })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suppliers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, contactName, phone, email, address } = body

    // Validate required fields
    if (!name || !contactName || !phone || !address) {
      return NextResponse.json(
        { success: false, error: 'Name, contact name, phone, and address are required' },
        { status: 400 }
      )
    }

    // Check if supplier name already exists
    const existingSupplier = await prisma.supplier.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    })

    if (existingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier with this name already exists' },
        { status: 400 }
      )
    }

    // Create supplier
    const supplier = await prisma.supplier.create({
      data: {
        name,
        contactName,
        phone,
        email: email || null,
        address,
        isActive: true,
      },
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
      message: 'Supplier created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create supplier' },
      { status: 500 }
    )
  }
}
