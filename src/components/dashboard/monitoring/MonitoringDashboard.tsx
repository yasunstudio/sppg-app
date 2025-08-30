'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';

// Import modular components
import { 
  MetricCards, 
  SystemHealthCard,
  ProductionTab,
  DistributionTab,
  FinancialTab
} from '@/components/dashboard/monitoring';

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

export default function MonitoringDashboard() {
  const { data, loading, error, period, setPeriod } = useMonitoringData();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading monitoring data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-200">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No monitoring data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time system monitoring and analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
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
        <div className="text-sm text-muted-foreground">
          Last updated: {formatDateTime(data.lastUpdated)}
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

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SystemHealthCard data={data} />
            {/* Add more overview components here */}
          </div>
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

        <TabsContent value="system" className="space-y-4">
          <SystemHealthCard data={data} />
          {/* Add more system monitoring components here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
