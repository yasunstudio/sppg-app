// ============================================================================
// NUTRITION CONSULTATIONS STATS API (src/app/api/nutrition-consultations/stats/route.ts)
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
    const period = searchParams.get('period') || '30' // days

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get consultation statistics
    const [
      totalConsultations,
      pendingConsultations,
      answeredConsultations,
      closedConsultations,
      recentConsultations
    ] = await Promise.all([
      // Total consultations
      prisma.nutritionConsultation.count(),

      // Pending consultations
      prisma.nutritionConsultation.count({
        where: { status: 'PENDING' }
      }),

      // Answered consultations
      prisma.nutritionConsultation.count({
        where: { status: 'ANSWERED' }
      }),

      // Closed consultations
      prisma.nutritionConsultation.count({
        where: { status: 'CLOSED' }
      }),

      // Recent consultations (last 5)
      prisma.nutritionConsultation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            include: {
              school: true
            }
          }
        }
      })
    ])

    // Calculate percentages
    const completionRate = totalConsultations > 0 
      ? ((answeredConsultations / totalConsultations) * 100).toFixed(1)
      : '0'

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          total: totalConsultations,
          pending: pendingConsultations,
          answered: answeredConsultations,
          closed: closedConsultations,
          completionRate: parseFloat(completionRate)
        },
        recentConsultations,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching nutrition consultation stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
