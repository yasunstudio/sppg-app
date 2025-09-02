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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  X,
  Download,
  CircleCheck,
  CircleX,
  Phone,
  Star,
  Activity,
  AlertTriangle,
  Clock,
  Users
} from "lucide-react"
import { toast } from "sonner"

interface Driver {
  id: string
  employeeId: string
  name: string
  phone: string
  email?: string | null
  licenseNumber: string
  licenseExpiry: string
  address?: string | null
  emergencyContact?: string | null
  emergencyPhone?: string | null
  isActive: boolean
  rating?: number | null
  totalDeliveries: number
  notes?: string | null
  createdAt: string
  updatedAt: string
  _count: {
    distributions: number
    deliveries: number
  }
}

const itemsPerPage = 10

export function DriversManagement() {
  const router = useRouter()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  // Stats state
  const [totalDrivers, setTotalDrivers] = useState(0)
  const [activeDrivers, setActiveDrivers] = useState(0)
  const [totalDeliveries, setTotalDeliveries] = useState(0)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    fetchDrivers()
  }, [currentPage, searchTerm, statusFilter])

  useEffect(() => {
    calculateStats()
  }, [drivers])

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: ((currentPage - 1) * itemsPerPage).toString(),
      })

      // Only add filter params if they're not "all"
      if (statusFilter && statusFilter !== "all") {
        params.append('isActive', statusFilter)
      }

      const response = await fetch(`/api/drivers?${params}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          let filteredDrivers = result.data

          // Client-side search filtering
          if (searchTerm) {
            filteredDrivers = result.data.filter((driver: Driver) =>
              driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              driver.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
              driver.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
              driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
            )
          }

          setDrivers(filteredDrivers)
          setTotalCount(result.pagination.total)
          setHasMore(result.pagination.hasMore)
        }
      } else {
        toast.error('Failed to fetch drivers')
      }
    } catch (error) {
      console.error('Error fetching drivers:', error)
      toast.error('Failed to fetch drivers')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    setTotalDrivers(drivers.length)
    setActiveDrivers(drivers.filter(d => d.isActive).length)
    setTotalDeliveries(drivers.reduce((sum, d) => sum + d.totalDeliveries, 0))
    
    const ratingsSum = drivers.reduce((sum, d) => sum + (d.rating || 0), 0)
    const driversWithRating = drivers.filter(d => d.rating !== null).length
    setAverageRating(driversWithRating > 0 ? ratingsSum / driversWithRating : 0)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete driver "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast.success('Driver deleted successfully')
          fetchDrivers()
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete driver')
      }
    } catch (error) {
      console.error('Error deleting driver:', error)
      toast.error('Failed to delete driver')
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        <CircleCheck className="mr-1 h-3 w-3" />
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
        <CircleX className="mr-1 h-3 w-3" />
        Inactive
      </Badge>
    )
  }

  const getRatingBadge = (rating: number | null | undefined) => {
    if (!rating) {
      return <Badge variant="secondary">No Rating</Badge>
    }

    if (rating >= 4.5) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        <Star className="mr-1 h-3 w-3 fill-current" />
        {rating.toFixed(1)}
      </Badge>
    } else if (rating >= 4.0) {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
        <Star className="mr-1 h-3 w-3 fill-current" />
        {rating.toFixed(1)}
      </Badge>
    } else if (rating >= 3.0) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Star className="mr-1 h-3 w-3 fill-current" />
        {rating.toFixed(1)}
      </Badge>
    } else {
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
        <Star className="mr-1 h-3 w-3 fill-current" />
        {rating.toFixed(1)}
      </Badge>
    }
  }

  const getLicenseStatus = (licenseExpiry: string) => {
    const expiryDate = new Date(licenseExpiry)
    const now = new Date()
    const daysDiff = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff < 0) {
      return <Badge variant="destructive">Expired</Badge>
    } else if (daysDiff <= 30) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <AlertTriangle className="mr-1 h-3 w-3" />
        Expires Soon
      </Badge>
    } else if (daysDiff <= 90) {
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
        <Clock className="mr-1 h-3 w-3" />
        Expires in {daysDiff} days
      </Badge>
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        Valid
      </Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drivers Management</h1>
          <p className="text-muted-foreground">
            Manage delivery drivers and personnel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => {/* TODO: Export functionality */}}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/dashboard/drivers/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDrivers}</div>
            <p className="text-xs text-muted-foreground">
              Registered drivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <CircleCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDrivers}</div>
            <p className="text-xs text-muted-foreground">
              Available for delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Completed deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5.0 stars
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Drivers</CardTitle>
          <CardDescription>
            Search and filter drivers by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, employee ID, phone, email, or license..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || statusFilter !== "all") && (
              <Button variant="outline" onClick={resetFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Drivers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Drivers List</CardTitle>
          <CardDescription>
            A comprehensive list of all registered drivers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver Info</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Deliveries</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading drivers...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : drivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <UserCheck className="h-8 w-8 text-muted-foreground" />
                      <span className="text-muted-foreground">No drivers found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {driver.employeeId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{driver.phone}</span>
                        </div>
                        {driver.email && (
                          <p className="text-sm text-muted-foreground">{driver.email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{driver.licenseNumber}</p>
                        <div className="flex items-center gap-2">
                          {getLicenseStatus(driver.licenseExpiry)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(driver.isActive)}
                    </TableCell>
                    <TableCell>
                      {getRatingBadge(driver.rating)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{driver.totalDeliveries}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(driver.createdAt)}
                      </span>
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
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/drivers/${driver.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/drivers/${driver.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit driver
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(driver.id, driver.name)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete driver
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, totalCount)} of{' '}
              {totalCount} drivers
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!hasMore}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
