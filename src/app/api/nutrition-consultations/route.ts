// ============================================================================
// NUTRITION CONSULTATIONS API (src/app/api/nutrition-consultations/route.ts)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const type = searchParams.get('type') || ''
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { studentName: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { recommendations: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (dateFrom || dateTo) {
      where.consultationDate = {}
      if (dateFrom) where.consultationDate.gte = new Date(dateFrom)
      if (dateTo) where.consultationDate.lte = new Date(dateTo)
    }

    // Get consultations with pagination
    const [consultations, total] = await Promise.all([
      prisma.nutritionConsultation.findMany({
        where,
        include: {
          student: {
            include: {
              school: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.nutritionConsultation.count({ where })
    ])

    return NextResponse.json({
      consultations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching nutrition consultations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      studentId,
      question,
      answer,
      status = 'PENDING'
    } = body

    // Validate required fields
    if (!studentId || !question) {
      return NextResponse.json(
        { error: 'Student ID and question are required' },
        { status: 400 }
      )
    }

    // Create consultation
    const consultation = await prisma.nutritionConsultation.create({
      data: {
        studentId,
        question,
        answer,
        status
      },
      include: {
        student: {
          include: {
            school: true
          }
        }
      }
    })

    return NextResponse.json(consultation, { status: 201 })

  } catch (error) {
    console.error('Error creating nutrition consultation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
