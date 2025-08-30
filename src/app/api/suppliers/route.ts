import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

// prisma imported from lib

// GET /api/suppliers - Get all suppliers
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { 
        deletedAt: null,
        isActive: true 
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      data: suppliers,
      total: suppliers.length,
      message: 'Suppliers fetched successfully'
    })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
