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
    if (!efficiency) return <Badge variant="secondary">Belum Selesai</Badge>
    if (efficiency >= 90) return <Badge variant="default" className="bg-green-100 text-green-800">Sangat Efisien</Badge>
    if (efficiency >= 70) return <Badge variant="default" className="bg-blue-100 text-blue-800">Efisien</Badge>
    if (efficiency >= 50) return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Cukup Efisien</Badge>
    return <Badge variant="destructive">Tidak Efisien</Badge>
  }

  const getResourceTypeBadge = (type: string) => {
    const colorMap: { [key: string]: string } = {
      EQUIPMENT: "bg-blue-100 text-blue-800",
      TOOL: "bg-green-100 text-green-800", 
      MACHINE: "bg-purple-100 text-purple-800",
      FACILITY: "bg-orange-100 text-orange-800"
    }
    
    return (
      <Badge variant="secondary" className={colorMap[type] || "bg-gray-100 text-gray-800"}>
        {type}
      </Badge>
    )
  }

  const getBatchStatusBadge = (status: string) => {
    const colorMap: { [key: string]: string } = {
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800"
    }
    
    return (
      <Badge variant="secondary" className={colorMap[status] || "bg-gray-100 text-gray-800"}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (!resourceUsage) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center py-8">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Resource usage not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Data resource usage yang dicari tidak ditemukan.
          </p>
          <Button className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Detail Resource Usage</h2>
            <p className="text-muted-foreground">
              Informasi lengkap penggunaan sumber daya produksi
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/dashboard/resource-usage/${resourceUsage.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700"
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
              Informasi Dasar
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
                <label className="text-sm font-medium text-muted-foreground">Target Porsi</label>
                <p className="font-medium">{resourceUsage.batch.productionPlan.targetPortions} porsi</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Tanggal Produksi</label>
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
              Informasi Resource
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nama Resource</label>
                <p className="font-medium">{resourceUsage.resource.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipe Resource</label>
                <div className="mt-1">
                  {getResourceTypeBadge(resourceUsage.resource.type)}
                </div>
              </div>

              {resourceUsage.resource.location && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Lokasi</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{resourceUsage.resource.location}</span>
                  </div>
                </div>
              )}

              {resourceUsage.resource.capacityPerHour && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kapasitas per Jam</label>
                  <p className="font-medium">{resourceUsage.resource.capacityPerHour} unit/jam</p>
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
              Informasi Waktu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Waktu Mulai</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDateTime(resourceUsage.startTime)}</span>
                </div>
              </div>

              {resourceUsage.endTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Waktu Selesai</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatDateTime(resourceUsage.endTime)}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Durasi Rencana</label>
                <p className="font-medium">{formatDuration(resourceUsage.plannedDuration)}</p>
              </div>

              {resourceUsage.actualDuration && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Durasi Aktual</label>
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
              Informasi Performa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status Efisiensi</label>
                <div className="mt-1">
                  {getStatusBadge(resourceUsage.efficiency)}
                </div>
              </div>

              {resourceUsage.efficiency && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nilai Efisiensi</label>
                  <p className="text-2xl font-bold">{resourceUsage.efficiency.toFixed(1)}%</p>
                </div>
              )}

              {resourceUsage.plannedDuration && resourceUsage.actualDuration && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Perhitungan Efisiensi</h4>
                  <p className="text-sm text-muted-foreground">
                    Efisiensi = (Durasi Rencana ÷ Durasi Aktual) × 100%
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
              Catatan
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
              <span className="text-muted-foreground">ID Resource Usage:</span>
              <span className="font-mono">{resourceUsage.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dibuat pada:</span>
              <span>{formatDateTime(resourceUsage.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
