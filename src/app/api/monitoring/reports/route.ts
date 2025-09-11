import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
// GET /api/monitoring/reports
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';
    const period = searchParams.get('period') || 'month';
    const format = searchParams.get('format') || 'json';

    const { startDate, endDate } = getDateRange(period);

    let reportData;

    switch (type) {
      case 'production':
        reportData = await generateProductionReport(startDate, endDate);
        break;
      case 'distribution':
        reportData = await generateDistributionReport(startDate, endDate);
        break;
      case 'financial':
        reportData = await generateFinancialReport(startDate, endDate);
        break;
      case 'quality':
        reportData = await generateQualityReport(startDate, endDate);
        break;
      case 'summary':
      default:
        reportData = await generateSummaryReport(startDate, endDate);
        break;
    }

    const response = {
      reportType: type,
      period,
      dateRange: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      data: reportData,
    };

    if (format === 'csv') {
      const csv = convertToCSV(reportData);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${type}-report-${period}.csv"`,
        },
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
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
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { startDate, endDate };
}

async function generateSummaryReport(startDate: Date, endDate: Date) {
  const [
    productionMetrics,
    distributionMetrics,
    financialMetrics,
    qualityMetrics,
    schoolMetrics,
  ] = await Promise.all([
    generateProductionMetrics(startDate, endDate),
    generateDistributionMetrics(startDate, endDate),
    generateFinancialMetrics(startDate, endDate),
    generateQualityMetrics(startDate, endDate),
    generateSchoolMetrics(startDate, endDate),
  ]);

  // Get detailed data for the details tab
  const productionPlans = await prisma.productionPlan.findMany({
    where: {
      planDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      menu: true,
      batches: {
        include: {
          qualityChecks: true,
        },
      },
    },
    orderBy: {
      planDate: 'desc'
    },
    take: 20 // Limit to last 20 records for performance
  });

  const transactions = await prisma.financialTransaction.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 20 // Limit to last 20 records for performance
  });

  return {
    summary: {
      totalMealsProduced: productionMetrics.totalMealsProduced,
      totalMealsDelivered: distributionMetrics.totalMealsDelivered,
      totalRevenue: financialMetrics.totalRevenue,
      totalCosts: financialMetrics.totalCosts,
      profitMargin: financialMetrics.profitMargin,
      qualityScore: qualityMetrics.averageScore,
      schoolsSatisfaction: schoolMetrics.averageSatisfaction,
    },
    breakdown: {
      production: productionMetrics,
      distribution: distributionMetrics,
      financial: financialMetrics,
      quality: qualityMetrics,
      schools: schoolMetrics,
    },
    // Add detailed data for the details tab
    plans: productionPlans.map(plan => ({
      id: plan.id,
      date: plan.planDate,
      menuName: plan.menu?.name || 'Unknown Menu',
      targetPortions: plan.targetPortions,
      actualPortions: plan.batches.reduce((sum, batch) => sum + (batch.actualQuantity || 0), 0),
      efficiency: plan.batches.length > 0 ? 
        (plan.batches.reduce((sum, batch) => sum + (batch.actualQuantity || 0), 0) / plan.targetPortions) * 100 : 0,
      batchesCount: plan.batches.length,
      qualityChecks: plan.batches.reduce((acc, batch) => acc + batch.qualityChecks.length, 0),
    })),
    transactions: transactions.map(tx => ({
      id: tx.id,
      date: tx.createdAt,
      type: tx.type,
      category: tx.category || 'General',
      description: tx.description || 'No description',
      amount: tx.amount,
    })),
    trends: await generateTrends(startDate, endDate),
    recommendations: generateRecommendations(productionMetrics, distributionMetrics, financialMetrics, qualityMetrics),
  };
}

