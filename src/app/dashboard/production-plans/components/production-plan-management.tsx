"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ClipboardList,
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle
} from "lucide-react"
import { toast } from "sonner"

interface ProductionPlan {
  id: string
  planDate: string
  targetPortions: number
  menuId?: string
  kitchenId?: string
  status: string
  plannedStartTime?: string
  plannedEndTime?: string
  actualStartTime?: string
  actualEndTime?: string
  notes?: string
  createdAt: string
  menu?: {
    id: string
    name: string
    description?: string
    mealType: string
    targetGroup: string
    totalCalories?: number
  }
  batches: Array<{
    id: string
    batchNumber: string
    status: string
    plannedQuantity: number
    actualQuantity?: number
    startedAt?: string
    completedAt?: string
  }>
  qualityChecks: Array<{
    id: string
    checkpointType: string
    status: string
    checkedAt: string
  }>
  _count: {
    batches: number
    qualityChecks: number
  }
}

interface ProductionPlanMetrics {
  totalTargetPortions: number
  averageTargetPortions: number
  totalRecords: number
}

interface ProductionPlanData {
  data: ProductionPlan[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  metrics: ProductionPlanMetrics
  statusDistribution: Record<string, number>
}

export function ProductionPlanManagement() {
  const router = useRouter()
  const [productionPlans, setProductionPlans] = useState<ProductionPlan[]>([])
  const [metrics, setMetrics] = useState<ProductionPlanMetrics | null>(null)
  const [statusDistribution, setStatusDistribution] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all")

  const fetchProductionPlans = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedStatus && selectedStatus !== "all" && { status: selectedStatus }),
      })

      // Add date range filter
      if (selectedDateRange && selectedDateRange !== "all") {
        const endDate = new Date()
        let startDate = new Date()
        
        switch (selectedDateRange) {
          case 'today':
            startDate = new Date()
            startDate.setHours(0, 0, 0, 0)
            break
          case 'week':
            startDate.setDate(endDate.getDate() - 7)
            break
          case 'month':
            startDate.setMonth(endDate.getMonth() - 1)
            break
          case 'quarter':
            startDate.setMonth(endDate.getMonth() - 3)
            break
        }
        
        params.append('startDate', startDate.toISOString())
        params.append('endDate', endDate.toISOString())
      }

      const response = await fetch(`/api/production-plans?${params}`)
      if (!response.ok) throw new Error('Failed to fetch production plans')

      const data: ProductionPlanData = await response.json()
      setProductionPlans(data.data)
      setMetrics(data.metrics)
      setStatusDistribution(data.statusDistribution)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching production plans:', error)
      toast.error('Gagal memuat data rencana produksi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductionPlans()
  }, [currentPage, pageSize, searchTerm, selectedStatus, selectedDateRange])

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus rencana produksi ini?')) return

    try {
      const response = await fetch(`/api/production-plans/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete production plan')
      }

      toast.success('Rencana produksi berhasil dihapus')
      fetchProductionPlans()
    } catch (error: any) {
      console.error('Error deleting production plan:', error)
      toast.error(error.message || 'Gagal menghapus rencana produksi')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; icon: React.ReactNode } } = {
      PLANNED: { color: "bg-blue-100 text-blue-800", icon: <ClipboardList className="w-3 h-3" /> },
      IN_PROGRESS: { color: "bg-orange-100 text-orange-800", icon: <PlayCircle className="w-3 h-3" /> },
      COMPLETED: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" /> },
      CANCELLED: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-3 h-3" /> },
    }
    
    const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800", icon: <AlertCircle className="w-3 h-3" /> }
    
    return (
      <Badge variant="secondary" className={`${statusInfo.color} gap-1`}>
        {statusInfo.icon}
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getMealTypeBadge = (mealType: string) => {
    const colorMap: { [key: string]: string } = {
      BREAKFAST: "bg-yellow-100 text-yellow-800",
      LUNCH: "bg-blue-100 text-blue-800",
      DINNER: "bg-purple-100 text-purple-800",
      SNACK: "bg-green-100 text-green-800"
    }
    
    return (
      <Badge variant="secondary" className={colorMap[mealType] || "bg-gray-100 text-gray-800"}>
        {mealType}
      </Badge>
    )
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Plans Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor food production plans
          </p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/production-plans/create')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Production Plan
        </Button>
      </div>

      {/* Stats Cards */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalRecords}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Target Porsi</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalTargetPortions.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Target Porsi</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(metrics.averageTargetPortions)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plans Aktif</CardTitle>
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(statusDistribution.PLANNED || 0) + (statusDistribution.IN_PROGRESS || 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Distribution */}
      {Object.keys(statusDistribution).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {Object.entries(statusDistribution).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  {getStatusBadge(status)}
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by menu or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PLANNED">Planned</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Production Plans Data</CardTitle>
          <CardDescription>
            List of food production plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : productionPlans.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No production plans found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No production plans have been created yet.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal Plan</TableHead>
                    <TableHead>Menu</TableHead>
                    <TableHead>Target Porsi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Batches</TableHead>
                    <TableHead>Quality Checks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{formatDate(plan.planDate)}</span>
                          {plan.plannedStartTime && (
                            <span className="text-sm text-muted-foreground">
                              {formatDateTime(plan.plannedStartTime)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.menu ? (
                          <div className="flex flex-col">
                            <span className="font-medium">{plan.menu.name}</span>
                            <div className="flex items-center gap-2 mt-1">
                              {getMealTypeBadge(plan.menu.mealType)}
                              <span className="text-xs text-muted-foreground">
                                {plan.menu.targetGroup}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No menu assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-lg">{plan.targetPortions.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground">porsi</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(plan.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{plan._count.batches}</span>
                          <span className="text-sm text-muted-foreground">batches</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{plan._count.qualityChecks}</span>
                          <span className="text-sm text-muted-foreground">checks</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/production-plans/${plan.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/production-plans/${plan.id}/edit`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(plan.id)}
                              className="text-red-600"
                              disabled={plan._count.batches > 0}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, metrics?.totalRecords || 0)} of {metrics?.totalRecords || 0} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
