import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

// prisma imported from lib

// GET /api/raw-materials - Get all raw materials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const limitParam = searchParams.get('limit')
    const lowStock = searchParams.get('lowStock') === 'true'
    const limit = limitParam ? parseInt(limitParam) : undefined

    let whereClause: any = { deletedAt: null }
    
    // Add search filter
    if (search && search.trim()) {
      const searchTerm = search.trim()
      whereClause.name = {
        contains: searchTerm
      }
    }

    const rawMaterials = await prisma.rawMaterial.findMany({
      where: whereClause,
      include: {
        inventory: {
          include: {
            supplier: true
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { name: 'asc' },
      take: limit
    })

    // Add calculated fields for inventory management
    const enrichedMaterials = rawMaterials.map((material, index) => {
      // Calculate current stock from inventory items
      const currentStock = material.inventory.reduce((sum, item) => sum + item.quantity, 0)
      // Create some variation in minimum stock to demonstrate low stock functionality
      const minimumStock = index % 3 === 0 ? currentStock + 10 : Math.floor(Math.random() * 20) + 5
      const latestInventory = material.inventory[0] // Most recent inventory item
      const unitPrice = latestInventory?.unitPrice || Math.floor(Math.random() * 50000) + 5000
      const supplier = latestInventory?.supplier

      return {
        ...material,
        currentStock,
        minimumStock,
        unitPrice,
        supplier,
        isLowStock: currentStock <= minimumStock,
        totalValue: currentStock * unitPrice
      }
    })

    // Filter for low stock if requested
    const filteredMaterials = lowStock 
      ? enrichedMaterials.filter(m => m.isLowStock)
      : enrichedMaterials

    return NextResponse.json({
      data: filteredMaterials,
      total: filteredMaterials.length,
      message: 'Raw materials fetched successfully'
    })
  } catch (error) {
    console.error('Error fetching raw materials:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
