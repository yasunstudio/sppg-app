import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// prisma imported from lib

// GET /api/production/stock-analytics - Get stock analytics and summary
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'production:read'
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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    // Get all raw materials with inventory
    const materials = await prisma.rawMaterial.findMany({
      where: { deletedAt: null },
      include: {
        inventory: {
          include: {
            supplier: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    // Calculate analytics
    let totalValue = 0
    let totalItems = 0
    let lowStockCount = 0
    let outOfStockCount = 0
    const categoryAnalytics: Record<string, any> = {}
    const supplierAnalytics: Record<string, any> = {}
    const materialAnalytics = []

    for (const material of materials) {
      const currentStock = material.inventory.reduce((sum, item) => sum + item.quantity, 0)
      const avgPrice = material.inventory.length > 0 
        ? material.inventory.reduce((sum, item) => sum + item.unitPrice, 0) / material.inventory.length
        : 0
      const materialValue = currentStock * avgPrice
      const minimumStock = Math.floor(Math.random() * 20) + 5 // Simulated minimum stock

      totalValue += materialValue
      totalItems += currentStock
      
      if (currentStock === 0) outOfStockCount++
      else if (currentStock <= minimumStock) lowStockCount++

      // Category analytics
      if (!categoryAnalytics[material.category]) {
        categoryAnalytics[material.category] = {
          category: material.category,
          itemCount: 0,
          totalStock: 0,
          totalValue: 0
        }
      }
      categoryAnalytics[material.category].itemCount++
      categoryAnalytics[material.category].totalStock += currentStock
      categoryAnalytics[material.category].totalValue += materialValue

      // Supplier analytics
      for (const inv of material.inventory) {
        if (inv.supplier) {
          if (!supplierAnalytics[inv.supplier.id]) {
            supplierAnalytics[inv.supplier.id] = {
              supplier: inv.supplier.name,
              itemCount: 0,
              totalValue: 0,
              lastDelivery: inv.createdAt
            }
          }
          supplierAnalytics[inv.supplier.id].itemCount++
          supplierAnalytics[inv.supplier.id].totalValue += inv.totalPrice
          if (inv.createdAt > supplierAnalytics[inv.supplier.id].lastDelivery) {
            supplierAnalytics[inv.supplier.id].lastDelivery = inv.createdAt
          }
        }
      }

      // Material analytics
      materialAnalytics.push({
        id: material.id,
        name: material.name,
        category: material.category,
        unit: material.unit,
        currentStock,
        minimumStock,
        avgPrice,
        totalValue: materialValue,
        status: currentStock === 0 ? 'OUT_OF_STOCK' : 
                currentStock <= minimumStock ? 'LOW_STOCK' : 'NORMAL',
        lastUpdated: material.inventory[0]?.createdAt || material.updatedAt,
        turnoverRate: Math.random() * 10 + 1 // Simulated turnover rate
      })
    }

    // Generate trend data (simulated)
    const trendData = []
    const now = new Date()
    for (let i = parseInt(period); i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      trendData.push({
        date: date.toISOString().split('T')[0],
        stockIn: Math.floor(Math.random() * 1000) + 500,
        stockOut: Math.floor(Math.random() * 800) + 300,
        totalValue: Math.floor(Math.random() * 50000000) + 10000000
      })
    }

    const analytics = {
      summary: {
        totalMaterials: materials.length,
        totalStockItems: totalItems,
        totalValue,
        lowStockCount,
        outOfStockCount,
        averagePrice: totalItems > 0 ? totalValue / totalItems : 0
      },
      categoryBreakdown: Object.values(categoryAnalytics),
      supplierPerformance: Object.values(supplierAnalytics),
      materialDetails: materialAnalytics.sort((a, b) => b.totalValue - a.totalValue),
      trends: trendData,
      alerts: [
        ...materialAnalytics
          .filter(m => m.status === 'OUT_OF_STOCK')
          .map(m => ({
            type: 'OUT_OF_STOCK',
            message: `${m.name} is out of stock`,
            severity: 'critical',
            materialId: m.id
          })),
        ...materialAnalytics
          .filter(m => m.status === 'LOW_STOCK')
          .slice(0, 5)
          .map(m => ({
            type: 'LOW_STOCK',
            message: `${m.name} is running low (${m.currentStock} ${m.unit} remaining)`,
            severity: 'warning',
            materialId: m.id
          }))
      ]
    }

    return NextResponse.json({
      data: analytics,
      message: 'Stock analytics fetched successfully'
    })
  } catch (error) {
    console.error('Error fetching stock analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
