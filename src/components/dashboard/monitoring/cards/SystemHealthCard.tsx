import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertCircle, CheckCircle, XCircle, Server, Database, Clock } from 'lucide-react';
import { MonitoringData } from '@/types/monitoring';

interface SystemHealthCardProps {
  data: MonitoringData;
}

function getStatusIcon(status: string) {
  if (status === 'healthy' || status === 'connected') {
    return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
  }
  return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
}

function getStatusBadgeVariant(status: string): "default" | "destructive" {
  if (status === 'healthy' || status === 'connected') return "default";
  return "destructive";
}

function getUsageColor(usage: number) {
  if (usage >= 90) return "text-red-600 dark:text-red-400";
  if (usage >= 75) return "text-yellow-600 dark:text-yellow-400";
  return "text-green-600 dark:text-green-400";
}

export function SystemHealthCard({ data }: SystemHealthCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">System Health</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Server Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="h-4 w-4" />
              <span className="text-sm">Server</span>
            </div>
            <Badge variant={getStatusBadgeVariant(data.systemHealth.serverStatus)}>
              {data.systemHealth.serverStatus}
            </Badge>
          </div>
          
          {/* Database Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="text-sm">Database</span>
            </div>
            <Badge variant={getStatusBadgeVariant(data.systemHealth.databaseStatus)}>
              {data.systemHealth.databaseStatus}
            </Badge>
          </div>
          
          {/* API Response Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">API Response</span>
            </div>
            <span className="text-sm font-medium">
              {data.systemHealth.apiResponseTime}ms
            </span>
          </div>
          
          {/* Memory Usage */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Memory</span>
            <span className={`text-sm font-medium ${getUsageColor(data.systemHealth.memoryUsage)}`}>
              {data.systemHealth.memoryUsage.toFixed(1)}%
            </span>
          </div>
          
          {/* CPU Usage */}
          <div className="flex items-center justify-between">
            <span className="text-sm">CPU</span>
            <span className={`text-sm font-medium ${getUsageColor(data.systemHealth.cpuUsage)}`}>
              {data.systemHealth.cpuUsage.toFixed(1)}%
            </span>
          </div>
          
          {/* Disk Usage */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Disk</span>
            <span className={`text-sm font-medium ${getUsageColor(data.systemHealth.diskUsage)}`}>
              {data.systemHealth.diskUsage.toFixed(1)}%
            </span>
          </div>
          
          {/* Uptime */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Uptime</span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {Math.floor(data.systemHealth.uptime / 24)}d {Math.floor(data.systemHealth.uptime % 24)}h
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
