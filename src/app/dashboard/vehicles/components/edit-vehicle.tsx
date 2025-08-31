'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Vehicle {
  id: string
  plateNumber: string
  type: string
  model: string
  year: number
  capacity: number
  fuelType: string
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  lastMaintenanceDate?: string
  nextMaintenanceDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface EditVehicleProps {
  vehicleId: string
}

export function EditVehicle({ vehicleId }: EditVehicleProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: 0,
    fuelType: 'GASOLINE',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    notes: ''
  })

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetails()
    }
  }, [vehicleId])

  const fetchVehicleDetails = async () => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const vehicleData = result.data
          setVehicle(vehicleData)
          setFormData({
            plateNumber: vehicleData.plateNumber || '',
            type: vehicleData.type || '',
            model: vehicleData.model || '',
            year: vehicleData.year || new Date().getFullYear(),
            capacity: vehicleData.capacity || 0,
            fuelType: vehicleData.fuelType || 'GASOLINE',
            status: vehicleData.status || 'ACTIVE',
            lastMaintenanceDate: vehicleData.lastMaintenanceDate 
              ? new Date(vehicleData.lastMaintenanceDate).toISOString().split('T')[0] 
              : '',
            nextMaintenanceDate: vehicleData.nextMaintenanceDate 
              ? new Date(vehicleData.nextMaintenanceDate).toISOString().split('T')[0] 
              : '',
            notes: vehicleData.notes || ''
          })
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
      router.push('/dashboard/vehicles')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.plateNumber || !formData.type || !formData.model) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const submitData = {
        ...formData,
        lastMaintenanceDate: formData.lastMaintenanceDate || null,
        nextMaintenanceDate: formData.nextMaintenanceDate || null,
        notes: formData.notes || null
      }

      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Vehicle updated successfully')
        router.push(`/dashboard/vehicles/${vehicleId}`)
      } else {
        toast.error(result.error || 'Failed to update vehicle')
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      toast.error('Failed to update vehicle')
    } finally {
      setSaving(false)
    }
  }

  const vehicleTypes = [
    { value: 'TRUCK', label: 'Truck' },
    { value: 'VAN', label: 'Van' },
    { value: 'PICKUP', label: 'Pickup' },
    { value: 'CAR', label: 'Car' },
    { value: 'MOTORCYCLE', label: 'Motorcycle' }
  ]

  const fuelTypes = [
    { value: 'GASOLINE', label: 'Gasoline' },
    { value: 'DIESEL', label: 'Diesel' },
    { value: 'ELECTRIC', label: 'Electric' },
    { value: 'HYBRID', label: 'Hybrid' }
  ]

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'MAINTENANCE', label: 'Under Maintenance' }
  ]

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Vehicle Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The vehicle you're trying to edit doesn't exist or has been removed.
        </p>
        <Link href="/dashboard/vehicles">
          <Button>Back to Vehicles</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/vehicles/${vehicleId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicle
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Vehicle</h1>
            <p className="text-muted-foreground">Update vehicle information and details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Vehicle identification and basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Plate Number *</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g., B 1234 ABC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., Toyota Hiace"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1990"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (kg)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="0"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Information */}
          <Card>
            <CardHeader>
              <CardTitle>Operational Information</CardTitle>
              <CardDescription>Fuel type, status, and operational details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel.value} value={fuel.value}>
                        {fuel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastMaintenanceDate">Last Maintenance Date</Label>
                <Input
                  id="lastMaintenanceDate"
                  type="date"
                  value={formData.lastMaintenanceDate}
                  onChange={(e) => setFormData({ ...formData, lastMaintenanceDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextMaintenanceDate">Next Maintenance Date</Label>
                <Input
                  id="nextMaintenanceDate"
                  type="date"
                  value={formData.nextMaintenanceDate}
                  onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Any additional information or notes about this vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter any additional notes or comments about this vehicle..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/dashboard/vehicles/${vehicleId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
