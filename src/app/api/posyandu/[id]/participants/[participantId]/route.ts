import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema validation for updating Participant
const updateParticipantSchema = z.object({
  name: z.string().min(1).optional(),
  nik: z.string().optional(),
  address: z.string().min(1).optional(),
  phoneNumber: z.string().optional(),
  healthCondition: z.string().optional(),
  allergies: z.string().optional(),
  nutritionStatus: z.enum(["NORMAL", "UNDERWEIGHT", "STUNTED", "WASTED", "OVERWEIGHT"]).optional(),
});

// GET /api/posyandu/[id]/participants/[participantId] - Get specific participant details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { id: posyanduId, participantId } = await params;

    const participant = await prisma.posyanduParticipant.findUnique({
      where: { 
        id: participantId,
        posyanduId,
        deletedAt: null,
      },
      include: {
        posyandu: {
          select: {
            id: true,
            name: true,
            headName: true,
          },
        },
        healthRecords: {
          orderBy: { recordDate: "desc" },
          select: {
            id: true,
            recordDate: true,
            weight: true,
            height: true,
            headCircumference: true,
            armCircumference: true,
            bloodPressure: true,
            hemoglobin: true,
            temperature: true,
            weightForAge: true,
            heightForAge: true,
            weightForHeight: true,
            notes: true,
          },
        },
        nutritionPlans: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          include: {
            recipes: {
              include: {
                recipe: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    servingSize: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            healthRecords: true,
            nutritionPlans: true,
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Peserta tidak ditemukan" },
        { status: 404 }
      );
    }

    // Calculate age
    const birthDate = new Date(participant.dateOfBirth);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                       (today.getMonth() - birthDate.getMonth());
    const ageInYears = Math.floor(ageInMonths / 12);

    // Calculate growth trends if health records exist
    let growthTrends = null;
    const healthRecords = (participant as any).healthRecords || [];
    if (healthRecords.length > 1) {
      const records = [...healthRecords].reverse(); // oldest first
      growthTrends = {
        weightTrend: calculateTrend(records.map((r: any) => ({ 
          date: r.recordDate, 
          value: Number(r.weight) || 0 
        }))),
        heightTrend: calculateTrend(records.map((r: any) => ({ 
          date: r.recordDate, 
          value: Number(r.height) || 0 
        }))),
        weightForAgeTrend: calculateTrend(records.map((r: any) => ({ 
          date: r.recordDate, 
          value: Number(r.weightForAge) || 0 
        }))),
        heightForAgeTrend: calculateTrend(records.map((r: any) => ({ 
          date: r.recordDate, 
          value: Number(r.heightForAge) || 0 
        }))),
      };
    }

    // Get latest health status
    const latestHealthRecord = healthRecords[0];
    const healthStatus = {
      hasRecentCheckup: latestHealthRecord && 
        new Date(latestHealthRecord.recordDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // within 30 days
      riskFactors: calculateRiskFactors(participant, latestHealthRecord),
      nutritionStatus: participant.nutritionStatus,
      needsAttention: needsAttention(participant, latestHealthRecord),
    };

    return NextResponse.json({
      ...participant,
      ageInMonths,
      ageInYears,
      growthTrends,
      healthStatus,
    });

  } catch (error) {
    console.error("Error fetching participant details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/posyandu/[id]/participants/[participantId] - Update participant information
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { id: posyanduId, participantId } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateParticipantSchema.parse(body);

    // Check if participant exists
    const existingParticipant = await prisma.posyanduParticipant.findUnique({
      where: { 
        id: participantId,
        posyanduId,
        deletedAt: null,
      },
    });

    if (!existingParticipant) {
      return NextResponse.json(
        { error: "Peserta tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update participant
    const updatedParticipant = await prisma.posyanduParticipant.update({
      where: { id: participantId },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        healthRecords: {
          orderBy: { recordDate: "desc" },
          take: 5,
        },
        nutritionPlans: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 3,
        },
        _count: {
          select: {
            healthRecords: true,
            nutritionPlans: true,
          },
        },
      },
    });

    return NextResponse.json(updatedParticipant);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data tidak valid", details: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Error updating participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/posyandu/[id]/participants/[participantId] - Soft delete participant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { id: posyanduId, participantId } = await params;

    // Check if participant exists
    const existingParticipant = await prisma.posyanduParticipant.findUnique({
      where: { 
        id: participantId,
        posyanduId,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            healthRecords: true,
            nutritionPlans: { where: { deletedAt: null } },
          },
        },
      },
    });

    if (!existingParticipant) {
      return NextResponse.json(
        { error: "Peserta tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if participant has active nutrition plans
    if (existingParticipant._count.nutritionPlans > 0) {
      return NextResponse.json(
        { 
          error: "Tidak dapat menghapus peserta yang memiliki rencana gizi aktif",
          details: "Mohon selesaikan atau hapus rencana gizi terlebih dahulu"
        },
        { status: 400 }
      );
    }

    // Soft delete participant
    const deletedParticipant = await prisma.posyanduParticipant.update({
      where: { id: participantId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Peserta berhasil dihapus",
      id: deletedParticipant.id,
    });

  } catch (error) {
    console.error("Error deleting participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateTrend(data: { date: Date; value: number }[]): { slope: number; direction: string } {
  if (data.length < 2) return { slope: 0, direction: "stable" };
  
  // Simple linear regression for trend
  const n = data.length;
  const sumX = data.reduce((sum, _, i) => sum + i, 0);
  const sumY = data.reduce((sum, point) => sum + point.value, 0);
  const sumXY = data.reduce((sum, point, i) => sum + i * point.value, 0);
  const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  let direction = "stable";
  if (slope > 0.1) direction = "improving";
  else if (slope < -0.1) direction = "declining";
  
  return { slope, direction };
}

function calculateRiskFactors(participant: any, latestRecord: any): string[] {
  const risks = [];
  
  if (participant.nutritionStatus === "UNDERWEIGHT") risks.push("Berat badan kurang");
  if (participant.nutritionStatus === "STUNTED") risks.push("Stunting");
  if (participant.nutritionStatus === "WASTED") risks.push("Wasting");
  if (participant.nutritionStatus === "OVERWEIGHT") risks.push("Kelebihan berat badan");
  
  if (latestRecord) {
    if (latestRecord.weightForAge && latestRecord.weightForAge < -2) risks.push("Z-score berat/umur rendah");
    if (latestRecord.heightForAge && latestRecord.heightForAge < -2) risks.push("Z-score tinggi/umur rendah");
    if (latestRecord.hemoglobin && latestRecord.hemoglobin < 11) risks.push("Anemia");
  }
  
  const ageInMonths = calculateAgeInMonths(participant.dateOfBirth);
  if (participant.participantType === "TODDLER" && ageInMonths > 24 && risks.length > 0) {
    risks.push("Balita berisiko tinggi");
  }
  
  return risks;
}

function needsAttention(participant: any, latestRecord: any): boolean {
  const risks = calculateRiskFactors(participant, latestRecord);
  return risks.length > 0 || !latestRecord || 
    new Date(latestRecord.recordDate) < new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // no checkup in 60 days
}

function calculateAgeInMonths(dateOfBirth: Date): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  return (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
}
