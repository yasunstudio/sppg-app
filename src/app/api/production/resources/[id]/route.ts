import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// prisma imported from lib

// GET /api/production/resources/[id] - Get single resource
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'production:read'
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

    const { id } = await params
    const resourceId = id

    const resource = await prisma.productionResource.findUnique({
      where: { id: resourceId },
      include: {
        usage: {
          where: {
            endTime: null // Active usage
          },
          include: {
            batch: {
              select: {
                id: true,
                batchNumber: true,
                status: true,
                recipe: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Add additional computed fields
    const enrichedResource = {
      ...resource,
      isActive: resource.status !== 'MAINTENANCE',
      currentUsage: resource.usage[0] || null,
      notes: resource.specifications ? 
        (typeof resource.specifications === 'object' && resource.specifications !== null ? 
          (resource.specifications as any).notes || '' : '') : 
        ''
    }

    return NextResponse.json({
      data: enrichedResource,
      message: 'Resource fetched successfully'
    })
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/production/resources/[id] - Update resource
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'production:update'
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

    const { id } = await params
    const resourceId = id
    const body = await request.json()

    const updatedResource = await prisma.productionResource.update({
      where: { id: resourceId },
      data: body,
    })

    return NextResponse.json({
      data: updatedResource,
      message: 'Resource updated successfully'
    })
  } catch (error) {
    console.error('[RESOURCE_PUT]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/production/resources/[id] - Update resource (partial)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'production:update'
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

    const { id } = await params
    const resourceId = id
    const body = await request.json()

    const updatedResource = await prisma.productionResource.update({
      where: { id: resourceId },
      data: body,
    })

    return NextResponse.json({
      data: updatedResource,
      message: 'Resource updated successfully'
    })
  } catch (error) {
    console.error('[RESOURCE_PATCH]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/production/resources/[id] - Delete resource (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'production:delete'
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

    const { id } = await params
    const resourceId = id

    // Soft delete by updating a deletedAt field if it exists, 
    // or just update status to indicate it's inactive
    const deletedResource = await prisma.productionResource.update({
      where: { id: resourceId },
      data: {
        status: 'MAINTENANCE', // Mark as maintenance instead of hard delete
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      data: deletedResource,
      message: 'Resource deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
