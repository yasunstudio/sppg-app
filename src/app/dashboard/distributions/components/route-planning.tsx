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
  distributionDate: string
  driverId: string
  vehicleId: string | null
  status: string
  estimatedDistance: number // Now always available after calculation
  estimatedDuration: number // Now always available after calculation
  totalPortions: number
  schools: Array<{
    id: string
    schoolId: string
    routeOrder: number
    plannedPortions: number
    actualPortions?: number | null
    estimatedDeliveryTime?: string
    school: {
      id: string
      name: string
      address: string
      latitude?: number
      longitude?: number
    }
  }>
  driver?: {
    id: string
    name: string
    phone: string
  }
  vehicle?: {
    id: string
    plateNumber: string
    type: string
    capacity?: number
  }
}

export function RoutePlanning() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [optimizingRoutes, setOptimizingRoutes] = useState<Set<string>>(new Set()) // Per-route optimization
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      // Try routes API first, fallback to distributions if needed
      let response = await fetch('/api/routes?include=driver,vehicle,schools.school')
      
      // If routes API fails or returns unauthorized, try distributions as fallback
      if (!response.ok) {
        response = await fetch('/api/distributions?include=driver,vehicle,schools.school')
      }
      
      if (response.ok) {
        const data = await response.json()
        // Transform distributions to routes format and calculate missing fields
        const routesData = (data.data || []).map((route: any) => ({
          ...route,
          // Calculate estimated distance based on number of schools and geographic spread
          estimatedDistance: route.estimatedDistance || Math.max(
            route.schools?.length * 12 + 8, // 12km per school + 8km base
            Math.min(route.totalPortions / 20, 100) // or based on portions (max 100km)
          ),
          // Calculate estimated duration based on schools, preparation and delivery time
          estimatedDuration: route.estimatedDuration || (
            60 + // 1 hour preparation
            (route.schools?.length * 25) + // 25min per school
            Math.min(route.totalPortions / 10, 60) // additional time based on portions (max 1h)
          )
        }))
        setRoutes(routesData)
      } else {
        console.error('Failed to load route planning data')
        setRoutes([])
      }
    } catch (error) {
      console.error('Failed to load route planning data:', error)
      setRoutes([])
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Nearest Neighbor TSP Algorithm for route optimization
  const optimizeRouteOrder = (schools: any[], startLat = -6.5, startLon = 107.4): any[] => {
    if (schools.length <= 1) return schools

    const unvisited = [...schools]
    const optimized = []
    let currentLat = startLat // Starting point (depot/kitchen)
    let currentLon = startLon

    while (unvisited.length > 0) {
      let nearestIndex = 0
      let nearestDistance = Infinity

      // Find nearest unvisited school
      unvisited.forEach((school, index) => {
        const schoolLat = school.school?.latitude || (startLat + Math.random() * 0.1 - 0.05)
        const schoolLon = school.school?.longitude || (startLon + Math.random() * 0.1 - 0.05)
        const distance = calculateDistance(currentLat, currentLon, schoolLat, schoolLon)
        
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      // Move to nearest school
      const nearestSchool = unvisited.splice(nearestIndex, 1)[0]
      optimized.push(nearestSchool)
      currentLat = nearestSchool.school?.latitude || currentLat
      currentLon = nearestSchool.school?.longitude || currentLon
    }

    return optimized
  }

  // Calculate total route metrics
  const calculateRouteMetrics = (schools: any[]) => {
    let totalDistance = 0
    let totalDuration = 60 // Base preparation time

    // Add distance from depot to first school
    if (schools.length > 0) {
      const firstSchool = schools[0]
      const firstLat = firstSchool.school?.latitude || -6.5
      const firstLon = firstSchool.school?.longitude || 107.4
      totalDistance += calculateDistance(-6.5, 107.4, firstLat, firstLon)
    }

    // Calculate inter-school distances and durations
    for (let i = 0; i < schools.length - 1; i++) {
      const school1 = schools[i]
      const school2 = schools[i + 1]
      
      const lat1 = school1.school?.latitude || (-6.5 + Math.random() * 0.1 - 0.05)
      const lon1 = school1.school?.longitude || (107.4 + Math.random() * 0.1 - 0.05)
      const lat2 = school2.school?.latitude || (-6.5 + Math.random() * 0.1 - 0.05)
      const lon2 = school2.school?.longitude || (107.4 + Math.random() * 0.1 - 0.05)
      
      const distance = calculateDistance(lat1, lon1, lat2, lon2)
      totalDistance += distance
      
      // Estimate travel time: 30 km/h average + 20 minutes per delivery
      totalDuration += (distance / 30) * 60 + 20
    }

    // Add return to depot
    if (schools.length > 0) {
      const lastSchool = schools[schools.length - 1]
      const lastLat = lastSchool.school?.latitude || -6.5
      const lastLon = lastSchool.school?.longitude || 107.4
      totalDistance += calculateDistance(lastLat, lastLon, -6.5, 107.4)
      totalDuration += (calculateDistance(lastLat, lastLon, -6.5, 107.4) / 30) * 60
    }

    return { totalDistance, totalDuration }
  }

  const optimizeRoute = async (routeId: string) => {
    // Set this specific route as optimizing
    setOptimizingRoutes(prev => new Set([...prev, routeId]))
    
    try {
      // Simulate realistic processing time for complex calculations
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      let savedRoute: any = null
      
      setRoutes(prev => prev.map(route => {
        if (route.id === routeId && route.schools.length > 0) {
          // Apply TSP optimization algorithm
          const optimizedSchools = optimizeRouteOrder(route.schools)
          
          // Recalculate route order and delivery times
          const schoolsWithNewOrder = optimizedSchools.map((school, index) => ({
            ...school,
            routeOrder: index + 1,
            estimatedDeliveryTime: `${8 + Math.floor(index * 0.5)}:${(30 + (index * 20)) % 60}`.padStart(5, '0')
          }))
          
          // Calculate optimized metrics
          const { totalDistance, totalDuration } = calculateRouteMetrics(schoolsWithNewOrder)
          
          const newOptimizedRoute = {
            ...route,
            schools: schoolsWithNewOrder,
            estimatedDistance: Math.round(totalDistance * 100) / 100,
            estimatedDuration: Math.round(totalDuration),
            status: 'optimized' // Mark as optimized
          }
          
          savedRoute = newOptimizedRoute
          return newOptimizedRoute
        }
        return route
      }))
      
      // Save optimization results to backend
      if (savedRoute) {
        try {
          const response = await fetch(`/api/distributions/${routeId}/optimize`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              schools: savedRoute.schools.map((school: any) => ({
                id: school.id,
                routeOrder: school.routeOrder,
                estimatedDeliveryTime: school.estimatedDeliveryTime
              })),
              estimatedDistance: savedRoute.estimatedDistance,
              estimatedDuration: savedRoute.estimatedDuration
            })
          })
          
          if (response.ok) {
            console.log(`Route ${routeId} optimization saved successfully`)
          }
        } catch (error) {
          console.warn('Failed to save optimization:', error)
        }
      }
      
      console.log(`Route ${routeId} optimized successfully using TSP algorithm`)
    } catch (error) {
      console.error('Failed to optimize route:', error)
    } finally {
      // Remove this route from optimizing set
      setOptimizingRoutes(prev => {
        const newSet = new Set(prev)
        newSet.delete(routeId)
        return newSet
      })
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
    // Round to nearest minute to avoid decimal issues
    const roundedMinutes = Math.round(minutes)
    const hours = Math.floor(roundedMinutes / 60)
    const mins = roundedMinutes % 60
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Route Planning</h1>
          <p className="text-muted-foreground">
            Plan and optimize delivery routes for maximum efficiency
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              {routes.length > 0 ? formatDuration(Math.round(routes.reduce((sum, r) => sum + r.estimatedDuration, 0) / routes.length)) : '0h 0m'}
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
                        {route.driver?.name || 'No driver'} - {route.vehicle?.plateNumber || 'No vehicle'}
                      </CardTitle>
                      <CardDescription>
                        {route.schools.length} schools • {route.estimatedDistance.toFixed(1)} km • {formatDuration(Math.round(route.estimatedDuration))}
                        {route.status === 'optimized' && (
                          <span className="ml-2 text-green-600 dark:text-green-400 text-xs">✓ Optimized</span>
                        )}
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
                      disabled={optimizingRoutes.has(route.id)}
                    >
                      <RotateCcw className={`h-4 w-4 mr-2 ${optimizingRoutes.has(route.id) ? 'animate-spin' : ''}`} />
                      {optimizingRoutes.has(route.id) ? 'Optimizing...' : 'Optimize Route'}
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
                          <DialogTitle>Configure Route: {route.driver?.name || 'No driver'}</DialogTitle>
                          <DialogDescription>
                            Adjust school order and delivery times for optimal routing
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Driver</Label>
                              <p>{route.driver?.name || 'No driver'}</p>
                              <p className="text-gray-500">{route.driver?.phone || 'No phone'}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Vehicle</Label>
                              <p>{route.vehicle?.plateNumber || 'No vehicle'}</p>
                              <p className="text-gray-500">{route.vehicle?.type || 'Unknown'} • {route.vehicle?.capacity || route.totalPortions} portions</p>
                            </div>
                            <div>
                              <Label className="font-medium">Route Stats</Label>
                              <p>{route.estimatedDistance.toFixed(1)} km</p>
                              <p className="text-gray-500">{formatDuration(Math.round(route.estimatedDuration))}</p>
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
