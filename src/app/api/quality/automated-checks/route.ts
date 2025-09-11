import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QualityCheckStatus } from "@/generated/prisma";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// POST /api/quality/automated-checks - Run automated quality checks
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'quality:create'
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
      batchId,
      temperature,
      pH,
      moisture,
      visualInspection,
      automaticChecks = true,
    } = body;

    if (!batchId) {
      return NextResponse.json(
        { error: "Batch ID is required" },
        { status: 400 }
      );
    }

    // Get batch information
    const batch = await prisma.productionBatch.findUnique({
      where: { id: batchId },
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Production batch not found" },
        { status: 404 }
      );
    }

    // Get quality standards (simplified approach without relation)
    const qualityStandards = [
      { parameter: "temperature", minValue: "60", maxValue: "80" },
      { parameter: "pH", minValue: "4.0", maxValue: "7.0" },
      { parameter: "moisture", minValue: "10", maxValue: "65" },
    ];
    
    // Automated quality assessment
    type QualityStatus = "PASS" | "FAIL";
    const qualityAssessment = {
      temperature: {
        value: temperature,
        status: "PASS" as QualityStatus,
        message: "Normal",
      },
      pH: {
        value: pH,
        status: "PASS" as QualityStatus,
        message: "Within acceptable range",
      },
      moisture: {
        value: moisture,
        status: "PASS" as QualityStatus,
        message: "Optimal moisture level",
      },
      overall: "PASS" as QualityStatus,
    };

    // Temperature validation
    if (qualityStandards.length > 0) {
      const tempStandard = qualityStandards.find(s => s.parameter === "temperature");
      if (tempStandard && temperature) {
        const minTemp = parseFloat(tempStandard.minValue || "0");
        const maxTemp = parseFloat(tempStandard.maxValue || "100");
        
        if (temperature < minTemp || temperature > maxTemp) {
          qualityAssessment.temperature.status = "FAIL";
          qualityAssessment.temperature.message = `Temperature ${temperature}°C outside acceptable range (${minTemp}-${maxTemp}°C)`;
          qualityAssessment.overall = "FAIL";
        }
      }
    }

    // pH validation
    if (qualityStandards.length > 0) {
      const pHStandard = qualityStandards.find(s => s.parameter === "pH");
      if (pHStandard && pH) {
        const minPH = parseFloat(pHStandard.minValue || "0");
        const maxPH = parseFloat(pHStandard.maxValue || "14");
        
        if (pH < minPH || pH > maxPH) {
          qualityAssessment.pH.status = "FAIL";
          qualityAssessment.pH.message = `pH ${pH} outside acceptable range (${minPH}-${maxPH})`;
          qualityAssessment.overall = "FAIL";
        }
      }
    }

    // Moisture validation
    if (qualityStandards.length > 0) {
      const moistureStandard = qualityStandards.find(s => s.parameter === "moisture");
      if (moistureStandard && moisture) {
        const minMoisture = parseFloat(moistureStandard.minValue || "0");
        const maxMoisture = parseFloat(moistureStandard.maxValue || "100");
        
        if (moisture < minMoisture || moisture > maxMoisture) {
          qualityAssessment.moisture.status = "FAIL";
          qualityAssessment.moisture.message = `Moisture ${moisture}% outside acceptable range (${minMoisture}-${maxMoisture}%)`;
          qualityAssessment.overall = "FAIL";
        }
      }
    }

    // Create quality checkpoint record
    const qualityCheckpoint = await prisma.qualityCheckpoint.create({
      data: {
        batchId: batchId,
        checkpointType: "automated_quality_check",
        checkedAt: new Date(),
        temperature: temperature ? parseFloat(temperature.toString()) : null,
        visualInspection: visualInspection || null,
        notes: `Automated quality check - Overall: ${qualityAssessment.overall}. pH: ${pH || 'N/A'}, Moisture: ${moisture || 'N/A'}%`,
        checkedBy: session.user.id,
        status: qualityAssessment.overall === "PASS" ? QualityCheckStatus.PASS : QualityCheckStatus.FAIL,
      },
    });

    // If quality check fails, create alert
    let alert = null;
    if (qualityAssessment.overall === "FAIL") {
      alert = await prisma.notification.create({
        data: {
          type: "QUALITY_ALERT",
          title: "Quality Check Failed",
          message: `Batch ${batch.batchNumber} failed automated quality checks`,
          isRead: false,
          userId: session.user.id,
        },
      });
    }

    // Generate recommendations based on results
    const recommendations = [];
    
    if (qualityAssessment.temperature.status === "FAIL") {
      recommendations.push({
        type: "temperature_correction",
        message: "Adjust cooking temperature or holding temperature",
        priority: "HIGH",
      });
    }
    
    if (qualityAssessment.pH.status === "FAIL") {
      recommendations.push({
        type: "pH_correction",
        message: "Check ingredient ratios and fermentation process",
        priority: "MEDIUM",
      });
    }
    
    if (qualityAssessment.moisture.status === "FAIL") {
      recommendations.push({
        type: "moisture_correction",
        message: "Adjust cooking time or storage conditions",
        priority: "MEDIUM",
      });
    }

    return NextResponse.json({
      checkpoint: qualityCheckpoint,
      assessment: qualityAssessment,
      recommendations,
      alert: alert || null,
      batchInfo: {
        id: batch.id,
        batchNumber: batch.batchNumber,
        recipeName: batch.recipe?.name || "Unknown Recipe",
        status: batch.status,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error in automated quality check:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET /api/quality/automated-checks - Get quality check history
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'quality:read'
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get("batchId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (batchId) {
      where.productionBatchId = batchId;
    }

    const [checkpoints, total] = await Promise.all([
      prisma.qualityCheckpoint.findMany({
        where,
        include: {
          checker: {
            select: {
              id: true,
              name: true,
            },
          },
          batch: {
            select: {
              id: true,
              batchNumber: true,
              recipe: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { checkedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.qualityCheckpoint.count({ where }),
    ]);

    return NextResponse.json({
      checkpoints,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
      },
    });

  } catch (error) {
    console.error("Error fetching quality checks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
