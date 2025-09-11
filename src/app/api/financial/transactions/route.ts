import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
type TransactionType = 'INCOME' | 'EXPENSE';
type TransactionCategory = 'RAW_MATERIALS' | 'TRANSPORTATION' | 'UTILITIES' | 'SALARIES' | 'EQUIPMENT' | 'MAINTENANCE' | 'OTHER';

// GET /api/financial/transactions
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') as TransactionType | null;
    const category = searchParams.get('category') as TransactionCategory | null;
    const period = searchParams.get('period');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const offset = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (type) where.type = type;
    if (category) where.category = category;
    if (period) where.budgetPeriod = period;
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [transactions, total] = await Promise.all([
      prisma.financialTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.financialTransaction.count({ where }),
    ]);

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/financial/transactions
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


    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      type,
      category,
      amount,
      description,
      referenceId,
      receiptUrl,
      budgetPeriod,
    } = body;

    // Validate required fields
    if (!type || !category || !amount || !description || !budgetPeriod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be positive' },
        { status: 400 }
      );
    }

    const transaction = await prisma.financialTransaction.create({
      data: {
        type,
        category,
        amount: parseFloat(amount),
        description,
        referenceId,
        receiptUrl,
        budgetPeriod,
      },
    });

    // Update budget if it exists
    if (type === 'EXPENSE') {
      await updateBudgetSpent(category, budgetPeriod, parseFloat(amount));
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

// Helper function to update budget spent amount
async function updateBudgetSpent(
  category: TransactionCategory,
  period: string,
  amount: number
) {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        period_category: {
          period,
          category,
        },
      },
    });

    if (budget) {
      const newSpent = budget.spent + amount;
      const newRemaining = budget.allocated - newSpent;

      await prisma.budget.update({
        where: {
          period_category: {
            period,
            category,
          },
        },
        data: {
          spent: newSpent,
          remaining: newRemaining,
        },
      });
    }
  } catch (error) {
    console.error('Error updating budget:', error);
  }
}
