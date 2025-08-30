import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/monitoring/real-time - Get real-time system monitoring data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("range") || "today"; // today, week, month
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate.setHours(0, 0, 0, 0);
    }

    // Get real-time metrics in parallel
    const [
      productionMetrics,
      distributionMetrics,
      qualityMetrics,
      inventoryMetrics,
      posyanduMetrics,
      systemAlerts,
    ] = await Promise.all([
      getProductionMetrics(startDate, now),
      getDistributionMetrics(startDate, now),
      getQualityMetrics(startDate, now),
      getInventoryMetrics(),
      getPosyanduMetrics(startDate, now),
      getSystemAlerts(startDate, now),
    ]);

    // Calculate overall system health
    const systemHealth = calculateSystemHealth({
      production: productionMetrics,
      distribution: distributionMetrics,
      quality: qualityMetrics,
      inventory: inventoryMetrics,
    });

    return NextResponse.json({
      timestamp: now.toISOString(),
      timeRange,
      systemHealth,
      metrics: {
        production: productionMetrics,
        distribution: distributionMetrics,
        quality: qualityMetrics,
        inventory: inventoryMetrics,
        posyandu: posyanduMetrics,
      },
      alerts: systemAlerts,
      recommendations: generateSystemRecommendations({
        production: productionMetrics,
        distribution: distributionMetrics,
        quality: qualityMetrics,
        inventory: inventoryMetrics,
      }),
    });

  } catch (error) {
    console.error("Error fetching real-time monitoring data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Get production metrics
async function getProductionMetrics(startDate: Date, endDate: Date) {
  const [batches, totalPortions, activeRecipes] = await Promise.all([
    prisma.productionBatch.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        status: true,
        plannedQuantity: true,
        actualQuantity: true,
        createdAt: true,
      },
    }),
    prisma.productionBatch.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        actualQuantity: { not: null },
      },
      _sum: {
        actualQuantity: true,
      },
    }),
    prisma.recipe.count({
      where: { isActive: true },
    }),
  ]);

  const batchesByStatus = batches.reduce((acc: any, batch) => {
    acc[batch.status] = (acc[batch.status] || 0) + 1;
    return acc;
  }, {});

  const efficiency = batches.length > 0 
    ? Math.round((batchesByStatus.COMPLETED || 0) / batches.length * 100) 
    : 0;

  return {
    totalBatches: batches.length,
    batchesByStatus,
    totalPortions: totalPortions._sum.actualQuantity || 0,
    activeRecipes,
    efficiency,
    status: efficiency >= 80 ? "excellent" : efficiency >= 60 ? "good" : "needs_attention",
  };
}

