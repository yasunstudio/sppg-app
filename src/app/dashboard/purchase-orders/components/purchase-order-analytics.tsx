"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  ArrowLeft,
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Package,
  Truck,
  Calendar,
  Users,
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AnalyticsData {
  totalStats: {
    totalOrders: number
    totalAmount: number
    avgOrderValue: number
  }
  statusDistribution: Array<{
    status: string
    _count: { id: number }
    _sum: { totalAmount: number | null }
  }>
  monthlyTrends: Array<{
    month: string
    orders: number
    amount: number
  }>
  topSuppliers: Array<{
    id: string
    name: string
    ordersCount: number
    totalAmount: number
    deliveredOrders: number
  }>
  topRawMaterials: Array<{
    id: string
    name: string
    category: string
    unit: string
    totalQuantity: number
    totalAmount: number
    ordersCount: number
  }>
  recentActivity: Array<{
    id: string
    orderNumber: string
    status: string
    totalAmount: number
    supplier: string
    createdBy: string
    createdAt: string
  }>
}

const STATUS_COLORS = {
  PENDING: '#fbbf24',
  CONFIRMED: '#3b82f6',
  SHIPPED: '#8b5cf6',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
  PARTIALLY_RECEIVED: '#f97316'
}

const STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  PARTIALLY_RECEIVED: 'Partially Received'
}

export function PurchaseOrderAnalytics() {
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/purchase-orders/analytics?months=${timeRange}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const result = await response.json()
      
      if (result.success) {
        setAnalyticsData(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Purchase Orders Analytics</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
          <p className="text-muted-foreground">Unable to load analytics data</p>
        </div>
      </div>
    )
  }

  const pieChartData = analyticsData.statusDistribution.map(item => ({
    name: STATUS_LABELS[item.status as keyof typeof STATUS_LABELS],
    value: item._count.id,
    color: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS]
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Purchase Orders Analytics</h1>
            <p className="text-muted-foreground">Comprehensive analysis of purchase order data</p>
          </div>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 Months</SelectItem>
            <SelectItem value="6">Last 6 Months</SelectItem>
            <SelectItem value="12">Last 12 Months</SelectItem>
            <SelectItem value="24">Last 24 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{analyticsData.totalStats.totalOrders.toLocaleString()}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">Rp {analyticsData.totalStats.totalAmount.toLocaleString('id-ID')}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">Rp {Math.round(analyticsData.totalStats.avgOrderValue).toLocaleString('id-ID')}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Suppliers</p>
                <p className="text-2xl font-bold">{analyticsData.topSuppliers.length}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Trends
            </CardTitle>
            <CardDescription>Orders and spending trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="orders" orientation="left" />
                <YAxis yAxisId="amount" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'orders' ? value : `Rp ${Number(value).toLocaleString('id-ID')}`,
                    name === 'orders' ? 'Orders' : 'Amount'
                  ]}
                />
                <Legend />
                <Bar yAxisId="orders" dataKey="orders" fill="#3b82f6" name="Orders" />
                <Line yAxisId="amount" type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} name="Amount" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Status Distribution
            </CardTitle>
            <CardDescription>Current status breakdown of all orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Suppliers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Suppliers
            </CardTitle>
            <CardDescription>Suppliers by total order value</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.topSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell className="text-right">{supplier.ordersCount}</TableCell>
                    <TableCell className="text-right">
                      Rp {supplier.totalAmount.toLocaleString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Raw Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Raw Materials
            </CardTitle>
            <CardDescription>Most purchased raw materials by value</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.topRawMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">
                      {material.name}
                      <div className="text-xs text-muted-foreground">{material.category}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      {material.totalQuantity.toLocaleString()} {material.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      Rp {material.totalAmount.toLocaleString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest purchase order activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.orderNumber}</TableCell>
                  <TableCell>{activity.supplier}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      style={{ 
                        backgroundColor: STATUS_COLORS[activity.status as keyof typeof STATUS_COLORS] + '20',
                        color: STATUS_COLORS[activity.status as keyof typeof STATUS_COLORS]
                      }}
                    >
                      {STATUS_LABELS[activity.status as keyof typeof STATUS_LABELS]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    Rp {activity.totalAmount.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell>{activity.createdBy}</TableCell>
                  <TableCell>
                    {new Date(activity.createdAt).toLocaleDateString('id-ID')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
