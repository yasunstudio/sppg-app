'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Building2,
  Package,
  MapPin,
  Save,
  ArrowLeft,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'

interface DistributionSchoolEditProps {
  id: string
}

export default function DistributionSchoolEdit({ id }: DistributionSchoolEditProps) {
  const [distributionSchool, setDistributionSchool] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [actualPortions, setActualPortions] = useState<number>(0)
  const [notes, setNotes] = useState('')
  const router = useRouter()

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
        setNotes(data.notes || '')
      } else {
        throw new Error('Failed to fetch distribution school')
      }
    } catch (error) {
      toast.error('Failed to load distribution school details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/distribution-schools/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          actualPortions,
          notes
        })
      })

      if (response.ok) {
        toast.success('Distribution school updated successfully')
        router.push(`/dashboard/distributions/schools/${id}`)
      } else {
        throw new Error('Failed to update distribution school')
      }
    } catch (error) {
      toast.error('Failed to update distribution school')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
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

  const getDifference = () => {
    return actualPortions - distributionSchool.plannedPortions
  }

  const getDifferenceColor = () => {
    const diff = getDifference()
    if (diff === 0) return 'text-green-600'
    if (diff > 0) return 'text-blue-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href={`/dashboard/distributions/schools/${id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Edit Distribution School
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update delivery information for {distributionSchool.school.name}
          </p>
        </div>

        <div className="grid gap-6">
          {/* School Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Building2 className="h-6 w-6 text-primary" />
                <span>School Information</span>
              </CardTitle>
              <CardDescription>
                Distribution scheduled for {format(new Date(distributionSchool.distribution.distributionDate), 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">School Name</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {distributionSchool.school.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Address</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {distributionSchool.school.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Total Students</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {distributionSchool.school.totalStudents.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Route Order</p>
                      <Badge variant="outline">#{distributionSchool.routeOrder}</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Package className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Planned Portions</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {distributionSchool.plannedPortions.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Update Delivery Information</CardTitle>
              <CardDescription>
                Enter the actual portions delivered and any delivery notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="actual-portions">Actual Portions Delivered</Label>
                    <Input
                      id="actual-portions"
                      type="number"
                      value={actualPortions}
                      onChange={(e) => setActualPortions(Number(e.target.value))}
                      placeholder="Enter actual portions"
                      min="0"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Planned: {distributionSchool.plannedPortions.toLocaleString()} portions
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Difference</Label>
                    <div className={`text-lg font-semibold ${getDifferenceColor()}`}>
                      {getDifference() > 0 ? '+' : ''}{getDifference().toLocaleString()} portions
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {getDifference() === 0 ? 'Perfect delivery' :
                       getDifference() > 0 ? 'Extra portions delivered' :
                       'Fewer portions delivered'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about the delivery (delays, issues, feedback, etc.)"
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <Link href={`/dashboard/distributions/schools/${id}`}>
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
