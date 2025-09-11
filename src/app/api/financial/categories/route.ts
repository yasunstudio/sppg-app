import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
import { prisma } from '@/lib/prisma';

// GET /api/financial/categories
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'financial:read'
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

    // Get distinct categories from existing transactions
    const categories = await prisma.financialTransaction.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    // Create category list with labels
    const categoryLabels: Record<string, string> = {
      RAW_MATERIALS: 'Bahan Baku',
      TRANSPORTATION: 'Transportasi',
      UTILITIES: 'Utilitas',
      SALARIES: 'Gaji',
      EQUIPMENT: 'Peralatan',
      MAINTENANCE: 'Pemeliharaan',
      OTHER: 'Lainnya',
    };

    // Combine existing categories from DB with standard categories
    const standardCategories = Object.keys(categoryLabels);
    const existingCategories = categories.map(c => c.category);
    
    // Merge and deduplicate
    const allCategories = [...new Set([...standardCategories, ...existingCategories])];
    
    const categoryOptions = allCategories.map(category => ({
      value: category,
      label: categoryLabels[category] || category,
    }));

    return NextResponse.json({
      categories: categoryOptions,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
