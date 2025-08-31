"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ClipboardCheck, 
  Thermometer, 
  Camera, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Users,
  FileText,
  BarChart,
  Package,
  Settings,
  Shield,
  Truck,
  Activity
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import Link from "next/link"

interface QualityCheckpointDetailsProps {
  checkpointId: string
}

interface QualityCheckpoint {
  id: string
  productionPlanId?: string
  batchId?: string
  checkpointType: string
  checkedAt: string
  checkedBy: string
  checkerName: string
  status: string
  temperature?: number
  visualInspection?: string
  tasteTest?: string
  textureEvaluation?: string
  correctiveAction?: string
  photos: string[]
  metrics?: any
  notes?: string
  createdAt: string
  batchName?: string
  productionPlanName?: string
}

export function QualityCheckpointDetails({ checkpointId }: QualityCheckpointDetailsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Mock data untuk development
  const [checkpoint] = useState<QualityCheckpoint>({
    id: checkpointId,
    productionPlanId: "plan-1",
    batchId: "batch-1",
    checkpointType: "PRODUCTION",
    checkedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    checkedBy: "user-2",
    checkerName: "Siti Nurhaliza",
    status: "CONDITIONAL",
    temperature: 75.0,
    visualInspection: "Warna sedikit pucat dari standar normal, namun masih dalam batas toleransi. Permukaan makanan terlihat rata dan tidak ada tanda-tanda kontaminasi.",
    tasteTest: "Rasa sudah sesuai dengan standar yang ditetapkan. Tingkat garam cukup dan bumbu merata. Tidak ada rasa aneh atau off-flavor yang terdeteksi.",
    textureEvaluation: "Tekstur kurang optimal dibandingkan standar. Sedikit lebih lembek dari yang diharapkan, namun masih dapat diterima untuk konsumsi.",
    correctiveAction: "Waktu memasak diperpanjang 5 menit untuk batch selanjutnya. Monitor suhu cooking lebih ketat. Pastikan timer berfungsi dengan baik.",
    photos: ["photo3.jpg", "photo4.jpg", "photo5.jpg"],
    metrics: {
      temperature: 8.5,
      taste: 9.0,
      appearance: 7.5,
      texture: 7.0
    },
    notes: "Perlu penyesuaian waktu memasak untuk batch selanjutnya. Tim produksi sudah diberitahu mengenai findings ini. Follow up diperlukan untuk memastikan improvement di batch berikutnya.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    batchName: "Batch Produksi #2024-002",
    productionPlanName: "Menu Sekolah Selasa"
  })

  const getTypeConfig = (type: string) => {
    const configs = {
      RAW_MATERIAL: { label: "Bahan Baku", icon: Package, color: "bg-blue-100 text-blue-800" },
      PRODUCTION: { label: "Produksi", icon: Settings, color: "bg-green-100 text-green-800" },
      PACKAGING: { label: "Kemasan", icon: Shield, color: "bg-yellow-100 text-yellow-800" },
      DISTRIBUTION: { label: "Distribusi", icon: Truck, color: "bg-purple-100 text-purple-800" }
    }
    return configs[type as keyof typeof configs] || configs.RAW_MATERIAL
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      PASS: { label: "Lulus", icon: CheckCircle, color: "bg-green-100 text-green-800", variant: "default" as const },
      FAIL: { label: "Gagal", icon: XCircle, color: "bg-red-100 text-red-800", variant: "destructive" as const },
      CONDITIONAL: { label: "Bersyarat", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800", variant: "secondary" as const },
      PENDING: { label: "Menunggu", icon: Clock, color: "bg-gray-100 text-gray-800", variant: "outline" as const },
      REWORK_REQUIRED: { label: "Perlu Rework", icon: AlertTriangle, color: "bg-orange-100 text-orange-800", variant: "secondary" as const }
    }
    return configs[status as keyof typeof configs] || configs.PENDING
  }

  const handleDelete = async () => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Checkpoint berhasil dihapus")
      router.push("/dashboard/quality-checkpoints")
    } catch (error) {
      toast.error("Gagal menghapus checkpoint")
      console.error("Delete checkpoint error:", error)
    } finally {
      setLoading(false)
    }
  }

  const typeConfig = getTypeConfig(checkpoint.checkpointType)
  const statusConfig = getStatusConfig(checkpoint.status)
  const TypeIcon = typeConfig.icon
  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/quality-checkpoints">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {checkpoint.batchName || `Checkpoint ${checkpoint.id}`}
            </h1>
            <p className="text-muted-foreground">
              Detail quality checkpoint dan hasil inspeksi
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/quality-checkpoints/${checkpoint.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Checkpoint</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus checkpoint ini? 
                  Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={loading}>
                  {loading ? "Menghapus..." : "Hapus"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Informasi Checkpoint
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tipe Checkpoint</Label>
                  <div className="mt-1">
                    <Badge variant="secondary" className={typeConfig.color}>
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {typeConfig.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge variant={statusConfig.variant} className={statusConfig.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Batch Produksi</Label>
                  <p className="mt-1 font-medium">
                    {checkpoint.batchName || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Rencana Produksi</Label>
                  <p className="mt-1 font-medium">
                    {checkpoint.productionPlanName || "-"}
                  </p>
                </div>
              </div>

              {checkpoint.temperature && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Suhu</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{checkpoint.temperature}°C</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inspection Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Hasil Inspeksi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {checkpoint.visualInspection && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Inspeksi Visual</Label>
                  <p className="mt-1 text-sm leading-relaxed">
                    {checkpoint.visualInspection}
                  </p>
                </div>
              )}

              {checkpoint.tasteTest && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tes Rasa</Label>
                  <p className="mt-1 text-sm leading-relaxed">
                    {checkpoint.tasteTest}
                  </p>
                </div>
              )}

              {checkpoint.textureEvaluation && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Evaluasi Tekstur</Label>
                  <p className="mt-1 text-sm leading-relaxed">
                    {checkpoint.textureEvaluation}
                  </p>
                </div>
              )}

              {checkpoint.correctiveAction && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tindakan Perbaikan</Label>
                  <div className="mt-1 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm leading-relaxed text-orange-800">
                      {checkpoint.correctiveAction}
                    </p>
                  </div>
                </div>
              )}

              {checkpoint.notes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Catatan</Label>
                  <p className="mt-1 text-sm leading-relaxed">
                    {checkpoint.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metrics */}
          {checkpoint.metrics && Object.keys(checkpoint.metrics).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Metrik Kualitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(checkpoint.metrics).map(([key, value]) => {
                    const score = parseFloat(value as string)
                    const getScoreColor = (score: number) => {
                      if (score >= 8.5) return "text-green-600"
                      if (score >= 7) return "text-yellow-600"
                      return "text-red-600"
                    }
                    
                    const getScoreLabel = (key: string) => {
                      const labels: Record<string, string> = {
                        temperature: "Suhu",
                        taste: "Rasa",
                        appearance: "Penampilan",
                        texture: "Tekstur",
                        freshness: "Kesegaran",
                        quality: "Kualitas",
                        hygiene: "Kebersihan",
                        packaging_integrity: "Integritas Kemasan",
                        seal_quality: "Kualitas Segel",
                        labeling: "Label",
                        temperature_compliance: "Kepatuhan Suhu",
                        packaging_condition: "Kondisi Kemasan",
                        delivery_time: "Ketepatan Waktu"
                      }
                      return labels[key] || key
                    }
                    
                    return (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">{getScoreLabel(key)}</span>
                        <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                          {score}/10
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Photos */}
          {checkpoint.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Dokumentasi Foto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {checkpoint.photos.map((photo, index) => (
                    <div key={photo} className="bg-gray-100 rounded-lg p-6 text-center">
                      <Camera className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm text-gray-600">Foto {index + 1}</p>
                      <p className="text-xs text-gray-500 mt-1">{photo}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipe</span>
                  <span className="font-semibold text-sm">{typeConfig.label}</span>
                </div>
                {checkpoint.temperature && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Suhu</span>
                    <span className="font-semibold text-sm">{checkpoint.temperature}°C</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Foto</span>
                  <span className="font-semibold text-sm">{checkpoint.photos.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inspector Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pemeriksa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Nama</Label>
                <p className="font-semibold">{checkpoint.checkerName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Waktu Pemeriksaan</Label>
                <p className="text-sm">{formatDate(checkpoint.checkedAt)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(checkpoint.checkedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Terkait
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {checkpoint.batchId && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/dashboard/production/batches/${checkpoint.batchId}`}>
                    Lihat Batch Produksi
                  </Link>
                </Button>
              )}
              {checkpoint.productionPlanId && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/dashboard/production/plans/${checkpoint.productionPlanId}`}>
                    Lihat Rencana Produksi
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/quality">
                  Dashboard Kualitas
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informasi Waktu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Dibuat</Label>
                <p className="text-sm">{formatDate(checkpoint.createdAt)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Diperiksa</Label>
                <p className="text-sm">{formatDate(checkpoint.checkedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
      {children}
    </label>
  )
}
