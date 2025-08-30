import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/financial/reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || getCurrentPeriod();
    const reportType = searchParams.get('type') || 'summary';

    switch (reportType) {
      case 'summary':
        return await generateSummaryReport(period);
      case 'category':
        return await generateCategoryReport(period);
      case 'trend':
        return await generateTrendReport(period);
      case 'budget-variance':
        return await generateBudgetVarianceReport(period);
      default:
        return await generateSummaryReport(period);
    }
  } catch (error) {
    console.error('Error generating financial reports:', error);
    return NextResponse.json(
      { error: 'Failed to generate financial reports' },
      { status: 500 }
    );
  }
}

async function generateSummaryReport(period: string) {
  // Get financial summary for the period
  const [incomeResult, expenseResult] = await Promise.all([
    prisma.financialTransaction.aggregate({
      where: {
        type: 'INCOME',
        budgetPeriod: period,
        deletedAt: null,
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.financialTransaction.aggregate({
      where: {
        type: 'EXPENSE',
        budgetPeriod: period,
        deletedAt: null,
      },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const totalIncome = incomeResult._sum.amount || 0;
  const totalExpenses = expenseResult._sum.amount || 0;
  const netIncome = totalIncome - totalExpenses;
  const incomeTransactions = incomeResult._count;
  const expenseTransactions = expenseResult._count;

  // Get top income and expense categories
  const [topIncomeCategories, topExpenseCategories] = await Promise.all([
    prisma.financialTransaction.groupBy({
      by: ['category'],
      where: {
        type: 'INCOME',
        budgetPeriod: period,
        deletedAt: null,
      },
      _sum: { amount: true },
      orderBy: {
        _sum: { amount: 'desc' }
      },
      take: 5,
    }),
    prisma.financialTransaction.groupBy({
      by: ['category'],
      where: {
        type: 'EXPENSE',
        budgetPeriod: period,
        deletedAt: null,
      },
      _sum: { amount: true },
      orderBy: {
        _sum: { amount: 'desc' }
      },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    type: 'summary',
    period,
    summary: {
      totalIncome,
      totalExpenses,
      netIncome,
      incomeTransactions,
      expenseTransactions,
      profitMargin: totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0,
    },
    topIncomeCategories: topIncomeCategories.map(item => ({
      category: item.category,
      amount: item._sum.amount || 0,
    })),
    topExpenseCategories: topExpenseCategories.map(item => ({
      category: item.category,
      amount: item._sum.amount || 0,
    })),
  });
}

async function generateCategoryReport(period: string) {
  // Get detailed breakdown by category
  const [incomeByCategory, expenseByCategory] = await Promise.all([
    prisma.financialTransaction.groupBy({
      by: ['category'],
      where: {
        type: 'INCOME',
        budgetPeriod: period,
        deletedAt: null,
      },
      _sum: { amount: true },
      _count: true,
      _avg: { amount: true },
    }),
    prisma.financialTransaction.groupBy({
      by: ['category'],
      where: {
        type: 'EXPENSE',
        budgetPeriod: period,
        deletedAt: null,
      },
      _sum: { amount: true },
      _count: true,
      _avg: { amount: true },
    }),
  ]);

  return NextResponse.json({
    type: 'category',
    period,
    incomeByCategory: incomeByCategory.map(item => ({
      category: item.category,
      total: item._sum.amount || 0,
      count: item._count,
      average: item._avg.amount || 0,
    })),
    expenseByCategory: expenseByCategory.map(item => ({
      category: item.category,
      total: item._sum.amount || 0,
      count: item._count,
      average: item._avg.amount || 0,
    })),
  });
}

async function generateTrendReport(period: string) {
  // Get weekly trends for the current period
  const startDate = new Date(`${period}-01`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  
  const weeklyData = await prisma.financialTransaction.findMany({
    where: {
      budgetPeriod: period,
      deletedAt: null,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      type: true,
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Group by week
  const weeklyTrends: any[] = [];
  const weekMap = new Map();

  weeklyData.forEach(transaction => {
    const week = getWeekOfMonth(transaction.createdAt);
    const key = `Week ${week}`;
    
    if (!weekMap.has(key)) {
      weekMap.set(key, { week: key, income: 0, expenses: 0 });
    }
    
    const weekData = weekMap.get(key);
    if (transaction.type === 'INCOME') {
      weekData.income += transaction.amount;
    } else {
      weekData.expenses += transaction.amount;
    }
  });

  weekMap.forEach(value => {
    weeklyTrends.push({
      ...value,
      net: value.income - value.expenses,
    });
  });

  return NextResponse.json({
    type: 'trend',
    period,
    weeklyTrends,
  });
}

async function generateBudgetVarianceReport(period: string) {
  // Get budget vs actual comparison
  const budgets = await prisma.budget.findMany({
    where: { period },
  });

  const budgetVariance = budgets.map(budget => ({
    category: budget.category,
    budgeted: budget.allocated,
    actual: budget.spent,
    variance: budget.spent - budget.allocated,
    variancePercentage: budget.allocated > 0 ? ((budget.spent - budget.allocated) / budget.allocated) * 100 : 0,
    status: budget.spent > budget.allocated ? 'over' : 'under',
  }));

  return NextResponse.json({
    type: 'budget-variance',
    period,
    budgetVariance,
  });
}

function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const weekStart = new Date(firstDay);
  weekStart.setDate(firstDay.getDate() - firstDay.getDay());
  
  const daysSinceWeekStart = Math.floor((date.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000));
  return Math.floor(daysSinceWeekStart / 7) + 1;
}
