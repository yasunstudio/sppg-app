import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/items - Fetch all available items for recipes
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const active = url.searchParams.get("active");

    const where: any = {};
    
    if (category) where.category = category;
    if (active !== null) where.isActive = active === "true";
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
