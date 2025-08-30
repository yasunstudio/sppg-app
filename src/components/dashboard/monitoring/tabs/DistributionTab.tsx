import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Truck, MapPin, Clock, TrendingUp, Route, Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { MonitoringData } from '@/types/monitoring';
import { formatNumber, formatPercentage, getTrendIcon, getTrendColor } from '@/lib/monitoring-utils';

interface DistributionTabProps {
  data: MonitoringData;
}

interface Distribution {
  id: string;
  schoolName: string;
  driverName: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
  scheduledAt: string;
  actualDeliveryTime?: string;
  estimatedDuration: number;
  actualDuration?: number;
  portionCount: number;
  route: string;
}

export function DistributionTab({ data }: DistributionTabProps) {
  const { distribution } = data.metrics;
  const details = data.detailedMetrics?.distribution;
  const [activeDistributions, setActiveDistributions] = useState<Distribution[]>([]);
  const [recentDistributions, setRecentDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistributionDetails = async () => {
      try {
        const response = await fetch('/api/distribution/details');
        if (response.ok) {
          const data = await response.json();
          setActiveDistributions(data.activeDistributions || []);
          setRecentDistributions(data.recentDistributions || []);
        }
      } catch (error) {
        console.error('Failed to fetch distribution details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistributionDetails();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 dark:text-green-400';
      case 'IN_TRANSIT': return 'text-blue-600 dark:text-blue-400';
      case 'DELAYED': return 'text-yellow-600 dark:text-yellow-400';
      case 'CANCELLED': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'IN_TRANSIT': return <Truck className="h-4 w-4" />;
      case 'DELAYED': return <AlertTriangle className="h-4 w-4" />;
      case 'CANCELLED': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Distribution Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distributions</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(distribution.totalDistributions)}</div>
            <p className="text-xs text-muted-foreground">Total shipments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Deliveries</CardTitle>
            <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatNumber(distribution.completedDeliveries)}
            </div>
            <p className="text-xs text-muted-foreground">Successful deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatNumber(distribution.inTransit)}
            </div>
            <p className="text-xs text-muted-foreground">Currently shipping</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatPercentage(distribution.onTimeDeliveryRate)}
            </div>
            <p className="text-xs text-muted-foreground">Delivery performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Distributions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Active Distributions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time tracking of ongoing deliveries
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-20 rounded"></div>
                ))}
              </div>
            ) : activeDistributions.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {activeDistributions.map((dist) => (
                  <div key={dist.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{dist.schoolName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Driver: {dist.driverName}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 ${getStatusColor(dist.status)}`}>
                        {getStatusIcon(dist.status)}
                        <Badge variant="outline" className={getStatusColor(dist.status)}>
                          {dist.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Portions:</span>
                        <span className="ml-1 font-medium">{dist.portionCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Route:</span>
                        <span className="ml-1 font-medium">{dist.route}</span>
                      </div>
                    </div>
                    
                    {dist.status === 'IN_TRANSIT' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {Math.round((Date.now() - new Date(dist.scheduledAt).getTime()) / 
                            (dist.estimatedDuration * 60 * 1000) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(100, (Date.now() - new Date(dist.scheduledAt).getTime()) / 
                          (dist.estimatedDuration * 60 * 1000) * 100)} 
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Scheduled: {new Date(dist.scheduledAt).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active distributions</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              Recent Deliveries
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest completed deliveries
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded"></div>
                ))}
              </div>
            ) : recentDistributions.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentDistributions.map((dist) => (
                  <div key={dist.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{dist.schoolName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {dist.driverName}
                        </p>
                      </div>
                      <Badge 
                        variant={dist.status === 'COMPLETED' ? 'default' : 'destructive'}
                        className={dist.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                      >
                        {dist.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-muted-foreground">Portions:</span>
                        <span className="ml-1 font-medium">{dist.portionCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <span className={`ml-1 font-medium ${
                          dist.actualDuration && dist.actualDuration <= dist.estimatedDuration
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {dist.actualDuration || dist.estimatedDuration}m
                        </span>
                      </div>
                    </div>
                    
                    {dist.actualDeliveryTime && (
                      <div className="text-xs text-muted-foreground">
                        Delivered: {new Date(dist.actualDeliveryTime).toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent deliveries</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Route Analytics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Route className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Route Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Route Efficiency</span>
                <span className="font-medium">{details?.routeEfficiency || 85}%</span>
              </div>
              <Progress value={details?.routeEfficiency || 85} className="mt-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Fuel Efficiency</span>
                <span className="font-medium">{details?.fuelEfficiency || 12.5} km/L</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Total Distance</span>
                <span className="font-medium">{details?.totalDistance || 245} km</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Delivery Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Average Delivery Time</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {details?.avgDeliveryTime || distribution.avgDeliveryTime || 2.3}h
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {distribution.completedDeliveries}
                </p>
                <p className="text-xs text-muted-foreground">This Period</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((distribution.onTimeDeliveryRate / 100) * distribution.completedDeliveries)}
                </p>
                <p className="text-xs text-muted-foreground">On Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Driver Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                <span className="text-sm font-medium">Budi Santoso</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  98%
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                <span className="text-sm font-medium">Andi Wijaya</span>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  95%
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                <span className="text-sm font-medium">Cahyo Pranoto</span>
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  89%
                </Badge>
              </div>
            </div>
            
            <div className="text-center pt-2 border-t">
              <p className="text-xs text-muted-foreground">On-time delivery rates</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
