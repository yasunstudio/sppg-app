import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '24h'
    const category = searchParams.get('category')

    // Calculate time range
    const now = new Date()
    const startTime = new Date()
    
    switch (timeRange) {
      case '1h':
        startTime.setHours(now.getHours() - 1)
        break
      case '24h':
        startTime.setDate(now.getDate() - 1)
        break
      case '7d':
        startTime.setDate(now.getDate() - 7)
        break
      case '30d':
        startTime.setDate(now.getDate() - 30)
        break
      default:
        startTime.setDate(now.getDate() - 1)
    }

    // Get database performance metrics
    const dbStats = await getDatabaseStats(startTime)
    
    // Get API performance metrics (simulated for now)
    const apiStats = await getAPIStats(timeRange)
    
    // Get system metrics
    const systemStats = getSystemStats()

    const performanceData = {
      database: dbStats,
      api: apiStats,
      system: systemStats,
      timestamp: now.toISOString(),
      timeRange
    }

    return Response.json(performanceData)
  } catch (error) {
    console.error('Failed to get performance metrics:', error)
    return Response.json(
      { error: 'Failed to get performance metrics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'performance:create'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const metrics = await request.json()
    
    // In a real implementation, you would store these metrics in a time-series database
    // For now, we'll just log them
    console.log('Received performance metrics:', {
      timestamp: new Date().toISOString(),
      metrics
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Failed to store performance metrics:', error)
    return Response.json(
      { error: 'Failed to store performance metrics' },
      { status: 500 }
    )
  }
}

async function getDatabaseStats(startTime: Date) {
  try {
    // Get recent audit logs as a proxy for database activity
    const recentActivity = await prisma.auditLog.count({
      where: {
        createdAt: {
          gte: startTime
        }
      }
    })

    // Get table counts for size metrics
    const [
      userCount,
      menuItemCount,
      productionBatchCount,
      qualityCheckCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.menuItem.count(),
      prisma.productionBatch.count(),
      prisma.qualityCheck.count()
    ])

    return {
      recentActivity,
      totalRecords: userCount + menuItemCount + productionBatchCount + qualityCheckCount,
      tables: {
        users: userCount,
        menuItems: menuItemCount,
        productionBatches: productionBatchCount,
        qualityChecks: qualityCheckCount
      },
      queryTime: Math.random() * 50 + 10 // Simulated query time
    }
  } catch (error) {
    console.error('Failed to get database stats:', error)
    return {
      recentActivity: 0,
      totalRecords: 0,
      tables: {},
      queryTime: 0
    }
  }
}

async function getAPIStats(timeRange: string) {
  // In a real implementation, you would get these from request logs
  // For now, we'll simulate the data
  const baseRequests = timeRange === '1h' ? 100 : 
                      timeRange === '24h' ? 2400 :
                      timeRange === '7d' ? 16800 : 72000

  return {
    totalRequests: baseRequests + Math.floor(Math.random() * 100),
    averageResponseTime: Math.random() * 200 + 50,
    errorRate: Math.random() * 5,
    slowestEndpoint: '/api/quality-checkpoints',
    fastestEndpoint: '/api/auth/session',
    topEndpoints: [
      { path: '/api/quality-checkpoints', requests: Math.floor(baseRequests * 0.3) },
      { path: '/api/notifications', requests: Math.floor(baseRequests * 0.25) },
      { path: '/api/menu-items', requests: Math.floor(baseRequests * 0.2) },
      { path: '/api/users', requests: Math.floor(baseRequests * 0.15) },
      { path: '/api/production-batches', requests: Math.floor(baseRequests * 0.1) }
    ]
  }
}

function getSystemStats() {
  // In a real implementation, you would get actual system metrics
  return {
    memoryUsage: {
      used: Math.random() * 1024 + 512, // MB
      total: 2048,
      percentage: Math.random() * 60 + 20
    },
    cpuUsage: Math.random() * 70 + 10,
    diskUsage: {
      used: Math.random() * 50 + 20, // GB
      total: 100,
      percentage: Math.random() * 50 + 20
    },
    uptime: Math.floor(Math.random() * 86400 * 7), // seconds
    activeConnections: Math.floor(Math.random() * 50 + 10)
  }
}
