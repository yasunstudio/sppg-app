'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Building2,
  Users,
  Package,
  MapPin,
  Phone,
  Calendar,
  Truck,
  Edit3,
  CheckCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface DistributionSchoolDetailProps {
  id: string
}

export default function DistributionSchoolDetail({ id }: DistributionSchoolDetailProps) {
  const [distributionSchool, setDistributionSchool] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [actualPortions, setActualPortions] = useState<number>(0)

  useEffect(() => {
    fetchDistributionSchool()
  }, [id])

  const fetchDistributionSchool = async () => {
    try {
      const response = await fetch(`/api/distribution-schools/${id}`)
      if (response.ok) {
        const data = await response.json()
        setDistributionSchool(data)
        setActualPortions(data.actualPortions || data.plannedPortions)
      } else {
        throw new Error('Failed to fetch distribution school')
      }
    } catch (error) {
      toast.error('Failed to load distribution school details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/distribution-schools/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          actualPortions
        })
      })

      if (response.ok) {
        toast.success('Distribution school updated successfully')
        setIsDialogOpen(false)
        fetchDistributionSchool()
      } else {
        throw new Error('Failed to update distribution school')
      }
    } catch (error) {
      toast.error('Failed to update distribution school')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6">
            <Card>
              <CardContent className="p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!distributionSchool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Distribution School Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The requested distribution school could not be found.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getPortionStatusColor = () => {
    const actual = distributionSchool.actualPortions || 0
    const planned = distributionSchool.plannedPortions
    
    if (actual === planned) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    if (actual > planned) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Distribution School Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and update school distribution information
          </p>
        </div>

        <div className="grid gap-6">
          {/* Main Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-xl">
                      {distributionSchool.school.name}
                    </CardTitle>
                    <CardDescription>
                      Distribution Route Order: #{distributionSchool.routeOrder}
                    </CardDescription>
                  </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Update Portions
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Actual Portions</DialogTitle>
                      <DialogDescription>
                        Enter the actual number of portions distributed to this school.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="actual-portions">Actual Portions</Label>
                        <Input
                          id="actual-portions"
                          type="number"
                          value={actualPortions}
                          onChange={(e) => setActualPortions(Number(e.target.value))}
                          placeholder="Enter actual portions"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdate} disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Update'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* School Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    School Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Address</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {distributionSchool.school.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Total Students</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {distributionSchool.school.totalStudents.toLocaleString()} students
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Principal</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {distributionSchool.school.principalName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {distributionSchool.school.principalPhone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distribution Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Distribution Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Distribution Date</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(distributionSchool.distribution.distributionDate), 'PPP')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Planned Portions</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {distributionSchool.plannedPortions.toLocaleString()} portions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Actual Portions</p>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPortionStatusColor()}>
                            {(distributionSchool.actualPortions || 0).toLocaleString()} portions
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle & Driver Information */}
              {distributionSchool.distribution.vehicle && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center mb-4">
                    <Truck className="h-5 w-5 mr-2" />
                    Vehicle & Driver Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Vehicle</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {distributionSchool.distribution.vehicle.plateNumber} - {distributionSchool.distribution.vehicle.type}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Capacity: {distributionSchool.distribution.vehicle.capacity} portions
                        </p>
                      </div>
                    </div>
                    {distributionSchool.distribution.driver && (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Driver</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {distributionSchool.distribution.driver.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {distributionSchool.distribution.driver.phone}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            License: {distributionSchool.distribution.driver.licenseNumber}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
