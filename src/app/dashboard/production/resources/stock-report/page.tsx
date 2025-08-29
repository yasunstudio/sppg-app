"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertTriangle, 
  BarChart3, 
  Download,
  Filter,
  Calendar,
  Search
} from "lucide-react"

// Fetch stock movements
async function fetchStockMovements(filters: any = {}) {
  const params = new URLSearchParams()
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate) params.append('endDate', filters.endDate)
  if (filters.type && filters.type !== 'all') params.append('type', filters.type)
  if (filters.materialId && filters.materialId !== 'all') params.append('materialId', filters.materialId)
  params.append('limit', '50')

  const response = await fetch(`/api/production/stock-movements?${params}`)
  if (!response.ok) {
    throw new Error("Failed to fetch stock movements")
  }
  const data = await response.json()
  return data.data || []
}

// Fetch stock analytics
async function fetchStockAnalytics(period = '30') {
  const response = await fetch(`/api/production/stock-analytics?period=${period}`)
  if (!response.ok) {
    throw new Error("Failed to fetch stock analytics")
  }
  const data = await response.json()
  return data.data || {}
}

// Fetch materials for filtering
async function fetchMaterials() {
  const response = await fetch("/api/raw-materials?limit=100")
  if (!response.ok) {
    throw new Error("Failed to fetch materials")
  }
  const data = await response.json()
  return data.data || []
}

export default function StockReportPage() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
    materialId: 'all'
  })
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30')

  const { data: movements = [], isLoading: movementsLoading } = useQuery({
    queryKey: ["stock-movements", filters],
    queryFn: () => fetchStockMovements(filters),
    refetchInterval: 60000,
  })

  const { data: analytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ["stock-analytics", analyticsPeriod],
    queryFn: () => fetchStockAnalytics(analyticsPeriod),
    refetchInterval: 60000,
  })

  const { data: materials = [] } = useQuery({
    queryKey: ["materials-for-filter"],
    queryFn: fetchMaterials,
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: 'all',
      materialId: 'all'
    })
  }

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'IN': return 'bg-green-100 text-green-800'
      case 'OUT': return 'bg-red-100 text-red-800'
      case 'ADJUSTMENT': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL': return 'bg-green-100 text-green-800'
      case 'LOW_STOCK': return 'bg-yellow-100 text-yellow-800'
      case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Movement Report</h1>
          <p className="text-muted-foreground">
            Comprehensive stock tracking and analytics
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsLoading ? '...' : analytics.summary?.totalMaterials || 0}
                </div>
                <p className="text-xs text-muted-foreground">active materials</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsLoading ? '...' : formatCurrency(analytics.summary?.totalValue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">inventory value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {analyticsLoading ? '...' : analytics.summary?.lowStockCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {analyticsLoading ? '...' : analytics.summary?.outOfStockCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">urgent restock</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Stock by Category</CardTitle>
                <CardDescription>Inventory distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsLoading ? (
                    <div className="text-center py-4">Loading categories...</div>
                  ) : (
                    analytics.categoryBreakdown?.map((category: any) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{category.category}</div>
                          <div className="text-sm text-muted-foreground">
                            {category.itemCount} items
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(category.totalValue)}</div>
                          <div className="text-sm text-muted-foreground">
                            {category.totalStock.toLocaleString()} units
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Movements</CardTitle>
                <CardDescription>Latest stock transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {movementsLoading ? (
                    <div className="text-center py-4">Loading movements...</div>
                  ) : (
                    movements.slice(0, 5).map((movement: any) => (
                      <div key={movement.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={getMovementTypeColor(movement.type)}>
                            {movement.type}
                          </Badge>
                          <div>
                            <div className="font-medium text-sm">{movement.materialName}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(movement.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(Math.abs(movement.totalValue))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Movement Type</Label>
                  <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="IN">Stock In</SelectItem>
                      <SelectItem value="OUT">Stock Out</SelectItem>
                      <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Select value={filters.materialId} onValueChange={(value) => handleFilterChange('materialId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All materials" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All materials</SelectItem>
                      {materials.map((material: any) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end space-x-2">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Movements Table */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
              <CardDescription>
                {movements.length} movement{movements.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movementsLoading ? (
                  <div className="text-center py-8">Loading movements...</div>
                ) : movements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No movements found for the selected filters
                  </div>
                ) : (
                  <div className="space-y-2">
                    {movements.map((movement: any) => (
                      <div key={movement.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Badge className={getMovementTypeColor(movement.type)}>
                              {movement.type}
                            </Badge>
                            <div>
                              <div className="font-medium">{movement.materialName}</div>
                              <div className="text-sm text-muted-foreground">
                                Ref: {movement.reference}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-semibold ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.unit}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(Math.abs(movement.totalValue))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div>
                            <span>{new Date(movement.date).toLocaleString()}</span>
                            {movement.supplier && <span> • {movement.supplier}</span>}
                          </div>
                          <div>Balance: {movement.balance} {movement.unit}</div>
                        </div>
                        {movement.notes && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            {movement.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Stock Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Detailed analysis of inventory performance
              </p>
            </div>
            <Select value={analyticsPeriod} onValueChange={setAnalyticsPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Material Performance</CardTitle>
                <CardDescription>Top materials by value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsLoading ? (
                    <div className="text-center py-4">Loading analytics...</div>
                  ) : (
                    analytics.materialDetails?.slice(0, 10).map((material: any) => (
                      <div key={material.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(material.status)}>
                            {material.status.replace('_', ' ')}
                          </Badge>
                          <div>
                            <div className="font-medium">{material.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {material.currentStock} {material.unit} • {material.category}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(material.totalValue)}</div>
                          <div className="text-sm text-muted-foreground">
                            @ {formatCurrency(material.avgPrice)}/{material.unit}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
                <CardDescription>Recent supplier activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsLoading ? (
                    <div className="text-center py-4">Loading suppliers...</div>
                  ) : (
                    analytics.supplierPerformance?.map((supplier: any) => (
                      <div key={supplier.supplier} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{supplier.supplier}</div>
                          <div className="text-sm text-muted-foreground">
                            {supplier.itemCount} deliveries
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(supplier.totalValue)}</div>
                          <div className="text-sm text-muted-foreground">
                            Last: {new Date(supplier.lastDelivery).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Stock Alerts</span>
              </CardTitle>
              <CardDescription>
                Critical stock levels and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsLoading ? (
                  <div className="text-center py-4">Loading alerts...</div>
                ) : analytics.alerts?.length === 0 ? (
                  <div className="text-center py-8 text-green-600">
                    <div className="text-lg font-medium">All Good!</div>
                    <div className="text-sm">No critical stock alerts at this time</div>
                  </div>
                ) : (
                  analytics.alerts?.map((alert: any, index: number) => (
                    <div key={index} className={`p-4 border rounded-lg ${
                      alert.severity === 'critical' ? 'border-red-200 bg-red-50' : 
                      alert.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' : 
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className={`h-5 w-5 ${
                            alert.severity === 'critical' ? 'text-red-500' : 
                            alert.severity === 'warning' ? 'text-yellow-500' : 
                            'text-blue-500'
                          }`} />
                          <div>
                            <div className="font-medium">{alert.message}</div>
                            <div className="text-sm text-muted-foreground">
                              Type: {alert.type.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
