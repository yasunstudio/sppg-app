import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin access
    const userRole = session.user?.role;
    const hasAdminAccess = userRole && ['ADMIN', 'KEPALA_SPPG'].includes(userRole);

    if (!hasAdminAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get comprehensive dashboard statistics
    const [
      totalUsers,
      totalSchools,
      totalStudents,
      totalSuppliers,
      activeProduction,
      pendingDistributions,
      recentUsers,
      systemAlerts
    ] = await Promise.all([
      // Basic counts
      prisma.user.count(),
      prisma.school.count(),
      prisma.student.count(),
      prisma.supplier.count(),
      
      // Production stats
      prisma.productionBatch.count({
        where: {
          status: 'IN_PROGRESS'
        }
      }),
      
      // Distribution stats
      prisma.distribution.count({
        where: {
          status: 'PREPARING'
        }
      }),
      
      // Recent activity
      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          roles: true
        }
      }),
      
      // System alerts (mock for now)
      3 // This would come from a monitoring system
    ]);

    // Get recent activity data
    const recentActivity = await Promise.all([
      // Recent user registrations
      prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          roles: true
        }
      }),
      
      // Recent production batches
      prisma.productionBatch.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          batchNumber: true,
          status: true,
          createdAt: true
        }
      }),
      
      // Recent distributions
      prisma.distribution.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          schools: {
            include: {
              school: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })
    ]);

    // Define activity item type
    interface ActivityItem {
      id: string;
      type: 'user' | 'production' | 'distribution' | 'system';
      message: string;
      timestamp: string;
      severity: 'info' | 'warning' | 'error';
    }

    // Format activity timeline
    const activityItems: ActivityItem[] = [];
    
    // Add user activities
    recentActivity[0].forEach(user => {
      activityItems.push({
        id: `user-${user.id}`,
        type: 'user',
        message: `New user registered: ${user.name} (${user.roles.join(', ')})`,
        timestamp: getRelativeTime(user.createdAt),
        severity: 'info'
      });
    });

    // Add production activities
    recentActivity[1].forEach(batch => {
      activityItems.push({
        id: `production-${batch.id}`,
        type: 'production',
        message: `Production batch ${batch.batchNumber} status: ${batch.status}`,
        timestamp: getRelativeTime(batch.createdAt),
        severity: batch.status === 'COMPLETED' ? 'info' : 'warning'
      });
    });

    // Add distribution activities
    recentActivity[2].forEach(distribution => {
      const schoolName = distribution.schools[0]?.school?.name || 'Unknown School';
      activityItems.push({
        id: `distribution-${distribution.id}`,
        type: 'distribution',
        message: `Distribution to ${schoolName}: ${distribution.status}`,
        timestamp: getRelativeTime(distribution.createdAt),
        severity: distribution.status === 'DELIVERED' ? 'info' : 'warning'
      });
    });

    // Sort by timestamp (most recent first)
    activityItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Mock system health data (in production, this would come from monitoring services)
    const systemHealth = {
      database: 'healthy',
      api: 'healthy',
      storage: 'warning' // Example: storage might be getting full
    };

    const stats = {
      totalUsers,
      totalSchools,
      totalStudents,
      totalSuppliers,
      activeProduction,
      pendingDistributions,
      systemAlerts,
      recentActivity: activityItems.slice(0, 10), // Limit to 10 most recent
      systemHealth,
      recentUsers,
      // Additional metrics
      metrics: {
        userGrowth: {
          current: totalUsers,
          previous: Math.max(0, totalUsers - Math.floor(Math.random() * 10)), // Mock previous period
          percentage: Math.floor(Math.random() * 20) + 5 // Mock growth percentage
        },
        schoolGrowth: {
          current: totalSchools,
          previous: Math.max(0, totalSchools - Math.floor(Math.random() * 3)),
          percentage: Math.floor(Math.random() * 15) + 2
        },
        productionEfficiency: Math.floor(Math.random() * 20) + 80, // Mock efficiency percentage
        distributionSuccess: Math.floor(Math.random() * 10) + 90 // Mock success rate
      }
    };

    return NextResponse.json(stats);
    
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
}
