import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/monitoring/dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';

    // Get date range based on period
    const { startDate, endDate } = getDateRange(period);

    // 1. Production Metrics
    const productionStats = await getProductionStats(startDate, endDate);

    // 2. Distribution Metrics
    const distributionStats = await getDistributionStats(startDate, endDate);

    // 3. Financial Metrics
    const financialStats = await getFinancialStats(startDate, endDate);

    // 4. Quality Metrics
    const qualityStats = await getQualityStats(startDate, endDate);

    // 5. Inventory Metrics
    const inventoryStats = await getInventoryStats(startDate, endDate);

    // 6. School Performance
    const schoolStats = await getSchoolStats(startDate, endDate);

    // 7. System Health
    const systemHealth = await getSystemHealth();

    // 8. Alert Summary
    const alertSummary = await getAlertSummary();

    return NextResponse.json({
      period,
      dateRange: { startDate, endDate },
      metrics: {
        production: productionStats,
        distribution: distributionStats,
        financial: financialStats,
        quality: qualityStats,
        inventory: inventoryStats,
        schools: schoolStats,
      },
      systemHealth,
      alertSummary,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching monitoring dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    );
  }
}

function getDateRange(period: string) {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = new Date(now);

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterStart, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  return { startDate, endDate };
}

async function getProductionStats(startDate: Date, endDate: Date) {
  const [totalPlans, completedBatches, activeProduction, avgEfficiency] = await Promise.all([
    // Total production plans
    prisma.productionPlan.count({
      where: {
        planDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),

    // Completed production batches
    prisma.productionBatch.count({
      where: {
        status: 'COMPLETED',
        startedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),

    // Active production
    prisma.productionBatch.count({
      where: {
        status: {
          in: ['IN_PROGRESS', 'QUALITY_CHECK'],
        },
      },
    }),

    // Calculate average efficiency
    prisma.productionBatch.aggregate({
      where: {
        status: 'COMPLETED',
        startedAt: {
          gte: startDate,
          lte: endDate,
        },
        plannedQuantity: {
          gt: 0,
        },
      },
      _avg: {
        actualQuantity: true,
      },
    }),
  ]);

  return {
    totalPlans,
    completedBatches,
    activeProduction,
    avgEfficiency: avgEfficiency._avg?.actualQuantity || 0,
  };
}

async function getDistributionStats(startDate: Date, endDate: Date) {
  const [totalDistributions, completedDeliveries, inTransit, avgDeliveryTime] = await Promise.all([
    // Total distributions
    prisma.distribution.count({
      where: {
        distributionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),

    // Completed deliveries
    prisma.distribution.count({
      where: {
        status: 'COMPLETED',
        distributionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),

    // In transit
    prisma.distribution.count({
      where: {
        status: 'IN_TRANSIT',
      },
    }),

    // Calculate average delivery time (mock calculation)
    prisma.distribution.count({
      where: {
        status: 'COMPLETED',
        distributionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  return {
    totalDistributions,
    completedDeliveries,
    inTransit,
    avgDeliveryTime: avgDeliveryTime > 0 ? 2.5 : 0, // Mock: 2.5 hours average
    onTimeDeliveryRate: completedDeliveries > 0 ? 92.5 : 0, // Mock: 92.5% on-time
  };
}

async function getFinancialStats(startDate: Date, endDate: Date) {
  const currentPeriod = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
  
  const [totalIncome, totalExpenses, budgetUtilization] = await Promise.all([
    // Total income
    prisma.financialTransaction.aggregate({
      where: {
        type: 'INCOME',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    // Total expenses
    prisma.financialTransaction.aggregate({
      where: {
        type: 'EXPENSE',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    // Budget utilization
    prisma.budget.aggregate({
      where: {
        period: currentPeriod,
      },
      _avg: {
        spent: true,
        allocated: true,
      },
    }),
  ]);

  const income = totalIncome._sum.amount || 0;
  const expenses = totalExpenses._sum.amount || 0;
  const avgSpent = budgetUtilization._avg.spent || 0;
  const avgAllocated = budgetUtilization._avg.allocated || 1;

  return {
    totalIncome: income,
    totalExpenses: expenses,
    netIncome: income - expenses,
    budgetUtilization: (avgSpent / avgAllocated) * 100,
  };
}

async function getQualityStats(startDate: Date, endDate: Date) {
  const [totalChecks, passedChecks, failedChecks, avgScore] = await Promise.all([
    // Total quality checks
    prisma.qualityCheckpoint.count({
      where: {
        checkedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),

    // Passed checks
    prisma.qualityCheckpoint.count({
      where: {
        status: 'PASS',
        checkedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),

    // Failed checks
    prisma.qualityCheckpoint.count({
      where: {
        status: 'FAIL',
        checkedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),

    // Average quality score (using temperature as proxy)
    prisma.qualityCheckpoint.aggregate({
      where: {
        checkedAt: {
          gte: startDate,
          lte: endDate,
        },
        temperature: {
          not: null,
        },
      },
      _avg: {
        temperature: true,
      },
    }),
  ]);

  return {
    totalChecks,
    passedChecks,
    failedChecks,
    passRate: totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0,
    avgScore: avgScore._avg?.temperature || 0,
  };
}

async function getInventoryStats(startDate: Date, endDate: Date) {
  const [totalItems, lowStockItems, stockValue] = await Promise.all([
    // Total inventory items
    prisma.item.count(),

    // Mock low stock items (we'll use a simple count for now)
    prisma.item.count({
      take: 5, // Mock: assume 5 items are low stock
    }),

    // Total stock value using unit price
    prisma.item.aggregate({
      _sum: {
        unitPrice: true,
      },
    }),
  ]);

  return {
    totalItems,
    lowStockItems: Math.min(lowStockItems, 5), // Mock: max 5 low stock items
    stockValue: (stockValue._sum?.unitPrice || 0) * 100, // Mock: multiply by quantity
    stockTurnover: 12.5, // Mock: 12.5 times per year
  };
}

async function getSchoolStats(startDate: Date, endDate: Date) {
  const [totalSchools, activeSchools, totalStudents, satisfactionRate] = await Promise.all([
    // Total schools
    prisma.school.count(),

    // Active schools (simplify - use total schools as proxy)
    prisma.school.count({
      where: {
        deletedAt: null,
      },
    }),

    // Total students
    prisma.student.count(),

    // Mock satisfaction rate
    Promise.resolve(95.2),
  ]);

  return {
    totalSchools,
    activeSchools,
    totalStudents,
    satisfactionRate,
    avgMealsPerDay: Math.floor(totalStudents * 1.2), // Mock: 1.2 meals per student
  };
}

async function getSystemHealth() {
  // Mock system health data
  return {
    serverStatus: 'healthy',
    databaseStatus: 'healthy',
    apiResponseTime: 145, // ms
    uptime: 99.8, // percentage
    memoryUsage: 67.5, // percentage
    cpuUsage: 23.2, // percentage
    diskUsage: 45.8, // percentage
  };
}

async function getAlertSummary() {
  // Mock alert data
  return {
    critical: 0,
    warning: 2,
    info: 5,
    total: 7,
    recentAlerts: [
      {
        id: '1',
        type: 'warning',
        message: 'Budget utilization for Raw Materials exceeds 90%',
        timestamp: new Date(),
      },
      {
        id: '2',
        type: 'info',
        message: 'New distribution scheduled for tomorrow',
        timestamp: new Date(),
      },
    ],
  };
}
