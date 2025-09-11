import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
// prisma imported from lib

// GET /api/inventory/alerts - Get inventory alerts
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

    // Get low stock items
    const lowStock = await prisma.inventoryItem.findMany({
      where: {
        quantity: { lte: 10 },
        deletedAt: null
      },
      include: {
        rawMaterial: {
          select: {
            name: true,
            category: true,
            unit: true
          }
        }
      },
      take: 10
    })

    // Get items near expiry (within 3 days)
    const nearExpiry = await prisma.inventoryItem.findMany({
      where: {
        expiryDate: {
          gte: today,
          lte: threeDaysFromNow
        },
        deletedAt: null
      },
      include: {
        rawMaterial: {
          select: {
            name: true,
            category: true,
            unit: true
          }
        }
      },
      take: 10
    })

    // Get expired items
    const expired = await prisma.inventoryItem.findMany({
      where: {
        expiryDate: { lt: today },
        deletedAt: null
      },
      include: {
        rawMaterial: {
          select: {
            name: true,
            category: true,
            unit: true
          }
        }
      },
      take: 10
    })

    return NextResponse.json({
      lowStock,
      nearExpiry,
      expired
    })
  } catch (error) {
    console.error('Error fetching inventory alerts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
