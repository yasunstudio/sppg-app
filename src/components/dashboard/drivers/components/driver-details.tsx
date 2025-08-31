'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Edit, 
  Trash2, 
  Star, 
  Phone, 
  Mail, 
  CreditCard, 
  TrendingUp,
  Truck,
  Package,
  AlertTriangle,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Driver {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  licenseClass: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  rating: number
  performanceScore: number
  emergencyContacts: {
    name: string
    relationship: string
    phone: string
  }[]
  _count: {
    deliveries: number
    distributions: number
  }
  createdAt: string
  updatedAt: string
}

interface Delivery {
  id: string
  deliveryDate: string
  status: string
  vehicle?: {
    plateNumber: string
    type: string
  }
  recipient: string
  items: number
}

interface DriverDetailsProps {
  driverId: string
}

export function DriverDetails({ driverId }: DriverDetailsProps) {
  const router = useRouter()
  const [driver, setDriver] = useState<Driver | null>(null)
  const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (driverId) {
      fetchDriverDetails()
      fetchRecentDeliveries()
    }
  }, [driverId])

  const fetchDriverDetails = async () => {
    try {
      const response = await fetch(`/api/drivers/${driverId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setDriver(result.data)
        } else {
          toast.error('Driver not found')
          router.push('/dashboard/drivers')
        }
      } else {
        toast.error('Failed to fetch driver details')
        router.push('/dashboard/drivers')
      }
    } catch (error) {
      console.error('Error fetching driver:', error)
      toast.error('Failed to fetch driver details')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentDeliveries = async () => {
    try {
      const response = await fetch(`/api/drivers/${driverId}/deliveries?limit=5`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setRecentDeliveries(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/drivers/${driverId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Driver deleted successfully')
        router.push('/dashboard/drivers')
      } else {
        toast.error(result.error || 'Failed to delete driver')
      }
    } catch (error) {
      console.error('Error deleting driver:', error)
      toast.error('Failed to delete driver')
    } finally {
      setDeleteLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getDeliveryStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!driver) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Driver Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The driver you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/dashboard/drivers">
          <Button>Back to Drivers</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>
              {driver.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{driver.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>ID: {driver.employeeId}</span>
              <span>•</span>
              <span>License: {driver.licenseNumber}</span>
              <span>•</span>
              <Badge className={getStatusColor(driver.status)}>
                {driver.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/drivers/${driver.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Driver</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this driver? This action cannot be undone.
                  All associated delivery records will be preserved but unlinked.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Driver'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold">{driver.rating.toFixed(1)}</span>
                  <div className="flex items-center">
                    {getRatingStars(driver.rating)}
                  </div>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold mt-2">{driver.performanceScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Deliveries</p>
                <p className="text-2xl font-bold mt-2">{driver._count.deliveries}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Distributions</p>
                <p className="text-2xl font-bold mt-2">{driver._count.distributions}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Driver Information */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
            <CardDescription>Personal and license details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{driver.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{driver.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">License Class</p>
                <p className="text-sm text-muted-foreground">{driver.licenseClass}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Joined</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(driver.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
            <CardDescription>Emergency contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {driver.emergencyContacts?.length > 0 ? (
                driver.emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      </div>
                      <p className="text-sm font-medium">{contact.phone}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No emergency contacts available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
          <CardDescription>Latest delivery assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {recentDeliveries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>
                      {new Date(delivery.deliveryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {delivery.vehicle ? (
                        <div>
                          <p className="font-medium">{delivery.vehicle.plateNumber}</p>
                          <p className="text-sm text-muted-foreground">{delivery.vehicle.type}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{delivery.recipient}</TableCell>
                    <TableCell>{delivery.items}</TableCell>
                    <TableCell>
                      <Badge className={getDeliveryStatusColor(delivery.status)}>
                        {delivery.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent deliveries found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
