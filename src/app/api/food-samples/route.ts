// =======================================================================
// FOOD SAMPLES API (src/app/api/food-samples/route.ts)
// =======================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const sampleType = searchParams.get('sampleType') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { menuName: { contains: search, mode: 'insensitive' } },
        { batchNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (sampleType) {
      where.sampleType = sampleType
    }

    if (status) {
      where.status = status
    }

    // Get samples with pagination
    const [samples, total] = await Promise.all([
      prisma.foodSample.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.foodSample.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: samples,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching food samples:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      sampleDate,
      menuName,
      batchNumber,
      sampleType,
      storageDays,
      status,
      notes
    } = body

    // Validate required fields
    if (!menuName || !batchNumber || !sampleType) {
      return NextResponse.json(
        { error: 'Menu name, batch number, and sample type are required' },
        { status: 400 }
      )
    }

    // Validate enums
    const validSampleTypes = ['RAW_MATERIAL', 'COOKED_FOOD', 'PACKAGED_MEAL']
    const validStatuses = ['STORED', 'TESTED', 'DISPOSED']

    if (!validSampleTypes.includes(sampleType)) {
      return NextResponse.json(
        { error: 'Invalid sample type' },
        { status: 400 }
      )
    }

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const sample = await prisma.foodSample.create({
      data: {
        sampleDate: sampleDate ? new Date(sampleDate) : new Date(),
        menuName,
        batchNumber,
        sampleType,
        storageDays: storageDays || 3,
        status: status || 'STORED',
        notes: notes || null
      }
    })

    return NextResponse.json({
      success: true,
      data: sample
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating food sample:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
