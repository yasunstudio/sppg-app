"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, Pause, CheckCircle, AlertTriangle, Clock, Thermometer, Users, Utensils } from "lucide-react"

// Fetch production batches from API
async function fetchProductionBatches() {
  const response = await fetch("/api/production/batches?status=IN_PROGRESS,QUALITY_CHECK")
  if (!response.ok) {
    throw new Error("Failed to fetch production batches")
  }
  const data = await response.json()
  return data.data || []
}

// Fetch production resources from API
async function fetchProductionResources() {
  const response = await fetch("/api/production/resources?status=IN_USE,AVAILABLE")
  if (!response.ok) {
    throw new Error("Failed to fetch production resources")
  }
  const data = await response.json()
  return data.data || []
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800"
    case "QUALITY_CHECK":
      return "bg-blue-100 text-blue-800"
    case "COMPLETED":
      return "bg-green-100 text-green-800"
    case "REJECTED":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getResourceStatusColor = (status: string) => {
  switch (status) {
    case "IN_USE":
      return "bg-green-100 text-green-800"
    case "AVAILABLE":
      return "bg-blue-100 text-blue-800"
    case "MAINTENANCE":
      return "bg-yellow-100 text-yellow-800"
    case "UNAVAILABLE":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ProductionExecutionPage() {
  const { data: batches = [], isLoading: batchesLoading, error: batchesError } = useQuery({
    queryKey: ["production-batches"],
    queryFn: fetchProductionBatches,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  })

  const { data: resources = [], isLoading: resourcesLoading, error: resourcesError } = useQuery({
    queryKey: ["production-resources"],
    queryFn: fetchProductionResources,
    refetchInterval: 10000, // Refresh every 10 seconds
  })

  if (batchesLoading && resourcesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Production Execution</h1>
        </div>
        <div className="text-center py-8">Loading production data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Execution</h1>
          <p className="text-muted-foreground">
            Monitor real-time production progress and equipment status
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <AlertTriangle className="mr-2 h-4 w-4" />
            View Alerts
          </Button>
          <Button>
            <PlayCircle className="mr-2 h-4 w-4" />
            Start New Batch
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batches.filter((b: any) => b.status === "IN_PROGRESS").length}
            </div>
            <p className="text-xs text-muted-foreground">currently cooking</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Check</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batches.filter((b: any) => b.status === "QUALITY_CHECK").length}
            </div>
            <p className="text-xs text-muted-foreground">pending QC</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Active</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resources.filter((r: any) => r.status === "IN_USE").length}
            </div>
            <p className="text-xs text-muted-foreground">equipment in use</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Quality Score</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batches.filter((b: any) => b.qualityScore).length > 0 ? 
                (batches.filter((b: any) => b.qualityScore).reduce((acc: number, b: any) => acc + b.qualityScore, 0) / 
                 batches.filter((b: any) => b.qualityScore).length).toFixed(1) : 
                "N/A"
              }%
            </div>
            <p className="text-xs text-muted-foreground">quality score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Production Batches */}
        <Card>
          <CardHeader>
            <CardTitle>Active Production Batches</CardTitle>
            <CardDescription>
              Monitor current batch progress in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {batchesError ? (
                <div className="text-center py-4 text-red-600">
                  Error loading batches: {batchesError.message}
                </div>
              ) : batches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active batches at the moment
                </div>
              ) : (
                batches.map((batch: any) => {
                  const startTime = batch.startedAt ? new Date(batch.startedAt) : null
                  const now = new Date()
                  const elapsed = startTime ? Math.floor((now.getTime() - startTime.getTime()) / 60000) : 0 // minutes
                  const estimated = 180 // Estimated 3 hours = 180 minutes
                  const progress = Math.min((elapsed / estimated) * 100, 100)

                  return (
                    <div key={batch.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{batch.batchNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            {batch.productionPlan?.menu?.name || "Menu not available"}
                          </p>
                        </div>
                        <Badge className={getStatusColor(batch.status)}>
                          {batch.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium">
                              {batch.actualQuantity || batch.plannedQuantity} portions
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Started</p>
                            <p className="font-medium">
                              {startTime ? startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-3">
                          <Button variant="outline" size="sm">
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </Button>
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Quality Check
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
            <CardDescription>
              Real-time equipment monitoring and utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resourcesError ? (
                <div className="text-center py-4 text-red-600">
                  Error loading resources: {resourcesError.message}
                </div>
              ) : resources.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No equipment data available
                </div>
              ) : (
                resources.map((resource: any) => {
                  const utilization = resource.status === "IN_USE" ? 
                    Math.floor(Math.random() * 40 + 60) : // Mock utilization 60-100% for active
                    Math.floor(Math.random() * 20) // Mock utilization 0-20% for available

                  return (
                    <div key={resource.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{resource.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {resource.type} • {resource.location || 'Location not set'}
                          </p>
                        </div>
                        <Badge className={getResourceStatusColor(resource.status)}>
                          {resource.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Utilization</span>
                          <span>{utilization}%</span>
                        </div>
                        <Progress value={utilization} className="h-2" />
                        
                        {resource.capacityPerHour && (
                          <div className="text-sm">
                            <p className="text-muted-foreground">Capacity</p>
                            <p className="font-medium">{resource.capacityPerHour} portions/hour</p>
                          </div>
                        )}
                        
                        {resource.usage && resource.usage.length > 0 && (
                          <div className="text-sm">
                            <p className="text-muted-foreground">Current Usage</p>
                            <p className="font-medium">
                              {resource.usage[0]?.batch?.batchNumber || 'Active batch'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
