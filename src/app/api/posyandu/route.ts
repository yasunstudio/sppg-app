import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema validation for Posyandu
const createPosyanduSchema = z.object({
  name: z.string().min(1, "Nama posyandu diperlukan"),
  headName: z.string().min(1, "Nama kepala posyandu diperlukan"),
  headPhone: z.string().min(1, "Nomor telepon diperlukan"),
  address: z.string().min(1, "Alamat diperlukan"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().optional(),
});

const updatePosyanduSchema = createPosyanduSchema.partial();

// GET /api/posyandu - List all posyandu with filtering
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const district = searchParams.get("district") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { headName: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    if (district) {
      where.address = { contains: district, mode: "insensitive" };
    }

    // Get total count for pagination
    const totalCount = await prisma.posyandu.count({ where });

    // Get posyandu with related data
    const posyandu = await prisma.posyandu.findMany({
      where,
      include: {
        programs: {
          where: { deletedAt: null },
          select: {
            id: true,
            name: true,
            programType: true,
            status: true,
            targetBeneficiaries: true,
          },
        },
        participants: {
          where: { deletedAt: null },
          select: {
            id: true,
            participantType: true,
            nutritionStatus: true,
          },
        },
        activities: {
          where: { 
            deletedAt: null,
            scheduledDate: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            },
          },
          select: {
            id: true,
            activityType: true,
            status: true,
            scheduledDate: true,
          },
        },
        volunteers: {
          where: { 
            deletedAt: null,
            activeStatus: true,
          },
          select: {
            id: true,
            role: true,
            trainingStatus: true,
          },
        },
        _count: {
          select: {
            programs: true,
            participants: true,
            activities: true,
            volunteers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Calculate statistics for each posyandu
    const posyanduWithStats = posyandu.map(p => ({
      ...p,
      stats: {
        totalPrograms: p._count.programs,
        activePrograms: p.programs.filter(prog => prog.status === "ACTIVE").length,
        totalParticipants: p._count.participants,
        participantsByType: {
          pregnant: p.participants.filter(part => part.participantType === "PREGNANT").length,
          lactating: p.participants.filter(part => part.participantType === "LACTATING").length,
          toddler: p.participants.filter(part => part.participantType === "TODDLER").length,
        },
        nutritionStatusBreakdown: {
          normal: p.participants.filter(part => part.nutritionStatus === "NORMAL").length,
          underweight: p.participants.filter(part => part.nutritionStatus === "UNDERWEIGHT").length,
          stunted: p.participants.filter(part => part.nutritionStatus === "STUNTED").length,
          wasted: p.participants.filter(part => part.nutritionStatus === "WASTED").length,
        },
        recentActivities: p.activities.length,
        activeVolunteers: p._count.volunteers,
      },
    }));

    return NextResponse.json({
      posyandu: posyanduWithStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      filters: {
        search,
        status,
        district,
      },
    });

  } catch (error) {
    console.error("Error fetching posyandu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/posyandu - Create new posyandu
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    const body = await request.json();
    const validatedData = createPosyanduSchema.parse(body);

    // Check for duplicate name
    const existingPosyandu = await prisma.posyandu.findFirst({
      where: {
        name: validatedData.name,
        deletedAt: null,
      },
    });

    if (existingPosyandu) {
      return NextResponse.json(
        { error: "Posyandu dengan nama ini sudah ada" },
        { status: 400 }
      );
    }

    const posyandu = await prisma.posyandu.create({
      data: validatedData,
      include: {
        programs: true,
        participants: true,
        activities: true,
        volunteers: true,
        _count: {
          select: {
            programs: true,
            participants: true,
            activities: true,
            volunteers: true,
          },
        },
      },
    });

    return NextResponse.json(posyandu, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating posyandu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
