"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  Calendar,
  Clock,
  Settings,
  TrendingUp,
  MapPin,
  Package,
  Activity,
  FileText
} from "lucide-react"
import { toast } from "sonner"

interface ResourceUsage {
  id: string
  batchId: string
  resourceId: string
  startTime: string
  endTime?: string
  plannedDuration: number
  actualDuration?: number
  efficiency?: number
  notes?: string
  createdAt: string
  batch: {
    id: string
    batchNumber: string
    startedAt?: string
    completedAt?: string
    status: string
    plannedQuantity: number
    actualQuantity?: number
    productionPlan: {
      id: string
      planDate: string
      targetPortions: number
      menu?: {
        id: string
        name: string
      }
    }
  }
  resource: {
    id: string
    name: string
    type: string
    capacityPerHour?: number
    location?: string
    status: string
    specifications?: any
  }
}

export function ResourceUsageDetails() {
  const router = useRouter()
  const params = useParams()
  const [resourceUsage, setResourceUsage] = useState<ResourceUsage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchResourceUsage(params.id as string)
    }
  }, [params.id])

  const fetchResourceUsage = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/resource-usage/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch resource usage')
      }

      const data = await response.json()
      setResourceUsage(data)
    } catch (error) {
      console.error('Error fetching resource usage:', error)
      toast.error('Gagal memuat data resource usage')
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (efficiency?: number) => {
    if (!efficiency) return <Badge variant="secondary">Not Completed</Badge>
    if (efficiency >= 90) return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Very Efficient</Badge>
    if (efficiency >= 70) return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Efficient</Badge>
    if (efficiency >= 50) return <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Moderately Efficient</Badge>
    return <Badge variant="destructive">Inefficient</Badge>
  }

  const getResourceTypeBadge = (type: string) => {
    const colorMap: { [key: string]: string } = {
      EQUIPMENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      TOOL: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", 
      MACHINE: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      FACILITY: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    }
    
    return (
      <Badge variant="secondary" className={colorMap[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}>
        {type}
      </Badge>
    )
  }

  const getBatchStatusBadge = (status: string) => {
    const colorMap: { [key: string]: string } = {
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
    
    return (
      <Badge variant="secondary" className={colorMap[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!resourceUsage) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h3 className="mt-2 text-sm font-semibold">Resource usage not found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            The requested resource usage data was not found.
          </p>
          <Button className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Resource Usage Details</h2>
            <p className="text-sm text-muted-foreground">
              Complete information on production resource usage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/dashboard/resource-usage/${resourceUsage.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Production Batch</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium">{resourceUsage.batch.batchNumber}</span>
                  {getBatchStatusBadge(resourceUsage.batch.status)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Menu Item</label>
                <p className="font-medium">{resourceUsage.batch.productionPlan.menu?.name || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Target Portions</label>
                <p className="font-medium">{resourceUsage.batch.productionPlan.targetPortions} portions</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Production Date</label>
                <p className="font-medium">{formatDateTime(resourceUsage.batch.productionPlan.planDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Resource Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Resource Name</label>
                <p className="font-medium">{resourceUsage.resource.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Resource Type</label>
                <div className="mt-1">
                  {getResourceTypeBadge(resourceUsage.resource.type)}
                </div>
              </div>

              {resourceUsage.resource.location && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{resourceUsage.resource.location}</span>
                  </div>
                </div>
              )}

              {resourceUsage.resource.capacityPerHour && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Capacity per Hour</label>
                  <p className="font-medium">{resourceUsage.resource.capacityPerHour} units/hour</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Time Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Start Time</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDateTime(resourceUsage.startTime)}</span>
                </div>
              </div>

              {resourceUsage.endTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">End Time</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatDateTime(resourceUsage.endTime)}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Planned Duration</label>
                <p className="font-medium">{formatDuration(resourceUsage.plannedDuration)}</p>
              </div>

              {resourceUsage.actualDuration && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Actual Duration</label>
                  <p className="font-medium">{formatDuration(resourceUsage.actualDuration)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Efficiency Status</label>
                <div className="mt-1">
                  {getStatusBadge(resourceUsage.efficiency)}
                </div>
              </div>

              {resourceUsage.efficiency && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Efficiency Value</label>
                  <p className="text-2xl font-bold">{resourceUsage.efficiency.toFixed(1)}%</p>
                </div>
              )}

              {resourceUsage.plannedDuration && resourceUsage.actualDuration && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="font-medium mb-2">Efficiency Calculation</h4>
                  <p className="text-sm text-muted-foreground">
                    Efficiency = (Planned Duration ÷ Actual Duration) × 100%
                  </p>
                  <p className="text-sm font-medium mt-1">
                    ({resourceUsage.plannedDuration} ÷ {resourceUsage.actualDuration}) × 100% = {resourceUsage.efficiency?.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      {resourceUsage.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{resourceUsage.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resource Usage ID:</span>
              <span className="font-mono">{resourceUsage.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created at:</span>
              <span>{formatDateTime(resourceUsage.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
