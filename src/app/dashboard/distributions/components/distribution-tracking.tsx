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
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Eye,
  Navigation
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface Distribution {
  id: string
  distributionDate: string
  status: string
  driver?: {
    id: string
    name: string
    phone: string
  }
  vehicle?: {
    id: string
    plateNumber: string
    type: string
  }
  schools: Array<{
    id: string
    schoolId: string
    plannedPortions: number
    actualPortions: number | null
    routeOrder: number
    school: {
      name: string
      address: string
    }
  }>
}

export function DistributionTracking() {
  const [distributions, setDistributions] = useState<Distribution[]>([])
  const [filteredData, setFilteredData] = useState<Distribution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    fetchDistributions()
  }, [])

  useEffect(() => {
    filterData()
  }, [distributions, searchTerm, statusFilter, dateFilter])

  const fetchDistributions = async () => {
    try {
      const response = await fetch('/api/distributions?include=driver,vehicle,schools.school')
      if (response.ok) {
        const data = await response.json()
        setDistributions(data.data || [])
      } else {
        throw new Error('Failed to fetch distributions')
      }
    } catch (error) {
      console.error('Failed to load distribution tracking data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterData = () => {
    let filtered = distributions

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.driver?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.vehicle?.plateNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.schools.some(school => 
          school.school.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.distributionDate)
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate())
        
        switch (dateFilter) {
          case 'today':
            return itemDateOnly.getTime() === today.getTime()
          case 'yesterday':
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            return itemDateOnly.getTime() === yesterday.getTime()
          case 'this-week':
            const weekStart = new Date(today)
            weekStart.setDate(today.getDate() - today.getDay())
            return itemDate >= weekStart && itemDate <= now
          default:
            return true
        }
      })
    }

    setFilteredData(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'DELIVERED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      case 'IN_TRANSIT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      case 'PREPARING':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />
      case 'IN_TRANSIT':
        return <Navigation className="h-4 w-4" />
      case 'PREPARING':
        return <Clock className="h-4 w-4" />
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getDeliveryProgress = (schools: Distribution['schools']) => {
    const completed = schools.filter(s => s.actualPortions !== null).length
    const total = schools.length
    const percentage = total > 0 ? (completed / total) * 100 : 0
    return { completed, total, percentage }
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
          <h1 className="text-3xl font-bold tracking-tight">Distribution Tracking</h1>
          <p className="text-muted-foreground">
            Monitor real-time delivery progress and status
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Distributions</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.filter(d => d.status === 'IN_TRANSIT').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently on route</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.filter(d => d.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">Deliveries finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.filter(d => d.status === 'PREPARING').length}
            </div>
            <p className="text-xs text-muted-foreground">Waiting to start</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.reduce((sum, d) => sum + d.schools.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Schools to deliver</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribution Tracking</CardTitle>
          <CardDescription>Monitor real-time delivery progress and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search driver, vehicle, school..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
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
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setDateFilter('today')
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Distributions</CardTitle>
          <CardDescription>Real-time monitoring of delivery status and progress</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Distribution Details</TableHead>
                  <TableHead>Driver & Vehicle</TableHead>
                  <TableHead>Delivery Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schools</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((distribution) => {
                  const progress = getDeliveryProgress(distribution.schools)
                  
                  return (
                    <TableRow key={distribution.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {format(new Date(distribution.distributionDate), 'PPP')}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {distribution.id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center">
                            <Truck className="h-4 w-4 mr-2 text-gray-500" />
                            {distribution.driver?.name || 'No driver assigned'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {distribution.vehicle ? 
                              `${distribution.vehicle.plateNumber} - ${distribution.vehicle.type}` : 
                              'No vehicle assigned'
                            }
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {distribution.driver?.phone || 'No phone'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{progress.completed} of {progress.total} schools</span>
                            <span>{progress.percentage.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(distribution.status)}>
                          {getStatusIcon(distribution.status)}
                          <span className="ml-1 capitalize">
                            {distribution.status === 'IN_TRANSIT' ? 'In Transit' : 
                             distribution.status === 'DELIVERED' ? 'Delivered' :
                             distribution.status === 'COMPLETED' ? 'Completed' :
                             distribution.status === 'PREPARING' ? 'Preparing' :
                             distribution.status === 'CANCELLED' ? 'Cancelled' :
                             distribution.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {distribution.schools.slice(0, 2).map((school, index) => (
                            <div key={school.id} className="text-sm">
                              <span className="font-medium">#{school.routeOrder}</span> {school.school.name}
                            </div>
                          ))}
                          {distribution.schools.length > 2 && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              +{distribution.schools.length - 2} more schools
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/dashboard/distributions/${distribution.id}/track`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/distributions/${distribution.id}/map`}>
                            <Button variant="ghost" size="sm">
                              <MapPin className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
