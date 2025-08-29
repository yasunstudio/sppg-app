"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, PieChart, TrendingUp, TrendingDown, Activity, Target,
  Calendar, Clock, Users, DollarSign, Factory, Truck, 
  AlertTriangle, CheckCircle, RefreshCw, Download, Filter,
  ArrowUp, ArrowDown, Minus, Eye, FileText, Share2
} from "lucide-react"

// Fetch analytics data
async function fetchAnalyticsData(period: string, category: string) {
  const response = await fetch(`/api/analytics/dashboard?period=${period}&category=${category}`)
  if (!response.ok) {
    throw new Error("Failed to fetch analytics data")
  }
  const data = await response.json()
  return data
}

// Fetch KPI data
async function fetchKPIData(period: string) {
  const response = await fetch(`/api/analytics/kpi?period=${period}`)
  if (!response.ok) {
    throw new Error("Failed to fetch KPI data")
  }
  const data = await response.json()
  return data.data || []
}

// Fetch trend analysis
async function fetchTrendAnalysis(period: string) {
  const response = await fetch(`/api/analytics/trends?period=${period}`)
  if (!response.ok) {
    throw new Error("Failed to fetch trend analysis")
  }
  const data = await response.json()
  return data.data || {}
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [autoRefresh, setAutoRefresh] = useState(true)

  const { data: analyticsData, isLoading: analyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ["analytics-dashboard", selectedPeriod, selectedCategory],
    queryFn: () => fetchAnalyticsData(selectedPeriod, selectedCategory),
    refetchInterval: autoRefresh ? 60000 : false, // Refresh every minute
  })

  const { data: kpiData = [], isLoading: kpiLoading } = useQuery({
    queryKey: ["analytics-kpi", selectedPeriod],
    queryFn: () => fetchKPIData(selectedPeriod),
    refetchInterval: autoRefresh ? 60000 : false,
  })

  const { data: trendData = {}, isLoading: trendLoading } = useQuery({
    queryKey: ["analytics-trends", selectedPeriod],
    queryFn: () => fetchTrendAnalysis(selectedPeriod),
    refetchInterval: autoRefresh ? 60000 : false,
  })

  const periodOptions = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
    { value: "custom", label: "Custom Range" }
  ]

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "production", label: "Production" },
    { value: "distribution", label: "Distribution" },
    { value: "financial", label: "Financial" },
    { value: "quality", label: "Quality" },
    { value: "schools", label: "Schools" }
  ]

  const getTrendIcon = (trend: string, percentage: number) => {
    if (trend === "up") return <ArrowUp className="h-4 w-4 text-green-600" />
    if (trend === "down") return <ArrowDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-green-600"
    if (trend === "down") return "text-red-600"
    return "text-gray-600"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const handleExport = () => {
    // Mock export functionality
    console.log("Exporting analytics report...")
    alert("Analytics report exported successfully!")
  }

  const handleRefresh = () => {
    refetchAnalytics()
  }

  if (analyticsLoading && !analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <div className="container mx-auto p-6 space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Error Loading Analytics Data
            </h3>
            <p className="text-muted-foreground mb-4">
              Unable to fetch analytics data. Please try refreshing the page.
            </p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive data analysis and business intelligence dashboard
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select period" />
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
              Auto
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
            ))
          ) : (
            kpiData.map((kpi: any) => (
              <Card key={kpi.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(kpi.trend, kpi.change)}
                    <span className={`text-xs font-medium ${getTrendColor(kpi.trend)}`}>
                      {formatPercentage(kpi.change)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                  {kpi.target && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs">
                        <span>Target: {kpi.target}</span>
                        <span>{kpi.achievement}%</span>
                      </div>
                      <Progress value={kpi.achievement} className="h-1 mt-1" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Analytics Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Custom Reports
              </Button>
              <Button variant="outline" className="justify-start">
                <PieChart className="mr-2 h-4 w-4" />
                Data Visualization
              </Button>
              <Button variant="outline" className="justify-start">
                <Target className="mr-2 h-4 w-4" />
                Goal Tracking
              </Button>
              <Button variant="outline" className="justify-start">
                <Share2 className="mr-2 h-4 w-4" />
                Share Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Analytics Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Production Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Factory className="h-5 w-5" />
                    Production Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Efficiency Rate</span>
                      <span className="font-medium">{analyticsData.production?.efficiency || 0}%</span>
                    </div>
                    <Progress value={analyticsData.production?.efficiency || 0} className="h-2" />
                  </div>
                  <div className="flex justify-between">
                    <span>Output Volume</span>
                    <span className="font-medium">{analyticsData.production?.output || 0} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Score</span>
                    <span className="font-medium text-green-600">{analyticsData.production?.quality || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downtime</span>
                    <span className="font-medium text-red-600">{analyticsData.production?.downtime || 0}h</span>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Revenue</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(analyticsData.financial?.revenue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin</span>
                    <span className="font-medium">{analyticsData.financial?.profitMargin || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Efficiency</span>
                    <span className="font-medium">{analyticsData.financial?.costEfficiency || 0}%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Budget Utilization</span>
                      <span className="font-medium">{analyticsData.financial?.budgetUtilization || 0}%</span>
                    </div>
                    <Progress value={analyticsData.financial?.budgetUtilization || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Distribution Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Distribution Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Delivery Success Rate</span>
                      <span className="font-medium">{analyticsData.distribution?.successRate || 0}%</span>
                    </div>
                    <Progress value={analyticsData.distribution?.successRate || 0} className="h-2" />
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Delivery Time</span>
                    <span className="font-medium">{analyticsData.distribution?.avgTime || 0}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Route Efficiency</span>
                    <span className="font-medium text-green-600">{analyticsData.distribution?.routeEfficiency || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Satisfaction</span>
                    <span className="font-medium text-green-600">{analyticsData.distribution?.satisfaction || 0}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground">Performance Chart</p>
                    <p className="text-xs text-muted-foreground mt-1">Interactive chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Goal Achievement</CardTitle>
                  <CardDescription>Progress towards targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Production Target</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Quality Target</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Financial Target</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trendLoading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
                ))
              ) : (
                Object.entries(trendData).map(([key, trend]: [string, any]) => (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="capitalize">{key} Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Current Period</span>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(trend.direction, trend.percentage)}
                          <span className={`font-medium ${getTrendColor(trend.direction)}`}>
                            {formatPercentage(trend.percentage)}
                          </span>
                        </div>
                      </div>
                      <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded">
                        <TrendingUp className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                        <p className="text-xs text-muted-foreground">Trend visualization</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {trend.insight || `${key} showing ${trend.direction}ward trend`}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Period Comparison</CardTitle>
                <CardDescription>Compare metrics across different time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <PieChart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">Comparison Charts</p>
                  <p className="text-sm text-muted-foreground">
                    Interactive comparison visualizations will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Predictive Analytics</CardTitle>
                  <CardDescription>AI-powered forecasting and predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <Target className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground">Forecasting Models</p>
                    <p className="text-xs text-muted-foreground mt-1">ML predictions will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scenario Planning</CardTitle>
                  <CardDescription>What-if analysis and scenario modeling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 border-l-2 border-blue-400 text-sm">
                    <span className="font-medium">Optimistic Scenario:</span> +15% growth expected
                  </div>
                  <div className="p-3 bg-yellow-50 border-l-2 border-yellow-400 text-sm">
                    <span className="font-medium">Realistic Scenario:</span> +8% growth expected
                  </div>
                  <div className="p-3 bg-red-50 border-l-2 border-red-400 text-sm">
                    <span className="font-medium">Conservative Scenario:</span> +3% growth expected
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-2 bg-green-50 border-l-2 border-green-400 text-sm">
                    Production efficiency increased by 12% this month
                  </div>
                  <div className="p-2 bg-blue-50 border-l-2 border-blue-400 text-sm">
                    Customer satisfaction reached all-time high
                  </div>
                  <div className="p-2 bg-purple-50 border-l-2 border-purple-400 text-sm">
                    New distribution routes saving 15% on costs
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-2 bg-yellow-50 border-l-2 border-yellow-400 text-sm">
                    Consider increasing production capacity for peak hours
                  </div>
                  <div className="p-2 bg-orange-50 border-l-2 border-orange-400 text-sm">
                    Optimize inventory levels to reduce carrying costs
                  </div>
                  <div className="p-2 bg-red-50 border-l-2 border-red-400 text-sm">
                    Address quality issues in batch production line 3
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Review supplier contracts</span>
                    <Badge variant="outline">High</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Update safety protocols</span>
                    <Badge variant="outline">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Staff training program</span>
                    <Badge variant="outline">Low</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
