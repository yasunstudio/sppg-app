'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, RefreshCw, Play, Pause } from 'lucide-react';
import { AutoRefreshNotification } from '@/components/ui/auto-refresh-notification';

// Import modular components
import { 
  MetricCards, 
  SystemHealthCard,
  ProductionTab,
  DistributionTab,
  FinancialTab
} from '@/components/dashboard/monitoring';

// Import chart components
import ProductionChart from '@/components/dashboard/monitoring/charts/ProductionChart';
import DistributionChart from '@/components/dashboard/monitoring/charts/DistributionChart';
import FinancialChart from '@/components/dashboard/monitoring/charts/FinancialChart';

// Import hooks and utilities
import { useMonitoringData } from '@/hooks/use-monitoring-data';
import { formatDateTime } from '@/lib/monitoring-utils';
import { PeriodOption } from '@/types/monitoring';

const periodOptions: PeriodOption[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

export default function MonitoringPage() {
  const { 
    data, 
    loading, 
    error, 
    period, 
    setPeriod, 
    fetchData,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval
  } = useMonitoringData();

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  const handleAutoRefreshToggle = () => {
    const newState = !autoRefresh;
    setAutoRefresh(newState);
    
    setNotification({
      message: newState 
        ? `Auto refresh diaktifkan (setiap ${refreshInterval / 1000} detik)` 
        : 'Auto refresh dinonaktifkan',
      type: newState ? 'success' : 'info'
    });
  };

  const handleIntervalChange = (newInterval: number) => {
    console.log('Changing interval from', refreshInterval, 'to', newInterval);
    setRefreshInterval(newInterval);
    setNotification({
      message: `Interval refresh diubah ke ${newInterval / 1000} detik`,
      type: 'success'
    });
    
    // If auto refresh is active, show additional info
    if (autoRefresh) {
      console.log('Auto refresh is active, new interval will take effect immediately');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor system performance and key metrics across all operations
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading monitoring data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor system performance and key metrics across all operations
          </p>
        </div>
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-200">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No monitoring data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor system performance and key metrics across all operations
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Auto Refresh Toggle */}
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={handleAutoRefreshToggle}
            className={autoRefresh ? "bg-green-600 hover:bg-green-700" : ""}
            title={autoRefresh ? "Klik untuk menonaktifkan auto refresh" : "Klik untuk mengaktifkan auto refresh"}
          >
            {autoRefresh ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Auto Refresh
            {autoRefresh && (
              <span className="ml-1 text-xs opacity-80">
                ({refreshInterval / 1000}s)
              </span>
            )}
          </Button>

          {/* Refresh Interval Settings */}
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground">Interval:</span>
            <select
              value={refreshInterval}
              onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
              className="px-2 py-1 text-xs border border-input bg-background rounded-md cursor-pointer hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
              title="Pilih interval auto refresh"
            >
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
              <option value={300000}>5m</option>
            </select>
          </div>

          {/* Manual Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Range & Last Updated */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="text-sm text-muted-foreground">
          Period: {data.dateRange.startDate} - {data.dateRange.endDate}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {formatDateTime(data.lastUpdated)}
          </div>
          {autoRefresh && (
            <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Auto refresh aktif ({refreshInterval / 1000}s)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Metrics Cards */}
      <MetricCards data={data} />

      {/* Alert Summary */}
      {data.alertSummary.total > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <span>Active Alerts</span>
              <Badge variant="outline" className="text-orange-800 dark:text-orange-200">
                {data.alertSummary.total}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Critical: {data.alertSummary.critical}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Warning: {data.alertSummary.warning}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Info: {data.alertSummary.info}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Main Analytics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Production Performance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Production Performance Overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time monitoring of production efficiency and output trends
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {data.metrics.production.activeProduction}
                    </div>
                    <p className="text-xs text-muted-foreground">Active Productions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {data.metrics.production.completedBatches}
                    </div>
                    <p className="text-xs text-muted-foreground">Completed Batches</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {data.metrics.production.avgEfficiency.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Avg Efficiency</p>
                  </div>
                </div>
                
                {/* Efficiency Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Production Efficiency</span>
                    <span className="font-medium">{data.metrics.production.avgEfficiency.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full transition-all duration-300" 
                      style={{width: `${Math.min(data.metrics.production.avgEfficiency, 100)}%`}}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Today's Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Total Schools</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {data.metrics.schools.totalSchools}
                    </p>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Students Served</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {data.metrics.schools.totalStudents.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">In Transit</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {data.metrics.distribution.inTransit}
                    </p>
                  </div>
                  <div className="text-orange-600 dark:text-orange-400">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Analytics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quality & Distribution Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quality & Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Quality assurance and delivery performance metrics
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Quality Pass Rate</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {data.metrics.quality.passRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{width: `${data.metrics.quality.passRate}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>On-Time Delivery</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {data.metrics.distribution.onTimeDeliveryRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{width: `${data.metrics.distribution.onTimeDeliveryRate}%`}}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-lg font-bold">{data.metrics.quality.passedChecks}</p>
                    <p className="text-xs text-muted-foreground">Passed QC</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{data.metrics.distribution.completedDeliveries}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Financial Overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Budget utilization and financial performance tracking
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`text-center p-4 rounded-lg ${
                  data.metrics.financial.netIncome >= 0 
                    ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300'
                }`}>
                  <p className="text-sm font-medium">Net Income</p>
                  <p className="text-2xl font-bold">
                    Rp {Math.abs(data.metrics.financial.netIncome).toLocaleString()}
                  </p>
                  <p className="text-xs">
                    {data.metrics.financial.netIncome >= 0 ? 'Profit' : 'Loss'} this period
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Utilization</span>
                    <span className="font-medium">
                      {data.metrics.financial.budgetUtilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className={`h-2 rounded-full ${
                        data.metrics.financial.budgetUtilization > 90 
                          ? 'bg-red-500' 
                          : data.metrics.financial.budgetUtilization > 75 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{width: `${Math.min(data.metrics.financial.budgetUtilization, 100)}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {data.metrics.financial.totalIncome.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Income</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      {data.metrics.financial.totalExpenses.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Expenses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          {data.chartData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Analytics & Trends</h2>
                <p className="text-sm text-muted-foreground">Visual insights and performance trends</p>
              </div>
              
              {/* Production Charts */}
              <ProductionChart data={data.chartData.production} />
              
              {/* Distribution and Financial Charts */}
              <DistributionChart data={data.chartData.distribution} />
              
              {/* Financial Charts */}
              <FinancialChart data={data.chartData.financial} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="production">
          <ProductionTab data={data} />
        </TabsContent>

        <TabsContent value="distribution">
          <DistributionTab data={data} />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialTab data={data} />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Health Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <SystemHealthCard data={data} />
            
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database Query Time</span>
                    <span className="font-medium">12ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '20%'}}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cache Hit Rate</span>
                    <span className="font-medium text-green-600 dark:text-green-400">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '96%'}}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <span className="font-medium text-green-600 dark:text-green-400">0.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '2%'}}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-lg font-bold">99.9%</p>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">1.2s</p>
                    <p className="text-xs text-muted-foreground">Avg Response</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">SSL Certificate</p>
                    <p className="text-xs text-muted-foreground">Valid until Dec 2025</p>
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Firewall</p>
                    <p className="text-xs text-muted-foreground">Active & Updated</p>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">0</p>
                    <p className="text-xs text-muted-foreground">Threats Blocked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">2h</p>
                    <p className="text-xs text-muted-foreground">Last Scan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Resources & Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Resource Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Resource Usage Trends</CardTitle>
                <p className="text-sm text-muted-foreground">
                  24-hour system resource monitoring
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span className="font-medium">{data.systemHealth.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          data.systemHealth.cpuUsage > 80 
                            ? 'bg-red-500' 
                            : data.systemHealth.cpuUsage > 60 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{width: `${data.systemHealth.cpuUsage}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span className="font-medium">{data.systemHealth.memoryUsage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          data.systemHealth.memoryUsage > 80 
                            ? 'bg-red-500' 
                            : data.systemHealth.memoryUsage > 60 
                            ? 'bg-yellow-500' 
                            : 'bg-blue-500'
                        }`}
                        style={{width: `${data.systemHealth.memoryUsage}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Disk Usage</span>
                      <span className="font-medium">{data.systemHealth.diskUsage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          data.systemHealth.diskUsage > 80 
                            ? 'bg-red-500' 
                            : data.systemHealth.diskUsage > 60 
                            ? 'bg-yellow-500' 
                            : 'bg-purple-500'
                        }`}
                        style={{width: `${data.systemHealth.diskUsage}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-sm font-medium">Network</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">2.4GB</p>
                      <p className="text-xs text-muted-foreground">Daily Transfer</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Connections</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">47</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Bandwidth</p>
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">64%</p>
                      <p className="text-xs text-muted-foreground">Usage</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent System Activity</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Latest system events and operations
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Database backup completed</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cache refreshed automatically</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">High CPU usage detected (temporary)</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Security scan completed - No threats</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">System updated to latest version</p>
                      <p className="text-xs text-muted-foreground">6 hours ago</p>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      View All Logs
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Auto Refresh Notification */}
      {notification && (
        <AutoRefreshNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
