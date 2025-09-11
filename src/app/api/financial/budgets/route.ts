import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth"
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

// GET /api/financial/budgets
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || getCurrentPeriod();

    const budgets = await prisma.budget.findMany({
      where: {
        period,
      },
      orderBy: {
        category: 'asc',
      },
    });

    return NextResponse.json({ budgets, period });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

// POST /api/financial/budgets
export async function POST(request: NextRequest) {
  try {
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'financial:create'
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

    const body = await request.json();
    const { period, category, allocated, notes } = body;

    // Validate required fields
    if (!period || !category || !allocated) {
      return NextResponse.json(
        { error: 'Missing required fields: period, category, allocated' },
        { status: 400 }
      );
    }

    // Validate allocated amount is positive
    if (allocated <= 0) {
      return NextResponse.json(
        { error: 'Allocated amount must be positive' },
        { status: 400 }
      );
    }

    // Check if budget already exists for this period and category
    const existingBudget = await prisma.budget.findUnique({
      where: {
        period_category: {
          period,
          category,
        },
      },
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: 'Budget already exists for this period and category' },
        { status: 409 }
      );
    }

    // Calculate current spent amount for this category and period
    const spentResult = await prisma.financialTransaction.aggregate({
      where: {
        type: 'EXPENSE',
        category,
        budgetPeriod: period,
        deletedAt: null,
      },
      _sum: {
        amount: true,
      },
    });

    const spent = spentResult._sum.amount || 0;
    const remaining = allocated - spent;

    const budget = await prisma.budget.create({
      data: {
        period,
        category,
        allocated: parseFloat(allocated),
        spent,
        remaining,
        notes,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}

// PUT /api/financial/budgets
export async function PUT(request: NextRequest) {
  try {
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'financial:update'
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

    const body = await request.json();
    const { id, allocated, notes } = body;

    if (!id || !allocated) {
      return NextResponse.json(
        { error: 'Missing required fields: id, allocated' },
        { status: 400 }
      );
    }

    if (allocated <= 0) {
      return NextResponse.json(
        { error: 'Allocated amount must be positive' },
        { status: 400 }
      );
    }

    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existingBudget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    const remaining = parseFloat(allocated) - existingBudget.spent;

    const budget = await prisma.budget.update({
      where: { id },
      data: {
        allocated: parseFloat(allocated),
        remaining,
        notes,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
