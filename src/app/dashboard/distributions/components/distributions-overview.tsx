'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  School, 
  Truck, 
  Eye, 
  Plus,
  Calendar,
  Users,
  CheckCircle,
  MapPin,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface DistributionStats {
  totalSchools: number
  todayDeliveries: number
  totalPortions: number
  completionRate: number
  activeDeliveries: number
  completedToday: number
  pendingDeliveries: number
}

export function DistributionsOverview() {
  const [stats, setStats] = useState<DistributionStats>({
    totalSchools: 0,
    todayDeliveries: 0,
    totalPortions: 0,
    completionRate: 0,
    activeDeliveries: 0,
    completedToday: 0,
    pendingDeliveries: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [distributionsRes, schoolsRes] = await Promise.all([
        fetch('/api/distributions?include=schools,driver,vehicle'),
        fetch('/api/schools')
      ])

      if (distributionsRes.ok && schoolsRes.ok) {
        const distributionsData = await distributionsRes.json()
        const schoolsData = await schoolsRes.json()
        
        const distributions = distributionsData.data || []
        const schools = schoolsData.data || []
        
        // Calculate today's date range 
        const today = new Date()
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
        
        // Filter today's distributions
        const todayDistributions = distributions.filter((dist: any) => {
          const distDate = new Date(dist.distributionDate)
          return distDate >= todayStart && distDate < todayEnd
        })
        
        // Calculate total portions for today (sum of planned portions from all schools)
        let totalPortions = 0
        todayDistributions.forEach((dist: any) => {
          if (dist.schools && dist.schools.length > 0) {
            // Sum planned portions from schools
            totalPortions += dist.schools.reduce((sum: number, school: any) => 
              sum + (school.plannedPortions || 0), 0)
          } else {
            // If no schools data, use totalPortions from distribution
            totalPortions += dist.totalPortions || 0
          }
        })
        
        // Count deliveries by status
        const completedDeliveries = todayDistributions.filter((dist: any) => 
          dist.status === 'COMPLETED' || dist.status === 'DELIVERED').length
        
        const activeDeliveries = todayDistributions.filter((dist: any) => 
          dist.status === 'IN_TRANSIT').length
        
        const pendingDeliveries = todayDistributions.filter((dist: any) => 
          dist.status === 'PREPARING' || dist.status === 'PLANNED').length
        
        // Calculate completion rate
        const completionRate = todayDistributions.length > 0 ? 
          (completedDeliveries / todayDistributions.length) * 100 : 0

        setStats({
          totalSchools: schools.length,
          todayDeliveries: todayDistributions.length,
          totalPortions,
          completionRate,
          activeDeliveries,
          completedToday: completedDeliveries,
          pendingDeliveries
        })
      } else {
        throw new Error('Failed to fetch statistics')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-80 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
          </div>
        </div>
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
          <h1 className="text-3xl font-bold tracking-tight">Distribution Management</h1>
          <p className="text-muted-foreground">
            Manage and track food distribution to schools
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
            <p className="text-xs text-muted-foreground">
              Active distribution points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">{stats.completedToday} completed</span> • {stats.pendingDeliveries} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPortions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Planned for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Today's delivery success
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution Tracking</CardTitle>
            <CardDescription>
              Monitor real-time delivery progress and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Deliveries</span>
                <Badge variant="secondary">{stats.activeDeliveries}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed Today</span>
                <Badge variant="outline" className="text-green-600 dark:text-green-400">
                  {stats.completedToday}
                </Badge>
              </div>
              <div className="space-y-2">
                <Link href="/dashboard/distributions/tracking">
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Tracking
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">School Management</CardTitle>
            <CardDescription>
              Manage distribution assignments for schools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Schools</span>
                <Badge variant="secondary">{stats.totalSchools}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Distribution Points</span>
                <Badge variant="outline">{stats.totalSchools}</Badge>
              </div>
              <div className="space-y-2">
                <Link href="/dashboard/distributions/schools">
                  <Button variant="outline" className="w-full">
                    <School className="h-4 w-4 mr-2" />
                    Manage Schools
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Route Planning</CardTitle>
            <CardDescription>
              Plan and optimize delivery routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Routes</span>
                <Badge variant="secondary">{stats.activeDeliveries}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Routes</span>
                <Badge variant="outline">{stats.pendingDeliveries}</Badge>
              </div>
              <div className="space-y-2">
                <Link href="/dashboard/distributions/routes">
                  <Button variant="outline" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Plan Routes
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
