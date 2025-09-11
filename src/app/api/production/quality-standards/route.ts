import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

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

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const isActive = searchParams.get("isActive")

    // Build where clause
    const where: any = {
      ...(category && { category }),
      ...(isActive !== null && { isActive: isActive === "true" })
    }

    const qualityStandards = await prisma.qualityStandard.findMany({
      where,
      orderBy: { category: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: qualityStandards
    })

  } catch (error) {
    console.error("Error fetching quality standards:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch quality standards",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

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

    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json()
    
    const {
      name,
      description,
      targetValue,
      currentValue,
      unit,
      category,
      isActive = true
    } = body

    const qualityStandard = await prisma.qualityStandard.create({
      data: {
        name,
        description,
        targetValue,
        currentValue,
        unit,
        category,
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: qualityStandard
    })

  } catch (error) {
    console.error("Error creating quality standard:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create quality standard",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
