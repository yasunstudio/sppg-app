"use client"

import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Clock, Camera, Edit, Thermometer, Eye, Utensils } from "lucide-react"
import Link from "next/link"

async function fetchQualityCheckpoint(id: string) {
  const response = await fetch(`/api/quality/checkpoints/${id}`)
  if (!response.ok) throw new Error("Failed to fetch quality checkpoint")
  return response.json()
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PASS":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
    case "FAIL":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
    case "CONDITIONAL":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
    case "PENDING":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
    case "REWORK_REQUIRED":
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PASS":
      return <CheckCircle className="h-5 w-5" />
    case "FAIL":
      return <XCircle className="h-5 w-5" />
    case "CONDITIONAL":
    case "REWORK_REQUIRED":
      return <AlertTriangle className="h-5 w-5" />
    case "PENDING":
      return <Clock className="h-5 w-5" />
    default:
      return <Clock className="h-5 w-5" />
  }
}

export default function QualityCheckpointDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  
  const { data: checkpoint, isLoading, error } = useQuery({
    queryKey: ["quality-checkpoint", id],
    queryFn: () => fetchQualityCheckpoint(id)
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/production/quality">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quality Control
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quality Checkpoint Details</h1>
          </div>
        </div>
        <div className="text-center py-8">Loading checkpoint details...</div>
      </div>
    )
  }

  if (error || !checkpoint) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/production/quality">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quality Control
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quality Checkpoint Details</h1>
          </div>
        </div>
        <div className="text-center py-8 text-destructive">
          Error loading checkpoint details: {error?.message || "Checkpoint not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/production/quality">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quality Control
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Quality Checkpoint Details</h1>
          <p className="text-muted-foreground">
            {checkpoint.checkpointType?.replace(/_/g, ' ') || 'Quality Checkpoint'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href={`/dashboard/production/quality/checkpoints/${id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/production/quality/photos/${id}`}>
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Photos
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(checkpoint.status)}
                  <span>Checkpoint Status</span>
                </CardTitle>
                <Badge className={getStatusColor(checkpoint.status)}>
                  {checkpoint.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Checkpoint Type</Label>
                  <p className="text-sm mt-1">{checkpoint.checkpointType?.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Checked At</Label>
                  <p className="text-sm mt-1">{new Date(checkpoint.checkedAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Checked By</Label>
                  <p className="text-sm mt-1">{checkpoint.checker?.name || 'Unknown'}</p>
                </div>
                {checkpoint.temperature && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Temperature</Label>
                    <div className="flex items-center space-x-1 mt-1">
                      <Thermometer className="h-4 w-4 text-destructive" />
                      <span className="text-sm">{checkpoint.temperature}°C</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quality Evaluations */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Evaluations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {checkpoint.visualInspection && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <Label className="font-medium">Visual Inspection</Label>
                  </div>
                  <p className="text-sm bg-primary/5 border border-primary/20 p-3 rounded-lg">{checkpoint.visualInspection}</p>
                </div>
              )}

              {checkpoint.tasteTest && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Utensils className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <Label className="font-medium">Taste Test</Label>
                  </div>
                  <p className="text-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg">{checkpoint.tasteTest}</p>
                </div>
              )}

              {checkpoint.textureEvaluation && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <Label className="font-medium">Texture Evaluation</Label>
                  </div>
                  <p className="text-sm bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-3 rounded-lg">{checkpoint.textureEvaluation}</p>
                </div>
              )}

              {checkpoint.correctiveAction && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <Label className="font-medium text-orange-700 dark:text-orange-300">Corrective Action Required</Label>
                  </div>
                  <p className="text-sm bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-3 rounded-lg">{checkpoint.correctiveAction}</p>
                </div>
              )}

              {checkpoint.notes && (
                <div>
                  <Label className="font-medium">Additional Notes</Label>
                  <p className="text-sm mt-2 bg-muted p-3 rounded-lg">{checkpoint.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metrics */}
          {checkpoint.metrics && (
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {typeof checkpoint.metrics === 'object' && Object.entries(checkpoint.metrics).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{String(value)}</div>
                      <div className="text-sm text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related Production */}
          {(checkpoint.productionPlan || checkpoint.batch) && (
            <Card>
              <CardHeader>
                <CardTitle>Related Production</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {checkpoint.productionPlan && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Production Plan</Label>
                    <div className="mt-1">
                      <Link href={`/dashboard/production-plans/${checkpoint.productionPlan.id}`}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          {checkpoint.productionPlan.menu?.name || 'Production Plan'}
                        </Button>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        Date: {new Date(checkpoint.productionPlan.planDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {checkpoint.batch && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Production Batch</Label>
                    <div className="mt-1">
                      <Link href={`/dashboard/production/batches/${checkpoint.batch.id}`}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          {checkpoint.batch.batchNumber}
                        </Button>
                      </Link>
                      <Badge variant="outline" className="mt-1">
                        {checkpoint.batch.status}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href={`/dashboard/production/quality/photos/${id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Camera className="h-4 w-4 mr-2" />
                    View Photos ({checkpoint.photos?.length || 0})
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href={`/dashboard/production/quality/checkpoints/${id}/edit`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Checkpoint
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Reviewed
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>
}
