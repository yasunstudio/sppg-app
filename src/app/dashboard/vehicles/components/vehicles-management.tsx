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
  Truck, 
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
  Calendar,
  Package,
  Activity
} from "lucide-react"
import { toast } from "sonner"

interface Vehicle {
  id: string
  plateNumber: string
  type: string
  capacity: number
  isActive: boolean
  lastService?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  _count: {
    distributions: number
    deliveries: number
  }
}

const itemsPerPage = 10

const vehicleTypes = [
  "Truck",
  "Van", 
  "Pickup",
  "Motorcycle",
  "Car"
]

const typeColors = {
  "Truck": "bg-blue-100 text-blue-800 border-blue-200",
  "Van": "bg-green-100 text-green-800 border-green-200",
  "Pickup": "bg-orange-100 text-orange-800 border-orange-200",
  "Motorcycle": "bg-purple-100 text-purple-800 border-purple-200",
  "Car": "bg-pink-100 text-pink-800 border-pink-200",
}

export function VehiclesManagement() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  // Stats state
  const [totalVehicles, setTotalVehicles] = useState(0)
  const [activeVehicles, setActiveVehicles] = useState(0)
  const [totalCapacity, setTotalCapacity] = useState(0)
  const [totalDeliveries, setTotalDeliveries] = useState(0)

  useEffect(() => {
    fetchVehicles()
  }, [currentPage, searchTerm, typeFilter, statusFilter])

  useEffect(() => {
    calculateStats()
  }, [vehicles])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: ((currentPage - 1) * itemsPerPage).toString(),
      })

      // Only add filter params if they're not "all"
      if (typeFilter && typeFilter !== "all") {
        params.append('type', typeFilter)
      }
      if (statusFilter && statusFilter !== "all") {
        params.append('isActive', statusFilter)
      }

      const response = await fetch(`/api/vehicles?${params}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          let filteredVehicles = result.data

          // Client-side search filtering
          if (searchTerm) {
            filteredVehicles = result.data.filter((vehicle: Vehicle) =>
              vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
              vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
              vehicle.notes?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          }

          setVehicles(filteredVehicles)
          setTotalCount(result.pagination.total)
          setHasMore(result.pagination.hasMore)
        }
      } else {
        toast.error('Failed to fetch vehicles')
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast.error('Failed to fetch vehicles')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    setTotalVehicles(vehicles.length)
    setActiveVehicles(vehicles.filter(v => v.isActive).length)
    setTotalCapacity(vehicles.reduce((sum, v) => sum + v.capacity, 0))
    setTotalDeliveries(vehicles.reduce((sum, v) => sum + v._count.deliveries, 0))
  }

  const handleDelete = async (id: string, plateNumber: string) => {
    if (!confirm(`Are you sure you want to delete vehicle "${plateNumber}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast.success('Vehicle deleted successfully')
          fetchVehicles()
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete vehicle')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      toast.error('Failed to delete vehicle')
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
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

  const getTypeBadge = (type: string) => {
    const colorClass = typeColors[type as keyof typeof typeColors] || "bg-gray-100 text-gray-800 border-gray-200"
    
    return (
      <Badge variant="outline" className={colorClass}>
        {type}
      </Badge>
    )
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

  const getServiceStatus = (lastService: string | null | undefined) => {
    if (!lastService) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">No Service Record</Badge>
    }

    const serviceDate = new Date(lastService)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - serviceDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff > 180) { // 6 months
      return <Badge variant="destructive">Service Due</Badge>
    } else if (daysDiff > 90) { // 3 months
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Service Soon</Badge>
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Recently Serviced</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles Management</h1>
          <p className="text-muted-foreground">
            Manage delivery vehicles and transportation fleet
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => {/* TODO: Export functionality */}}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/dashboard/vehicles/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Registered vehicles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <CircleCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Ready for delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity}</div>
            <p className="text-xs text-muted-foreground">
              Combined capacity (kg)
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
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Vehicles</CardTitle>
          <CardDescription>
            Search and filter vehicles by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by plate number, type, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

            {(searchTerm || typeFilter !== "all" || statusFilter !== "all") && (
              <Button variant="outline" onClick={resetFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicles List</CardTitle>
          <CardDescription>
            A comprehensive list of all registered vehicles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Info</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Service Status</TableHead>
                <TableHead>Deliveries</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading vehicles...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Truck className="h-8 w-8 text-muted-foreground" />
                      <span className="text-muted-foreground">No vehicles found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Truck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{vehicle.plateNumber}</p>
                          {vehicle.notes && (
                            <p className="text-sm text-muted-foreground">{vehicle.notes}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(vehicle.type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{vehicle.capacity} kg</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(vehicle.isActive)}
                    </TableCell>
                    <TableCell>
                      {getServiceStatus(vehicle.lastService)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{vehicle._count.deliveries}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(vehicle.createdAt)}
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
                            onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit vehicle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(vehicle.id, vehicle.plateNumber)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete vehicle
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
              {totalCount} vehicles
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
