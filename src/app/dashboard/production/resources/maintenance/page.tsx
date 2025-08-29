"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

import { ArrowLeft, Save, Calendar, Clock, AlertTriangle, CheckCircle, Wrench, Loader2 } from "lucide-react"
import { toast } from "sonner"

// Fetch equipment for maintenance scheduling
async function fetchEquipment() {
  const response = await fetch("/api/production/equipment")
  if (!response.ok) {
    throw new Error("Failed to fetch equipment")
  }
  const data = await response.json()
  return data.data || []
}

// Fetch upcoming maintenance
async function fetchUpcomingMaintenance() {
  const response = await fetch("/api/production/maintenance?upcoming=true")
  if (!response.ok) {
    throw new Error("Failed to fetch upcoming maintenance")
  }
  const data = await response.json()
  return data.data || []
}

export default function MaintenanceSchedulePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    equipmentId: "",
    type: "",
    scheduledDate: "",
    estimatedDuration: "",
    priority: "medium",
    description: "",
    assignedTo: "",
    notes: ""
  })

  const { data: equipment = [], isLoading: equipmentLoading } = useQuery({
    queryKey: ["equipment"],
    queryFn: fetchEquipment,
  })

  const { data: upcomingMaintenance = [], isLoading: maintenanceLoading } = useQuery({
    queryKey: ["upcoming-maintenance"],
    queryFn: fetchUpcomingMaintenance,
  })

  const maintenanceTypes = [
    { value: "preventive", label: "Preventive Maintenance" },
    { value: "corrective", label: "Corrective Maintenance" },
    { value: "emergency", label: "Emergency Repair" },
    { value: "inspection", label: "Routine Inspection" },
    { value: "calibration", label: "Calibration" },
    { value: "cleaning", label: "Deep Cleaning" }
  ]

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" },
    { value: "critical", label: "Critical", color: "bg-red-200 text-red-900" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/production/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          estimatedDuration: parseInt(formData.estimatedDuration) || 60
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule maintenance")
      }

      toast.success("Maintenance scheduled successfully")
      router.push("/dashboard/production/resources")
    } catch (error) {
      console.error("Error scheduling maintenance:", error)
      toast.error("Failed to schedule maintenance")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Wrench className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    return priorityOptions.find(p => p.value === priority)?.color || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Maintenance</h1>
          <p className="text-muted-foreground">
            Schedule maintenance for production equipment
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Details</CardTitle>
              <CardDescription>
                Fill in the maintenance schedule information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="equipment">Equipment</Label>
                    <Select 
                      value={formData.equipmentId} 
                      onValueChange={(value) => setFormData(prev => ({...prev, equipmentId: value}))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentLoading ? (
                          <SelectItem value="loading" disabled>Loading equipment...</SelectItem>
                        ) : (
                          equipment.map((item: any) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} - {item.model}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Maintenance Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData(prev => ({...prev, type: value}))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {maintenanceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData(prev => ({...prev, scheduledDate: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">Duration (minutes)</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData(prev => ({...prev, estimatedDuration: e.target.value}))}
                      placeholder="60"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value) => setFormData(prev => ({...prev, priority: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input
                      id="assignedTo"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData(prev => ({...prev, assignedTo: e.target.value}))}
                      placeholder="Technician name or team"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe the maintenance work to be performed..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Any additional notes or special instructions..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Schedule Maintenance
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
              <CardDescription>
                Scheduled maintenance activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceLoading ? (
                  <div className="text-center py-4">Loading maintenance...</div>
                ) : upcomingMaintenance.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No upcoming maintenance
                  </div>
                ) : (
                  upcomingMaintenance.map((maintenance: any) => (
                    <div key={maintenance.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(maintenance.status)}
                          <span className="font-medium text-sm">
                            {maintenance.equipment?.name}
                          </span>
                        </div>
                        <Badge className={getPriorityColor(maintenance.priority)}>
                          {maintenance.priority}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>{maintenance.type}</div>
                        <div>
                          {new Date(maintenance.scheduledDate).toLocaleDateString()} at{' '}
                          {new Date(maintenance.scheduledDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div>Duration: {maintenance.estimatedDuration} minutes</div>
                        {maintenance.assignedTo && (
                          <div>Assigned: {maintenance.assignedTo}</div>
                        )}
                      </div>

                      <hr className="my-2 border-gray-200" />

                      <div className="text-xs">
                        {maintenance.description}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/production/resources/maintenance/calendar")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/production/resources/maintenance/history")}
              >
                <Wrench className="mr-2 h-4 w-4" />
                Maintenance History
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/production/resources/maintenance/overdue")}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Overdue Tasks
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
