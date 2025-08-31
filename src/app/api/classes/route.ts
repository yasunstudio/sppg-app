import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where = {
      ...(schoolId && { schoolId: schoolId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { teacherName: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    }

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        include: {
          school: {
            select: { id: true, name: true }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.class.count({ where })
    ])

    return NextResponse.json({
      classes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Classes GET error:', error)
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
    const { name, grade, schoolId, capacity, teacherName } = body

    if (!name || !grade || !schoolId) {
      return NextResponse.json(
        { error: 'Name, grade, and schoolId are required' },
        { status: 400 }
      )
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        grade: parseInt(grade),
        schoolId: schoolId,
        capacity: capacity ? parseInt(capacity) : 25,
        teacherName: teacherName || null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        school: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json(newClass, { status: 201 })

  } catch (error) {
    console.error('Classes POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
