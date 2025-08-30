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

    // Get pregnant women with relations
    const pregnantWomen = await prisma.pregnantWoman.findMany({
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
    const total = await prisma.pregnantWoman.count({ where })

    // Calculate additional metrics for each pregnant woman
    const womenWithMetrics = pregnantWomen.map((woman: any) => {
      return {
        ...woman,
        ageGroup: woman.age < 20 ? 'Under 20' : woman.age > 35 ? 'Over 35' : '20-35',
        riskCategory: woman.age < 18 || woman.age > 35 ? 'HIGH_RISK' : 'NORMAL_RISK'
      }
    })

    return NextResponse.json({
      success: true,
      data: womenWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalWomen: total,
        averageAge: womenWithMetrics.length > 0 
          ? Math.round(womenWithMetrics.reduce((acc, w) => acc + w.age, 0) / womenWithMetrics.length)
          : 0,
        ageDistribution: {
          under20: womenWithMetrics.filter(w => w.age < 20).length,
          normal: womenWithMetrics.filter(w => w.age >= 20 && w.age <= 35).length,
          over35: womenWithMetrics.filter(w => w.age > 35).length
        },
        highRisk: womenWithMetrics.filter(w => w.riskCategory === 'HIGH_RISK').length
      }
    })

  } catch (error) {
    console.error('Error fetching pregnant women:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pregnant women' },
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
    if (age < 12 || age > 50) {
      return NextResponse.json(
        { success: false, error: 'Invalid age for pregnant woman' },
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
    const existingRecord = await prisma.pregnantWoman.findUnique({
      where: { nik }
    })

    if (existingRecord) {
      return NextResponse.json(
        { success: false, error: 'NIK already exists' },
        { status: 409 }
      )
    }

    // Create the pregnant woman record
    const pregnantWoman = await prisma.pregnantWoman.create({
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
    const riskCategory = age < 18 || age > 35 ? 'HIGH_RISK' : 'NORMAL_RISK'

    return NextResponse.json({
      success: true,
      data: {
        ...pregnantWoman,
        ageGroup,
        riskCategory
      },
      message: 'Pregnant woman record created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating pregnant woman:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create pregnant woman record' },
      { status: 500 }
    )
  }
}
