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
  if (value >= thresholds.good) return 'text-green-600';
  if (value >= thresholds.warning) return 'text-yellow-600';
  return 'text-red-600';
}

function getHealthStatus(status: string) {
  switch (status) {
    case 'healthy':
      return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    case 'critical':
      return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
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
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>Error loading monitoring data</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoring & Reporting</h1>
          <p className="text-muted-foreground">
            Real-time system monitoring dan performance analytics
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
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50' : ''}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* System Health Bar */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Server className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">System Status</div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {formatDateTime(data.lastUpdated)}
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Server</div>
                {getHealthStatus(data.systemHealth.serverStatus)}
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Database</div>
                {getHealthStatus(data.systemHealth.databaseStatus)}
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Uptime</div>
                <div className="font-medium text-green-600">{data.systemHealth.uptime}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Response</div>
                <div className="font-medium">{data.systemHealth.apiResponseTime}ms</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Production */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produksi Aktif</CardTitle>
            <Factory className="h-4 w-4 text-blue-600" />
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
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.distribution.inTransit}</div>
            <div className="text-xs text-muted-foreground">dalam perjalanan</div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">On-time Rate</div>
              <div className="text-sm font-medium text-green-600">
                {data.metrics.distribution.onTimeDeliveryRate}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
            <DollarSign className={`h-4 w-4 ${data.metrics.financial.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.metrics.financial.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
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
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-600" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Critical: {data.alertSummary.critical}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Warning: {data.alertSummary.warning}</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Info: {data.alertSummary.info}</span>
              </div>
              <div className="text-sm font-medium">Total: {data.alertSummary.total}</div>
            </div>
            <div className="space-y-2">
              {data.alertSummary.recentAlerts.map((alert) => (
                <div key={alert.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
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

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>CPU Usage</span>
                    <span className="font-medium">{data.systemHealth.cpuUsage}%</span>
                  </div>
                  <Progress value={data.systemHealth.cpuUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Memory Usage</span>
                    <span className="font-medium">{data.systemHealth.memoryUsage}%</span>
                  </div>
                  <Progress value={data.systemHealth.memoryUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Disk Usage</span>
                    <span className="font-medium">{data.systemHealth.diskUsage}%</span>
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
                  <span className="font-medium">{data.systemHealth.apiResponseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime</span>
                  <span className="font-medium text-green-600">{data.systemHealth.uptime}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
