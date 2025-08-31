'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export function CreateVehicle() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.plateNumber || !formData.type || !formData.model) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const submitData = {
        ...formData,
        plateNumber: formData.plateNumber.toUpperCase(),
        lastMaintenanceDate: formData.lastMaintenanceDate || null,
        nextMaintenanceDate: formData.nextMaintenanceDate || null,
        notes: formData.notes || null
      }

      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Vehicle created successfully')
        router.push('/dashboard/vehicles')
      } else {
        toast.error(result.error || 'Failed to create vehicle')
      }
    } catch (error) {
      console.error('Error creating vehicle:', error)
      toast.error('Failed to create vehicle')
    } finally {
      setLoading(false)
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

  const commonCapacities = [
    { value: 75, label: 'Small (50-100 kg)' },
    { value: 200, label: 'Medium (150-250 kg)' },
    { value: 500, label: 'Large (400-600 kg)' },
    { value: 1000, label: 'Extra Large (800-1200 kg)' },
    { value: 2000, label: 'Heavy Duty (1500+ kg)' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/vehicles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Create New Vehicle</h1>
            <p className="text-muted-foreground">Add a new vehicle to the fleet management system</p>
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
                  <div className="space-y-2">
                    <Select
                      value={formData.capacity.toString()}
                      onValueChange={(value) => setFormData({ ...formData, capacity: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonCapacities.map((cap) => (
                          <SelectItem key={cap.value} value={cap.value.toString()}>
                            {cap.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="0"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                      placeholder="Or enter custom capacity"
                    />
                  </div>
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
                <Label htmlFor="status">Initial Status</Label>
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
                <p className="text-xs text-muted-foreground">Leave empty if no maintenance done yet</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextMaintenanceDate">Next Maintenance Date</Label>
                <Input
                  id="nextMaintenanceDate"
                  type="date"
                  value={formData.nextMaintenanceDate}
                  onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Schedule next maintenance date</p>
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
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create Vehicle'}
          </Button>
        </div>
      </form>
    </div>
  )
}
