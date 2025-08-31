"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Truck,
  Shield,
  Package,
  Heart,
  RefreshCw
} from "lucide-react";

interface MonitoringData {
  timestamp: string;
  timeRange: string;
  systemHealth: {
    score: number;
    status: string;
    message: string;
  };
  metrics: {
    production: any;
    distribution: any;
    quality: any;
    inventory: any;
  };
  alerts: any[];
  recommendations: any[];
}

export default function RealTimeMonitoringPage() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("today");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/monitoring/real-time?range=${timeRange}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-50";
      case "good": return "text-blue-600 bg-blue-50";
      case "fair": return "text-yellow-600 bg-yellow-50";
      case "needs_attention": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Real-Time Monitoring</h1>
            <p className="text-gray-600">System performance and health monitoring</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Real-Time Monitoring</h1>
          <p className="text-gray-600">
            Last updated: {new Date(data.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">{data.systemHealth.score}%</div>
              <p className="text-gray-600">{data.systemHealth.message}</p>
            </div>
            <Badge className={getStatusColor(data.systemHealth.status)} variant="secondary">
              {data.systemHealth.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                data.systemHealth.score >= 90 ? "bg-green-500" :
                data.systemHealth.score >= 75 ? "bg-blue-500" :
                data.systemHealth.score >= 60 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${data.systemHealth.score}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Production Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{data.metrics.production.totalBatches}</span>
                <Badge className={getStatusColor(data.metrics.production.status)} variant="secondary">
                  {data.metrics.production.efficiency}%
                </Badge>
              </div>
              <p className="text-xs text-gray-600">
                Total Batches • {data.metrics.production.totalPortions} portions
              </p>
              <div className="text-xs">
                <div>Active Recipes: {data.metrics.production.activeRecipes}</div>
                <div>Completed: {data.metrics.production.batchesByStatus.COMPLETED || 0}</div>
                <div>Pending: {data.metrics.production.batchesByStatus.PENDING || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{data.metrics.distribution.totalDistributions}</span>
                <Badge className={getStatusColor(data.metrics.distribution.status)} variant="secondary">
                  {data.metrics.distribution.completionRate}%
                </Badge>
              </div>
              <p className="text-xs text-gray-600">
                Distributions • {data.metrics.distribution.totalSchools} schools
              </p>
              <div className="text-xs">
                <div>Completed: {data.metrics.distribution.distributionsByStatus.COMPLETED || 0}</div>
                <div>In Transit: {data.metrics.distribution.distributionsByStatus.IN_TRANSIT || 0}</div>
                <div>Preparing: {data.metrics.distribution.distributionsByStatus.PREPARING || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Quality Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{data.metrics.quality.totalChecks}</span>
                <Badge className={getStatusColor(data.metrics.quality.status)} variant="secondary">
                  {data.metrics.quality.passRate}%
                </Badge>
              </div>
              <p className="text-xs text-gray-600">
                Quality Checks • Avg temp: {data.metrics.quality.avgTemperature}°C
              </p>
              <div className="text-xs">
                <div>Passed: {data.metrics.quality.checkpointsByStatus.PASS || 0}</div>
                <div>Failed: {data.metrics.quality.checkpointsByStatus.FAIL || 0}</div>
                <div>Pending: {data.metrics.quality.checkpointsByStatus.PENDING || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{data.metrics.inventory.totalItems}</span>
                <Badge className={getStatusColor(data.metrics.inventory.status)} variant="secondary">
                  Rp {data.metrics.inventory.totalValue.toLocaleString()}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">
                Total Items • {data.metrics.inventory.lowStockItems} low stock
              </p>
              {data.metrics.inventory.lowStockItems > 0 && (
                <div className="text-xs text-red-600">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  {data.metrics.inventory.lowStockItems} items need restocking
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Recommendations */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.alerts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                No active alerts
              </div>
            ) : (
              <div className="space-y-3">
                {data.alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="border-l-4 border-red-400 pl-3 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-gray-600">{alert.message}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recommendations.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                System operating optimally
              </div>
            ) : (
              <div className="space-y-3">
                {data.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getPriorityColor(rec.priority)} variant="secondary">
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm">{rec.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
