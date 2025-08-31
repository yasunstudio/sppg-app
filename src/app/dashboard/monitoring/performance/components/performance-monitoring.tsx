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
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Award,
  Zap,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart
} from 'recharts'

interface PerformanceData {
  summary: {
    totalProduction: number
    totalTarget: number
    productionEfficiency: number
    avgEfficiency: number
    avgQualityScore: number
    deliverySuccessRate: number
    qualityPassRate: number
    totalDeliveries: number
    totalQualityChecks: number
  }
  charts: {
    productionMetrics: Array<{
      date: string
      production: number
      target: number
      efficiency: number
      qualityScore: number
      wastage: number
      cost: number
    }>
    deliveryPerformance: Array<{
      status: string
      count: number
    }>
    qualityMetrics: Array<{
      status: string
      count: number
    }>
    distributionEfficiency: Array<{
      id: string
      date: string
      status: string
      portionEfficiency: number
      timeEfficiency: number
      totalPortions: number
      plannedPortions: number
      actualPortions: number
    }>
    wasteByType: Record<string, Record<string, number>>
    vehicleUtilization: Array<{
      id: string
      plateNumber: string
      type: string
      capacity: number
      isActive: boolean
      totalTrips: number
      completedTrips: number
      utilizationRate: number
      capacityUtilization: number
    }>
  }
  trends: {
    productionTrend: number
    qualityTrend: number
  }
}

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899']

const statusConfig = {
  COMPLETED: { label: "Selesai", color: "bg-green-100 text-green-800" },
  PENDING: { label: "Tertunda", color: "bg-yellow-100 text-yellow-800" },
  IN_PROGRESS: { label: "Sedang Berjalan", color: "bg-blue-100 text-blue-800" },
  CANCELLED: { label: "Dibatalkan", color: "bg-red-100 text-red-800" },
  PASSED: { label: "Lulus", color: "bg-green-100 text-green-800" },
  FAILED: { label: "Gagal", color: "bg-red-100 text-red-800" },
  PREPARING: { label: "Persiapan", color: "bg-gray-100 text-gray-800" },
}

export function PerformanceMonitoring() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("7")
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch(`/api/monitoring/performance?period=${period}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        toast.error("Gagal mengambil data performa")
      }
    } catch (error) {
      console.error('Error fetching performance data:', error)
      toast.error("Terjadi kesalahan saat mengambil data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [period])

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined || isNaN(num)) {
      return "0"
    }
    return new Intl.NumberFormat('id-ID').format(num)
  }

  const formatPercentage = (num: number | null | undefined) => {
    if (num === null || num === undefined || isNaN(num)) {
      return "0.0%"
    }
    return `${num.toFixed(1)}%`
  }

  const getTrendIcon = (trend: number | null | undefined) => {
    if (!trend || isNaN(trend)) return <Activity className="h-4 w-4 text-gray-600" />
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = (trend: number | null | undefined) => {
    if (!trend || isNaN(trend)) return "text-gray-600"
    if (trend > 0) return "text-green-600"
    if (trend < 0) return "text-red-600"
    return "text-gray-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Memuat data performa...</span>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Data Tidak Tersedia</h3>
          <p className="text-muted-foreground">Tidak dapat memuat data performa saat ini.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoring Performa</h1>
          <p className="text-muted-foreground">
            Dashboard analisis performa sistem produksi dan distribusi
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Hari</SelectItem>
              <SelectItem value="7">7 Hari</SelectItem>
              <SelectItem value="30">30 Hari</SelectItem>
              <SelectItem value="90">90 Hari</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={fetchData} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efisiensi Produksi</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(data.summary.productionEfficiency)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(data.trends.productionTrend)}
              <span className={`ml-1 ${getTrendColor(data.trends.productionTrend)}`}>
                {formatPercentage(Math.abs(data.trends.productionTrend))}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skor Kualitas</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.avgQualityScore.toFixed(1)}/10
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(data.trends.qualityTrend)}
              <span className={`ml-1 ${getTrendColor(data.trends.qualityTrend)}`}>
                {formatPercentage(Math.abs(data.trends.qualityTrend))}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sukses Pengiriman</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(data.summary.deliverySuccessRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.summary.totalDeliveries} total pengiriman
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Lulus QC</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(data.summary.qualityPassRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.summary.totalQualityChecks} pemeriksaan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Production Metrics Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Tren Performa Produksi
            </CardTitle>
            <CardDescription>
              Tracking produksi harian, target, dan efisiensi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.charts.productionMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="production" fill="#3b82f6" name="Produksi Aktual" />
                  <Bar yAxisId="left" dataKey="target" fill="#e5e7eb" name="Target Produksi" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10b981" name="Efisiensi %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Status Pengiriman
            </CardTitle>
            <CardDescription>
              Distribusi status pengiriman
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={data.charts.deliveryPerformance}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ status, count }: any) => `${statusConfig[status as keyof typeof statusConfig]?.label || status}: ${count}`}
                  >
                    {data.charts.deliveryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Kontrol Kualitas
            </CardTitle>
            <CardDescription>
              Status pemeriksaan kualitas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.qualityMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Utilization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Utilisasi Kendaraan
          </CardTitle>
          <CardDescription>
            Efisiensi penggunaan armada kendaraan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.charts.vehicleUtilization.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${vehicle.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium">{vehicle.plateNumber}</p>
                    <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">
                      {vehicle.totalTrips} perjalanan
                    </Badge>
                    <Badge variant="outline">
                      {formatPercentage(vehicle.utilizationRate)} sukses
                    </Badge>
                    <Badge variant="outline">
                      {formatPercentage(vehicle.capacityUtilization)} kapasitas
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribution Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Efisiensi Distribusi
          </CardTitle>
          <CardDescription>
            Performa distribusi berdasarkan porsi dan waktu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.distributionEfficiency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="portionEfficiency" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="Efisiensi Porsi %"
                />
                <Area 
                  type="monotone" 
                  dataKey="timeEfficiency" 
                  stackId="2" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  name="Efisiensi Waktu %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