async function generateProductionReport(startDate: Date, endDate: Date) {
  const productionPlans = await prisma.productionPlan.findMany({
    where: {
      planDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      menu: true,
      batches: {
        include: {
          qualityChecks: true,
        },
      },
    },
  });

  const metrics = await generateProductionMetrics(startDate, endDate);

  return {
    metrics,
    plans: productionPlans.map(plan => ({
      id: plan.id,
      date: plan.planDate,
      menuName: plan.menu?.name || 'Unknown',
      targetPortions: plan.targetPortions,
      actualPortions: plan.batches.reduce((sum, batch) => sum + (batch.actualQuantity || 0), 0),
      efficiency: plan.batches.length > 0 ? 
        (plan.batches.reduce((sum, batch) => sum + (batch.actualQuantity || 0), 0) / plan.targetPortions) * 100 : 0,
      batchesCount: plan.batches.length,
      qualityChecks: plan.batches.reduce((acc, batch) => acc + batch.qualityChecks.length, 0),
    })),
  };
}

async function generateDistributionReport(startDate: Date, endDate: Date) {
  const distributions = await prisma.distribution.findMany({
    where: {
      distributionDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      driver: true,
      vehicle: true,
      schools: {
        include: {
          school: true,
        },
      },
    },
  });

  const metrics = await generateDistributionMetrics(startDate, endDate);

  return {
    metrics,
    distributions: distributions.map(dist => ({
      id: dist.id,
      date: dist.distributionDate,
      driverName: dist.driver?.name || 'Unassigned',
      vehicleNumber: dist.vehicle?.plateNumber || 'Unassigned',
      status: dist.status,
      totalPortions: dist.totalPortions,
      schoolsCount: dist.schools.length,
      estimatedDuration: dist.estimatedDuration,
      actualDuration: dist.actualDuration,
      efficiency: dist.actualDuration && dist.estimatedDuration ?
        (dist.estimatedDuration / dist.actualDuration) * 100 : 0,
    })),
  };
}

async function generateFinancialReport(startDate: Date, endDate: Date) {
  const currentPeriod = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
  
  const [transactions, budgets] = await Promise.all([
    prisma.financialTransaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.budget.findMany({
      where: {
        period: currentPeriod,
      },
    }),
  ]);

  const metrics = await generateFinancialMetrics(startDate, endDate);

  return {
    metrics,
    transactions: transactions.map(tx => ({
      id: tx.id,
      date: tx.createdAt,
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      description: tx.description,
      reference: tx.referenceId,
    })),
    budgets: budgets.map(budget => ({
      category: budget.category,
      allocated: budget.allocated,
      spent: budget.spent,
      remaining: budget.remaining,
      utilization: budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0,
    })),
  };
}

async function generateQualityReport(startDate: Date, endDate: Date) {
  const qualityChecks = await prisma.qualityCheckpoint.findMany({
    where: {
      checkedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      checker: true,
      productionPlan: {
        include: {
          menu: true,
        },
      },
    },
  });

  const metrics = await generateQualityMetrics(startDate, endDate);

  return {
    metrics,
    checks: qualityChecks.map(check => ({
      id: check.id,
      date: check.checkedAt,
      type: check.checkpointType,
      status: check.status,
      checkerName: check.checker.name,
      menuName: check.productionPlan?.menu?.name || 'Unknown',
      temperature: check.temperature,
      notes: check.notes,
    })),
  };
}

// Helper functions for metrics calculation
async function generateProductionMetrics(startDate: Date, endDate: Date) {
  const [totalPlans, totalBatches, completedBatches] = await Promise.all([
    prisma.productionPlan.count({
      where: { planDate: { gte: startDate, lte: endDate } },
    }),
    prisma.productionBatch.count({
      where: { createdAt: { gte: startDate, lte: endDate } },
    }),
    prisma.productionBatch.count({
      where: { 
        status: 'COMPLETED',
        completedAt: { gte: startDate, lte: endDate },
      },
    }),
  ]);

  return {
    totalPlans,
    totalBatches,
    completedBatches,
    completionRate: totalBatches > 0 ? (completedBatches / totalBatches) * 100 : 0,
    totalMealsProduced: completedBatches * 250, // Mock: 250 meals per batch
  };
}

