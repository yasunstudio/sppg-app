import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
// prisma imported from lib

// GET /api/inventory/stats - Get inventory statistics
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'inventory:read'
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

    const today = new Date()
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(today.getDate() + 3)

    // Get total items
    const totalItems = await prisma.inventoryItem.count({
      where: { deletedAt: null }
    })

    // Get low stock items (quantity <= 10 as default minimum)
    const lowStockItems = await prisma.inventoryItem.count({
      where: {
        quantity: { lte: 10 },
        deletedAt: null
      }
    })

    // Get expired items
    const expiredItems = await prisma.inventoryItem.count({
      where: {
        expiryDate: { lt: today },
        deletedAt: null
      }
    })

    // Get total value
    const totalValueResult = await prisma.inventoryItem.aggregate({
      where: { deletedAt: null },
      _sum: {
        totalPrice: true
      }
    })

    const totalValue = totalValueResult._sum.totalPrice || 0

    return NextResponse.json({
      totalItems,
      lowStockItems,
      expiredItems,
      totalValue
    })
  } catch (error) {
    console.error('Error fetching inventory stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
