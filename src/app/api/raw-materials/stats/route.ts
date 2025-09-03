import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock stats data - replace with actual database queries
    const stats = {
      total: 150,
      active: 142,
      lowStock: 8,
      outOfStock: 3,
      categories: {
        'Bahan Pokok': 45,
        'Bumbu & Rempah': 32,
        'Protein': 28,
        'Sayuran': 25,
        'Buah': 20
      },
      recentlyAdded: 5,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching raw materials stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
