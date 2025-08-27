"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  DollarSign,
  Package,
  Calendar,
  Download,
  RefreshCw
} from "lucide-react"
import { useState } from "react"

// Fetch analytics data from API
async function fetchAnalytics(period: string) {
  const response = await fetch(`/api/production/analytics?period=${period}`)
  if (!response.ok) {
    throw new Error("Failed to fetch analytics data")
  }
  const data = await response.json()
  return data.data
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function ProductionAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  
  const { data: analytics, isLoading, error, refetch } = useQuery({
    queryKey: ["production-analytics", selectedPeriod],
    queryFn: () => fetchAnalytics(selectedPeriod),
    refetchInterval: 300000, // Refresh every 5 minutes
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Production Analytics</h1>
        </div>
        <div className="text-center py-8">Loading analytics data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Production Analytics</h1>
        </div>
        <div className="text-center py-8 text-red-600">
          Error loading analytics: {error.message}
        </div>
      </div>
    )
  }

  const overview = analytics?.overview || {}
  const quality = analytics?.quality || {}
  const resources = analytics?.resources || {}
  const costs = analytics?.costs || {}
  const trends = analytics?.trends || {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into production performance and efficiency
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Plans</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalPlans || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={`flex items-center ${
                (overview.planCompletionRate || 0) >= 80 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(overview.planCompletionRate || 0) >= 80 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {(overview.planCompletionRate || 0).toFixed(1)}% completion rate
              </span>
            </div>
            <Progress value={overview.planCompletionRate || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(overview.portionEfficiency || 0).toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={`flex items-center ${
                (overview.portionEfficiency || 0) >= 90 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {(overview.portionEfficiency || 0) >= 90 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {overview.actualPortions || 0} of {overview.totalPortions || 0} portions
              </span>
            </div>
            <Progress value={overview.portionEfficiency || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(quality.passRate || 0).toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={`flex items-center ${
                (quality.passRate || 0) >= 95 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(quality.passRate || 0) >= 95 ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {quality.passedChecks || 0} of {quality.totalChecks || 0} checks
              </span>
            </div>
            <Progress value={quality.passRate || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(resources.utilizationRate || 0).toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={`flex items-center ${
                (resources.utilizationRate || 0) >= 75 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {(resources.utilizationRate || 0) >= 75 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {resources.activeResources || 0} of {resources.totalResources || 0} active
              </span>
            </div>
            <Progress value={resources.utilizationRate || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Production Trends */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daily Production Trend</CardTitle>
              <CardDescription>
                Portion production over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(trends.daily || []).map((day: any, index: number) => (
                  <div key={day.date} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="text-sm font-medium">
                        {new Date(day.date).toLocaleDateString()}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {day.batches} batches produced
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">{day.portions}</span>
                      <p className="text-xs text-muted-foreground">portions</p>
                    </div>
                  </div>
                ))}
                {(!trends.daily || trends.daily.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No production data available for the selected period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Menu Popularity</CardTitle>
              <CardDescription>
                Most produced menu items by portion count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(trends.menuPopularity || []).map((menu: any, index: number) => (
                  <div key={menu.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{menu.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold">{menu.portions}</span>
                        <span className="text-xs text-muted-foreground ml-1">portions</span>
                      </div>
                    </div>
                    <Progress 
                      value={
                        trends.menuPopularity.length > 0 
                          ? (menu.portions / Math.max(...trends.menuPopularity.map((m: any) => m.portions))) * 100 
                          : 0
                      } 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {menu.plans} production plans
                    </p>
                  </div>
                ))}
                {(!trends.menuPopularity || trends.menuPopularity.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No menu data available for the selected period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Metrics & Costs */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Status</CardTitle>
              <CardDescription>
                Quality checkpoint results breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Checks</span>
                  <Badge variant="outline">{quality.totalChecks || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Passed</span>
                  <Badge className="bg-green-100 text-green-800">
                    {quality.passedChecks || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Failed</span>
                  <Badge className="bg-red-100 text-red-800">
                    {quality.failedChecks || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pass Rate</span>
                  <span className="text-sm font-bold">
                    {(quality.passRate || 0).toFixed(1)}%
                  </span>
                </div>
              </div>

              {quality.qualityByType && quality.qualityByType.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-3">Quality by Type</h4>
                  <div className="space-y-2">
                    {quality.qualityByType.map((type: any, index: number) => (
                      <div key={type.type} className="p-2 border rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">
                            {type.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {type.total} checks
                          </span>
                        </div>
                        <Progress 
                          value={type.total > 0 ? (type.passed / type.total) * 100 : 0} 
                          className="h-1" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Cost Overview</CardTitle>
              <CardDescription>
                Material costs and inventory insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Inventory Value</span>
                  </div>
                  <span className="text-sm font-bold">
                    Rp {(costs.materialInventoryValue || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Material Types</span>
                  </div>
                  <Badge variant="outline">
                    {costs.totalMaterialTypes || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Low Stock Items</span>
                  </div>
                  <Badge variant="destructive">
                    {costs.lowStockItems || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Analytics Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  Performance Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
