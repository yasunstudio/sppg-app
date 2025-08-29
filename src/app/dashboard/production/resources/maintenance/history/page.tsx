"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Filter, Clock, CheckCircle, AlertTriangle, Wrench, Calendar } from "lucide-react"

// Fetch maintenance history
async function fetchMaintenanceHistory(filters: any) {
  const params = new URLSearchParams()
  if (filters.status) params.append("status", filters.status)
  if (filters.type) params.append("type", filters.type)
  if (filters.equipment) params.append("equipment", filters.equipment)
  if (filters.search) params.append("search", filters.search)
  
  const response = await fetch(`/api/production/maintenance/history?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch maintenance history")
  }
  const data = await response.json()
  return data.data || []
}

// Fetch equipment list for filter
async function fetchEquipmentList() {
  const response = await fetch("/api/production/equipment")
  if (!response.ok) {
    throw new Error("Failed to fetch equipment")
  }
  const data = await response.json()
  return data.data || []
}

export default function MaintenanceHistoryPage() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    equipment: "all",
    search: ""
  })

  const { data: maintenanceHistory = [], isLoading } = useQuery({
    queryKey: ["maintenance-history", filters],
    queryFn: () => fetchMaintenanceHistory(filters),
  })

  const { data: equipment = [] } = useQuery({
    queryKey: ["equipment-list"],
    queryFn: fetchEquipmentList,
  })

  const maintenanceTypes = [
    { value: "all", label: "All Types" },
    { value: "preventive", label: "Preventive" },
    { value: "corrective", label: "Corrective" },
    { value: "emergency", label: "Emergency" },
    { value: "inspection", label: "Inspection" },
    { value: "calibration", label: "Calibration" },
    { value: "cleaning", label: "Cleaning" }
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "scheduled", label: "Scheduled" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "overdue", label: "Overdue" }
  ]

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      case "critical":
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      status: "all",
      type: "all",
      equipment: "all",
      search: ""
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance History</h1>
          <p className="text-muted-foreground">
            View and filter past maintenance activities
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search maintenance..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
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
              <label className="text-sm font-medium">Equipment</label>
              <Select value={filters.equipment} onValueChange={(value) => handleFilterChange("equipment", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Equipment</SelectItem>
                  {equipment.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">Loading maintenance history...</div>
          </CardContent>
        </Card>
      ) : maintenanceHistory.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              No maintenance records found
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {maintenanceHistory.map((record: any) => (
            <Card key={record.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {getStatusIcon(record.status)}
                      <div>
                        <h3 className="font-semibold">{record.equipment?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {record.equipment?.model} • {record.type}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm mb-3">{record.description}</p>

                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Scheduled:</span>{" "}
                        {new Date(record.scheduledDate).toLocaleDateString()}
                      </div>
                      {record.completedAt && (
                        <div>
                          <span className="font-medium">Completed:</span>{" "}
                          {new Date(record.completedAt).toLocaleDateString()}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Duration:</span> {record.estimatedDuration} min
                        {record.actualDuration && ` (actual: ${record.actualDuration} min)`}
                      </div>
                      {record.assignedTo && (
                        <div>
                          <span className="font-medium">Assigned:</span> {record.assignedTo}
                        </div>
                      )}
                    </div>

                    {record.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                        <span className="font-medium">Notes:</span> {record.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Badge className={getStatusColor(record.status)}>
                      {record.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(record.priority)}>
                      {record.priority}
                    </Badge>
                    {record.cost && (
                      <Badge variant="outline">
                        ${record.cost}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
