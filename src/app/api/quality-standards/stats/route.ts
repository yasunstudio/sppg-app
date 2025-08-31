import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || [];
    if (!hasPermission(userRoles, 'quality.check')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get total quality standards
    const totalStandards = await prisma.qualityStandard.count();

    // Get active standards
    const activeStandards = await prisma.qualityStandard.count({
      where: { isActive: true }
    });

    // Get standards by category
    const standardsByCategory = await prisma.qualityStandard.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    // Get standards with current values (being monitored)
    const monitoredStandards = await prisma.qualityStandard.count({
      where: {
        currentValue: {
          not: null
        },
        isActive: true
      }
    });

    // Get standards exceeding targets (performance issues)  
    const allStandards = await prisma.qualityStandard.findMany({
      where: {
        currentValue: {
          not: null
        },
        isActive: true
      }
    });

    const exceededStandards = allStandards.filter((s: any) => 
      s.currentValue !== null && s.currentValue > s.targetValue
    ).length;

    // Get standards below targets (underperforming)
    const belowTargetStandards = allStandards.filter((s: any) => 
      s.currentValue !== null && s.currentValue < s.targetValue
    ).length;

    // Get recent standards (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentStandards = await prisma.qualityStandard.count({
      where: {
        createdAt: { gte: sevenDaysAgo }
      }
    });

    // Calculate compliance rate (standards meeting targets)
    const meetingTargetStandards = allStandards.filter((s: any) => 
      s.currentValue !== null && s.currentValue >= s.targetValue
    ).length;

    const complianceRate = monitoredStandards > 0 
      ? Math.round((meetingTargetStandards / monitoredStandards) * 100) 
      : 0;

    return NextResponse.json({
      totalStandards,
      activeStandards,
      monitoredStandards,
      exceededStandards,
      belowTargetStandards,
      recentStandards,
      complianceRate,
      standardsByCategory: standardsByCategory.map((item: any) => ({
        category: item.category,
        count: item._count.id
      }))
    });
  } catch (error) {
    console.error('Error fetching quality standards stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
