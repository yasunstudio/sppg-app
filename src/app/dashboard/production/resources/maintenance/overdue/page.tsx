"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertTriangle, Clock, Calendar, Wrench, RefreshCw, CheckCircle } from "lucide-react"
import { toast } from "sonner"

// Fetch overdue maintenance tasks
async function fetchOverdueTasks(priority?: string) {
  const params = new URLSearchParams()
  if (priority) params.append("priority", priority)
  
  const response = await fetch(`/api/production/maintenance/overdue?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch overdue tasks")
  }
  const data = await response.json()
  return data.data || []
}

export default function OverdueTasksPage() {
  const router = useRouter()
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isRescheduling, setIsRescheduling] = useState<string | null>(null)

  const { data: overdueTasks = [], isLoading, refetch } = useQuery({
    queryKey: ["overdue-tasks", priorityFilter],
    queryFn: () => fetchOverdueTasks(priorityFilter),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
  ]

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

  const getOverdueDays = (scheduledDate: string) => {
    const scheduled = new Date(scheduledDate)
    const now = new Date()
    const diffTime = now.getTime() - scheduled.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleReschedule = async (taskId: string) => {
    setIsRescheduling(taskId)
    try {
      const response = await fetch(`/api/production/maintenance/${taskId}/reschedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          reason: "Rescheduled from overdue tasks page"
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reschedule task")
      }

      toast.success("Task rescheduled successfully")
      refetch()
    } catch (error) {
      console.error("Error rescheduling task:", error)
      toast.error("Failed to reschedule task")
    } finally {
      setIsRescheduling(null)
    }
  }

  const handleMarkCompleted = async (taskId: string) => {
    try {
      const response = await fetch(`/api/production/maintenance/${taskId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completedAt: new Date().toISOString(),
          notes: "Marked as completed from overdue tasks page"
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark task as completed")
      }

      toast.success("Task marked as completed")
      refetch()
    } catch (error) {
      console.error("Error completing task:", error)
      toast.error("Failed to mark task as completed")
    }
  }

  const sortedTasks = overdueTasks.sort((a: any, b: any) => {
    // Sort by priority (critical first) then by overdue days
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    
    return getOverdueDays(b.scheduledDate) - getOverdueDays(a.scheduledDate)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-600">
            <AlertTriangle className="inline mr-2 h-8 w-8" />
            Overdue Maintenance Tasks
          </h1>
          <p className="text-muted-foreground">
            Critical and overdue maintenance activities requiring immediate attention
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {overdueTasks.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">Loading overdue tasks...</div>
          </CardContent>
        </Card>
      ) : sortedTasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                No Overdue Tasks!
              </h3>
              <p className="text-muted-foreground">
                All maintenance tasks are up to date. Great job!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task: any) => {
            const overdueDays = getOverdueDays(task.scheduledDate)
            return (
              <Card key={task.id} className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                          <h3 className="font-semibold text-lg">{task.equipment?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.equipment?.model} • {task.type}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm mb-4">{task.description}</p>

                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium">Due:</span>{" "}
                            {new Date(task.scheduledDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium">Duration:</span> {task.estimatedDuration} min
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium">Assigned:</span>{" "}
                            {task.assignedTo || "Unassigned"}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <div>
                            <span className="font-medium text-red-600">
                              {overdueDays} day{overdueDays !== 1 ? 's' : ''} overdue
                            </span>
                          </div>
                        </div>
                      </div>

                      {task.notes && (
                        <div className="mt-3 p-2 bg-yellow-50 border-l-2 border-yellow-400 text-sm">
                          <span className="font-medium">Notes:</span> {task.notes}
                        </div>
                      )}

                      <div className="flex space-x-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => handleMarkCompleted(task.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Completed
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReschedule(task.id)}
                          disabled={isRescheduling === task.id}
                        >
                          {isRescheduling === task.id ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Calendar className="mr-2 h-4 w-4" />
                          )}
                          Reschedule
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="destructive">
                        OVERDUE
                      </Badge>
                      {overdueDays > 7 && (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          CRITICAL DELAY
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
