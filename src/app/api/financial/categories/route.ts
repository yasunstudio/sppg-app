import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/financial/categories
export async function GET() {
  try {
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
