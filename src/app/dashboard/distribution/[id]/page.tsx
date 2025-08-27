"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft,
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  User,
  Phone,
  Star,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Navigation,
  Route
} from "lucide-react"
import Link from "next/link"

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

export default function DistributionDetailPage() {
  const params = useParams()
  const distributionId = params.id as string

  const { data: distribution, isLoading, error } = useQuery({
    queryKey: ["distribution", distributionId],
    queryFn: async () => {
      const response = await fetch(`/api/distributions/${distributionId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch distribution")
      }
      return response.json()
    }
  })

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

  const calculateProgress = () => {
    if (!distribution?.schools) return 0
    const delivered = distribution.schools.filter((ds: any) => ds.actualPortions).length
    return distribution.schools.length > 0 ? (delivered / distribution.schools.length) * 100 : 0
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/distribution">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
          </div>
        </div>
        <div className="text-center py-8">Loading distribution details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/distribution">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Error</h1>
          </div>
        </div>
        <div className="text-center py-8 text-red-600">
          Error loading distribution: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/distribution">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Distribution #{distribution.id.slice(-8)}
            </h1>
            <Badge variant={statusColors[distribution.status as keyof typeof statusColors]}>
              <span className="flex items-center gap-1">
                {getStatusIcon(distribution.status)}
                {distribution.status.replace('_', ' ')}
              </span>
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {formatDateTime(distribution.distributionDate)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Route className="h-4 w-4 mr-2" />
            View Route
          </Button>
          <Button>
            <Navigation className="h-4 w-4 mr-2" />
            Track Live
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Distribution Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Portions</p>
                  <p className="text-2xl font-bold">{distribution.totalPortions}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Schools</p>
                  <p className="text-2xl font-bold">{distribution.schools?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Duration</p>
                  <p className="text-2xl font-bold">{distribution.estimatedDuration} min</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Delivery Progress</span>
                  <span>{Math.round(calculateProgress())}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-3" />
              </div>

              {distribution.notes && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Notes</p>
                  <p className="text-sm">{distribution.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* School Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Route</CardTitle>
              <CardDescription>
                Schools in delivery order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distribution.schools?.sort((a: any, b: any) => a.routeOrder - b.routeOrder).map((school: any, index: number) => (
                  <div key={school.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {school.routeOrder}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{school.school.name}</h4>
                      <p className="text-sm text-muted-foreground">{school.school.address}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Planned: {school.plannedPortions} portions</span>
                        {school.actualPortions && (
                          <span>Delivered: {school.actualPortions} portions</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {school.actualPortions ? (
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Delivered
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Driver Info */}
          {distribution.driver && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned Driver</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{distribution.driver.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm text-muted-foreground">{distribution.driver.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {distribution.driver.phone}
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Driver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vehicle Info */}
          {distribution.vehicle && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{distribution.vehicle.plateNumber}</p>
                      <p className="text-sm text-muted-foreground">{distribution.vehicle.type}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{distribution.vehicle.capacity} portions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Load:</span>
                      <span>{Math.round((distribution.totalPortions / distribution.vehicle.capacity) * 100)}%</span>
                    </div>
                  </div>
                  <Progress 
                    value={(distribution.totalPortions / distribution.vehicle.capacity) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  View on Map
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Change Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
