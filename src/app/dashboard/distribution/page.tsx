"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  Plus, 
  Search, 
  Filter,
  Navigation,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  Calendar,
  Route
} from "lucide-react"
import Link from "next/link"

interface Distribution {
  id: string
  distributionDate: string
  status: string
  totalPortions: number
  estimatedDuration: number
  actualDuration?: number
  notes?: string
  driver?: {
    id: string
    name: string
    phone: string
    rating: number
  }
  vehicle?: {
    id: string
    plateNumber: string
    type: string
    capacity: number
  }
  schools: Array<{
    id: string
    schoolId: string
    plannedPortions: number
    actualPortions?: number
    routeOrder: number
    school: {
      id: string
      name: string
      address: string
      latitude?: number
      longitude?: number
    }
  }>
}

const statusColors = {
  PREPARING: "secondary",
  IN_TRANSIT: "default", 
  DELIVERED: "outline",
  COMPLETED: "default",
  CANCELLED: "destructive"
} as const

const statusIcons = {
  PREPARING: Package,
  IN_TRANSIT: Truck,
  DELIVERED: CheckCircle,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle
}

export default function DistributionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")

  const { data: distributions = [], isLoading, error, refetch } = useQuery({
    queryKey: ["distributions", statusFilter, dateFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (dateFilter) params.append("date", dateFilter)
      params.append("limit", "20")

      const response = await fetch(`/api/distributions?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch distributions")
      }
      const result = await response.json()
      return result.data || []
    }
  })

  const { data: distributionStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["distribution-stats"],
    queryFn: async () => {
      const response = await fetch("/api/distributions/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch distribution stats")
      }
      return response.json()
    }
  })

  const filteredDistributions = distributions.filter((distribution: Distribution) =>
    distribution.schools.some(ds => 
      ds.school.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || distribution.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons] || Clock
    return <Icon className="h-4 w-4" />
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const calculateProgress = (distribution: Distribution) => {
    const delivered = distribution.schools.filter(ds => ds.actualPortions).length
    return distribution.schools.length > 0 ? (delivered / distribution.schools.length) * 100 : 0
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Distribution & Logistics</h1>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-500">
              Error loading distributions: {error.message}
              <div className="mt-4">
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Distribution & Logistics</h1>
          <p className="text-muted-foreground">
            Manage food distribution and delivery operations
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/distribution/planning">
            <Button variant="outline">
              <Route className="mr-2 h-4 w-4" />
              Route Planning
            </Button>
          </Link>
          <Link href="/dashboard/distribution/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Distribution
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {isLoadingStats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Distributions</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{distributionStats?.todayDistributions || 0}</div>
                <p className="text-xs text-muted-foreground">scheduled deliveries</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{distributionStats?.activeRoutes || 0}</div>
                <p className="text-xs text-muted-foreground">in progress</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portions</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{distributionStats?.totalPortions || 0}</div>
                <p className="text-xs text-muted-foreground">being delivered</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schools Served</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{distributionStats?.schoolsServed || 0}</div>
                <p className="text-xs text-muted-foreground">today</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search distributions or schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PREPARING">Preparing</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-[160px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution List */}
      <div className="grid gap-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredDistributions.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Truck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Distributions Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all" || dateFilter
                    ? "Try adjusting your search or filter criteria."
                    : "Start by creating your first distribution plan."}
                </p>
                <Link href="/dashboard/distribution/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Distribution
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredDistributions.map((distribution: Distribution) => (
            <Card key={distribution.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        Distribution #{distribution.id.slice(-8)}
                      </h3>
                      <Badge variant={statusColors[distribution.status as keyof typeof statusColors]}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(distribution.status)}
                          {distribution.status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(distribution.distributionDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {distribution.totalPortions} portions
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {distribution.schools.length} schools
                      </span>
                      {distribution.estimatedDuration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {distribution.estimatedDuration} min
                        </span>
                      )}
                    </div>

                    {/* Driver and Vehicle Info */}
                    {(distribution.driver || distribution.vehicle) && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        {distribution.driver && (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Driver: {distribution.driver.name}
                          </span>
                        )}
                        {distribution.vehicle && (
                          <span className="flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            {distribution.vehicle.plateNumber} ({distribution.vehicle.type})
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Delivery Progress</span>
                        <span>{Math.round(calculateProgress(distribution))}%</span>
                      </div>
                      <Progress value={calculateProgress(distribution)} className="h-2" />
                    </div>

                    {/* Schools List */}
                    <div className="text-sm">
                      <p className="font-medium mb-1">Schools:</p>
                      <div className="flex flex-wrap gap-1">
                        {distribution.schools.slice(0, 3).map((ds, index) => (
                          <Badge key={ds.id} variant="outline" className="text-xs">
                            {ds.school.name}
                          </Badge>
                        ))}
                        {distribution.schools.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{distribution.schools.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/distribution/${distribution.id}`}>
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                    </Link>
                    <Link href={`/dashboard/distribution/${distribution.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>

                {distribution.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-sm mt-1">{distribution.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
