'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { usePerformance } from '@/hooks/use-performance'
import { useCache } from '@/hooks/use-cache'
import { useRealtime } from '@/hooks/use-realtime'
import { Activity, Database, Globe, HardDrive, MemoryStick, Zap } from 'lucide-react'

interface PerformanceData {
  database: {
    recentActivity: number
    totalRecords: number
    tables: Record<string, number>
    queryTime: number
  }
  api: {
    totalRequests: number
    averageResponseTime: number
    errorRate: number
    slowestEndpoint: string
    fastestEndpoint: string
    topEndpoints: Array<{ path: string; requests: number }>
  }
  system: {
    memoryUsage: { used: number; total: number; percentage: number }
    cpuUsage: number
    diskUsage: { used: number; total: number; percentage: number }
    uptime: number
    activeConnections: number
  }
  timeRange: string
  timestamp: string
}

export default function PerformanceDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')

  const performance = usePerformance()
  const cache = useCache()
  const realtime = useRealtime('/api/realtime', { 
    disabled: process.env.NODE_ENV === 'development' // Disable in development
  })

  const fetchPerformanceData = async () => {
    try {
      const response = await performance.measureAPI('performance_data', async () => {
        const res = await fetch(`/api/performance?timeRange=${timeRange}`)
        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`Failed to fetch performance data: ${res.status} ${errorText}`)
        }
        return res.json()
      })
      
      setPerformanceData(response)
      cache.set(`performance_${timeRange}`, response, 30000) // Cache for 30 seconds
    } catch (error) {
      console.error('Failed to fetch performance data:', error)
      
      // Try to load from cache as fallback
      const cachedData = cache.get(`performance_${timeRange}`)
      if (cachedData) {
        console.log('Using cached performance data as fallback')
        setPerformanceData(cachedData)
      } else {
        // Set minimal fallback data to prevent UI crashes
        setPerformanceData({
          database: {
            recentActivity: 0,
            totalRecords: 0,
            tables: {},
            queryTime: 0
          },
          api: {
            totalRequests: 0,
            averageResponseTime: 0,
            errorRate: 0,
            slowestEndpoint: 'N/A',
            fastestEndpoint: 'N/A',
            topEndpoints: []
          },
          system: {
            memoryUsage: { used: 0, total: 0, percentage: 0 },
            cpuUsage: 0,
            diskUsage: { used: 0, total: 0, percentage: 0 },
            uptime: 0,
            activeConnections: 0
          },
          timestamp: new Date().toISOString(),
          timeRange
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const getHealthStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return { status: 'Good', color: 'bg-green-500' }
    if (value <= thresholds.warning) return { status: 'Warning', color: 'bg-yellow-500' }
    return { status: 'Critical', color: 'bg-red-500' }
  }

  useEffect(() => {
    // Check cache first
    const cachedData = cache.get(`performance_${timeRange}`)
    if (cachedData) {
      setPerformanceData(cachedData)
      setLoading(false)
    } else {
      fetchPerformanceData()
    }
  }, [timeRange])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchPerformanceData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [autoRefresh, timeRange])

  // Listen for real-time performance updates
  useEffect(() => {
    if (realtime.lastEvent?.type === 'performance_update') {
      setPerformanceData(realtime.lastEvent.data)
    }
  }, [realtime.lastEvent])

  if (loading || !performanceData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading performance data...</p>
        </div>
      </div>
    )
  }

  const { database, api, system } = performanceData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time system performance monitoring and analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${realtime.connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {realtime.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="w-4 h-4 mr-2" />
            {autoRefresh ? 'Pause' : 'Resume'}
          </Button>
          <Button onClick={fetchPerformanceData} disabled={loading}>
            <Zap className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Tabs value={timeRange} onValueChange={setTimeRange}>
        <TabsList>
          <TabsTrigger value="1h">Last Hour</TabsTrigger>
          <TabsTrigger value="24h">Last 24 Hours</TabsTrigger>
          <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
        </TabsList>

        <TabsContent value={timeRange} className="space-y-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{api.totalRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Avg response: {api.averageResponseTime.toFixed(1)}ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Records</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{database.totalRecords.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Query time: {database.queryTime.toFixed(1)}ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <MemoryStick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{system.memoryUsage.percentage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {system.memoryUsage.used.toFixed(0)} / {system.memoryUsage.total} MB
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatUptime(system.uptime)}</div>
                <p className="text-xs text-muted-foreground">
                  {system.activeConnections} active connections
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Performance Metrics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Current system resource utilization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <Badge variant={system.cpuUsage > 80 ? 'destructive' : system.cpuUsage > 60 ? 'secondary' : 'default'}>
                      {system.cpuUsage.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={system.cpuUsage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <Badge variant={system.memoryUsage.percentage > 80 ? 'destructive' : system.memoryUsage.percentage > 60 ? 'secondary' : 'default'}>
                      {system.memoryUsage.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={system.memoryUsage.percentage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Disk Usage</span>
                    <Badge variant={system.diskUsage.percentage > 80 ? 'destructive' : system.diskUsage.percentage > 60 ? 'secondary' : 'default'}>
                      {system.diskUsage.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={system.diskUsage.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* API Performance */}
            <Card>
              <CardHeader>
                <CardTitle>API Performance</CardTitle>
                <CardDescription>
                  Most frequently accessed endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {api.topEndpoints.map((endpoint, index) => (
                    <div key={endpoint.path} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="text-sm font-mono">{endpoint.path}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {endpoint.requests.toLocaleString()} requests
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <Badge variant={api.errorRate > 5 ? 'destructive' : api.errorRate > 2 ? 'secondary' : 'default'}>
                      {api.errorRate.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Response Time</span>
                    <span className="text-muted-foreground">{api.averageResponseTime.toFixed(1)}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cache & Performance Stats */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cache Performance</CardTitle>
                <CardDescription>
                  Application caching statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{cache.stats.hitRate.toFixed(1)}%</div>
                    <p className="text-sm text-muted-foreground">Hit Rate</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{cache.stats.size}</div>
                    <p className="text-sm text-muted-foreground">Cached Items</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Requests</span>
                    <span>{cache.stats.totalItems}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>{cache.stats.memoryUsage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cache Hits</span>
                    <span className="text-green-600">{cache.stats.hits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cache Misses</span>
                    <span className="text-red-600">{cache.stats.misses}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Application performance insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{performance.stats.apiCalls.total}</div>
                    <p className="text-sm text-muted-foreground">API Calls</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{performance.stats.apiCalls.average.toFixed(0)}ms</div>
                    <p className="text-sm text-muted-foreground">Avg Duration</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fastest Call</span>
                    <span className="text-green-600">{performance.stats.apiCalls.fastest.toFixed(0)}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Slowest Call</span>
                    <span className="text-red-600">{performance.stats.apiCalls.slowest.toFixed(0)}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Network Requests</span>
                    <span>{performance.stats.networkStats.totalRequests}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Failed Requests</span>
                    <span className="text-red-600">{performance.stats.networkStats.failedRequests}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
