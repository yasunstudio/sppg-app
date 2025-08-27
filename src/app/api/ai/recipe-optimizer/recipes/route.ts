import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        servingSize: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: recipes
    })
  } catch (error) {
    console.error('Error fetching recipes for AI optimizer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}