async function generateDistributionMetrics(startDate: Date, endDate: Date) {
  const [totalDistributions, completedDistributions] = await Promise.all([
    prisma.distribution.count({
      where: { distributionDate: { gte: startDate, lte: endDate } },
    }),
    prisma.distribution.count({
      where: { 
        status: 'COMPLETED',
        distributionDate: { gte: startDate, lte: endDate },
      },
    }),
  ]);

  return {
    totalDistributions,
    completedDistributions,
    completionRate: totalDistributions > 0 ? (completedDistributions / totalDistributions) * 100 : 0,
    totalMealsDelivered: completedDistributions * 1200, // Mock: 1200 meals per distribution
  };
}

async function generateFinancialMetrics(startDate: Date, endDate: Date) {
  const [income, expenses] = await Promise.all([
    prisma.financialTransaction.aggregate({
      where: {
        type: 'INCOME',
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    }),
    prisma.financialTransaction.aggregate({
      where: {
        type: 'EXPENSE',
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    }),
  ]);

  const totalRevenue = income._sum.amount || 0;
  const totalCosts = expenses._sum.amount || 0;
  const profit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return {
    totalRevenue,
    totalCosts,
    profit,
    profitMargin,
  };
}

async function generateQualityMetrics(startDate: Date, endDate: Date) {
  const [totalChecks, passedChecks] = await Promise.all([
    prisma.qualityCheckpoint.count({
      where: { checkedAt: { gte: startDate, lte: endDate } },
    }),
    prisma.qualityCheckpoint.count({
      where: { 
        status: 'PASS',
        checkedAt: { gte: startDate, lte: endDate },
      },
    }),
  ]);

  return {
    totalChecks,
    passedChecks,
    passRate: totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0,
    averageScore: 85.5, // Mock score
  };
}

async function generateSchoolMetrics(startDate: Date, endDate: Date) {
  const totalSchools = await prisma.school.count();
  const totalStudents = await prisma.student.count();

  return {
    totalSchools,
    totalStudents,
    averageSatisfaction: 95.2, // Mock satisfaction
    mealsServed: 12500, // Mock
  };
}

async function generateTrends(startDate: Date, endDate: Date) {
  // Mock trend data - in real implementation, this would calculate actual trends
  return {
    production: { trend: 'up', percentage: 12.5 },
    distribution: { trend: 'up', percentage: 8.3 },
    financial: { trend: 'down', percentage: -2.1 },
    quality: { trend: 'stable', percentage: 0.8 },
  };
}

function generateRecommendations(production: any, distribution: any, financial: any, quality: any) {
  const recommendations = [];

  if (production.completionRate < 90) {
    recommendations.push({
      category: 'production',
      priority: 'high',
      message: 'Production completion rate is below target. Consider optimizing production workflow.',
    });
  }

  if (distribution.completionRate < 95) {
    recommendations.push({
      category: 'distribution',
      priority: 'medium',
      message: 'Distribution completion rate can be improved. Review route optimization.',
    });
  }

  if (financial.profitMargin < 10) {
    recommendations.push({
      category: 'financial',
      priority: 'high',
      message: 'Profit margin is low. Consider cost optimization or pricing review.',
    });
  }

  if (quality.passRate < 95) {
    recommendations.push({
      category: 'quality',
      priority: 'high',
      message: 'Quality pass rate is below standard. Implement additional quality controls.',
    });
  }

  return recommendations;
}

function convertToCSV(data: any): string {
  // Simple CSV conversion - in real implementation, use a proper CSV library
  const headers = Object.keys(data.summary || {});
  const rows = [headers.join(',')];
  
  if (data.summary) {
    const values = headers.map(header => data.summary[header]);
    rows.push(values.join(','));
  }

  return rows.join('\n');
}
