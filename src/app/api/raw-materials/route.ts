import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

// GET /api/raw-materials - Get all raw materials with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const lowStock = searchParams.get('lowStock') === 'true'

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    let whereClause: any = { deletedAt: null }
    
    // Add search filter
    if (search && search.trim()) {
      whereClause.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } }
      ]
    }

    // Add category filter
    if (category && category !== 'all') {
      whereClause.category = category
    }

    // Build order by clause
    const orderBy: any = {}
    if (sortBy === 'name') {
      orderBy.name = sortOrder
    } else if (sortBy === 'category') {
      orderBy.category = sortOrder
    } else if (sortBy === 'updatedAt') {
      orderBy.updatedAt = sortOrder
    } else {
      orderBy.name = 'asc' // fallback
    }

    // Get total count for pagination
    const totalCount = await prisma.rawMaterial.count({ where: whereClause })

    // Fetch raw materials with relationships
    const rawMaterials = await prisma.rawMaterial.findMany({
      where: whereClause,
      include: {
        inventory: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            supplier: {
              select: { name: true }
            },
            expiryDate: true,
            batchNumber: true
          },
          orderBy: { createdAt: 'desc' }
        },
        menuItems: {
          select: {
            id: true,
            quantity: true,
            menuItem: {
              select: { name: true }
            }
          }
        },
        purchaseOrderItems: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            purchaseOrder: {
              select: {
                poNumber: true,
                orderDate: true
              }
            }
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // Add calculated fields
    const enrichedMaterials = rawMaterials.map((material) => ({
      ...material,
      inventoryCount: material.inventory.length
    }))

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    const pagination = {
      page,
      limit,
      total: totalCount,
      totalPages,
      hasNext,
      hasPrev
    }

    return NextResponse.json({
      success: true,
      data: enrichedMaterials,
      pagination,
      message: 'Raw materials fetched successfully'
    })
  } catch (error) {
    console.error('Error fetching raw materials:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/raw-materials - Create new raw material
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      category,
      unit,
      description,
      caloriesPer100g,
      proteinPer100g,
      fatPer100g,
      carbsPer100g,
      fiberPer100g
    } = body

    // Validate required fields
    if (!name || !category || !unit) {
      return NextResponse.json(
        { success: false, error: 'Name, category, and unit are required' },
        { status: 400 }
      )
    }

    // Check if raw material with same name already exists
    const existingMaterial = await prisma.rawMaterial.findFirst({
      where: {
        name: { equals: name.trim(), mode: 'insensitive' },
        deletedAt: null
      }
    })

    if (existingMaterial) {
      return NextResponse.json(
        { success: false, error: 'Raw material with this name already exists' },
        { status: 409 }
      )
    }

    // Create raw material
    const rawMaterial = await prisma.rawMaterial.create({
      data: {
        name: name.trim(),
        category,
        unit,
        description: description?.trim() || null,
        caloriesPer100g,
        proteinPer100g,
        fatPer100g,
        carbsPer100g,
        fiberPer100g
      }
    })

    return NextResponse.json({
      success: true,
      data: rawMaterial,
      message: 'Raw material created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating raw material:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
