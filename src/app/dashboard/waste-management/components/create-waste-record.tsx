'use client'

import { useState, useEffect } from 'react'
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

interface School {
  id: string
  name: string
  address: string
}

export function CreateWasteRecord() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [schools, setSchools] = useState<School[]>([])
  const [formData, setFormData] = useState({
    recordDate: new Date().toISOString().split('T')[0],
    wasteType: '' as 'ORGANIC' | 'INORGANIC' | 'PACKAGING' | '',
    source: '' as 'PREPARATION' | 'PRODUCTION' | 'PACKAGING' | 'SCHOOL_LEFTOVER' | 'EXPIRED_MATERIAL' | '',
    weight: 0,
    notes: '',
    schoolId: ''
  })

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools?limit=100')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSchools(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.wasteType || !formData.source || !formData.weight) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.weight <= 0) {
      toast.error('Weight must be greater than 0')
      return
    }

    setLoading(true)
    try {
      const submitData = {
        recordDate: new Date(formData.recordDate).toISOString(),
        wasteType: formData.wasteType,
        source: formData.source,
        weight: formData.weight,
        notes: formData.notes || null,
        schoolId: formData.schoolId || null
      }

      const response = await fetch('/api/waste-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Waste record created successfully')
        router.push('/dashboard/waste-management')
      } else {
        toast.error(result.error || 'Failed to create waste record')
      }
    } catch (error) {
      console.error('Error creating waste record:', error)
      toast.error('Failed to create waste record')
    } finally {
      setLoading(false)
    }
  }

  const wasteTypes = [
    { value: 'ORGANIC', label: 'Organic' },
    { value: 'INORGANIC', label: 'Inorganic' },
    { value: 'PACKAGING', label: 'Packaging' }
  ]

  const wasteSources = [
    { value: 'PREPARATION', label: 'Food Preparation' },
    { value: 'PRODUCTION', label: 'Production Process' },
    { value: 'PACKAGING', label: 'Packaging Process' },
    { value: 'SCHOOL_LEFTOVER', label: 'School Leftover' },
    { value: 'EXPIRED_MATERIAL', label: 'Expired Material' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/waste-management">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Waste Management
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Create Waste Record</h1>
            <p className="text-muted-foreground">Add a new waste tracking record</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Waste Information</CardTitle>
              <CardDescription>Basic details about the waste record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recordDate">Record Date *</Label>
                <Input
                  id="recordDate"
                  type="date"
                  value={formData.recordDate}
                  onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wasteType">Waste Type *</Label>
                <Select
                  value={formData.wasteType}
                  onValueChange={(value: 'ORGANIC' | 'INORGANIC' | 'PACKAGING') => 
                    setFormData({ ...formData, wasteType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Waste Source *</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value: 'PREPARATION' | 'PRODUCTION' | 'PACKAGING' | 'SCHOOL_LEFTOVER' | 'EXPIRED_MATERIAL') => 
                    setFormData({ ...formData, source: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste source" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteSources.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter weight in kg"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Optional details and notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolId">Associated School</Label>
                <Select
                  value={formData.schoolId}
                  onValueChange={(value) => setFormData({ ...formData, schoolId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select school (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No school</SelectItem>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select a school if this waste is related to a specific school
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter any additional notes or comments..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Additional details about the waste record
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create Waste Record'}
          </Button>
        </div>
      </form>
    </div>
  )
}
