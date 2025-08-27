"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Edit, CheckCircle, XCircle, AlertTriangle, Clock, Calendar, User, Thermometer } from "lucide-react"
import Link from "next/link"

const statusColors = {
  PASS: "default",
  FAIL: "destructive",
  CONDITIONAL: "secondary", 
  PENDING: "outline",
  REWORK_REQUIRED: "destructive"
} as const

const statusIcons = {
  PASS: CheckCircle,
  FAIL: XCircle,
  CONDITIONAL: AlertTriangle,
  PENDING: Clock,
  REWORK_REQUIRED: XCircle
}

const checkpointTypeLabels = {
  "RAW_MATERIAL_INSPECTION": "Inspeksi Bahan Baku",
  "COOKING_PROCESS": "Proses Memasak",
  "FINAL_INSPECTION": "Inspeksi Akhir",
  "PACKAGING_CHECK": "Pemeriksaan Kemasan", 
  "TEMPERATURE_MONITORING": "Monitoring Suhu",
  "TASTE_TEST": "Tes Rasa",
  "TEXTURE_EVALUATION": "Evaluasi Tekstur",
  "HYGIENE_CHECK": "Pemeriksaan Hygiene"
}

export default function QualityCheckpointDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: checkpoint, isLoading, error } = useQuery({
    queryKey: ["quality-checkpoint", id],
    queryFn: async () => {
      const response = await fetch(`/api/quality/checkpoints/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch quality checkpoint")
      }
      return response.json()
    },
    enabled: !!id
  })

  const getStatusIcon = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons]
    return Icon ? <Icon className="h-4 w-4" /> : null
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <Card>
            <CardContent className="py-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !checkpoint) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Checkpoint</h3>
              <p className="text-muted-foreground mb-4">
                {error?.message || "Quality checkpoint not found"}
              </p>
              <Link href="/dashboard/quality">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Quality Control
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard/quality">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quality Control
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Checkpoint Details</h1>
          <p className="text-muted-foreground">
            {checkpointTypeLabels[checkpoint.checkpointType as keyof typeof checkpointTypeLabels] || checkpoint.checkpointType}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/quality/checkpoints/${id}/edit`}>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status & Basic Info */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {checkpointTypeLabels[checkpoint.checkpointType as keyof typeof checkpointTypeLabels] || checkpoint.checkpointType}
                </CardTitle>
                <CardDescription className="text-sm">Quality checkpoint information</CardDescription>
              </div>
              <Badge variant={statusColors[checkpoint.status as keyof typeof statusColors]} className="text-sm py-1 px-3">
                <span className="flex items-center gap-2">
                  {getStatusIcon(checkpoint.status)}
                  {checkpoint.status}
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Checked At:</span>
                  <span>{formatDateTime(checkpoint.checkedAt)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Checked By:</span>
                  <span>{checkpoint.checker.name}</span>
                  <span className="text-muted-foreground">({checkpoint.checker.email})</span>
                </div>

                {checkpoint.temperature && (
                  <div className="flex items-center gap-2 text-sm">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Temperature:</span>
                    <span>{checkpoint.temperature}°C</span>
                  </div>
                )}
              </div>

              {/* Production Plan & Batch Info */}
              <div className="space-y-4">
                {checkpoint.productionPlan && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Production Plan</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Menu:</span> {checkpoint.productionPlan.menu.name}</p>
                      <p><span className="font-medium">Meal Type:</span> {checkpoint.productionPlan.menu.mealType}</p>
                      <p><span className="font-medium">Target Portions:</span> {checkpoint.productionPlan.targetPortions}</p>
                      <p><span className="font-medium">Plan Date:</span> {new Date(checkpoint.productionPlan.planDate).toLocaleDateString("id-ID")}</p>
                    </div>
                  </div>
                )}

                {checkpoint.batch && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Production Batch</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Batch Number:</span> {checkpoint.batch.batchNumber}</p>
                      <p><span className="font-medium">Status:</span> {checkpoint.batch.status}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Assessment Results */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quality Assessment Results</CardTitle>
            <CardDescription className="text-sm">Detailed evaluation findings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {checkpoint.visualInspection && (
                <div>
                  <h4 className="font-medium mb-2">Visual Inspection</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                    {checkpoint.visualInspection}
                  </p>
                </div>
              )}

              {checkpoint.tasteTest && (
                <div>
                  <h4 className="font-medium mb-2">Taste Test</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                    {checkpoint.tasteTest}
                  </p>
                </div>
              )}

              {checkpoint.textureEvaluation && (
                <div>
                  <h4 className="font-medium mb-2">Texture Evaluation</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                    {checkpoint.textureEvaluation}
                  </p>
                </div>
              )}

              {checkpoint.correctiveAction && (
                <div>
                  <h4 className="font-medium mb-2 text-destructive">Corrective Action Required</h4>
                  <p className="text-sm bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
                    {checkpoint.correctiveAction}
                  </p>
                </div>
              )}

              {checkpoint.notes && (
                <div>
                  <h4 className="font-medium mb-2">Additional Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                    {checkpoint.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metrics Display (if available) */}
        {checkpoint.metrics && Object.keys(checkpoint.metrics).length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quality Metrics</CardTitle>
              <CardDescription className="text-sm">Quantitative measurements and scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(checkpoint.metrics).map(([key, value]) => (
                  <div key={key} className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium capitalize">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-lg font-bold mt-1">
                      {typeof value === "number" ? value.toFixed(1) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
