"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { Plus, Search, Filter, CheckCircle, XCircle, AlertTriangle, Clock, Eye } from "lucide-react"
import Link from "next/link"

interface QualityCheckpoint {
  id: string
  checkpointType: string
  checkedAt: string
  status: "PASS" | "FAIL" | "CONDITIONAL" | "PENDING" | "REWORK_REQUIRED"
  temperature?: number
  visualInspection?: string
  tasteTest?: string
  textureEvaluation?: string
  correctiveAction?: string
  notes?: string
  checker: {
    id: string
    name: string
    email: string
  }
  productionPlan?: {
    id: string
    planDate: string
    targetPortions: number
    menu: {
      id: string
      name: string
      mealType: string
    }
  }
  batch?: {
    id: string
    batchNumber: string
    status: string
  }
}

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

export default function QualityControlPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const { data: qualityCheckpoints = [], isLoading, error, refetch } = useQuery({
    queryKey: ["quality-checkpoints", statusFilter, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (typeFilter !== "all") params.append("type", typeFilter)
      params.append("limit", "20")

      const response = await fetch(`/api/quality/checkpoints?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch quality checkpoints")
      }
      return response.json()
    }
  })

  const filteredCheckpoints = qualityCheckpoints.filter((checkpoint: QualityCheckpoint) =>
    checkpoint.productionPlan?.menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkpoint.checkpointType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkpoint.checker.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: QualityCheckpoint["status"]) => {
    const Icon = statusIcons[status]
    return <Icon className="h-4 w-4" />
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getTemperatureDisplay = (temp?: number) => {
    if (!temp) return "-"
    return `${temp}°C`
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Quality Control</h1>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-500">
              Error loading quality checkpoints: {error.message}
              <div className="mt-4">
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Quality Control</h1>
          <p className="text-muted-foreground">
            Monitor and manage quality checkpoints for production processes
          </p>
        </div>
        <Link href="/dashboard/quality/checkpoints/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Quality Check
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by menu, checkpoint type, or checker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PASS">Pass</SelectItem>
                  <SelectItem value="FAIL">Fail</SelectItem>
                  <SelectItem value="CONDITIONAL">Conditional</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REWORK_REQUIRED">Rework Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(checkpointTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Checkpoints List */}
      <div className="grid gap-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredCheckpoints.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Quality Checkpoints Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start by creating your first quality checkpoint."}
                </p>
                <Link href="/dashboard/quality/checkpoints/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Quality Checkpoint
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredCheckpoints.map((checkpoint: QualityCheckpoint) => (
            <Card key={checkpoint.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {checkpointTypeLabels[checkpoint.checkpointType as keyof typeof checkpointTypeLabels] || checkpoint.checkpointType}
                      </h3>
                      <Badge variant={statusColors[checkpoint.status]}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(checkpoint.status)}
                          {checkpoint.status}
                        </span>
                      </Badge>
                    </div>
                    
                    {checkpoint.productionPlan && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>Menu: {checkpoint.productionPlan.menu.name}</span>
                        <span>•</span>
                        <span>Meal: {checkpoint.productionPlan.menu.mealType}</span>
                        <span>•</span>
                        <span>Target: {checkpoint.productionPlan.targetPortions} portions</span>
                      </div>
                    )}

                    {checkpoint.batch && (
                      <div className="text-sm text-muted-foreground mb-2">
                        Batch: {checkpoint.batch.batchNumber} ({checkpoint.batch.status})
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Checked by: {checkpoint.checker.name}</span>
                      <span>•</span>
                      <span>{formatDateTime(checkpoint.checkedAt)}</span>
                      {checkpoint.temperature && (
                        <>
                          <span>•</span>
                          <span>Temp: {getTemperatureDisplay(checkpoint.temperature)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/quality/checkpoints/${checkpoint.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Quality Details */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  {checkpoint.visualInspection && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Visual Inspection</p>
                      <p className="text-sm mt-1">{checkpoint.visualInspection}</p>
                    </div>
                  )}
                  {checkpoint.tasteTest && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taste Test</p>
                      <p className="text-sm mt-1">{checkpoint.tasteTest}</p>
                    </div>
                  )}
                  {checkpoint.textureEvaluation && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Texture Evaluation</p>
                      <p className="text-sm mt-1">{checkpoint.textureEvaluation}</p>
                    </div>
                  )}
                  {checkpoint.correctiveAction && (
                    <div>
                      <p className="text-sm font-medium text-destructive">Corrective Action Required</p>
                      <p className="text-sm mt-1">{checkpoint.correctiveAction}</p>
                    </div>
                  )}
                </div>

                {checkpoint.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-sm mt-1">{checkpoint.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
