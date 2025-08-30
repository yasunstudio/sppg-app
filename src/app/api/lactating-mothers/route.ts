import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const posyanduId = searchParams.get('posyanduId')
    const minAge = searchParams.get('minAge')
    const maxAge = searchParams.get('maxAge')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (posyanduId) {
      where.posyanduId = posyanduId
    }

    if (minAge) {
      where.age = { ...where.age, gte: parseInt(minAge) }
    }

    if (maxAge) {
      where.age = { ...where.age, lte: parseInt(maxAge) }
    }

    // Get lactating mothers with relations
    const lactatingMothers = await prisma.lactatingMother.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        posyandu: {
          select: {
            id: true,
            name: true,
            address: true,
          }
        },
      }
    })

    // Get total count
    const total = await prisma.lactatingMother.count({ where })

    // Calculate additional metrics for each mother
    const mothersWithMetrics = lactatingMothers.map((mother: any) => {
      return {
        ...mother,
        ageGroup: mother.age < 20 ? 'Under 20' : mother.age > 35 ? 'Over 35' : '20-35',
        nutritionalRisk: mother.age < 18 || mother.age > 40 ? 'HIGH' : 'NORMAL',
        supportNeeded: mother.age < 20 || mother.age > 35
      }
    })

    return NextResponse.json({
      success: true,
      data: mothersWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalMothers: total,
        averageAge: mothersWithMetrics.length > 0 
          ? Math.round(mothersWithMetrics.reduce((acc, m) => acc + m.age, 0) / mothersWithMetrics.length)
          : 0,
        ageDistribution: {
          under20: mothersWithMetrics.filter(m => m.age < 20).length,
          normal: mothersWithMetrics.filter(m => m.age >= 20 && m.age <= 35).length,
          over35: mothersWithMetrics.filter(m => m.age > 35).length
        },
        needingSupport: mothersWithMetrics.filter(m => m.supportNeeded).length,
        highNutritionalRisk: mothersWithMetrics.filter(m => m.nutritionalRisk === 'HIGH').length
      }
    })

  } catch (error) {
    console.error('Error fetching lactating mothers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lactating mothers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nik,
      name,
      age,
      posyanduId,
      notes
    } = body

    // Validate required fields
    if (!nik || !name || !age) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (nik, name, age)' },
        { status: 400 }
      )
    }

    // Validate age
    if (age < 15 || age > 50) {
      return NextResponse.json(
        { success: false, error: 'Invalid age for lactating mother' },
        { status: 400 }
      )
    }

    // Check if posyandu exists (if provided)
    if (posyanduId) {
      const posyandu = await prisma.posyandu.findUnique({
        where: { id: posyanduId }
      })

      if (!posyandu) {
        return NextResponse.json(
          { success: false, error: 'Posyandu not found' },
          { status: 404 }
        )
      }
    }

    // Check if NIK already exists
    const existingRecord = await prisma.lactatingMother.findUnique({
      where: { nik }
    })

    if (existingRecord) {
      return NextResponse.json(
        { success: false, error: 'NIK already exists' },
        { status: 409 }
      )
    }

    // Create the lactating mother record
    const lactatingMother = await prisma.lactatingMother.create({
      data: {
        nik,
        name,
        age,
        posyanduId,
        notes
      },
      include: {
        posyandu: {
          select: {
            id: true,
            name: true,
            address: true,
          }
        }
      }
    })

    // Calculate additional info
    const ageGroup = age < 20 ? 'Under 20' : age > 35 ? 'Over 35' : '20-35'
    const nutritionalRisk = age < 18 || age > 40 ? 'HIGH' : 'NORMAL'
    const supportNeeded = age < 20 || age > 35

    return NextResponse.json({
      success: true,
      data: {
        ...lactatingMother,
        ageGroup,
        nutritionalRisk,
        supportNeeded
      },
      message: 'Lactating mother record created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating lactating mother:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create lactating mother record' },
      { status: 500 }
    )
  }
}
