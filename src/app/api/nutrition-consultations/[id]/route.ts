// =======================================================================
// SINGLE NUTRITION CONSULTATION API (src/app/api/nutrition-consultations/[id]/route.ts)
// =======================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const consultation = await prisma.nutritionConsultation.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            school: true
          }
        }
      }
    })

    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: consultation
    })
  } catch (error) {
    console.error('Error fetching consultation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    const { studentId, question, answer, status } = body

    // Validate required fields
    if (!studentId || !question) {
      return NextResponse.json(
        { error: 'Student ID and question are required' },
        { status: 400 }
      )
    }

    // Validate status
    if (status && !['PENDING', 'ANSWERED', 'CLOSED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Check if consultation exists
    const existingConsultation = await prisma.nutritionConsultation.findUnique({
      where: { id }
    })

    if (!existingConsultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const consultation = await prisma.nutritionConsultation.update({
      where: { id },
      data: {
        studentId,
        question,
        answer: answer || null,
        status: status || 'PENDING'
      },
      include: {
        student: {
          include: {
            school: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: consultation
    })
  } catch (error) {
    console.error('Error updating consultation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if consultation exists
    const existingConsultation = await prisma.nutritionConsultation.findUnique({
      where: { id }
    })

    if (!existingConsultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })
    }

    await prisma.nutritionConsultation.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Consultation deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting consultation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
