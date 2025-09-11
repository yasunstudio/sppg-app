import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductionBatchStatus } from "@/generated/prisma";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// GET /api/production/batches - List production batches
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

        if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const recipeId = url.searchParams.get("recipeId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const where: any = {};
    
    // Handle multiple statuses separated by comma
    if (statusParam) {
      const statuses = statusParam.split(',').map(s => s.trim()) as ProductionBatchStatus[];
      if (statuses.length === 1) {
        where.status = statuses[0];
      } else {
        where.status = { in: statuses };
      }
    }
    if (recipeId) where.recipeId = recipeId;
    
    if (startDate || endDate) {
      where.productionPlan = {
        planDate: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      };
    }

    const [batches, total] = await Promise.all([
      prisma.productionBatch.findMany({
        where,
        include: {
          recipe: {
            select: {
              id: true,
              name: true,
              category: true,
              servingSize: true,
              prepTime: true,
              cookTime: true,
            },
          },
          productionPlan: {
            select: {
              id: true,
              planDate: true,
              targetPortions: true,
              status: true,
            },
          },
          qualityChecks: {
            select: {
              id: true,
              status: true,
            },
          },
          _count: {
            select: {
              qualityChecks: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.productionBatch.count({ where }),
    ]);

    // Calculate efficiency metrics for each batch
    const batchesWithMetrics = batches.map((batch) => {
      const efficiency = batch.actualQuantity && batch.plannedQuantity 
        ? (batch.actualQuantity / batch.plannedQuantity) * 100 
        : 0;

      const duration = batch.startedAt && batch.completedAt
        ? Math.round((new Date(batch.completedAt).getTime() - new Date(batch.startedAt).getTime()) / (1000 * 60))
        : 0;

      return {
        ...batch,
        metrics: {
          efficiency: Math.round(efficiency * 100) / 100,
          durationMinutes: duration,
          isOnTime: batch.recipe && duration > 0 
            ? duration <= (batch.recipe.prepTime + batch.recipe.cookTime) 
            : null,
        },
      };
    });

    return NextResponse.json({
      batches: batchesWithMetrics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching production batches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/production/batches - Create new production batch manually
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      productionPlanId,
      batchNumber,
      recipeId,
      plannedQuantity,
      notes,
    } = body;

    // Validate required fields
    if (!productionPlanId || !plannedQuantity) {
      return NextResponse.json(
        { error: "Production plan ID and planned quantity are required" },
        { status: 400 }
      );
    }

    // Verify production plan exists
    const productionPlan = await prisma.productionPlan.findUnique({
      where: { id: productionPlanId },
    });

    if (!productionPlan) {
      return NextResponse.json(
        { error: "Production plan not found" },
        { status: 404 }
      );
    }

    // Create production batch
    const batch = await prisma.productionBatch.create({
      data: {
        productionPlanId,
        batchNumber: batchNumber || `BATCH-${Date.now()}`,
        recipeId,
        plannedQuantity,
        status: ProductionBatchStatus.PENDING,
        notes,
      },
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            category: true,
            servingSize: true,
          },
        },
        productionPlan: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
          },
        },
      },
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error("Error creating production batch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
