import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
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

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const include = searchParams.get('include') || ''
    
    // For now, use distribution data as routes since we don't have separate Route model
    // In real implementation, you would have a dedicated Route model
    const distributions = await prisma.distribution.findMany({
      include: {
        driver: include.includes('driver'),
        vehicle: include.includes('vehicle'),
        schools: include.includes('schools') ? {
          include: {
            school: include.includes('school')
          },
          orderBy: {
            routeOrder: 'asc'
          }
        } : false
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform distributions to route format
    const routes = distributions.map(dist => ({
      id: `route-${dist.id}`,
      distributionId: dist.id,
      driverId: dist.driverId,
      vehicleId: dist.vehicleId,
      status: dist.status === 'DELIVERED' ? 'optimized' : 
              dist.status === 'IN_TRANSIT' ? 'planned' : 'draft',
      estimatedDistance: Math.random() * 50 + 10, // Mock calculation
      estimatedDuration: Math.random() * 120 + 60, // Mock calculation
      driver: dist.driver || {
        name: 'Unknown Driver',
        phone: 'No phone available'
      },
      vehicle: dist.vehicle || {
        plateNumber: 'No Vehicle Assigned',
        type: 'Unknown',
        capacity: 0
      },
      schools: dist.schools?.map(school => ({
        ...school,
        estimatedDeliveryTime: `${8 + Math.floor(Math.random() * 4)}:${30 + Math.floor(Math.random() * 30)}`.slice(0, 5)
      })) || []
    }))

    return NextResponse.json({
      success: true,
      data: routes
    })
  } catch (error) {
    console.error('Error fetching routes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch routes' },
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
      'routes:create'
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

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // In a real implementation, you would create route optimization logic here
    // For now, we'll return a success response
    return NextResponse.json({
      success: true,
      message: 'Route optimization completed'
    })
  } catch (error) {
    console.error('Error optimizing route:', error)
    return NextResponse.json(
      { error: 'Failed to optimize route' },
      { status: 500 }
    )
  }
}
