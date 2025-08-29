"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Calendar,
  Clock,
  Package,
  Users,
  Plus,
  Minus,
  Save,
  ArrowLeft,
  MapPin,
  Truck
} from "lucide-react"
import Link from "next/link"

interface School {
  id: string
  name: string
  address: string
  totalStudents: number
  latitude?: number
  longitude?: number
}

interface DistributionSchool {
  schoolId: string
  plannedPortions: number
  routeOrder: number
}

interface CreateDistributionForm {
  distributionDate: string
  status: string
  totalPortions: number
  estimatedDuration: number
  driverId: string
  vehicleId: string
  notes: string
  schools: DistributionSchool[]
}

export default function CreateDistributionPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [form, setForm] = useState<CreateDistributionForm>({
    distributionDate: new Date().toISOString().split('T')[0],
    status: "PREPARING",
    totalPortions: 0,
    estimatedDuration: 60,
    driverId: "",
    vehicleId: "",
    notes: "",
    schools: []
  })

  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set())

  // Fetch schools
  const { data: schools = [], isLoading: isLoadingSchools } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const response = await fetch("/api/schools")
      if (!response.ok) {
        throw new Error("Failed to fetch schools")
      }
      const result = await response.json()
      return result.data || []
    }
  })

  // Fetch drivers
  const { data: drivers = [], isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const response = await fetch("/api/drivers?isActive=true")
      if (!response.ok) {
        throw new Error("Failed to fetch drivers")
      }
      const result = await response.json()
      return result.data || []
    }
  })

  // Fetch vehicles
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await fetch("/api/vehicles?isActive=true")
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles")
      }
      const result = await response.json()
      return result.data || []
    }
  })

  // Create distribution mutation
  const createDistribution = useMutation({
    mutationFn: async (data: CreateDistributionForm) => {
      const response = await fetch("/api/distributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create distribution")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributions"] })
      router.push("/dashboard/distribution")
    },
  })

  const handleSchoolSelection = (schoolId: string, checked: boolean) => {
    const newSelectedSchools = new Set(selectedSchools)
    
    if (checked) {
      newSelectedSchools.add(schoolId)
      const school = schools.find((s: School) => s.id === schoolId)
      if (school) {
        const newSchoolData: DistributionSchool = {
          schoolId,
          plannedPortions: Math.ceil(school.totalStudents * 1.1), // 10% buffer
          routeOrder: form.schools.length + 1
        }
        setForm(prev => ({
          ...prev,
          schools: [...prev.schools, newSchoolData],
          totalPortions: prev.totalPortions + newSchoolData.plannedPortions
        }))
      }
    } else {
      newSelectedSchools.delete(schoolId)
      const schoolData = form.schools.find(s => s.schoolId === schoolId)
      setForm(prev => ({
        ...prev,
        schools: prev.schools.filter(s => s.schoolId !== schoolId),
        totalPortions: prev.totalPortions - (schoolData?.plannedPortions || 0)
      }))
    }
    
    setSelectedSchools(newSelectedSchools)
  }

  const updateSchoolPortions = (schoolId: string, portions: number) => {
    setForm(prev => {
      const schoolIndex = prev.schools.findIndex(s => s.schoolId === schoolId)
      if (schoolIndex === -1) return prev

      const oldPortions = prev.schools[schoolIndex].plannedPortions
      const newSchools = [...prev.schools]
      newSchools[schoolIndex] = { ...newSchools[schoolIndex], plannedPortions: portions }

      return {
        ...prev,
        schools: newSchools,
        totalPortions: prev.totalPortions - oldPortions + portions
      }
    })
  }

  const updateRouteOrder = (schoolId: string, order: number) => {
    setForm(prev => ({
      ...prev,
      schools: prev.schools.map(s => 
        s.schoolId === schoolId ? { ...s, routeOrder: order } : s
      )
    }))
  }

  const getSchoolByIndex = (index: number) => {
    const schoolData = form.schools[index]
    return schools.find((s: School) => s.id === schoolData?.schoolId)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (form.schools.length === 0) {
      alert("Please select at least one school")
      return
    }
    
    createDistribution.mutate(form)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/distribution">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Distribution</h1>
          <p className="text-muted-foreground">
            Plan a new food distribution to schools
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Distribution Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribution Details</CardTitle>
                <CardDescription>
                  Set the basic information for this distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="distributionDate">Distribution Date</Label>
                    <Input
                      id="distributionDate"
                      type="datetime-local"
                      value={form.distributionDate + "T" + new Date().toTimeString().slice(0,5)}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        distributionDate: e.target.value.split('T')[0] 
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      min="30"
                      max="480"
                      value={form.estimatedDuration}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        estimatedDuration: parseInt(e.target.value) || 60 
                      }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="driverId">Driver</Label>
                    <Select
                      value={form.driverId}
                      onValueChange={(value) => setForm(prev => ({ ...prev, driverId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-driver">No driver assigned</SelectItem>
                        {isLoadingDrivers ? (
                          <SelectItem value="loading" disabled>Loading drivers...</SelectItem>
                        ) : (
                          drivers.map((driver: any) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name} ({driver.phone})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="vehicleId">Vehicle</Label>
                    <Select
                      value={form.vehicleId}
                      onValueChange={(value) => setForm(prev => ({ ...prev, vehicleId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-vehicle">No vehicle assigned</SelectItem>
                        {isLoadingVehicles ? (
                          <SelectItem value="loading" disabled>Loading vehicles...</SelectItem>
                        ) : (
                          vehicles.map((vehicle: any) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.plateNumber} - {vehicle.type} (Capacity: {vehicle.capacity})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any special instructions or notes..."
                    value={form.notes}
                    onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* School Selection */}
            <Card>
              <CardHeader>
                <CardTitle>School Selection</CardTitle>
                <CardDescription>
                  Choose schools to include in this distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSchools ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {schools.map((school: School) => (
                      <div key={school.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={`school-${school.id}`}
                          checked={selectedSchools.has(school.id)}
                          onCheckedChange={(checked: boolean) => 
                            handleSchoolSelection(school.id, checked)
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor={`school-${school.id}`} className="font-medium">
                            {school.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {school.address} • {school.totalStudents} students
                          </p>
                        </div>
                        <Badge variant="outline">
                          <Users className="h-3 w-3 mr-1" />
                          {school.totalStudents}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Schools Configuration */}
            {form.schools.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Route Configuration</CardTitle>
                  <CardDescription>
                    Configure portions and delivery order for selected schools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {form.schools
                      .sort((a, b) => a.routeOrder - b.routeOrder)
                      .map((schoolData, index) => {
                        const school = schools.find((s: School) => s.id === schoolData.schoolId)
                        if (!school) return null

                        return (
                          <div key={schoolData.schoolId} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{school.name}</h4>
                                <p className="text-sm text-muted-foreground">{school.address}</p>
                              </div>
                              <Badge variant="secondary">Stop #{schoolData.routeOrder}</Badge>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <div>
                                <Label htmlFor={`portions-${schoolData.schoolId}`}>
                                  Planned Portions
                                </Label>
                                <Input
                                  id={`portions-${schoolData.schoolId}`}
                                  type="number"
                                  min="1"
                                  value={schoolData.plannedPortions}
                                  onChange={(e) => 
                                    updateSchoolPortions(schoolData.schoolId, parseInt(e.target.value) || 0)
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor={`order-${schoolData.schoolId}`}>
                                  Route Order
                                </Label>
                                <Select
                                  value={schoolData.routeOrder.toString()}
                                  onValueChange={(value) => 
                                    updateRouteOrder(schoolData.schoolId, parseInt(value))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: form.schools.length }, (_, i) => (
                                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                                        Stop #{i + 1}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Distribution Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Date:</span>
                    <span className="text-sm">{new Date(form.distributionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Driver:</span>
                    <span className="text-sm">
                      {form.driverId ? 
                        drivers.find((d: any) => d.id === form.driverId)?.name || "Selected" : 
                        "Not assigned"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Vehicle:</span>
                    <span className="text-sm">
                      {form.vehicleId ? 
                        vehicles.find((v: any) => v.id === form.vehicleId)?.plateNumber || "Selected" : 
                        "Not assigned"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Schools:</span>
                    <span className="text-sm">{form.schools.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Portions:</span>
                    <span className="text-sm font-bold">{form.totalPortions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Estimated Duration:</span>
                    <span className="text-sm">{form.estimatedDuration} min</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createDistribution.isPending || form.schools.length === 0}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {createDistribution.isPending ? "Creating..." : "Create Distribution"}
                  </Button>
                </div>

                {createDistribution.error && (
                  <div className="text-sm text-red-600 mt-2">
                    Error: {createDistribution.error.message}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
