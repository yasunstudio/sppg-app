'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  MapPin,
  Route,
  Users,
  Package,
  Navigation,
  Settings,
  Save,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface School {
  id: string
  name: string
  address: string
  latitude?: number
  longitude?: number
  totalStudents: number
}

interface RouteSchool {
  id: string
  schoolId: string
  routeOrder: number
  plannedPortions: number
  estimatedDeliveryTime?: string
  school: School
}

interface Route {
  id: string
  distributionId: string
  driverId: string
  vehicleId: string
  status: string
  estimatedDistance: number
  estimatedDuration: number
  schools: RouteSchool[]
  driver: {
    name: string
    phone: string
  }
  vehicle: {
    plateNumber: string
    type: string
    capacity: number
  }
}

export function RoutePlanning() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes?include=driver,vehicle,schools.school')
      if (response.ok) {
        const data = await response.json()
        setRoutes(data.data || [])
      } else {
        toast.error('Failed to load route planning data')
        setRoutes([])
      }
    } catch (error) {
      toast.error('Failed to load route planning data')
      setRoutes([])
    } finally {
      setIsLoading(false)
    }
  }

  const optimizeRoute = async (routeId: string) => {
    setIsOptimizing(true)
    try {
      // Simulate route optimization
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock optimization - reorder schools
      setRoutes(prev => prev.map(route => {
        if (route.id === routeId) {
          const optimizedSchools = [...route.schools].sort(() => Math.random() - 0.5)
            .map((school, index) => ({
              ...school,
              routeOrder: index + 1,
              estimatedDeliveryTime: `${8 + index}:${30 + (index * 15)}`.slice(0, 5)
            }))
          
          return {
            ...route,
            schools: optimizedSchools,
            estimatedDistance: route.estimatedDistance * 0.9, // 10% improvement
            estimatedDuration: route.estimatedDuration * 0.9
          }
        }
        return route
      }))
      
      toast.success('Route optimized successfully')
    } catch (error) {
      toast.error('Failed to optimize route')
    } finally {
      setIsOptimizing(false)
    }
  }

  const moveSchool = (routeId: string, schoolId: string, direction: 'up' | 'down') => {
    setRoutes(prev => prev.map(route => {
      if (route.id === routeId) {
        const schools = [...route.schools]
        const currentIndex = schools.findIndex(s => s.id === schoolId)
        
        if (direction === 'up' && currentIndex > 0) {
          [schools[currentIndex], schools[currentIndex - 1]] = [schools[currentIndex - 1], schools[currentIndex]]
        } else if (direction === 'down' && currentIndex < schools.length - 1) {
          [schools[currentIndex], schools[currentIndex + 1]] = [schools[currentIndex + 1], schools[currentIndex]]
        }
        
        // Update route orders
        schools.forEach((school, index) => {
          school.routeOrder = index + 1
        })
        
        return { ...route, schools }
      }
      return route
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'planned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routes.length}</div>
            <p className="text-xs text-muted-foreground">Routes planned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {routes.reduce((sum, r) => sum + r.estimatedDistance, 0).toFixed(1)} km
            </div>
            <p className="text-xs text-muted-foreground">Estimated total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {routes.reduce((sum, r) => sum + r.schools.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Schools to visit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {routes.length > 0 ? formatDuration(routes.reduce((sum, r) => sum + r.estimatedDuration, 0) / routes.length) : '0h 0m'}
            </div>
            <p className="text-xs text-muted-foreground">Per route</p>
          </CardContent>
        </Card>
      </div>

      {/* Routes Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Route Planning & Optimization</CardTitle>
          <CardDescription>Plan and optimize delivery routes for maximum efficiency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {routes.map((route) => (
            <Card key={route.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <CardTitle className="text-base">
                        {route.driver.name} - {route.vehicle.plateNumber}
                      </CardTitle>
                      <CardDescription>
                        {route.schools.length} schools • {route.estimatedDistance.toFixed(1)} km • {formatDuration(route.estimatedDuration)}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(route.status)}>
                      {route.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => optimizeRoute(route.id)}
                      disabled={isOptimizing}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {isOptimizing ? 'Optimizing...' : 'Optimize'}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Configure Route: {route.driver.name}</DialogTitle>
                          <DialogDescription>
                            Adjust school order and delivery times for optimal routing
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Driver</Label>
                              <p>{route.driver.name}</p>
                              <p className="text-gray-500">{route.driver.phone}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Vehicle</Label>
                              <p>{route.vehicle.plateNumber}</p>
                              <p className="text-gray-500">{route.vehicle.type} • {route.vehicle.capacity} portions</p>
                            </div>
                            <div>
                              <Label className="font-medium">Route Stats</Label>
                              <p>{route.estimatedDistance.toFixed(1)} km</p>
                              <p className="text-gray-500">{formatDuration(route.estimatedDuration)}</p>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="font-medium mb-3 block">School Delivery Order</Label>
                            <div className="space-y-2">
                              {route.schools.map((school, index) => (
                                <div key={school.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <Badge variant="outline">#{school.routeOrder}</Badge>
                                    <div>
                                      <p className="font-medium">{school.school.name}</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">{school.school.address}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                      <p className="text-sm font-medium">{school.plannedPortions} portions</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">ETA: {school.estimatedDeliveryTime}</p>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => moveSchool(route.id, school.id, 'up')}
                                        disabled={index === 0}
                                      >
                                        <ArrowUp className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => moveSchool(route.id, school.id, 'down')}
                                        disabled={index === route.schools.length - 1}
                                      >
                                        <ArrowDown className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>
                            <Save className="h-4 w-4 mr-2" />
                            Save Route
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {route.schools.map((school) => (
                    <div key={school.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">#{school.routeOrder}</Badge>
                        <div>
                          <p className="font-medium text-sm">{school.school.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{school.school.address}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{school.plannedPortions} portions</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ETA: {school.estimatedDeliveryTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
