import { NextRequest, NextResponse } from "next/server"
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
      'analytics:read'
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

    // Mock trends data
    const trendsData = {
      userGrowth: [
        { date: "2024-01", value: 100 },
        { date: "2024-02", value: 120 },
        { date: "2024-03", value: 150 }
      ],
      revenueGrowth: [
        { date: "2024-01", value: 50000 },
        { date: "2024-02", value: 75000 },
        { date: "2024-03", value: 125000 }
      ]
    }

    return NextResponse.json(trendsData)
  } catch (error) {
    console.error("[TRENDS_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}