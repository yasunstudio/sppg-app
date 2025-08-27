import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema validation for Health Record
const createHealthRecordSchema = z.object({
  weight: z.number().positive("Berat badan harus lebih dari 0"),
  height: z.number().positive("Tinggi badan harus lebih dari 0"),
  headCircumference: z.number().positive().optional(),
  armCircumference: z.number().positive().optional(),
  bloodPressure: z.string().optional(),
  hemoglobin: z.number().positive().optional(),
  temperature: z.number().positive().optional(),
  notes: z.string().optional(),
  checkupDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Format tanggal tidak valid").optional(),
});

const updateHealthRecordSchema = createHealthRecordSchema.partial();

// GET /api/posyandu/[id]/participants/[participantId]/health-records - List health records
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { id: posyanduId, participantId } = await params;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    
    const skip = (page - 1) * limit;

    // Verify participant exists and belongs to posyandu
    const participant = await prisma.posyanduParticipant.findUnique({
      where: { 
        id: participantId,
        posyanduId,
        deletedAt: null,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Peserta tidak ditemukan" },
        { status: 404 }
      );
    }

    // Build where clause for health records
    const where: any = {
      participantId,
      deletedAt: null,
    };

    if (fromDate) {
      where.recordDate = { gte: new Date(fromDate) };
    }

    if (toDate) {
      where.recordDate = { 
        ...where.recordDate,
        lte: new Date(toDate),
      };
    }

    // Get health records
    const [healthRecords, total] = await Promise.all([
      prisma.healthRecord.findMany({
        where,
        orderBy: { recordDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.healthRecord.count({ where }),
    ]);

    // Calculate growth trends and statistics
    const allRecords = await prisma.healthRecord.findMany({
      where: { participantId, deletedAt: null },
      orderBy: { recordDate: "asc" },
      select: {
        recordDate: true,
        weight: true,
        height: true,
        weightForAge: true,
        heightForAge: true,
        weightForHeight: true,
      },
    });

    const growthStatistics = calculateGrowthStatistics(allRecords, participant);

    return NextResponse.json({
      healthRecords,
      participant: {
        id: participant.id,
        name: participant.name,
        dateOfBirth: participant.dateOfBirth,
        participantType: participant.participantType,
        nutritionStatus: participant.nutritionStatus,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      growthStatistics,
      filters: {
        fromDate,
        toDate,
      },
    });

  } catch (error) {
    console.error("Error fetching health records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/posyandu/[id]/participants/[participantId]/health-records - Create health record
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { id: posyanduId, participantId } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = createHealthRecordSchema.parse(body);

    // Verify participant exists and belongs to posyandu
    const participant = await prisma.posyanduParticipant.findUnique({
      where: { 
        id: participantId,
        posyanduId,
        deletedAt: null,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Peserta tidak ditemukan" },
        { status: 404 }
      );
    }

    // Calculate age in months
    const birthDate = new Date(participant.dateOfBirth);
    const checkupDate = validatedData.checkupDate ? new Date(validatedData.checkupDate) : new Date();
    const ageInMonths = (checkupDate.getFullYear() - birthDate.getFullYear()) * 12 + 
                       (checkupDate.getMonth() - birthDate.getMonth());

    // Calculate Z-scores using WHO standards (simplified)
    const zScores = calculateZScores(
      validatedData.weight,
      validatedData.height,
      ageInMonths,
      participant.gender
    );

    // Determine nutrition status based on Z-scores
    const nutritionStatus = determineNutritionStatus(zScores);

    // Create health record
    const healthRecord = await prisma.healthRecord.create({
      data: {
        participantId,
        recordDate: checkupDate,
        weight: validatedData.weight,
        height: validatedData.height,
        headCircumference: validatedData.headCircumference,
        armCircumference: validatedData.armCircumference,
        bloodPressure: validatedData.bloodPressure,
        hemoglobin: validatedData.hemoglobin,
        temperature: validatedData.temperature,
        weightForAge: zScores.weightForAge.toString(),
        heightForAge: zScores.heightForAge.toString(),
        weightForHeight: zScores.weightForHeight.toString(),
        notes: validatedData.notes,
      },
    });

    // Update participant's nutrition status if changed
    if (nutritionStatus !== participant.nutritionStatus) {
      await prisma.posyanduParticipant.update({
        where: { id: participantId },
        data: { 
          nutritionStatus: nutritionStatus as any,
          updatedAt: new Date(),
        },
      });
    }

    // Calculate growth velocity (change from previous record)
    const previousRecord = await prisma.healthRecord.findFirst({
      where: {
        participantId,
        recordDate: { lt: checkupDate },
        deletedAt: null,
      },
      orderBy: { recordDate: "desc" },
    });

    let growthVelocity = null;
    if (previousRecord) {
      const daysDiff = Math.abs(checkupDate.getTime() - previousRecord.recordDate.getTime()) / (1000 * 60 * 60 * 24);
      const monthsDiff = daysDiff / 30.44;
      
      growthVelocity = {
        weightGain: Number(validatedData.weight) - Number(previousRecord.weight),
        heightGain: Number(validatedData.height) - Number(previousRecord.height),
        weightVelocity: monthsDiff > 0 ? (Number(validatedData.weight) - Number(previousRecord.weight)) / monthsDiff : 0,
        heightVelocity: monthsDiff > 0 ? (Number(validatedData.height) - Number(previousRecord.height)) / monthsDiff : 0,
        timeDifferenceMonths: monthsDiff,
      };
    }

    return NextResponse.json({
      ...healthRecord,
      zScores,
      nutritionStatus,
      growthVelocity,
      ageInMonths,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data tidak valid", details: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Error creating health record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions for growth calculations
function calculateZScores(weight: number, height: number, ageInMonths: number, gender: string) {
  // Simplified Z-score calculations - in production, use WHO growth standards tables
  
  // Weight-for-age Z-score (simplified)
  const expectedWeight = gender === "MALE" 
    ? 3.3 + (ageInMonths * 0.45) // Simplified male growth
    : 3.2 + (ageInMonths * 0.42); // Simplified female growth
  const weightSD = 1.5 + (ageInMonths * 0.05);
  const weightForAge = (weight - expectedWeight) / weightSD;

  // Height-for-age Z-score (simplified)
  const expectedHeight = gender === "MALE"
    ? 49.9 + (ageInMonths * 1.8) // Simplified male growth
    : 49.1 + (ageInMonths * 1.7); // Simplified female growth
  const heightSD = 2.5 + (ageInMonths * 0.1);
  const heightForAge = (height - expectedHeight) / heightSD;

  // Weight-for-height Z-score (BMI-based simplified)
  const bmi = weight / Math.pow(height / 100, 2);
  const expectedBMI = ageInMonths < 24 ? 16 + (ageInMonths * 0.2) : 16;
  const bmiSD = 1.5;
  const weightForHeight = (bmi - expectedBMI) / bmiSD;

  return {
    weightForAge: Math.round(weightForAge * 100) / 100,
    heightForAge: Math.round(heightForAge * 100) / 100,
    weightForHeight: Math.round(weightForHeight * 100) / 100,
  };
}

function determineNutritionStatus(zScores: any): string {
  if (zScores.weightForHeight < -2) return "WASTED";
  if (zScores.heightForAge < -2) return "STUNTED";
  if (zScores.weightForAge < -2) return "UNDERWEIGHT";
  if (zScores.weightForHeight > 2) return "OVERWEIGHT";
  return "NORMAL";
}

function calculateGrowthStatistics(records: any[], participant: any) {
  if (records.length < 2) return null;

  const weightData = records.map(r => ({ date: r.recordDate, value: Number(r.weight) }));
  const heightData = records.map(r => ({ date: r.recordDate, value: Number(r.height) }));

  const latestRecord = records[records.length - 1];
  const firstRecord = records[0];

  const totalMonths = records.length > 1 ? 
    (new Date(latestRecord.recordDate).getTime() - new Date(firstRecord.recordDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44) : 0;

  return {
    totalRecords: records.length,
    timeSpanMonths: Math.round(totalMonths * 10) / 10,
    totalWeightGain: Number(latestRecord.weight) - Number(firstRecord.weight),
    totalHeightGain: Number(latestRecord.height) - Number(firstRecord.height),
    averageWeightVelocity: totalMonths > 0 ? (Number(latestRecord.weight) - Number(firstRecord.weight)) / totalMonths : 0,
    averageHeightVelocity: totalMonths > 0 ? (Number(latestRecord.height) - Number(firstRecord.height)) / totalMonths : 0,
    currentZScores: {
      weightForAge: Number(latestRecord.weightForAge) || 0,
      heightForAge: Number(latestRecord.heightForAge) || 0,
      weightForHeight: Number(latestRecord.weightForHeight) || 0,
    },
    trends: {
      weightTrend: calculateTrend(weightData),
      heightTrend: calculateTrend(heightData),
    },
  };
}

function calculateTrend(data: { date: Date; value: number }[]): { slope: number; direction: string } {
  if (data.length < 2) return { slope: 0, direction: "stable" };
  
  // Simple linear regression
  const n = data.length;
  const sumX = data.reduce((sum, _, i) => sum + i, 0);
  const sumY = data.reduce((sum, point) => sum + point.value, 0);
  const sumXY = data.reduce((sum, point, i) => sum + i * point.value, 0);
  const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  let direction = "stable";
  if (slope > 0.1) direction = "improving";
  else if (slope < -0.1) direction = "declining";
  
  return { slope: Math.round(slope * 1000) / 1000, direction };
}
