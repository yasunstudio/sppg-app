"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Truck,
  Package,
  CircleCheck,
  CircleX,
  Calendar,
  FileText,
  Activity,
  MapPin,
  Timer,
  AlertTriangle
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

interface Delivery {
  id: string
  deliveryDate: string
  status: string
  school: {
    name: string
    address: string
  }
  createdAt: string
}

const typeColors = {
  "Truck": "bg-blue-100 text-blue-800 border-blue-200",
  "Van": "bg-green-100 text-green-800 border-green-200",
  "Pickup": "bg-orange-100 text-orange-800 border-orange-200",
  "Motorcycle": "bg-purple-100 text-purple-800 border-purple-200",
  "Car": "bg-pink-100 text-pink-800 border-pink-200",
}

const statusColors = {
  "PENDING": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "IN_PROGRESS": "bg-blue-100 text-blue-800 border-blue-200",
  "DELIVERED": "bg-green-100 text-green-800 border-green-200",
  "CANCELLED": "bg-red-100 text-red-800 border-red-200",
}

interface VehicleDetailsProps {
  vehicleId: string
}

export function VehicleDetails({ vehicleId }: VehicleDetailsProps) {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetails()
      fetchRecentDeliveries()
    }
  }, [vehicleId])

  const fetchVehicleDetails = async () => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setVehicle(result.data)
        } else {
          toast.error('Vehicle not found')
          router.push('/dashboard/vehicles')
        }
      } else {
        toast.error('Failed to fetch vehicle details')
        router.push('/dashboard/vehicles')
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      toast.error('Failed to fetch vehicle details')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentDeliveries = async () => {
    try {
      // This would be an API call to get recent deliveries for this vehicle
      // For now, we'll simulate it
      setRecentDeliveries([])
    } catch (error) {
      console.error('Error fetching deliveries:', error)
    }
  }

  const handleDelete = async () => {
    if (!vehicle) return
    
    if (!confirm(`Are you sure you want to delete vehicle "${vehicle.plateNumber}"? This action cannot be undone.`)) {
      return
    }

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast.success('Vehicle deleted successfully')
          router.push('/dashboard/vehicles')
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete vehicle')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      toast.error('Failed to delete vehicle')
    } finally {
      setDeleteLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDateShort = (dateString: string) => {
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
      return (
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-yellow-600">No Service Record</span>
        </div>
      )
    }

    const serviceDate = new Date(lastService)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - serviceDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff > 180) { // 6 months
      return (
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600">Service Due ({daysDiff} days ago)</span>
        </div>
      )
    } else if (daysDiff > 90) { // 3 months
      return (
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-yellow-600">Service Soon ({daysDiff} days ago)</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-2">
          <CircleCheck className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">Recently Serviced ({daysDiff} days ago)</span>
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span>Loading vehicle details...</span>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Truck className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Vehicle not found</h3>
          <p className="text-muted-foreground">The vehicle you're looking for doesn't exist.</p>
        </div>
        <Button onClick={() => router.push('/dashboard/vehicles')}>
          Back to Vehicles
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{vehicle.plateNumber}</h1>
                <div className="flex items-center gap-2">
                  {getTypeBadge(vehicle.type)}
                  {getStatusBadge(vehicle.isActive)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/vehicles/${vehicleId}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
              <CardDescription>
                Basic details about this vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Plate Number</label>
                    <p className="text-lg font-semibold">{vehicle.plateNumber}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Vehicle Type</label>
                    <p className="text-lg">{vehicle.type}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Capacity</label>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-semibold">{vehicle.capacity} kg</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(vehicle.isActive)}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Service</label>
                    <div className="mt-1">
                      {vehicle.lastService ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDateShort(vehicle.lastService)}</span>
                          </div>
                          {getServiceStatus(vehicle.lastService)}
                        </div>
                      ) : (
                        getServiceStatus(null)
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Deliveries</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-semibold">{vehicle._count.deliveries}</span>
                    </div>
                  </div>
                </div>
              </div>

              {vehicle.notes && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Notes
                    </label>
                    <p className="mt-1 text-sm leading-relaxed">{vehicle.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>
                Latest delivery assignments for this vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentDeliveries.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No recent deliveries found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDateShort(delivery.deliveryDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{delivery.school.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={statusColors[delivery.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200"}
                          >
                            {delivery.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{delivery.school.address}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Statistics</CardTitle>
              <CardDescription>
                Performance metrics for this vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Total Deliveries</p>
                  <p className="text-2xl font-bold">{vehicle._count.deliveries}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Distributions</p>
                  <p className="text-2xl font-bold">{vehicle._count.distributions}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Capacity</p>
                  <p className="text-2xl font-bold">{vehicle.capacity}</p>
                  <p className="text-xs text-muted-foreground">kg</p>
                </div>
                <Truck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
              <CardDescription>
                Registration and maintenance information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Registered</span>
                <span className="text-sm font-medium">{formatDateShort(vehicle.createdAt)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium">{formatDateShort(vehicle.updatedAt)}</span>
              </div>

              {vehicle.lastService && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Service</span>
                  <span className="text-sm font-medium">{formatDateShort(vehicle.lastService)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Vehicle ID</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{vehicle.id}</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
