import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/participants - Get all posyandu participants with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const posyanduId = searchParams.get('posyanduId') || ''
    const ageGroup = searchParams.get('ageGroup') || ''
    const gender = searchParams.get('gender') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { parentName: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (posyanduId) {
      where.posyanduId = posyanduId
    }

    if (gender) {
      where.gender = gender
    }

      if (ageGroup) {
        // Age groups: BALITA (0-5), ANAK (6-12), REMAJA (13-18), DEWASA (19-59), LANSIA (60+)
        const now = new Date()
        const currentYear = now.getFullYear()
        
        switch (ageGroup) {
          case 'BALITA':
            where.dateOfBirth = {
              gte: new Date(currentYear - 5, 0, 1),
              lte: new Date(currentYear, 11, 31)
            }
            break
          case 'ANAK':
            where.dateOfBirth = {
              gte: new Date(currentYear - 12, 0, 1),
              lt: new Date(currentYear - 5, 0, 1)
            }
            break
          case 'REMAJA':
            where.dateOfBirth = {
              gte: new Date(currentYear - 18, 0, 1),
              lt: new Date(currentYear - 12, 0, 1)
            }
            break
          case 'DEWASA':
            where.dateOfBirth = {
              gte: new Date(currentYear - 59, 0, 1),
              lt: new Date(currentYear - 18, 0, 1)
            }
            break
          case 'LANSIA':
            where.dateOfBirth = {
              lt: new Date(currentYear - 59, 0, 1)
            }
            break
        }
      }    // Get participants with related data
    const [participants, totalCount] = await Promise.all([
      prisma.posyanduParticipant.findMany({
        where,
        skip,
        take: limit,
        include: {
          posyandu: {
            select: {
              id: true,
              name: true,
              address: true
            }
          },
          healthRecords: {
            take: 1,
            orderBy: {
              recordDate: 'desc'
            },
            select: {
              id: true,
              recordDate: true,
              weight: true,
              height: true,
              weightForAge: true,
              heightForAge: true,
              weightForHeight: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.posyanduParticipant.count({ where })
    ])

    // Calculate age for each participant
    const participantsWithAge = participants.map(participant => {
      const birthDate = new Date(participant.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return {
        ...participant,
        age,
        latestHealthRecord: participant.healthRecords[0] || null
      }
    })

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: participantsWithAge,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching participants:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data peserta' },
      { status: 500 }
    )
  }
}

// POST /api/participants - Create new posyandu participant
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      name,
      dateOfBirth,
      gender,
      parentName,
      parentPhone,
      address,
      posyanduId,
      participantType,
      notes
    } = data

    // Validate required fields
    if (!name || !dateOfBirth || !gender || !parentName || !posyanduId || !participantType) {
      return NextResponse.json(
        { error: 'Nama, tanggal lahir, jenis kelamin, nama orang tua, posyandu, dan tipe peserta harus diisi' },
        { status: 400 }
      )
    }

    // Validate gender
    if (!['MALE', 'FEMALE'].includes(gender)) {
      return NextResponse.json(
        { error: 'Jenis kelamin tidak valid' },
        { status: 400 }
      )
    }

    // Check if posyandu exists
    const posyandu = await prisma.posyandu.findUnique({
      where: { id: posyanduId }
    })

    if (!posyandu) {
      return NextResponse.json(
        { error: 'Posyandu tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check for duplicate participant (same name, birth date, and posyandu)
    const existingParticipant = await prisma.posyanduParticipant.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        dateOfBirth: new Date(dateOfBirth),
        posyanduId
      }
    })

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'Peserta dengan nama dan tanggal lahir yang sama sudah terdaftar di posyandu ini' },
        { status: 400 }
      )
    }

    // Create participant
    const participant = await prisma.posyanduParticipant.create({
      data: {
        name: name.trim(),
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address: address?.trim() || '',
        phoneNumber: parentPhone?.trim() || null,
        participantType,
        posyanduId
      },
      include: {
        posyandu: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Peserta berhasil didaftarkan',
      participant
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating participant:', error)
    return NextResponse.json(
      { error: 'Gagal mendaftarkan peserta' },
      { status: 500 }
    )
  }
}
