'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, AlertTriangle, CheckCircle, Clock, DollarSign, Factory, 
  School, Truck, Users, Gauge, Server, Database, Wifi, RefreshCw,
  TrendingUp, TrendingDown, BarChart3, PieChart, Calendar,
  Bell, AlertCircle, Info
} from 'lucide-react';

interface MonitoringData {
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
  lastUpdated: string;
}

const periodOptions = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'week', label: 'Minggu Ini' },
  { value: 'month', label: 'Bulan Ini' },
  { value: 'quarter', label: 'Kuartal Ini' },
  { value: 'year', label: 'Tahun Ini' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('id-ID');
}

function getStatusColor(value: number, thresholds: { good: number; warning: number }) {
  if (value >= thresholds.good) return 'text-green-600 dark:text-green-400';
  if (value >= thresholds.warning) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function getHealthStatus(status: string) {
  switch (status) {
    case 'healthy':
      return <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Healthy</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">Warning</Badge>;
    case 'critical':
      return <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">Critical</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

export default function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/monitoring/dashboard?period=${selectedPeriod}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Error Loading Monitoring Data
            </h3>
            <p className="text-muted-foreground mb-4">
              Unable to fetch monitoring data. Please try refreshing the page.
            </p>
            <Button onClick={fetchData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitoring & Reporting</h1>
            <p className="text-muted-foreground">
              Real-time system monitoring dan performance analytics • Last updated: {data ? formatDateTime(data.lastUpdated) : 'Loading...'}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchData(); // Always refresh data when clicked
                setAutoRefresh(!autoRefresh); // Toggle auto refresh
              }}
              className={autoRefresh ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : ''}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto Refresh ON' : 'Enable Auto Refresh'}
            </Button>
          </div>
        </div>

      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Production */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produksi Aktif</CardTitle>
            <Factory className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.production.activeProduction}</div>
            <div className="text-xs text-muted-foreground">
              {data.metrics.production.completedBatches} batch selesai
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">Efisiensi</div>
              <div className="text-sm font-medium">{data.metrics.production.avgEfficiency.toFixed(1)}%</div>
            </div>
          </CardContent>
        </Card>

        {/* Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribusi</CardTitle>
            <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.distribution.inTransit}</div>
            <div className="text-xs text-muted-foreground">dalam perjalanan</div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">On-time Rate</div>
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                {data.metrics.distribution.onTimeDeliveryRate}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
            <DollarSign className={`h-4 w-4 ${data.metrics.financial.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.metrics.financial.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(data.metrics.financial.netIncome)}
            </div>
            <div className="text-xs text-muted-foreground">
              Budget: {data.metrics.financial.budgetUtilization.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        {/* Quality */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.metrics.quality.passRate.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {data.metrics.quality.passedChecks}/{data.metrics.quality.totalChecks} checks
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Summary */}
      {data.alertSummary.total > 0 && (
        <Card className="border-l-4 border-l-yellow-500 dark:border-l-yellow-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm">Critical: {data.alertSummary.critical}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm">Warning: {data.alertSummary.warning}</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">Info: {data.alertSummary.info}</span>
              </div>
              <div className="text-sm font-medium">Total: {data.alertSummary.total}</div>
            </div>
            <div className="space-y-2">
              {data.alertSummary.recentAlerts.map((alert) => (
                <div key={alert.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="text-sm">{alert.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(alert.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Metrics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  School Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Schools</span>
                  <span className="font-medium">{data.metrics.schools.totalSchools}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Schools</span>
                  <span className="font-medium">{data.metrics.schools.activeSchools}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Students</span>
                  <span className="font-medium">{data.metrics.schools.totalStudents.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Satisfaction Rate</span>
                  <span className="font-medium text-green-600">
                    {data.metrics.schools.satisfactionRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Meals/Day</span>
                  <span className="font-medium">{data.metrics.schools.avgMealsPerDay.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span className="font-medium">{data.metrics.inventory.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Low Stock</span>
                  <span className={`font-medium ${data.metrics.inventory.lowStockItems > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.metrics.inventory.lowStockItems}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Stock Value</span>
                  <span className="font-medium">{formatCurrency(data.metrics.inventory.stockValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Turnover</span>
                  <span className="font-medium">{data.metrics.inventory.stockTurnover}x/year</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pass Rate</span>
                    <span className="font-medium">{data.metrics.quality.passRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={data.metrics.quality.passRate} className="h-2" />
                </div>
                <div className="flex justify-between">
                  <span>Total Checks</span>
                  <span className="font-medium">{data.metrics.quality.totalChecks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passed</span>
                  <span className="font-medium text-green-600">{data.metrics.quality.passedChecks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Failed</span>
                  <span className={`font-medium ${data.metrics.quality.failedChecks > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.metrics.quality.failedChecks}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Production Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Plans</span>
                  <span className="font-medium">{data.metrics.production.totalPlans}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed Batches</span>
                  <span className="font-medium text-green-600">{data.metrics.production.completedBatches}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Production</span>
                  <span className="font-medium text-blue-600">{data.metrics.production.activeProduction}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Efficiency</span>
                    <span className="font-medium">{data.metrics.production.avgEfficiency.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(data.metrics.production.avgEfficiency, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production Trends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Production trending up 12.5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Peak hours: 8-12 AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Avg batch time: 4.2 hours</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Equipment Usage</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Staff Utilization</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Kitchen Capacity</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Distribution Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Distributions</span>
                  <span className="font-medium">{data.metrics.distribution.totalDistributions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span className="font-medium text-green-600">{data.metrics.distribution.completedDeliveries}</span>
                </div>
                <div className="flex justify-between">
                  <span>In Transit</span>
                  <span className="font-medium text-blue-600">{data.metrics.distribution.inTransit}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>On-time Rate</span>
                    <span className="font-medium">{data.metrics.distribution.onTimeDeliveryRate}%</span>
                  </div>
                  <Progress value={data.metrics.distribution.onTimeDeliveryRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Avg Delivery Time</span>
                  <span className="font-medium">{data.metrics.distribution.avgDeliveryTime} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Delivery efficiency up 8.3%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Peak delivery: 11 AM - 1 PM</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Route Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Route Efficiency</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Fuel Efficiency</span>
                    <span className="font-medium">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div className="flex justify-between">
                  <span>Total Distance</span>
                  <span className="font-medium">1,250 km</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Income</span>
                  <span className="font-medium text-green-600">{formatCurrency(data.metrics.financial.totalIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Expenses</span>
                  <span className="font-medium text-red-600">{formatCurrency(data.metrics.financial.totalExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Income</span>
                  <span className={`font-medium ${data.metrics.financial.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(data.metrics.financial.netIncome)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Budget Utilization</span>
                    <span className="font-medium">{data.metrics.financial.budgetUtilization.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(data.metrics.financial.budgetUtilization, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Raw Materials</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="flex justify-between">
                  <span>Labor</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="flex justify-between">
                  <span>Operations</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Other</span>
                  <span className="font-medium">10%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Trends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Profit margin down 2.1%</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Revenue up 15.2%</span>
                </div>
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Cost optimization target: 8%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Raw Materials</span>
                    <span className="font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Operations</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Distribution</span>
                    <span className="font-medium">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">Revenue vs Expenses Chart</p>
                  <p className="text-xs text-muted-foreground mt-1">Chart visualization will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>CPU Usage</span>
                    <span className={`font-medium ${getStatusColor(100 - data.systemHealth.cpuUsage, { good: 70, warning: 50 })}`}>
                      {data.systemHealth.cpuUsage}%
                    </span>
                  </div>
                  <Progress value={data.systemHealth.cpuUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Memory Usage</span>
                    <span className={`font-medium ${getStatusColor(100 - data.systemHealth.memoryUsage, { good: 70, warning: 50 })}`}>
                      {data.systemHealth.memoryUsage}%
                    </span>
                  </div>
                  <Progress value={data.systemHealth.memoryUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Disk Usage</span>
                    <span className={`font-medium ${getStatusColor(100 - data.systemHealth.diskUsage, { good: 70, warning: 50 })}`}>
                      {data.systemHealth.diskUsage}%
                    </span>
                  </div>
                  <Progress value={data.systemHealth.diskUsage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Server Status</span>
                  {getHealthStatus(data.systemHealth.serverStatus)}
                </div>
                <div className="flex justify-between">
                  <span>Database Status</span>
                  {getHealthStatus(data.systemHealth.databaseStatus)}
                </div>
                <div className="flex justify-between">
                  <span>API Response Time</span>
                  <span className={`font-medium ${getStatusColor(1000 - data.systemHealth.apiResponseTime, { good: 800, warning: 500 })}`}>
                    {data.systemHealth.apiResponseTime}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime</span>
                  <span className="font-medium text-green-600">{data.systemHealth.uptime}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network & Connectivity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Internet Connection</span>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Active Connections</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Transfer</span>
                  <span className="font-medium">2.4 GB/day</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Bandwidth Usage</span>
                    <span className="font-medium">64%</span>
                  </div>
                  <Progress value={64} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Query Performance</span>
                  <span className="font-medium text-green-600">Excellent</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Query Time</span>
                  <span className="font-medium">12ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Connections</span>
                  <span className="font-medium">8/100</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cache Hit Rate</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>SSL Certificate</span>
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Valid</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Security Scan</span>
                  <span className="text-sm">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Threats Blocked</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Firewall</span>
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-950/50 border-l-2 border-yellow-400 dark:border-yellow-500 text-sm">
                    <span className="font-medium">Warning:</span> Memory usage approaching 70%
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/50 border-l-2 border-blue-400 dark:border-blue-500 text-sm">
                    <span className="font-medium">Info:</span> System backup completed successfully
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
