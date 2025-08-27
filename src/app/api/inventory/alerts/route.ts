import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

// GET /api/inventory/alerts - Get inventory alerts
export async function GET() {
  try {
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
