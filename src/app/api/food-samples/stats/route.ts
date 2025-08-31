// =======================================================================
// FOOD SAMPLES STATS API (src/app/api/food-samples/stats/route.ts)
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

    // Get overall stats
    const [
      totalSamples,
      storedSamples,
      testedSamples,
      disposedSamples,
      samplesThisWeek,
      samplesByType,
      recentSamples,
      expiringSoon
    ] = await Promise.all([
      // Total samples
      prisma.foodSample.count(),
      
      // By status
      prisma.foodSample.count({ where: { status: 'STORED' } }),
      prisma.foodSample.count({ where: { status: 'TESTED' } }),
      prisma.foodSample.count({ where: { status: 'DISPOSED' } }),

      // This week
      prisma.foodSample.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // By type
      prisma.foodSample.groupBy({
        by: ['sampleType'],
        _count: {
          id: true
        }
      }),

      // Recent samples
      prisma.foodSample.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          menuName: true,
          sampleType: true,
          status: true,
          createdAt: true
        }
      }),

      // Expiring soon (within 1 day of storage limit)
      prisma.foodSample.count({
        where: {
          status: 'STORED',
          sampleDate: {
            lte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago (assuming 3 day storage)
          }
        }
      })
    ])

    // Calculate completion rate (tested + disposed / total)
    const completionRate = totalSamples > 0 
      ? ((testedSamples + disposedSamples) / totalSamples) * 100 
      : 0

    // Format sample types data
    const sampleTypeStats = samplesByType.map(item => ({
      type: item.sampleType,
      count: item._count.id
    }))

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          total: totalSamples,
          stored: storedSamples,
          tested: testedSamples,
          disposed: disposedSamples,
          thisWeek: samplesThisWeek,
          expiringSoon,
          completionRate: Math.round(completionRate * 100) / 100
        },
        byType: sampleTypeStats,
        recent: recentSamples
      }
    })
  } catch (error) {
    console.error('Error fetching food sample stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
