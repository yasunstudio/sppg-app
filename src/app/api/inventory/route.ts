import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../generated/prisma'
import { z } from 'zod'

const prisma = new PrismaClient()

const createInventorySchema = z.object({
  rawMaterialId: z.string(),
  supplierId: z.string().optional(),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  expiryDate: z.string().optional(),
  batchNumber: z.string().optional(),
  qualityStatus: z.enum(['GOOD', 'FAIR', 'POOR', 'REJECTED', 'PENDING']).optional()
})

// GET /api/inventory - Get all inventory items with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    // Build where clause
    const where: any = {
      deletedAt: null
    }

    if (search) {
      where.OR = [
        { rawMaterial: { name: { contains: search, mode: 'insensitive' } } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } },
        { batchNumber: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category && category !== 'ALL') {
      where.rawMaterial = {
        ...where.rawMaterial,
        category: category
      }
    }

    const inventoryItems = await prisma.inventoryItem.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate status for each item
    const today = new Date()
    const processedItems = inventoryItems.map((item: any) => {
      let calculatedStatus = 'AVAILABLE'
      
      // Check if expired
      if (item.expiryDate && new Date(item.expiryDate) < today) {
        calculatedStatus = 'EXPIRED'
      }
      // Check if out of stock
      else if (item.quantity <= 0) {
        calculatedStatus = 'OUT_OF_STOCK'
      }
      // Check if low stock - using defaultMinimumStock if not set
      else if (item.quantity <= (item.minimumStock || 10)) {
        calculatedStatus = 'LOW_STOCK'
      }

      return {
        ...item,
        status: calculatedStatus
      }
    })

    return NextResponse.json(processedItems)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/inventory - Create new inventory item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createInventorySchema.parse(body)

    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        rawMaterialId: validatedData.rawMaterialId,
        supplierId: validatedData.supplierId,
        quantity: validatedData.quantity,
        unitPrice: validatedData.unitPrice,
        totalPrice: validatedData.quantity * validatedData.unitPrice,
        expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : null,
        batchNumber: validatedData.batchNumber,
        qualityStatus: validatedData.qualityStatus || 'GOOD'
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

    return NextResponse.json(inventoryItem, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating inventory item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
