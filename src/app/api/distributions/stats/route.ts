import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')

    // Build where clause for school-specific stats
    const where = schoolId ? {
      schools: {
        some: {
          schoolId: schoolId // Keep as string
        }
      }
    } : {}

    // Get distribution statistics
    const [
      totalDistributions,
      completedDistributions,
      todayDistributions,
      activeRoutes,
      totalPortionsToday,
      schoolsServedToday,
      averagePortions,
      statusCounts
    ] = await Promise.all([
      // Total distributions
      prisma.distribution.count({ where }),
      
      // Completed distributions
      prisma.distribution.count({
        where: {
          ...where,
          status: 'COMPLETED'
        }
      }),
      
      // Today's distributions
      prisma.distribution.count({
        where: {
          ...where,
          distributionDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),

      // Active routes (in transit)
      prisma.distribution.count({
        where: {
          ...where,
          status: 'IN_TRANSIT'
        }
      }),

      // Total portions today
      prisma.distribution.aggregate({
        where: {
          ...where,
          distributionDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        },
        _sum: {
          totalPortions: true
        }
      }),

      // Schools served today
      prisma.distributionSchool.findMany({
        where: {
          distribution: {
            distributionDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        },
        select: {
          schoolId: true
        },
        distinct: ['schoolId']
      }),
      
      // Average portions
      prisma.distribution.aggregate({
        where,
        _avg: {
          totalPortions: true
        }
      }),
      
      // Status distribution
      prisma.distribution.groupBy({
        by: ['status'],
        where,
        _count: {
          id: true
        }
      })
    ])

    const completionRate = totalDistributions > 0 
      ? Math.round((completedDistributions / totalDistributions) * 100)
      : 0

    return NextResponse.json({
      total: totalDistributions,
      completed: completedDistributions,
      todayDistributions: todayDistributions,
      activeRoutes: activeRoutes,
      totalPortions: totalPortionsToday._sum?.totalPortions || 0,
      schoolsServed: schoolsServedToday.length,
      completionRate,
      averagePortions: Math.round(averagePortions._avg?.totalPortions || 0),
      statusBreakdown: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count?.id || 0
        return acc
      }, {} as Record<string, number>)
    })
  } catch (error) {
    console.error('Error fetching distribution stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch distribution statistics' },
      { status: 500 }
    )
  }
}
