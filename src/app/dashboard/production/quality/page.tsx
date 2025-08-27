"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertTriangle, Clock, Camera, FileText, Plus } from "lucide-react"

// Fetch quality checkpoints from API
async function fetchQualityCheckpoints() {
  const response = await fetch("/api/production/quality-checkpoints?limit=20")
  if (!response.ok) {
    throw new Error("Failed to fetch quality checkpoints")
  }
  const data = await response.json()
  return data.data || []
}

// Fetch quality standards from API
async function fetchQualityStandards() {
  const response = await fetch("/api/production/quality-standards?isActive=true")
  if (!response.ok) {
    throw new Error("Failed to fetch quality standards")
  }
  const data = await response.json()
  return data.data || []
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PASS":
      return "bg-green-100 text-green-800"
    case "FAIL":
      return "bg-red-100 text-red-800"
    case "CONDITIONAL":
      return "bg-yellow-100 text-yellow-800"
    case "PENDING":
      return "bg-blue-100 text-blue-800"
    case "REWORK_REQUIRED":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PASS":
      return <CheckCircle className="h-4 w-4" />
    case "FAIL":
      return <XCircle className="h-4 w-4" />
    case "CONDITIONAL":
    case "REWORK_REQUIRED":
      return <AlertTriangle className="h-4 w-4" />
    case "PENDING":
      return <Clock className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export default function ProductionQualityPage() {
  const { data: qualityCheckpoints = [], isLoading, error } = useQuery({
    queryKey: ["quality-checkpoints"],
    queryFn: fetchQualityCheckpoints,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const { data: qualityStandards = [], isLoading: isLoadingStandards } = useQuery({
    queryKey: ["quality-standards"],
    queryFn: fetchQualityStandards,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Quality Control</h1>
        </div>
        <div className="text-center py-8">Loading quality checkpoints...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Quality Control</h1>
        </div>
        <div className="text-center py-8 text-red-600">
          Error loading quality checkpoints: {error.message}
        </div>
      </div>
    )
  }

  const passedCheckpoints = qualityCheckpoints.filter((qc: any) => qc.status === "PASS")
  const failedCheckpoints = qualityCheckpoints.filter((qc: any) => qc.status === "FAIL")
  const pendingCheckpoints = qualityCheckpoints.filter((qc: any) => qc.status === "PENDING")
  const passRate = qualityCheckpoints.length > 0 ? (passedCheckpoints.length / qualityCheckpoints.length) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Control</h1>
          <p className="text-muted-foreground">
            Monitor and manage quality checkpoints throughout production
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            SOP Guidelines
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Quality Check
          </Button>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checkpoints</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityCheckpoints.length}</div>
            <p className="text-xs text-muted-foreground">completed today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{passedCheckpoints.length} passed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Checks</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedCheckpoints.length}</div>
            <p className="text-xs text-muted-foreground">require attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCheckpoints.length}</div>
            <p className="text-xs text-muted-foreground">awaiting inspection</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quality Checkpoints */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quality Checkpoints</CardTitle>
              <CardDescription>
                Latest quality control checks and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityCheckpoints.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No quality checkpoints found
                  </div>
                ) : (
                  qualityCheckpoints.map((checkpoint: any) => (
                    <div key={checkpoint.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">
                            {checkpoint.checkpointType.replace('_', ' ')}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Batch: {checkpoint.batch?.batchNumber || 'N/A'}
                          </p>
                        </div>
                        <Badge className={getStatusColor(checkpoint.status)}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(checkpoint.status)}
                            <span>{checkpoint.status}</span>
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-sm font-medium">Checked By</p>
                          <p className="text-sm text-muted-foreground">
                            {checkpoint.checker?.name || 'Unknown'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Time</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(checkpoint.checkedAt).toLocaleString()}
                          </p>
                        </div>
                        {checkpoint.temperature && (
                          <div>
                            <p className="text-sm font-medium">Temperature</p>
                            <p className="text-sm text-muted-foreground">
                              {checkpoint.temperature}°C
                            </p>
                          </div>
                        )}
                        {checkpoint.visualInspection && (
                          <div>
                            <p className="text-sm font-medium">Visual Inspection</p>
                            <p className="text-sm text-muted-foreground">
                              {checkpoint.visualInspection}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {checkpoint.notes && (
                        <div className="mt-3">
                          <p className="text-sm font-medium">Notes</p>
                          <p className="text-sm text-muted-foreground">
                            {checkpoint.notes}
                          </p>
                        </div>
                      )}
                      
                      {checkpoint.correctiveAction && (
                        <div className="mt-3 p-2 bg-orange-50 rounded">
                          <p className="text-sm font-medium text-orange-800">Corrective Action Required</p>
                          <p className="text-sm text-orange-700">
                            {checkpoint.correctiveAction}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Camera className="h-3 w-3 mr-1" />
                          View Photos
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Standards & SOP */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quality Standards</CardTitle>
              <CardDescription>
                Current quality standards and SOP compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingStandards ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-3 border rounded-lg animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))
                ) : qualityStandards.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No quality standards configured
                  </div>
                ) : (
                  qualityStandards.map((standard: any) => (
                    <div key={standard.id} className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-sm">{standard.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {standard.description}
                      </p>
                      <Progress 
                        value={(standard.currentValue / standard.targetValue) * 100} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {standard.currentValue}% compliance (Target: {standard.targetValue}%)
                      </p>
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View Full SOP Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Quality Checkpoint
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="mr-2 h-4 w-4" />
                  Photo Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate QC Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