// Get distribution metrics
async function getDistributionMetrics(startDate: Date, endDate: Date) {
  const [distributions, totalDeliveries] = await Promise.all([
    prisma.distribution.findMany({
      where: {
        distributionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        schools: true,
      },
    }),
    prisma.delivery.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  const distributionsByStatus = distributions.reduce((acc: any, dist) => {
    acc[dist.status] = (acc[dist.status] || 0) + 1;
    return acc;
  }, {});

  const totalSchools = distributions.reduce((sum, dist) => sum + dist.schools.length, 0);
  const completionRate = distributions.length > 0 
    ? Math.round((distributionsByStatus.COMPLETED || 0) / distributions.length * 100)
    : 0;

  return {
    totalDistributions: distributions.length,
    distributionsByStatus,
    totalSchools,
    totalDeliveries,
    completionRate,
    status: completionRate >= 90 ? "excellent" : completionRate >= 70 ? "good" : "needs_attention",
  };
}

// Get quality metrics
async function getQualityMetrics(startDate: Date, endDate: Date) {
  const [checkpoints, totalChecks] = await Promise.all([
    prisma.qualityCheckpoint.findMany({
      where: {
        checkedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        status: true,
        temperature: true,
      },
    }),
    prisma.qualityCheckpoint.count({
      where: {
        checkedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  const checkpointsByStatus = checkpoints.reduce((acc: any, checkpoint) => {
    acc[checkpoint.status] = (acc[checkpoint.status] || 0) + 1;
    return acc;
  }, {});

  const passRate = totalChecks > 0 
    ? Math.round((checkpointsByStatus.PASS || 0) / totalChecks * 100)
    : 0;

  const avgTemperature = checkpoints.length > 0
    ? Math.round(checkpoints
        .filter(c => c.temperature !== null)
        .reduce((sum, c) => sum + (c.temperature || 0), 0) / 
        checkpoints.filter(c => c.temperature !== null).length * 10) / 10
    : 0;

  return {
    totalChecks,
    checkpointsByStatus,
    passRate,
    avgTemperature,
    status: passRate >= 95 ? "excellent" : passRate >= 85 ? "good" : "needs_attention",
  };
}

// Get inventory metrics
async function getInventoryMetrics() {
  const [inventoryItems, lowStockItems] = await Promise.all([
    prisma.inventoryItem.findMany({
      include: {
        rawMaterial: {
          select: {
            name: true,
            unit: true,
          },
        },
      },
    }),
    prisma.inventoryItem.findMany({
      where: {
        quantity: {
          lte: 10, // Low stock threshold
        },
      },
      include: {
        rawMaterial: {
          select: {
            name: true,
            unit: true,
          },
        },
      },
    }),
  ]);

  const totalValue = inventoryItems.reduce((sum: number, item: any) => 
    sum + (item.quantity * item.unitPrice), 0
  );

  const stockStatus = lowStockItems.length === 0 ? "excellent" :
    lowStockItems.length <= 5 ? "good" : "needs_attention";

  return {
    totalItems: inventoryItems.length,
    totalValue: Math.round(totalValue),
    lowStockItems: lowStockItems.length,
    lowStockDetails: lowStockItems.map((item: any) => ({
      name: item.rawMaterial.name,
      quantity: item.quantity,
      unit: item.rawMaterial.unit,
    })),
    status: stockStatus,
  };
}

// Get posyandu metrics
async function getPosyanduMetrics(startDate: Date, endDate: Date) {
  const [totalPosyandu, activePrograms, totalParticipants] = await Promise.all([
    prisma.posyandu.count(),
    prisma.posyanduProgram.count({
      where: { status: "ACTIVE" },
    }),
    prisma.posyanduParticipant.count(),
  ]);

  return {
    totalPosyandu,
    activePrograms,
    totalParticipants,
    status: activePrograms > 0 ? "good" : "needs_attention",
  };
}

// Get system alerts
async function getSystemAlerts(startDate: Date, endDate: Date) {
  const notifications = await prisma.notification.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      type: {
        in: ["QUALITY_ALERT", "INVENTORY_LOW"],
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return notifications.map(notif => ({
    id: notif.id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    timestamp: notif.createdAt,
    isRead: notif.isRead,
  }));
}

// Calculate overall system health
function calculateSystemHealth(metrics: any) {
  const scores = [
    metrics.production.efficiency,
    metrics.distribution.completionRate,
    metrics.quality.passRate,
    metrics.inventory.status === "excellent" ? 100 : 
      metrics.inventory.status === "good" ? 80 : 60,
  ];

  const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  
  let status = "needs_attention";
  let message = "System performance needs improvement";
  
  if (overallScore >= 90) {
    status = "excellent";
    message = "All systems operating optimally";
  } else if (overallScore >= 75) {
    status = "good";
    message = "Systems operating well with minor issues";
  } else if (overallScore >= 60) {
    status = "fair";
    message = "Some systems need attention";
  }

  return {
    score: overallScore,
    status,
    message,
  };
}

// Generate system recommendations
function generateSystemRecommendations(metrics: any) {
  const recommendations = [];

  if (metrics.production.efficiency < 70) {
    recommendations.push({
      type: "production_optimization",
      message: "Production efficiency is low. Review batch planning and resource allocation.",
      priority: "HIGH",
    });
  }

  if (metrics.distribution.completionRate < 80) {
    recommendations.push({
      type: "distribution_improvement",
      message: "Distribution completion rate needs improvement. Optimize routes and schedules.",
      priority: "HIGH",
    });
  }

  if (metrics.quality.passRate < 90) {
    recommendations.push({
      type: "quality_enhancement",
      message: "Quality pass rate is below target. Review quality control processes.",
      priority: "MEDIUM",
    });
  }

  if (metrics.inventory.lowStockItems > 5) {
    recommendations.push({
      type: "inventory_management",
      message: "Multiple items are running low. Review purchasing and inventory planning.",
      priority: "MEDIUM",
    });
  }

  return recommendations;
}
