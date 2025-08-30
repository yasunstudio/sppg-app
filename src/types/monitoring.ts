export interface MonitoringData {
  period: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  metrics: {
    production: {
      totalPlans: number;
      completedBatches: number;
      activeProduction: number;
      avgEfficiency: number;
    };
    distribution: {
      totalDistributions: number;
      completedDeliveries: number;
      inTransit: number;
      avgDeliveryTime: number;
      onTimeDeliveryRate: number;
    };
    financial: {
      totalIncome: number;
      totalExpenses: number;
      netIncome: number;
      budgetUtilization: number;
    };
    quality: {
      totalChecks: number;
      passedChecks: number;
      failedChecks: number;
      passRate: number;
      avgScore: number;
    };
    inventory: {
      totalItems: number;
      lowStockItems: number;
      stockValue: number;
      stockTurnover: number;
    };
    schools: {
      totalSchools: number;
      activeSchools: number;
      totalStudents: number;
      satisfactionRate: number;
      avgMealsPerDay: number;
    };
  };
  chartData?: {
    production: {
      daily: Array<{
        date: string;
        production: number;
        efficiency: number;
      }>;
      equipment: Array<{
        name: string;
        utilization: number;
      }>;
    };
    distribution: {
      delivery: Array<{
        status: string;
        count: number;
        color: string;
      }>;
      routes: Array<{
        route: string;
        efficiency: number;
        deliveries: number;
      }>;
    };
    financial: {
      monthly: Array<{
        month: string;
        income: number;
        expenses: number;
        profit: number;
      }>;
      categories: Array<{
        category: string;
        amount: number;
        percentage: number;
      }>;
    };
  };
  systemHealth: {
    serverStatus: string;
    databaseStatus: string;
    apiResponseTime: number;
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
  };
  alertSummary: {
    critical: number;
    warning: number;
    info: number;
    total: number;
    recentAlerts: Array<{
      id: string;
      type: string;
      message: string;
      timestamp: string;
    }>;
  };
  detailedMetrics?: {
    production: {
      equipmentUsage: number;
      staffUtilization: number;
      kitchenCapacity: number;
      avgBatchTime: number;
      productionTrendPercent: number;
      peakHours: string;
    };
    distribution: {
      routeEfficiency: number;
      fuelEfficiency: number;
      totalDistance: number;
      deliveryTrendPercent: number;
      peakDeliveryHours: string;
      avgDeliveryTime: number;
    };
    financial: {
      costBreakdown: {
        rawMaterials: number;
        labor: number;
        operations: number;
        other: number;
      };
      budgetPerformance: {
        rawMaterials: number;
        operations: number;
        distribution: number;
      };
      trends: {
        revenueGrowth: number;
        profitMarginChange: number;
      };
    };
    system: {
      networkConnections: number;
      dataTransferDaily: number;
      bandwidthUsage: number;
      queryPerformance: string;
      avgQueryTime: number;
      activeConnections: number;
      maxConnections: number;
      cacheHitRate: number;
      lastSecurityScan: string;
      threatsBlocked: number;
    };
  };
  lastUpdated: string;
}

export interface PeriodOption {
  value: string;
  label: string;
}

export interface StatusColorConfig {
  good: number;
  warning: number;
}
