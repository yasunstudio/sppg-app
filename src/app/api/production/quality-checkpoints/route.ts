import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
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

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const status = searchParams.get("status")
    const checkpointType = searchParams.get("checkpointType")

    // Build where clause
    const where: any = {
      ...(status && { status }),
      ...(checkpointType && { checkpointType })
    }

    const [qualityCheckpoints, total] = await Promise.all([
      prisma.qualityCheckpoint.findMany({
        where,
        include: {
          batch: {
            select: {
              batchNumber: true,
              productionPlan: {
                select: {
                  menu: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          },
          checker: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { checkedAt: "desc" },
        take: limit,
        skip: offset
      }),
      prisma.qualityCheckpoint.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: qualityCheckpoints,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error("Error fetching quality checkpoints:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch quality checkpoints",
        details: error instanceof Error ? error.message : "Unknown error"
      },
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
      'production:create'
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

    const body = await request.json()
    
    const {
      productionPlanId,
      batchId,
      checkpointType,
      checkedBy,
      status,
      temperature,
      visualInspection,
      tasteTest,
      textureEvaluation,
      correctiveAction,
      photos,
      metrics,
      notes
    } = body

    const qualityCheckpoint = await prisma.qualityCheckpoint.create({
      data: {
        productionPlanId,
        batchId,
        checkpointType,
        checkedBy,
        status,
        temperature,
        visualInspection,
        tasteTest,
        textureEvaluation,
        correctiveAction,
        photos: photos || [],
        metrics,
        notes
      },
      include: {
        batch: {
          select: {
            batchNumber: true
          }
        },
        checker: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: qualityCheckpoint
    })

  } catch (error) {
    console.error("Error creating quality checkpoint:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create quality checkpoint",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
