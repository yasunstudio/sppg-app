import { NextResponse } from 'next/server'
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:read'
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

    // Mock stats data - replace with actual database queries
    const stats = {
      total: 150,
      active: 142,
      lowStock: 8,
      outOfStock: 3,
      categories: {
        'Bahan Pokok': 45,
        'Bumbu & Rempah': 32,
        'Protein': 28,
        'Sayuran': 25,
        'Buah': 20
      },
      recentlyAdded: 5,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching raw materials stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
