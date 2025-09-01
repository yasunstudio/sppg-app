'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Badge } from '@/components/ui/badge'
import { 
  Building2,
  Users,
  Package,
  Plus,
  Save,
  ArrowLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

interface School {
  id: string
  name: string
  address: string
  totalStudents: number
}

interface Distribution {
  id: string
  distributionDate: string
  status: string
}

interface DistributionSchoolFormData {
  schoolId: string
  plannedPortions: number
  routeOrder: number
  selected: boolean
}

export function DistributionSchoolForm() {
  const [distributions, setDistributions] = useState<Distribution[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [selectedDistribution, setSelectedDistribution] = useState('')
  const [formData, setFormData] = useState<DistributionSchoolFormData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (schools.length > 0) {
      initializeFormData()
    }
  }, [schools])

  const fetchData = async () => {
    try {
      const [distributionsRes, schoolsRes] = await Promise.all([
        fetch('/api/distributions'),
        fetch('/api/schools')
      ])

      if (distributionsRes.ok && schoolsRes.ok) {
        const [distributionsData, schoolsData] = await Promise.all([
          distributionsRes.json(),
          schoolsRes.json()
        ])
        
        setDistributions(distributionsData.data || [])
        setSchools(schoolsData.data || [])
      }
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const initializeFormData = () => {
    const initialData = schools.map((school, index) => ({
      schoolId: school.id,
      plannedPortions: Math.ceil(school.totalStudents * 1.1), // 10% buffer
      routeOrder: index + 1,
      selected: false
    }))
    setFormData(initialData)
  }

  const updateFormData = (schoolId: string, field: keyof DistributionSchoolFormData, value: any) => {
    setFormData(prev => prev.map(item => 
      item.schoolId === schoolId 
        ? { ...item, [field]: value }
        : item
    ))
  }

  const toggleSelectAll = () => {
    const allSelected = formData.every(item => item.selected)
    setFormData(prev => prev.map(item => ({ ...item, selected: !allSelected })))
  }

  const handleSave = async () => {
    const selectedSchools = formData.filter(item => item.selected)
    
    if (!selectedDistribution) {
      toast.error('Please select a distribution')
      return
    }

    if (selectedSchools.length === 0) {
      toast.error('Please select at least one school')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        distributionId: selectedDistribution,
        schools: selectedSchools.map(({ selected, ...school }) => school)
      }

      const response = await fetch('/api/distribution-schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success(`Successfully created ${selectedSchools.length} distribution schools`)
        router.push('/dashboard/distributions/schools')
      } else {
        throw new Error('Failed to create distribution schools')
      }
    } catch (error) {
      toast.error('Failed to create distribution schools')
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
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const selectedCount = formData.filter(item => item.selected).length
  const totalPlannedPortions = formData
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.plannedPortions, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard/distributions/schools">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Distribution Schools
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Create Distribution Schools
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Assign schools to a distribution with planned portions and route order
          </p>
        </div>

        <div className="grid gap-6">
          {/* Distribution Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Package className="h-6 w-6 text-primary" />
                <span>Select Distribution</span>
              </CardTitle>
              <CardDescription>
                Choose the distribution to assign schools to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distribution">Distribution</Label>
                  <Select value={selectedDistribution} onValueChange={setSelectedDistribution}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a distribution" />
                    </SelectTrigger>
                    <SelectContent>
                      {distributions.map((distribution) => (
                        <SelectItem key={distribution.id} value={distribution.id}>
                          {new Date(distribution.distributionDate).toLocaleDateString()} - {distribution.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {selectedCount > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Selected Schools</p>
                    <p className="text-2xl font-bold text-primary">{selectedCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                    <p className="text-2xl font-bold">
                      {formData
                        .filter(item => item.selected)
                        .reduce((sum, item) => {
                          const school = schools.find(s => s.id === item.schoolId)
                          return sum + (school?.totalStudents || 0)
                        }, 0)
                        .toLocaleString()
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Planned Portions</p>
                    <p className="text-2xl font-bold text-green-600">
                      {totalPlannedPortions.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Portions/Student</p>
                    <p className="text-2xl font-bold">
                      {selectedCount > 0 ? (
                        totalPlannedPortions / formData
                          .filter(item => item.selected)
                          .reduce((sum, item) => {
                            const school = schools.find(s => s.id === item.schoolId)
                            return sum + (school?.totalStudents || 0)
                          }, 0)
                      ).toFixed(1) : '0'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schools Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Schools Assignment</CardTitle>
                  <CardDescription>
                    Select schools and configure portions and route order
                  </CardDescription>
                </div>
                <Button onClick={toggleSelectAll} variant="outline" size="sm">
                  {formData.every(item => item.selected) ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Planned Portions</TableHead>
                      <TableHead>Route Order</TableHead>
                      <TableHead>Portions/Student</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.map((item) => {
                      const school = schools.find(s => s.id === item.schoolId)
                      if (!school) return null

                      const portionsPerStudent = item.plannedPortions / school.totalStudents

                      return (
                        <TableRow key={item.schoolId}>
                          <TableCell>
                            <Checkbox
                              checked={item.selected}
                              onCheckedChange={(checked) => 
                                updateFormData(item.schoolId, 'selected', checked)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{school.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {school.address}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span>{school.totalStudents.toLocaleString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.plannedPortions}
                              onChange={(e) => 
                                updateFormData(item.schoolId, 'plannedPortions', Number(e.target.value))
                              }
                              className="w-24"
                              min="0"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.routeOrder}
                              onChange={(e) => 
                                updateFormData(item.schoolId, 'routeOrder', Number(e.target.value))
                              }
                              className="w-20"
                              min="1"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              portionsPerStudent >= 1.2 ? "default" :
                              portionsPerStudent >= 1.0 ? "secondary" : "destructive"
                            }>
                              {portionsPerStudent.toFixed(2)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Link href="/dashboard/distributions/schools">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !selectedDistribution || selectedCount === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Creating...' : `Create ${selectedCount} Distribution Schools`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
