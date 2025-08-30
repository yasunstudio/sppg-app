import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const posyanduId = searchParams.get('posyanduId')
    const gender = searchParams.get('gender')
    const minAge = searchParams.get('minAge')
    const maxAge = searchParams.get('maxAge')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (posyanduId) {
      where.posyanduId = posyanduId
    }

    if (gender) {
      where.gender = gender
    }

    if (minAge) {
      where.age = { ...where.age, gte: parseInt(minAge) }
    }

    if (maxAge) {
      where.age = { ...where.age, lte: parseInt(maxAge) }
    }

    // Get toddlers with relations
    const toddlers = await prisma.toddler.findMany({
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
    const total = await prisma.toddler.count({ where })

    // Calculate additional metrics for each toddler
    const toddlersWithMetrics = toddlers.map((toddler: any) => {
      // Age-based development categories
      const developmentStage = toddler.age <= 12 ? 'INFANT' : 
                              toddler.age <= 24 ? 'EARLY_TODDLER' : 
                              toddler.age <= 36 ? 'TODDLER' : 
                              'PRESCHOOLER'

      // Nutrition monitoring based on age
      const needsFrequentMonitoring = toddler.age <= 24 // Under 2 years
      
      // Growth milestone expectations
      const expectedMilestones = toddler.age <= 6 ? 'Basic reflexes and feeding' :
                                toddler.age <= 12 ? 'Sitting, crawling, first foods' :
                                toddler.age <= 18 ? 'Walking, first words' :
                                toddler.age <= 24 ? 'Running, simple sentences' :
                                'Complex speech, social play'

      return {
        ...toddler,
        developmentStage,
        needsFrequentMonitoring,
        expectedMilestones,
        ageInMonths: toddler.age,
        ageGroup: toddler.age <= 12 ? '0-1 year' : 
                 toddler.age <= 24 ? '1-2 years' : 
                 toddler.age <= 36 ? '2-3 years' : '3+ years'
      }
    })

    return NextResponse.json({
      success: true,
      data: toddlersWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalToddlers: total,
        averageAgeMonths: toddlersWithMetrics.length > 0 
          ? Math.round(toddlersWithMetrics.reduce((acc, t) => acc + t.age, 0) / toddlersWithMetrics.length)
          : 0,
        genderDistribution: {
          male: toddlersWithMetrics.filter(t => t.gender === 'MALE').length,
          female: toddlersWithMetrics.filter(t => t.gender === 'FEMALE').length
        },
        ageGroups: {
          infants: toddlersWithMetrics.filter(t => t.age <= 12).length,
          earlyToddlers: toddlersWithMetrics.filter(t => t.age > 12 && t.age <= 24).length,
          toddlers: toddlersWithMetrics.filter(t => t.age > 24 && t.age <= 36).length,
          preschoolers: toddlersWithMetrics.filter(t => t.age > 36).length
        },
        needingFrequentMonitoring: toddlersWithMetrics.filter(t => t.needsFrequentMonitoring).length
      }
    })

  } catch (error) {
    console.error('Error fetching toddlers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch toddlers' },
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
      gender,
      parentName,
      posyanduId,
      notes
    } = body

    // Validate required fields
    if (!nik || !name || !age || !gender || !parentName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (nik, name, age, gender, parentName)' },
        { status: 400 }
      )
    }

    // Validate age (in months, typically 0-60 for toddlers)
    if (age < 0 || age > 72) {
      return NextResponse.json(
        { success: false, error: 'Invalid age for toddler (should be 0-72 months)' },
        { status: 400 }
      )
    }

    // Validate gender
    const validGenders = ['MALE', 'FEMALE']
    if (!validGenders.includes(gender)) {
      return NextResponse.json(
        { success: false, error: 'Invalid gender (must be MALE or FEMALE)' },
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
    const existingRecord = await prisma.toddler.findUnique({
      where: { nik }
    })

    if (existingRecord) {
      return NextResponse.json(
        { success: false, error: 'NIK already exists' },
        { status: 409 }
      )
    }

    // Create the toddler record
    const toddler = await prisma.toddler.create({
      data: {
        nik,
        name,
        age,
        gender,
        parentName,
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
    const developmentStage = age <= 12 ? 'INFANT' : 
                           age <= 24 ? 'EARLY_TODDLER' : 
                           age <= 36 ? 'TODDLER' : 
                           'PRESCHOOLER'
    
    const needsFrequentMonitoring = age <= 24
    const ageGroup = age <= 12 ? '0-1 year' : 
                    age <= 24 ? '1-2 years' : 
                    age <= 36 ? '2-3 years' : '3+ years'

    return NextResponse.json({
      success: true,
      data: {
        ...toddler,
        developmentStage,
        needsFrequentMonitoring,
        ageGroup,
        ageInMonths: age
      },
      message: 'Toddler record created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating toddler:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create toddler record' },
      { status: 500 }
    )
  }
}
