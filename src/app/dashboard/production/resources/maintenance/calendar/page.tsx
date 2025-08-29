"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Clock, AlertTriangle, CheckCircle, Wrench, Filter } from "lucide-react"

// Fetch maintenance calendar data
async function fetchMaintenanceCalendar(month: string, year: string) {
  const response = await fetch(`/api/production/maintenance/calendar?month=${month}&year=${year}`)
  if (!response.ok) {
    throw new Error("Failed to fetch maintenance calendar")
  }
  const data = await response.json()
  return data.data || []
}

export default function MaintenanceCalendarPage() {
  const router = useRouter()
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString())
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString())

  const { data: maintenanceEvents = [], isLoading } = useQuery({
    queryKey: ["maintenance-calendar", selectedMonth, selectedYear],
    queryFn: () => fetchMaintenanceCalendar(selectedMonth, selectedYear),
  })

  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" }
  ]

  const years = Array.from({ length: 3 }, (_, i) => {
    const year = currentDate.getFullYear() + i - 1
    return { value: year.toString(), label: year.toString() }
  })

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

  // Group events by date
  const eventsByDate = maintenanceEvents.reduce((acc: any, event: any) => {
    const date = new Date(event.scheduledDate).toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Calendar</h1>
          <p className="text-muted-foreground">
            View scheduled maintenance activities by month
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter by:</span>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">Loading maintenance calendar...</div>
          </CardContent>
        </Card>
      ) : Object.keys(eventsByDate).length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              No maintenance activities scheduled for this period
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(eventsByDate)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([date, events]: [string, any]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardTitle>
                  <CardDescription>
                    {events.length} maintenance {events.length === 1 ? 'activity' : 'activities'} scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event: any) => (
                      <div key={event.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(event.status)}
                            <div>
                              <h4 className="font-medium">{event.equipment?.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {event.type} • {event.estimatedDuration} minutes
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-sm mb-2">{event.description}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>
                              {new Date(event.scheduledDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {event.assignedTo && <span>Assigned: {event.assignedTo}</span>}
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Badge className={getStatusColor(event.status)}>
                            {event.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(event.priority)}>
                            {event.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
