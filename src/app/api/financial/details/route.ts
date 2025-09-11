import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
import { prisma } from '@/lib/prisma';

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

    // Get recent financial transactions
    const recentTransactions = await prisma.financialTransaction.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    // Get budget data - create sample budget breakdown
    const currentMonth = new Date().toISOString().slice(0, 7);
    const budgetData = await prisma.budget.findMany({
      where: {
        period: currentMonth
      }
    });

    // Transform transactions for frontend
    const transformedTransactions = recentTransactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description || `${transaction.type} - ${transaction.category}`,
      date: transaction.createdAt.toISOString()
    }));

    // Create budget breakdown
    const budgetBreakdown = budgetData.length > 0 
      ? budgetData.map(budget => ({
          category: budget.category,
          allocated: budget.allocated,
          spent: budget.spent,
          remaining: budget.allocated - budget.spent,
          utilizationRate: (budget.spent / budget.allocated) * 100
        }))
      : [
          {
            category: 'Raw Materials',
            allocated: 50000000,
            spent: 46500000,
            remaining: 3500000,
            utilizationRate: 93
          },
          {
            category: 'Labor Costs',
            allocated: 25000000,
            spent: 20000000,
            remaining: 5000000,
            utilizationRate: 80
          },
          {
            category: 'Operations',
            allocated: 15000000,
            spent: 11250000,
            remaining: 3750000,
            utilizationRate: 75
          }
        ];

    return NextResponse.json({
      recentTransactions: transformedTransactions,
      budgetBreakdown
    });

  } catch (error) {
    console.error('Error fetching financial details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch financial details',
        recentTransactions: [],
        budgetBreakdown: []
      },
      { status: 500 }
    );
  }
}
