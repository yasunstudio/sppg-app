import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function POST(
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
      'production:create'
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

    const { batchId, notes } = await request.json()
    const { id } = await params
    const resourceId = id

    // Validate input
    if (!batchId) {
      return NextResponse.json(
        { error: "Batch ID is required" },
        { status: 400 }
      )
    }

    // Check if resource exists and is available
    const resource = await prisma.productionResource.findUnique({
      where: { id: resourceId }
    })

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      )
    }

    // Check if batch exists and is active
    const batch = await prisma.productionBatch.findUnique({
      where: { id: batchId }
    })

    if (!batch) {
      return NextResponse.json(
        { error: "Production batch not found" },
        { status: 404 }
      )
    }

    if (batch.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "Can only assign resources to active batches" },
        { status: 400 }
      )
    }

    // Create resource usage record
    const assignment = await prisma.resourceUsage.create({
      data: {
        resourceId: resourceId,
        batchId: batchId,
        startTime: new Date(),
        plannedDuration: 60, // Default 1 hour, can be customized
        notes: notes || null
      },
      include: {
        resource: true,
        batch: {
          include: {
            recipe: true
          }
        }
      }
    })

    // Update resource status to IN_USE
    await prisma.productionResource.update({
      where: { id: resourceId },
      data: { 
        status: "IN_USE",
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Resource assigned to batch successfully",
      data: assignment
    })

  } catch (error) {
    console.error("Error assigning resource to batch:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
