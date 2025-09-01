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
  Settings,
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Clock,
  Activity,
  Cog,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

interface ResourceUsage {
  id: string
  batchId: string
  resourceId: string
  startTime: string
  endTime?: string
  plannedDuration: number
  actualDuration?: number
  efficiency?: number
  notes?: string
  createdAt: string
  batch: {
    id: string
    batchNumber: string
    startedAt?: string
    completedAt?: string
    status: string
    productionPlan: {
      id: string
      planDate: string
      targetPortions: number
      menu?: {
        id: string
        name: string
      }
    }
  }
  resource: {
    id: string
    name: string
    type: string
    capacityPerHour?: number
    location?: string
    status: string
  }
}

interface ResourceUsageMetrics {
  totalPlannedDuration: number
  totalActualDuration: number
  averagePlannedDuration: number
  averageActualDuration: number
  averageEfficiency: number
  totalRecords: number
}

interface ResourceUsageData {
  data: ResourceUsage[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  metrics: ResourceUsageMetrics
}

export function ResourceUsageManagement() {
  const router = useRouter()
  const [resourceUsages, setResourceUsages] = useState<ResourceUsage[]>([])
  const [metrics, setMetrics] = useState<ResourceUsageMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedBatch, setSelectedBatch] = useState<string>("")
  const [selectedResource, setSelectedResource] = useState<string>("")
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all")

  const fetchResourceUsages = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedBatch && { batchId: selectedBatch }),
        ...(selectedResource && { resourceId: selectedResource }),
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

      const response = await fetch(`/api/resource-usage?${params}`)
      if (!response.ok) throw new Error('Failed to fetch resource usages')

      const data: ResourceUsageData = await response.json()
      setResourceUsages(data.data)
      setMetrics(data.metrics)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching resource usages:', error)
      toast.error('Gagal memuat data penggunaan sumber daya')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResourceUsages()
  }, [currentPage, pageSize, searchTerm, selectedBatch, selectedResource, selectedDateRange])

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data penggunaan sumber daya ini?')) return

    try {
      const response = await fetch(`/api/resource-usage/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete resource usage')

      toast.success('Data penggunaan sumber daya berhasil dihapus')
      fetchResourceUsages()
    } catch (error) {
      console.error('Error deleting resource usage:', error)
      toast.error('Gagal menghapus data penggunaan sumber daya')
    }
  }

  const getStatusBadge = (efficiency?: number) => {
    if (!efficiency) return <Badge variant="secondary">Belum Selesai</Badge>
    if (efficiency >= 90) return <Badge variant="default" className="bg-green-100 text-green-800">Sangat Efisien</Badge>
    if (efficiency >= 70) return <Badge variant="default" className="bg-blue-100 text-blue-800">Efisien</Badge>
    if (efficiency >= 50) return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Cukup Efisien</Badge>
    return <Badge variant="destructive">Tidak Efisien</Badge>
  }

  const getResourceTypeBadge = (type: string) => {
    const colorMap: { [key: string]: string } = {
      EQUIPMENT: "bg-blue-100 text-blue-800",
      TOOL: "bg-green-100 text-green-800",
      MACHINE: "bg-purple-100 text-purple-800",
      FACILITY: "bg-orange-100 text-orange-800"
    }
    
    return (
      <Badge variant="secondary" className={colorMap[type] || "bg-gray-100 text-gray-800"}>
        {type}
      </Badge>
    )
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}j ${mins}m` : `${mins}m`
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Resource Usage</h2>
          <p className="text-sm text-muted-foreground">
            Manage and monitor production resource usage
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => router.push('/dashboard/resource-usage/create')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Resource Usage
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalRecords}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Efficiency</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.averageEfficiency.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Planned Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(metrics.totalPlannedDuration)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Actual Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(metrics.totalActualDuration)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(Math.round(metrics.averageActualDuration))}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by batch, resource, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
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
          <CardTitle>Resource Usage Data</CardTitle>
          <CardDescription>
            List of production resource usage records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : resourceUsages.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No resource usage found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No resource usage data available yet.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Menu</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resourceUsages.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{usage.batch.batchNumber}</span>
                          <span className="text-sm text-muted-foreground">
                            {usage.batch.productionPlan.targetPortions} portions
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{usage.resource.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            {getResourceTypeBadge(usage.resource.type)}
                            {usage.resource.location && (
                              <span className="text-xs text-muted-foreground">{usage.resource.location}</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {usage.batch.productionPlan.menu?.name || 'N/A'}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDateTime(usage.batch.productionPlan.planDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{formatDateTime(usage.startTime)}</span>
                          {usage.endTime && (
                            <span className="text-sm text-muted-foreground">
                              s/d {formatDateTime(usage.endTime)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatDuration(usage.actualDuration)} / {formatDuration(usage.plannedDuration)}
                          </span>
                          <span className="text-sm text-muted-foreground">Aktual / Rencana</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {usage.efficiency ? `${usage.efficiency.toFixed(1)}%` : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(usage.efficiency)}
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
                              onClick={() => router.push(`/dashboard/resource-usage/${usage.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/resource-usage/${usage.id}/edit`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(usage.id)}
                              className="text-red-600"
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
