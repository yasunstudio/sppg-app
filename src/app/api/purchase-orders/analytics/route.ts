import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const monthsBack = parseInt(searchParams.get('months') || '6')
    const startDate = subMonths(new Date(), monthsBack)

    // 1. Total Purchase Orders Statistics
    const totalStats = await prisma.purchaseOrder.aggregate({
      _count: { id: true },
      _sum: { totalAmount: true },
      where: {
        orderDate: { gte: startDate }
      }
    })

    // 2. Status Distribution
    const statusDistribution = await prisma.purchaseOrder.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { totalAmount: true },
      where: {
        orderDate: { gte: startDate }
      }
    })

    // 3. Monthly Trends
    const monthlyData = []
    for (let i = monthsBack - 1; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i))
      const monthEnd = endOfMonth(subMonths(new Date(), i))
      
      const monthStats = await prisma.purchaseOrder.aggregate({
        _count: { id: true },
        _sum: { totalAmount: true },
        where: {
          orderDate: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })

      monthlyData.push({
        month: format(monthStart, 'MMM yyyy'),
        orders: monthStats._count.id,
        amount: monthStats._sum.totalAmount || 0
      })
    }

    // 4. Top Suppliers
    const topSuppliers = await prisma.supplier.findMany({
      include: {
        purchaseOrders: {
          where: {
            orderDate: { gte: startDate }
          },
          select: {
            totalAmount: true,
            status: true
          }
        }
      },
      take: 10
    })

    const suppliersWithStats = topSuppliers
      .map(supplier => ({
        id: supplier.id,
        name: supplier.name,
        ordersCount: supplier.purchaseOrders.length,
        totalAmount: supplier.purchaseOrders.reduce((sum, po) => sum + (po.totalAmount || 0), 0),
        deliveredOrders: supplier.purchaseOrders.filter(po => po.status === 'DELIVERED').length
      }))
      .filter(s => s.ordersCount > 0)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5)

    // 5. Top Raw Materials
    const topRawMaterials = await prisma.purchaseOrderItem.groupBy({
      by: ['rawMaterialId'],
      _sum: {
        quantity: true,
        totalPrice: true
      },
      _count: { id: true },
      where: {
        purchaseOrder: {
          orderDate: { gte: startDate }
        }
      },
      orderBy: {
        _sum: {
          totalPrice: 'desc'
        }
      },
      take: 5
    })

    const rawMaterialsWithDetails = await Promise.all(
      topRawMaterials.map(async (item) => {
        const rawMaterial = await prisma.rawMaterial.findUnique({
          where: { id: item.rawMaterialId },
          select: { id: true, name: true, category: true, unit: true }
        })
        return {
          ...rawMaterial,
          totalQuantity: item._sum.quantity || 0,
          totalAmount: item._sum.totalPrice || 0,
          ordersCount: item._count.id
        }
      })
    )

    // 6. Average Order Value & Delivery Time
    const avgOrderValue = totalStats._sum.totalAmount && totalStats._count.id
      ? totalStats._sum.totalAmount / totalStats._count.id
      : 0

    // 7. Recent Activity (Last 7 days)
    const recentActivity = await prisma.purchaseOrder.findMany({
      where: {
        orderDate: {
          gte: subMonths(new Date(), 1)
        }
      },
      include: {
        supplier: {
          select: { name: true }
        },
        orderedByUser: {
          select: { name: true }
        }
      },
      orderBy: { orderDate: 'desc' },
      take: 10
    })

    const analytics = {
      totalStats: {
        totalOrders: totalStats._count.id,
        totalAmount: totalStats._sum.totalAmount || 0,
        avgOrderValue
      },
      statusDistribution,
      monthlyTrends: monthlyData,
      topSuppliers: suppliersWithStats,
      topRawMaterials: rawMaterialsWithDetails,
      recentActivity: recentActivity.map(po => ({
        id: po.id,
        orderNumber: po.poNumber,
        status: po.status,
        totalAmount: po.totalAmount,
        supplier: po.supplier.name,
        createdBy: po.orderedByUser.name,
        createdAt: po.createdAt
      }))
    }

    return NextResponse.json({
      success: true,
      data: analytics
    })

  } catch (error) {
    console.error('Purchase orders analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
