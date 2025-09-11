// =======================================================================
// SINGLE FOOD SAMPLE API (src/app/api/food-samples/[id]/route.ts)
// =======================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

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

    const { id } = await params

    const sample = await prisma.foodSample.findUnique({
      where: { id }
    })

    if (!sample) {
      return NextResponse.json({ error: 'Food sample not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: sample
    })
  } catch (error) {
    console.error('Error fetching food sample:', error)
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'foodSamples:update'
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

    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params
    const body = await request.json()
    
    const {
      sampleDate,
      menuName,
      batchNumber,
      sampleType,
      storageDays,
      status,
      notes,
      disposedAt
    } = body

    // Validate required fields
    if (!menuName || !batchNumber || !sampleType) {
      return NextResponse.json(
        { error: 'Menu name, batch number, and sample type are required' },
        { status: 400 }
      )
    }

    // Validate enums
    const validSampleTypes = ['RAW_MATERIAL', 'COOKED_FOOD', 'PACKAGED_MEAL']
    const validStatuses = ['STORED', 'TESTED', 'DISPOSED']

    if (!validSampleTypes.includes(sampleType)) {
      return NextResponse.json(
        { error: 'Invalid sample type' },
        { status: 400 }
      )
    }

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Check if sample exists
    const existingSample = await prisma.foodSample.findUnique({
      where: { id }
    })

    if (!existingSample) {
      return NextResponse.json({ error: 'Food sample not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {
      menuName,
      batchNumber,
      sampleType,
      storageDays: storageDays || 3,
      status: status || 'STORED',
      notes: notes || null
    }

    if (sampleDate) {
      updateData.sampleDate = new Date(sampleDate)
    }

    if (disposedAt) {
      updateData.disposedAt = new Date(disposedAt)
    }

    const sample = await prisma.foodSample.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: sample
    })
  } catch (error) {
    console.error('Error updating food sample:', error)
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'foodSamples:delete'
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

    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params

    // Check if sample exists
    const existingSample = await prisma.foodSample.findUnique({
      where: { id }
    })

    if (!existingSample) {
      return NextResponse.json({ error: 'Food sample not found' }, { status: 404 })
    }

    await prisma.foodSample.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Food sample deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting food sample:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
