import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, QualityCheckStatus } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const checkpointType = url.searchParams.get("type")
    const batchId = url.searchParams.get("batchId")
    const planId = url.searchParams.get("planId")
    const limit = parseInt(url.searchParams.get("limit") || "20")

    const where: any = {}
    if (status) where.status = status
    if (checkpointType) where.checkpointType = checkpointType
    if (batchId) where.batchId = batchId
    if (planId) where.productionPlanId = planId

    // First, try to get existing quality checkpoints from database
    const qualityCheckpoints = await prisma.qualityCheckpoint.findMany({
      where,
      take: limit,
      orderBy: {
        checkedAt: "desc"
      },
      include: {
        productionPlan: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
            menu: {
              select: {
                id: true,
                name: true,
                mealType: true
              }
            }
          }
        },
        batch: {
          select: {
            id: true,
            batchNumber: true,
            status: true
          }
        },
        checker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // If we have existing data, return it
    if (qualityCheckpoints.length > 0) {
      return NextResponse.json(qualityCheckpoints)
    }

    // If no data exists and no specific filters, create sample data for demo purposes
    if (!status && !checkpointType && !batchId && !planId) {
      console.log("No quality checkpoints found, creating sample data for demo...")
      
      // Get existing production plans and batches for realistic relationships
      const productionPlans = await prisma.productionPlan.findMany({
        take: 3,
        include: { menu: true }
      })
      
      const productionBatches = await prisma.productionBatch.findMany({
        take: 3
      })

      const users = await prisma.user.findMany({
        take: 2
      })

      if (productionPlans.length > 0 && users.length > 0) {
        const sampleCheckpoints = [
          {
            productionPlanId: productionPlans[0]?.id,
            batchId: productionBatches[0]?.id || null,
            checkpointType: "RAW_MATERIAL_INSPECTION",
            checkedBy: users[0].id,
            status: QualityCheckStatus.PASS,
            temperature: 4.5,
            visualInspection: "Sayuran segar, tidak ada tanda-tanda pembusukan. Warna hijau cerah dan tekstur masih renyah.",
            tasteTest: null,
            textureEvaluation: "Tekstur sayuran masih segar dan renyah",
            correctiveAction: null,
            photos: ["/images/quality/raw-vegetables-inspection.jpg"],
            metrics: {
              freshness_score: 95,
              visual_rating: 5,
              temperature_check: "passed",
              expiry_date_check: "passed"
            },
            notes: "Semua bahan baku memenuhi standar kualitas. Sayuran dari supplier terpercaya.",
            checkedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          {
            productionPlanId: productionPlans[1]?.id,
            batchId: productionBatches[1]?.id || null,
            checkpointType: "COOKING_PROCESS",
            checkedBy: users[0].id,
            status: QualityCheckStatus.PASS,
            temperature: 75.2,
            visualInspection: "Makanan termasak sempurna dengan warna golden brown yang menarik",
            tasteTest: "Rasa gurih dan manis seimbang, bumbu meresap dengan baik",
            textureEvaluation: "Tekstur lembut namun tidak lembek, masih ada sedikit bite",
            correctiveAction: null,
            photos: ["/images/quality/cooking-process.jpg"],
            metrics: {
              cooking_temperature: 75.2,
              cooking_time: 25,
              taste_score: 4.8,
              texture_score: 4.7,
              visual_score: 4.9
            },
            notes: "Proses memasak berjalan sesuai SOP. Temperature cooking optimal.",
            checkedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          },
          {
            productionPlanId: productionPlans[2]?.id,
            batchId: productionBatches[2]?.id || null,
            checkpointType: "FINAL_INSPECTION",
            checkedBy: users[1]?.id || users[0].id,
            status: QualityCheckStatus.CONDITIONAL,
            temperature: 65.0,
            visualInspection: "Penampilan makanan menarik, namun ada sedikit ketidakseragaman dalam pemotongan",
            tasteTest: "Rasa sesuai standar, namun sedikit kurang garam",
            textureEvaluation: "Tekstur baik secara keseluruhan",
            correctiveAction: "Tambahkan sedikit garam dan perbaiki konsistensi pemotongan untuk batch selanjutnya",
            photos: ["/images/quality/final-inspection.jpg"],
            metrics: {
              overall_score: 3.8,
              taste_score: 3.5,
              visual_score: 4.0,
              texture_score: 4.2,
              temperature_check: "passed"
            },
            notes: "Kualitas dapat diterima dengan catatan perbaikan untuk batch berikutnya.",
            checkedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
          },
          {
            productionPlanId: productionPlans[0]?.id,
            batchId: null,
            checkpointType: "PACKAGING_CHECK",
            checkedBy: users[0].id,
            status: QualityCheckStatus.PASS,
            temperature: null,
            visualInspection: "Kemasan rapi, label tertempel dengan baik, tidak ada kebocoran",
            tasteTest: null,
            textureEvaluation: null,
            correctiveAction: null,
            photos: ["/images/quality/packaging-check.jpg"],
            metrics: {
              packaging_integrity: 100,
              label_accuracy: 100,
              portion_weight: 250.5,
              target_weight: 250
            },
            notes: "Kemasan memenuhi standar keamanan pangan dan ready untuk distribusi.",
            checkedAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
          },
          {
            productionPlanId: productionPlans[1]?.id,
            batchId: productionBatches[1]?.id || null,
            checkpointType: "TEMPERATURE_MONITORING",
            checkedBy: users[1]?.id || users[0].id,
            status: QualityCheckStatus.FAIL,
            temperature: 55.0,
            visualInspection: "Makanan terlihat normal namun temperature dibawah standar",
            tasteTest: "Rasa normal namun tidak cukup panas",
            textureEvaluation: "Tekstur baik",
            correctiveAction: "Reheat makanan hingga mencapai temperature minimum 65°C sebelum packaging",
            photos: ["/images/quality/temperature-fail.jpg"],
            metrics: {
              required_temp: 65.0,
              actual_temp: 55.0,
              temperature_gap: -10.0,
              safety_status: "below_threshold"
            },
            notes: "Temperature dibawah standar keamanan. Perlu pemanasan ulang sebelum packaging.",
            checkedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
          },
          {
            productionPlanId: productionPlans[2]?.id,
            batchId: null,
            checkpointType: "HYGIENE_CHECK",
            checkedBy: users[0].id,
            status: QualityCheckStatus.PASS,
            temperature: null,
            visualInspection: "Area kerja bersih, peralatan sudah disanitasi dengan baik",
            tasteTest: null,
            textureEvaluation: null,
            correctiveAction: null,
            photos: ["/images/quality/hygiene-check.jpg"],
            metrics: {
              cleanliness_score: 98,
              sanitization_status: "complete",
              equipment_cleanliness: "excellent"
            },
            notes: "Standar hygiene terpenuhi dengan baik. Tim kitchen sudah menjalankan SOP dengan benar.",
            checkedAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
          }
        ]

        // Create sample checkpoints
        const createdCheckpoints = []
        for (const checkpoint of sampleCheckpoints) {
          try {
            const created = await prisma.qualityCheckpoint.create({
              data: checkpoint,
              include: {
                productionPlan: {
                  select: {
                    id: true,
                    planDate: true,
                    targetPortions: true,
                    menu: {
                      select: {
                        id: true,
                        name: true,
                        mealType: true
                      }
                    }
                  }
                },
                batch: {
                  select: {
                    id: true,
                    batchNumber: true,
                    status: true
                  }
                },
                checker: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            })
            createdCheckpoints.push(created)
          } catch (createError) {
            console.error("Error creating sample checkpoint:", createError)
          }
        }

        return NextResponse.json(createdCheckpoints)
      }
    }

    // Return empty array if no data and can't create samples
    return NextResponse.json([])
  } catch (error) {
    console.error("Error fetching quality checkpoints:", error)
    return NextResponse.json(
      { error: "Failed to fetch quality checkpoints" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.checkpointType || !body.checkedBy || !body.status) {
      return NextResponse.json(
        { error: "Missing required fields: checkpointType, checkedBy, status" },
        { status: 400 }
      )
    }

    const qualityCheckpoint = await prisma.qualityCheckpoint.create({
      data: {
        productionPlanId: body.productionPlanId || null,
        batchId: body.batchId || null,
        checkpointType: body.checkpointType,
        checkedBy: body.checkedBy,
        status: body.status,
        temperature: body.temperature ? parseFloat(body.temperature) : null,
        visualInspection: body.visualInspection || null,
        tasteTest: body.tasteTest || null,
        textureEvaluation: body.textureEvaluation || null,
        correctiveAction: body.correctiveAction || null,
        photos: body.photos || [],
        metrics: body.metrics || {},
        notes: body.notes || null,
        checkedAt: body.checkedAt ? new Date(body.checkedAt) : new Date()
      },
      include: {
        productionPlan: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
            menu: {
              select: {
                id: true,
                name: true,
                mealType: true
              }
            }
          }
        },
        batch: {
          select: {
            id: true,
            batchNumber: true,
            status: true
          }
        },
        checker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(qualityCheckpoint)
  } catch (error) {
    console.error("Error creating quality checkpoint:", error)
    return NextResponse.json(
      { error: "Failed to create quality checkpoint" },
      { status: 500 }
    )
  }
}

// Individual quality checkpoint by ID
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: "Quality checkpoint ID is required" },
        { status: 400 }
      )
    }

    const updatedCheckpoint = await prisma.qualityCheckpoint.update({
      where: { id },
      data: {
        ...updateData,
        temperature: updateData.temperature ? parseFloat(updateData.temperature) : undefined,
        checkedAt: updateData.checkedAt ? new Date(updateData.checkedAt) : undefined
      },
      include: {
        productionPlan: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
            menu: {
              select: {
                id: true,
                name: true,
                mealType: true
              }
            }
          }
        },
        batch: {
          select: {
            id: true,
            batchNumber: true,
            status: true
          }
        },
        checker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedCheckpoint)
  } catch (error) {
    console.error("Error updating quality checkpoint:", error)
    return NextResponse.json(
      { error: "Failed to update quality checkpoint" },
      { status: 500 }
    )
  }
}
