import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
// GET /api/financial/stats
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
    const period = searchParams.get('period') || getCurrentPeriod();

    // Get total income and expenses for the period
    const [incomeResult, expenseResult] = await Promise.all([
      prisma.financialTransaction.aggregate({
        where: {
          type: 'INCOME',
          budgetPeriod: period,
          deletedAt: null,
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.financialTransaction.aggregate({
        where: {
          type: 'EXPENSE',
          budgetPeriod: period,
          deletedAt: null,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalIncome = incomeResult._sum.amount || 0;
    const totalExpenses = expenseResult._sum.amount || 0;
    const netIncome = totalIncome - totalExpenses;

    // Get expense breakdown by category
    const expenseByCategory = await prisma.financialTransaction.groupBy({
      by: ['category'],
      where: {
        type: 'EXPENSE',
        budgetPeriod: period,
        deletedAt: null,
      },
      _sum: {
        amount: true,
      },
    });

    // Get budget utilization
    const budgets = await prisma.budget.findMany({
      where: {
        period,
      },
    });

    const budgetUtilization = budgets.map(budget => ({
      category: budget.category,
      allocated: budget.allocated,
      spent: budget.spent,
      remaining: budget.remaining,
      utilizationPercentage: budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0,
    }));

    // Get recent transactions
    const recentTransactions = await prisma.financialTransaction.findMany({
      where: {
        budgetPeriod: period,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Calculate monthly trends (last 6 months)
    const monthlyTrends = await getMonthlyTrends();

    return NextResponse.json({
      period,
      totalIncome,
      totalExpenses,
      netIncome,
      expenseByCategory: expenseByCategory.map(item => ({
        category: item.category,
        amount: item._sum.amount || 0,
      })),
      budgetUtilization,
      recentTransactions,
      monthlyTrends,
    });
  } catch (error) {
    console.error('Error fetching financial stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial statistics' },
      { status: 500 }
    );
  }
}

function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

async function getMonthlyTrends() {
  const trends = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const [income, expenses] = await Promise.all([
      prisma.financialTransaction.aggregate({
        where: {
          type: 'INCOME',
          budgetPeriod: period,
          deletedAt: null,
        },
        _sum: { amount: true },
      }),
      prisma.financialTransaction.aggregate({
        where: {
          type: 'EXPENSE',
          budgetPeriod: period,
          deletedAt: null,
        },
        _sum: { amount: true },
      }),
    ]);

    trends.push({
      period,
      income: income._sum.amount || 0,
      expenses: expenses._sum.amount || 0,
      net: (income._sum.amount || 0) - (expenses._sum.amount || 0),
    });
  }
  
  return trends;
}
