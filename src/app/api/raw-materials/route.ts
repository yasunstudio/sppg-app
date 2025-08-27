import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

// GET /api/raw-materials - Get all raw materials
export async function GET() {
  try {
    const rawMaterials = await prisma.rawMaterial.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(rawMaterials)
  } catch (error) {
    console.error('Error fetching raw materials:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
