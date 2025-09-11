// ============================================================================
// QUALITY STANDARDS STATS API ROUTE (src/app/api/quality-standards/stats/route.ts)
// Enhanced with Database-Driven Permission System
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

// GET: Get quality standards statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'quality.view')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get basic counts
    const [
      totalStandards,
      activeStandards,
      inactiveStandards
    ] = await Promise.all([
      prisma.qualityStandard.count(),
      prisma.qualityStandard.count({ where: { isActive: true } }),
      prisma.qualityStandard.count({ where: { isActive: false } })
    ])

    // Get standards by category
    const standardsByCategory = await prisma.qualityStandard.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      where: {
        isActive: true
      }
    })

    // Get compliance metrics
    const complianceData = await prisma.qualityStandard.findMany({
      where: {
        isActive: true,
        currentValue: { not: null }
      },
      select: {
        id: true,
        name: true,
        category: true,
        targetValue: true,
        currentValue: true,
        unit: true
      }
    })

    const complianceStats = complianceData.map(standard => {
      const compliance = standard.currentValue && standard.targetValue 
        ? Math.min((standard.currentValue / standard.targetValue) * 100, 100)
        : 0

      return {
        id: standard.id,
        name: standard.name,
        category: standard.category,
        targetValue: standard.targetValue,
        currentValue: standard.currentValue,
        unit: standard.unit,
        compliance: Math.round(compliance),
        status: compliance >= 95 ? 'excellent' : 
                compliance >= 80 ? 'good' : 
                compliance >= 60 ? 'fair' : 'poor'
      }
    })

    const averageCompliance = complianceStats.length > 0
      ? Math.round(complianceStats.reduce((sum, item) => sum + item.compliance, 0) / complianceStats.length)
      : 0

    // Get trending data (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentStandards = await prisma.qualityStandard.count({
      where: {
        createdAt: { gte: sevenDaysAgo }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalStandards,
          activeStandards,
          inactiveStandards,
          averageCompliance,
          recentStandards
        },
        categoryBreakdown: standardsByCategory.map(item => ({
          category: item.category,
          count: item._count.id
        })),
        complianceMetrics: {
          averageCompliance,
          standardsAbove95: complianceStats.filter(s => s.compliance >= 95).length,
          standardsAbove80: complianceStats.filter(s => s.compliance >= 80).length,
          standardsBelow60: complianceStats.filter(s => s.compliance < 60).length,
          details: complianceStats
        }
      }
    })

  } catch (error) {
    console.error('Error in GET /api/quality-standards/stats:', error)
    return NextResponse.json(
      { error: 'Failed to get quality standards statistics' },
      { status: 500 }
    )
  }
}
