import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/health-records - Get health records with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const participantId = searchParams.get('participantId') || ''
    const search = searchParams.get('search') || ''
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (participantId) {
      where.participantId = participantId
    }

    if (search) {
      where.participant = {
        name: { contains: search, mode: 'insensitive' }
      }
    }

    if (dateFrom || dateTo) {
      where.recordDate = {}
      if (dateFrom) where.recordDate.gte = new Date(dateFrom)
      if (dateTo) where.recordDate.lte = new Date(dateTo)
    }

    // Get health records with participant info
    const [healthRecords, totalCount] = await Promise.all([
      prisma.healthRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          participant: {
            select: {
              id: true,
              name: true,
              dateOfBirth: true,
              gender: true,
              participantType: true,
              posyandu: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          recordDate: 'desc'
        }
      }),
      prisma.healthRecord.count({ where })
    ])

    // Calculate BMI and nutritional status for each record
    const recordsWithAnalysis = healthRecords.map(record => {
      let bmi = null
      let bmiCategory = null
      let age = null

      if (record.participant.dateOfBirth) {
        const birthDate = new Date(record.participant.dateOfBirth)
        const recordDate = new Date(record.recordDate)
        age = recordDate.getFullYear() - birthDate.getFullYear()
        const monthDiff = recordDate.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && recordDate.getDate() < birthDate.getDate())) {
          age--
        }
      }

      if (record.weight && record.height) {
        const weightKg = parseFloat(record.weight.toString())
        const heightM = parseFloat(record.height.toString()) / 100
        bmi = weightKg / (heightM * heightM)

        // BMI categorization (simplified)
        if (bmi < 18.5) bmiCategory = 'Underweight'
        else if (bmi < 25) bmiCategory = 'Normal'
        else if (bmi < 30) bmiCategory = 'Overweight'
        else bmiCategory = 'Obese'
      }

      return {
        ...record,
        participant: {
          ...record.participant,
          age
        },
        analysis: {
          bmi: bmi ? Math.round(bmi * 100) / 100 : null,
          bmiCategory,
          nutritionalStatus: record.weightForHeight || 'Unknown'
        }
      }
    })

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      healthRecords: recordsWithAnalysis,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching health records:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data rekam kesehatan' },
      { status: 500 }
    )
  }
}

// POST /api/health-records - Create new health record
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      participantId,
      recordDate,
      weight,
      height,
      headCircumference,
      armCircumference,
      bloodPressure,
      hemoglobin,
      temperature,
      weightForAge,
      heightForAge,
      weightForHeight,
      symptoms,
      diagnosis,
      treatment,
      notes
    } = data

    // Validate required fields
    if (!participantId || !recordDate) {
      return NextResponse.json(
        { error: 'ID peserta dan tanggal pemeriksaan harus diisi' },
        { status: 400 }
      )
    }

    // Check if participant exists
    const participant = await prisma.posyanduParticipant.findUnique({
      where: { id: participantId }
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Peserta tidak ditemukan' },
        { status: 404 }
      )
    }

    // Create health record
    const healthRecord = await prisma.healthRecord.create({
      data: {
        participantId,
        recordDate: new Date(recordDate),
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        headCircumference: headCircumference ? parseFloat(headCircumference) : null,
        armCircumference: armCircumference ? parseFloat(armCircumference) : null,
        bloodPressure: bloodPressure?.trim() || null,
        hemoglobin: hemoglobin ? parseFloat(hemoglobin) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        weightForAge: weightForAge?.trim() || null,
        heightForAge: heightForAge?.trim() || null,
        weightForHeight: weightForHeight?.trim() || null,
        symptoms: symptoms?.trim() || null,
        diagnosis: diagnosis?.trim() || null,
        treatment: treatment?.trim() || null,
        notes: notes?.trim() || null
      },
      include: {
        participant: {
          select: {
            id: true,
            name: true,
            dateOfBirth: true,
            gender: true,
            participantType: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Rekam kesehatan berhasil disimpan',
      healthRecord
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating health record:', error)
    return NextResponse.json(
      { error: 'Gagal menyimpan rekam kesehatan' },
      { status: 500 }
    )
  }
}
