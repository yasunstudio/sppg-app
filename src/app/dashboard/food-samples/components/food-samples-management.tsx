"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  TestTube, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar
} from "lucide-react"
import { toast } from "sonner"

interface FoodSample {
  id: string
  sampleDate: string
  menuName: string
  batchNumber: string
  sampleType: string
  storageDays: number
  status: string
  notes?: string
  disposedAt?: string
  createdAt: string
  updatedAt: string
}

const sampleTypeConfig = {
  RAW_MATERIAL: { label: "Raw Material", color: "bg-orange-100 text-orange-800", icon: Package },
  COOKED_FOOD: { label: "Cooked Food", color: "bg-blue-100 text-blue-800", icon: TestTube },
  PACKAGED_MEAL: { label: "Packaged Meal", color: "bg-green-100 text-green-800", icon: Package },
}

const statusConfig = {
  STORED: { label: "Stored", color: "bg-blue-100 text-blue-800", icon: Package },
  TESTED: { label: "Tested", color: "bg-green-100 text-green-800", icon: CheckCircle },
  DISPOSED: { label: "Disposed", color: "bg-red-100 text-red-800", icon: AlertTriangle },
}

export function FoodSamplesManagement() {
  const router = useRouter()
  const [foodSamples, setFoodSamples] = useState<FoodSample[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sampleTypeFilter, setSampleTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const itemsPerPage = 10

  useEffect(() => {
    fetchFoodSamples()
  }, [currentPage, searchTerm, statusFilter, sampleTypeFilter])

  const fetchFoodSamples = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
      })

      // Only add filter params if they're not "all"
      if (statusFilter && statusFilter !== "all") {
        params.append('status', statusFilter)
      }
      if (sampleTypeFilter && sampleTypeFilter !== "all") {
        params.append('sampleType', sampleTypeFilter)
      }

      const response = await fetch(`/api/food-samples?${params}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setFoodSamples(result.data)
          setTotalPages(result.pagination.totalPages)
          setTotalCount(result.pagination.total)
        }
      } else {
        toast.error('Failed to fetch food samples')
      }
    } catch (error) {
      console.error('Error fetching food samples:', error)
      toast.error('Failed to fetch food samples')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, menuName: string) => {
    if (!confirm(`Are you sure you want to delete food sample for ${menuName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/food-samples/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Food sample deleted successfully')
        fetchFoodSamples()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete food sample')
      }
    } catch (error) {
      console.error('Error deleting food sample:', error)
      toast.error('Failed to delete food sample')
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setSampleTypeFilter("all")
    setCurrentPage(1)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getDaysStoredColor = (storageDays: number, status: string) => {
    if (status === 'DISPOSED') return 'text-gray-500'
    if (storageDays >= 7) return 'text-red-600'
    if (storageDays >= 5) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading && currentPage === 1) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Food Samples</h1>
          <p className="text-muted-foreground">
            Manage food samples for quality control and testing procedures
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/food-samples/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Food Sample
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stored</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {foodSamples.filter(sample => sample.status === 'STORED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tested</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {foodSamples.filter(sample => sample.status === 'TESTED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disposed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {foodSamples.filter(sample => sample.status === 'DISPOSED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter food samples by search, status, or sample type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by menu name, batch number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.entries(statusConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sampleTypeFilter} onValueChange={setSampleTypeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {Object.entries(sampleTypeConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Food Samples Table */}
      <Card>
        <CardHeader>
          <CardTitle>Food Samples</CardTitle>
          <CardDescription>
            {totalCount} food sample(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Menu Name</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Sample Type</TableHead>
                  <TableHead>Sample Date</TableHead>
                  <TableHead>Storage Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foodSamples.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <TestTube className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No food samples found</p>
                        <Button 
                          variant="outline" 
                          onClick={() => router.push('/dashboard/food-samples/create')}
                        >
                          Create your first food sample
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  foodSamples.map((sample) => {
                    const sampleType = sampleTypeConfig[sample.sampleType as keyof typeof sampleTypeConfig]
                    const status = statusConfig[sample.status as keyof typeof statusConfig]
                    const SampleTypeIcon = sampleType?.icon || Package
                    const StatusIcon = status?.icon || Clock

                    return (
                      <TableRow key={sample.id}>
                        <TableCell className="font-medium">
                          {sample.menuName}
                        </TableCell>
                        <TableCell>{sample.batchNumber}</TableCell>
                        <TableCell>
                          <Badge className={sampleType?.color}>
                            <SampleTypeIcon className="mr-1 h-3 w-3" />
                            {sampleType?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(sample.sampleDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={getDaysStoredColor(sample.storageDays, sample.status)}>
                            {sample.storageDays} days
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={status?.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {sample.notes && (
                            <span className="text-sm text-muted-foreground">
                              {sample.notes.length > 30 
                                ? `${sample.notes.substring(0, 30)}...` 
                                : sample.notes
                              }
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/food-samples/${sample.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/food-samples/${sample.id}/edit`)}
                                disabled={sample.status === 'DISPOSED'}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(sample.id, sample.menuName)}
                                disabled={sample.status === 'TESTED' || sample.status === 'DISPOSED'}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} food samples
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i))
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
