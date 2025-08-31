import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/items - Fetch all available items with pagination and filters
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
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const where: any = {};
    
    if (category && category !== "all") where.category = category;
    if (active !== null) where.isActive = active === "true";
    if (status === "active") where.isActive = true;
    if (status === "inactive") where.isActive = false;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // For simple API calls without pagination, return all items
    if (!url.searchParams.get("page")) {
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
    }

    // For paginated requests
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.item.count({ where })
    ]);

    // Get stats
    const stats = {
      total: await prisma.item.count(),
      active: await prisma.item.count({ where: { isActive: true } }),
      inactive: await prisma.item.count({ where: { isActive: false } }),
    };

    return NextResponse.json({
      items: items.map(item => ({
        ...item,
        supplierName: item.supplier?.name
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/items - Create new item
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      unit,
      unitPrice,
      allergens,
      shelfLife,
      storageRequirement,
      supplierId,
      isActive
    } = body;

    // Validate required fields
    if (!name || !category || !unit) {
      return NextResponse.json(
        { error: "Name, category, and unit are required" },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        name,
        description,
        category,
        unit,
        unitPrice: unitPrice ? parseFloat(unitPrice) : null,
        allergens: allergens || [],
        shelfLife: shelfLife ? parseInt(shelfLife) : null,
        storageRequirement,
        supplierId,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...item,
        supplierName: item.supplier?.name
      },
      message: 'Item created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
