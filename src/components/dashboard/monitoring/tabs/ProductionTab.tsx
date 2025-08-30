import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Factory, TrendingUp, Users, Clock, AlertTriangle, CheckCircle, Play, Timer } from 'lucide-react';
import { MonitoringData } from '@/types/monitoring';
import { formatNumber, formatPercentage, getEfficiencyColor, getTrendIcon, getTrendColor } from '@/lib/monitoring-utils';

interface ProductionTabProps {
  data: MonitoringData;
}

interface ProductionBatch {
  id: string;
  planId: string;
  itemName: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'QUALITY_CHECK' | 'COMPLETED' | 'FAILED';
  plannedQuantity: number;
  actualQuantity: number;
  startedAt: string;
  completedAt?: string;
  estimatedDuration: number;
  actualDuration?: number;
}

export function ProductionTab({ data }: ProductionTabProps) {
  const { production } = data.metrics;
  const details = data.detailedMetrics?.production;
  const [activeBatches, setActiveBatches] = useState<ProductionBatch[]>([]);
  const [recentBatches, setRecentBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductionDetails = async () => {
      try {
        const response = await fetch('/api/production/details');
        if (response.ok) {
          const data = await response.json();
          setActiveBatches(data.activeBatches || []);
          setRecentBatches(data.recentBatches || []);
        }
      } catch (error) {
        console.error('Failed to fetch production details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductionDetails();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 dark:text-green-400';
      case 'IN_PROGRESS': return 'text-blue-600 dark:text-blue-400';
      case 'QUALITY_CHECK': return 'text-yellow-600 dark:text-yellow-400';
      case 'FAILED': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'IN_PROGRESS': return <Play className="h-4 w-4" />;
      case 'QUALITY_CHECK': return <AlertTriangle className="h-4 w-4" />;
      case 'FAILED': return <AlertTriangle className="h-4 w-4" />;
      default: return <Timer className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Production Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(production.totalPlans)}</div>
            <p className="text-xs text-muted-foreground">Production plans active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Batches</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatNumber(production.completedBatches)}
            </div>
            <p className="text-xs text-muted-foreground">Batches finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Production</CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatNumber(production.activeProduction)}
            </div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Efficiency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getEfficiencyColor(production.avgEfficiency)}`}>
              {formatPercentage(production.avgEfficiency)}
            </div>
            <p className="text-xs text-muted-foreground">Production efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Production Batches */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Active Production Batches
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time tracking of ongoing production
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded"></div>
                ))}
              </div>
            ) : activeBatches.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {activeBatches.map((batch) => (
                  <div key={batch.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{batch.itemName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Batch #{batch.id.slice(-6)}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 ${getStatusColor(batch.status)}`}>
                        {getStatusIcon(batch.status)}
                        <Badge variant="outline" className={getStatusColor(batch.status)}>
                          {batch.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Planned:</span>
                        <span className="ml-1 font-medium">{batch.plannedQuantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Actual:</span>
                        <span className="ml-1 font-medium">{batch.actualQuantity || '-'}</span>
                      </div>
                    </div>
                    
                    {batch.status === 'IN_PROGRESS' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {Math.round((batch.actualQuantity / batch.plannedQuantity) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(batch.actualQuantity / batch.plannedQuantity) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Started: {new Date(batch.startedAt).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Factory className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active production batches</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              Recently Completed
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest completed production batches
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-14 rounded"></div>
                ))}
              </div>
            ) : recentBatches.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentBatches.map((batch) => (
                  <div key={batch.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{batch.itemName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Batch #{batch.id.slice(-6)}
                        </p>
                      </div>
                      <Badge 
                        variant={batch.status === 'COMPLETED' ? 'default' : 'destructive'}
                        className={batch.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                      >
                        {batch.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="ml-1 font-medium">{batch.actualQuantity}/{batch.plannedQuantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Efficiency:</span>
                        <span className={`ml-1 font-medium ${
                          (batch.actualQuantity / batch.plannedQuantity) >= 0.95 
                            ? 'text-green-600 dark:text-green-400'
                            : (batch.actualQuantity / batch.plannedQuantity) >= 0.8
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {Math.round((batch.actualQuantity / batch.plannedQuantity) * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    {batch.completedAt && (
                      <div className="text-xs text-muted-foreground">
                        Completed: {new Date(batch.completedAt).toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent completed batches</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      {details && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Equipment Usage</span>
                  <span className="font-medium">{formatPercentage(details.equipmentUsage)}</span>
                </div>
                <Progress value={details.equipmentUsage} className="mt-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Staff Utilization</span>
                  <span className="font-medium">{formatPercentage(details.staffUtilization)}</span>
                </div>
                <Progress value={details.staffUtilization} className="mt-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Kitchen Capacity</span>
                  <span className="font-medium">{formatPercentage(details.kitchenCapacity)}</span>
                </div>
                <Progress value={details.kitchenCapacity} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Batch Time</span>
                <span className="text-sm font-medium">{details.avgBatchTime} hours</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Production Trend</span>
                <div className="flex items-center space-x-1">
                  <span className={`text-sm ${getTrendColor(details.productionTrendPercent)}`}>
                    {getTrendIcon(details.productionTrendPercent)}
                  </span>
                  <span className="text-sm font-medium">
                    {formatPercentage(Math.abs(details.productionTrendPercent))}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Peak Hours</span>
                <Badge variant="outline">{details.peakHours}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
