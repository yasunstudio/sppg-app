'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

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
  emergencyContacts: EmergencyContact[]
}

interface EditDriverProps {
  driverId: string
}

export function EditDriver({ driverId }: EditDriverProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseClass: 'B1',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    rating: 5.0,
    performanceScore: 100
  })
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: '', relationship: '', phone: '' }
  ])

  useEffect(() => {
    if (driverId) {
      fetchDriverDetails()
    }
  }, [driverId])

  const fetchDriverDetails = async () => {
    try {
      const response = await fetch(`/api/drivers/${driverId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const driver: Driver = result.data
          setFormData({
            employeeId: driver.employeeId,
            name: driver.name,
            email: driver.email,
            phone: driver.phone,
            licenseNumber: driver.licenseNumber,
            licenseClass: driver.licenseClass,
            status: driver.status,
            rating: driver.rating,
            performanceScore: driver.performanceScore
          })
          
          if (driver.emergencyContacts && driver.emergencyContacts.length > 0) {
            setEmergencyContacts(driver.emergencyContacts)
          }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.employeeId || !formData.name || !formData.email || !formData.phone || !formData.licenseNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate emergency contacts
    const validContacts = emergencyContacts.filter(contact => 
      contact.name && contact.relationship && contact.phone
    )

    if (validContacts.length === 0) {
      toast.error('Please add at least one emergency contact')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/drivers/${driverId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          emergencyContacts: validContacts
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Driver updated successfully')
        router.push(`/dashboard/drivers/${driverId}`)
      } else {
        toast.error(result.error || 'Failed to update driver')
      }
    } catch (error) {
      console.error('Error updating driver:', error)
      toast.error('Failed to update driver')
    } finally {
      setSaving(false)
    }
  }

  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { name: '', relationship: '', phone: '' }])
  }

  const removeEmergencyContact = (index: number) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index))
    }
  }

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const updated = [...emergencyContacts]
    updated[index] = { ...updated[index], [field]: value }
    setEmergencyContacts(updated)
  }

  const licenseClasses = [
    { value: 'A', label: 'Class A - Heavy Truck' },
    { value: 'B', label: 'Class B - Medium Truck' },
    { value: 'B1', label: 'Class B1 - Light Truck' },
    { value: 'C', label: 'Class C - Regular Car' }
  ]

  const relationships = [
    'Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Colleague', 'Other'
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/drivers/${driverId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Driver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Driver</h1>
            <p className="text-muted-foreground">Update driver information and settings</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the driver's personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="e.g., DRV001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="driver@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+62 812 3456 7890"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* License Information */}
          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
              <CardDescription>Driver's license and performance details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="Enter license number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseClass">License Class</Label>
                <Select
                  value={formData.licenseClass}
                  onValueChange={(value) => setFormData({ ...formData, licenseClass: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {licenseClasses.map((cls) => (
                      <SelectItem key={cls.value} value={cls.value}>
                        {cls.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5.0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="performanceScore">Performance Score</Label>
                  <Input
                    id="performanceScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.performanceScore}
                    onChange={(e) => setFormData({ ...formData, performanceScore: parseInt(e.target.value) || 100 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>Update emergency contact information for the driver</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEmergencyContact}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-end space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-1 grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                        placeholder="Contact name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Select
                        value={contact.relationship}
                        onValueChange={(value) => updateEmergencyContact(index, 'relationship', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationships.map((rel) => (
                            <SelectItem key={rel} value={rel}>
                              {rel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={contact.phone}
                        onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  {emergencyContacts.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEmergencyContact(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/dashboard/drivers/${driverId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
