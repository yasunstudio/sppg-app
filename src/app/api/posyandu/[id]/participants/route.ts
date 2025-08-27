import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema validation for Participant
const createParticipantSchema = z.object({
  name: z.string().min(1, "Nama peserta diperlukan"),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), "Format tanggal tidak valid"),
  gender: z.enum(["MALE", "FEMALE"], { message: "Jenis kelamin diperlukan" }),
  participantType: z.enum(["PREGNANT", "LACTATING", "TODDLER", "ELDERLY", "CHILD"], { message: "Tipe peserta diperlukan" }),
  nik: z.string().optional(),
  address: z.string().min(1, "Alamat diperlukan"),
  phoneNumber: z.string().optional(),
  healthCondition: z.string().optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
  // Health baseline data
  initialWeight: z.number().positive().optional(),
  initialHeight: z.number().positive().optional(),
  nutritionStatus: z.enum(["NORMAL", "UNDERWEIGHT", "OVERWEIGHT", "STUNTED", "WASTED", "SEVERE_MALNUTRITION", "OBESITY"]).optional(),
});

const updateParticipantSchema = createParticipantSchema.partial();

// GET /api/posyandu/[id]/participants - List participants for a posyandu
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: posyanduId } = await params;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const participantType = searchParams.get("type") || "";
    const nutritionStatus = searchParams.get("nutritionStatus") || "";
    
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      posyanduId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    if (participantType) {
      where.participantType = participantType;
    }

    if (nutritionStatus) {
      where.nutritionStatus = nutritionStatus;
    }

    // Get participants with health records
    const [participants, total] = await Promise.all([
      prisma.posyanduParticipant.findMany({
        where,
        include: {
          healthRecords: {
            orderBy: { recordDate: "desc" },
            take: 1, // Latest health record
              select: {
                id: true,
                recordDate: true,
                weight: true,
                height: true,
                weightForAge: true,
                heightForAge: true,
                weightForHeight: true,
              },
          },
          nutritionPlans: {
            where: { 
              deletedAt: null,
              status: "ACTIVE",
            },
            select: {
              id: true,
              planName: true,
              startDate: true,
              endDate: true,
            },
          },
          _count: {
            select: {
              healthRecords: true,
              nutritionPlans: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.posyanduParticipant.count({ where }),
    ]);

    // Calculate age for each participant
    const participantsWithAge = participants.map(participant => {
      const birthDate = new Date(participant.dateOfBirth);
      const today = new Date();
      const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                         (today.getMonth() - birthDate.getMonth());
      
      return {
        ...participant,
        ageInMonths,
        latestHealthRecord: (participant as any).healthRecords?.[0] || null,
        activeNutritionPlans: (participant as any).nutritionPlans || [],
      };
    });

    // Calculate statistics
    const stats = {
      total,
      byType: {
        pregnant: await prisma.posyanduParticipant.count({
          where: { ...where, participantType: "PREGNANT" }
        }),
        lactating: await prisma.posyanduParticipant.count({
          where: { ...where, participantType: "LACTATING" }
        }),
        toddler: await prisma.posyanduParticipant.count({
          where: { ...where, participantType: "TODDLER" }
        }),
        elderly: await prisma.posyanduParticipant.count({
          where: { ...where, participantType: "ELDERLY" }
        }),
      },
      byNutritionStatus: {
        normal: await prisma.posyanduParticipant.count({
          where: { ...where, nutritionStatus: "NORMAL" }
        }),
        underweight: await prisma.posyanduParticipant.count({
          where: { ...where, nutritionStatus: "UNDERWEIGHT" }
        }),
        stunted: await prisma.posyanduParticipant.count({
          where: { ...where, nutritionStatus: "STUNTED" }
        }),
        wasted: await prisma.posyanduParticipant.count({
          where: { ...where, nutritionStatus: "WASTED" }
        }),
        overweight: await prisma.posyanduParticipant.count({
          where: { ...where, nutritionStatus: "OVERWEIGHT" }
        }),
      },
    };

    return NextResponse.json({
      participants: participantsWithAge,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
      filters: {
        search,
        participantType,
        nutritionStatus,
      },
    });

  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/posyandu/[id]/participants - Create new participant
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: posyanduId } = await params;
    const body = await request.json();

    console.log("Received data:", JSON.stringify(body, null, 2));
    console.log("Posyandu ID:", posyanduId);

    // Validate input
    const validatedData = createParticipantSchema.parse(body);
    console.log("Validated data:", JSON.stringify(validatedData, null, 2));

    // Check if posyandu exists
    const posyandu = await prisma.posyandu.findUnique({
      where: { id: posyanduId, deletedAt: null },
    });

    if (!posyandu) {
      console.error("Posyandu not found:", posyanduId);
      return NextResponse.json(
        { error: "Posyandu tidak ditemukan" },
        { status: 404 }
      );
    }

    console.log("Posyandu found:", posyandu.name);

    // Calculate initial nutrition status if weight and height provided
    let calculatedNutritionStatus = validatedData.nutritionStatus || "NORMAL";

    if (validatedData.initialWeight && validatedData.initialHeight) {
      // Simple BMI-based assessment for now
      const bmi = validatedData.initialWeight / Math.pow(validatedData.initialHeight / 100, 2);
      
      if (bmi < 16) calculatedNutritionStatus = "WASTED";
      else if (bmi < 18.5) calculatedNutritionStatus = "UNDERWEIGHT";
      else if (bmi > 25) calculatedNutritionStatus = "OVERWEIGHT";
      else calculatedNutritionStatus = "NORMAL";
    }

    console.log("Creating participant with nutrition status:", calculatedNutritionStatus);

    // Create participant
    const participant = await prisma.posyanduParticipant.create({
      data: {
        name: validatedData.name,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        gender: validatedData.gender,
        participantType: validatedData.participantType,
        nik: validatedData.nik,
        address: validatedData.address,
        phoneNumber: validatedData.phoneNumber,
        healthCondition: validatedData.healthCondition,
        allergies: validatedData.allergies,
        posyanduId,
        nutritionStatus: calculatedNutritionStatus,
        currentWeight: validatedData.initialWeight,
        currentHeight: validatedData.initialHeight,
      },
      include: {
        healthRecords: true,
        nutritionPlans: true,
        _count: {
          select: {
            healthRecords: true,
            nutritionPlans: true,
          },
        },
      },
    });

    console.log("Participant created:", participant.id);

    // Create initial health record if baseline data provided
    if (validatedData.initialWeight && validatedData.initialHeight) {
      const healthRecord = await prisma.healthRecord.create({
        data: {
          participantId: participant.id,
          recordDate: new Date(),
          weight: validatedData.initialWeight,
          height: validatedData.initialHeight,
          notes: "Data awal saat registrasi",
        },
      });
      console.log("Initial health record created:", healthRecord.id);
    }

    return NextResponse.json(participant, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues);
      return NextResponse.json(
        { error: "Data tidak valid", details: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Error creating participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
