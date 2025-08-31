"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ArrowLeft, 
  Save, 
  ClipboardCheck, 
  Thermometer, 
  Camera, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Package,
  Settings,
  Shield,
  Truck,
  Upload,
  X
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface EditQualityCheckpointFormProps {
  checkpointId: string
}

interface QualityCheckpoint {
  id: string
  productionPlanId?: string
  batchId?: string
  checkpointType: string
  checkedAt: string
  checkedBy: string
  status: string
  temperature?: number
  visualInspection?: string
  tasteTest?: string
  textureEvaluation?: string
  correctiveAction?: string
  photos: string[]
  metrics?: any
  notes?: string
}

export function EditQualityCheckpointForm({ checkpointId }: EditQualityCheckpointFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<QualityCheckpoint>>({})

  // Load existing data (mock untuk development)
  useEffect(() => {
    const loadCheckpoint = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const existingData: QualityCheckpoint = {
          id: checkpointId,
          productionPlanId: "plan-1",
          batchId: "batch-1",
          checkpointType: "PRODUCTION",
          checkedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          checkedBy: "user-2",
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
          notes: "Perlu penyesuaian waktu memasak untuk batch selanjutnya. Tim produksi sudah diberitahu mengenai findings ini."
        }
        
        setFormData(existingData)
      } catch (error) {
        toast.error("Gagal memuat data checkpoint")
        console.error("Load checkpoint error:", error)
      }
    }

    loadCheckpoint()
  }, [checkpointId])

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

  const getMetricsFields = (type: string) => {
    const fieldsMap = {
      RAW_MATERIAL: [
        { key: 'freshness', label: 'Kesegaran', min: 1, max: 10 },
        { key: 'quality', label: 'Kualitas', min: 1, max: 10 },
        { key: 'hygiene', label: 'Kebersihan', min: 1, max: 10 }
      ],
      PRODUCTION: [
        { key: 'temperature', label: 'Suhu', min: 1, max: 10 },
        { key: 'taste', label: 'Rasa', min: 1, max: 10 },
        { key: 'appearance', label: 'Penampilan', min: 1, max: 10 },
        { key: 'texture', label: 'Tekstur', min: 1, max: 10 }
      ],
      PACKAGING: [
        { key: 'packaging_integrity', label: 'Integritas Kemasan', min: 1, max: 10 },
        { key: 'seal_quality', label: 'Kualitas Segel', min: 1, max: 10 },
        { key: 'labeling', label: 'Label', min: 1, max: 10 }
      ],
      DISTRIBUTION: [
        { key: 'temperature_compliance', label: 'Kepatuhan Suhu', min: 1, max: 10 },
        { key: 'packaging_condition', label: 'Kondisi Kemasan', min: 1, max: 10 },
        { key: 'delivery_time', label: 'Ketepatan Waktu', min: 1, max: 10 }
      ]
    }
    return fieldsMap[type as keyof typeof fieldsMap] || fieldsMap.RAW_MATERIAL
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.checkpointType || !formData.status) {
      toast.error("Harap lengkapi semua field yang wajib diisi")
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("Checkpoint berhasil diperbarui")
      router.push(`/dashboard/quality-checkpoints/${checkpointId}`)
    } catch (error) {
      toast.error("Gagal memperbarui checkpoint")
      console.error("Update checkpoint error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoRemove = (index: number) => {
    const updatedPhotos = [...(formData.photos || [])]
    updatedPhotos.splice(index, 1)
    setFormData(prev => ({
      ...prev,
      photos: updatedPhotos
    }))
    toast.success("Foto berhasil dihapus")
  }

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const newPhoto = `photo_${Date.now()}.jpg`
    setFormData(prev => ({
      ...prev,
      photos: [...(prev.photos || []), newPhoto]
    }))
    toast.success("Foto berhasil ditambahkan")
  }

  const typeConfig = formData.checkpointType ? getTypeConfig(formData.checkpointType) : null
  const statusConfig = formData.status ? getStatusConfig(formData.status) : null
  const TypeIcon = typeConfig?.icon
  const StatusIcon = statusConfig?.icon

  // Show loading state while data is being loaded
  if (!formData.id) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/quality-checkpoints">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Memuat...</h1>
            <p className="text-muted-foreground">Sedang memuat data checkpoint</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
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
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/quality-checkpoints/${checkpointId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Edit Quality Checkpoint
            </h1>
            <p className="text-muted-foreground">
              Perbarui informasi dan hasil inspeksi checkpoint
            </p>
          </div>
        </div>
        
        {/* Current Status Display */}
        <div className="flex items-center gap-4">
          {TypeIcon && typeConfig && (
            <Badge variant="secondary" className={typeConfig.color}>
              <TypeIcon className="h-3 w-3 mr-1" />
              {typeConfig.label}
            </Badge>
          )}
          {StatusIcon && statusConfig && (
            <Badge variant={statusConfig.variant} className={statusConfig.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Informasi Dasar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="checkpointType">Tipe Checkpoint *</Label>
                    <Select 
                      value={formData.checkpointType || ""} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, checkpointType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe checkpoint" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RAW_MATERIAL">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Bahan Baku
                          </div>
                        </SelectItem>
                        <SelectItem value="PRODUCTION">
                          <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Produksi
                          </div>
                        </SelectItem>
                        <SelectItem value="PACKAGING">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Kemasan
                          </div>
                        </SelectItem>
                        <SelectItem value="DISTRIBUTION">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Distribusi
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select 
                      value={formData.status || ""} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PASS">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Lulus
                          </div>
                        </SelectItem>
                        <SelectItem value="FAIL">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            Gagal
                          </div>
                        </SelectItem>
                        <SelectItem value="CONDITIONAL">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            Bersyarat
                          </div>
                        </SelectItem>
                        <SelectItem value="PENDING">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-600" />
                            Menunggu
                          </div>
                        </SelectItem>
                        <SelectItem value="REWORK_REQUIRED">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            Perlu Rework
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Suhu (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="Masukkan suhu"
                    value={formData.temperature || ""}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      temperature: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inspection Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Detail Inspeksi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visualInspection">Inspeksi Visual</Label>
                  <Textarea
                    id="visualInspection"
                    placeholder="Deskripsi hasil inspeksi visual..."
                    rows={3}
                    value={formData.visualInspection || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, visualInspection: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tasteTest">Tes Rasa</Label>
                  <Textarea
                    id="tasteTest"
                    placeholder="Hasil tes rasa dan evaluasi..."
                    rows={3}
                    value={formData.tasteTest || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, tasteTest: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textureEvaluation">Evaluasi Tekstur</Label>
                  <Textarea
                    id="textureEvaluation"
                    placeholder="Evaluasi tekstur produk..."
                    rows={3}
                    value={formData.textureEvaluation || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, textureEvaluation: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correctiveAction">Tindakan Perbaikan</Label>
                  <Textarea
                    id="correctiveAction"
                    placeholder="Tindakan perbaikan yang diperlukan..."
                    rows={3}
                    value={formData.correctiveAction || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, correctiveAction: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Tambahan</Label>
                  <Textarea
                    id="notes"
                    placeholder="Catatan atau komentar tambahan..."
                    rows={3}
                    value={formData.notes || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Metrics */}
            {formData.checkpointType && (
              <Card>
                <CardHeader>
                  <CardTitle>Metrik Kualitas</CardTitle>
                  <CardDescription>
                    Berikan penilaian untuk setiap aspek (skala 1-10)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {getMetricsFields(formData.checkpointType).map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>
                          {field.label} (1-10)
                        </Label>
                        <Input
                          id={field.key}
                          type="number"
                          min={field.min}
                          max={field.max}
                          step="0.1"
                          placeholder={`Nilai ${field.label.toLowerCase()}`}
                          value={formData.metrics?.[field.key] || ""}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            metrics: {
                              ...prev.metrics,
                              [field.key]: e.target.value ? parseFloat(e.target.value) : ""
                            }
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Dokumentasi Foto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.photos && formData.photos.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {formData.photos.map((photo, index) => (
                      <div key={photo} className="relative bg-gray-100 rounded-lg p-4 text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">Foto {index + 1}</p>
                        <p className="text-xs text-gray-500 mb-3">{photo}</p>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handlePhotoRemove(index)}
                          className="absolute top-2 right-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Belum ada foto yang diunggah</p>
                  </div>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePhotoUpload}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Tambah Foto
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/quality-checkpoints/${checkpointId}`}>
                    Batal
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Bantuan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  • Field yang ditandai dengan (*) wajib diisi
                </p>
                <p>
                  • Metrik kualitas menggunakan skala 1-10
                </p>
                <p>
                  • Foto dapat ditambah atau dihapus sesuai kebutuhan
                </p>
                <p>
                  • Tindakan perbaikan diperlukan untuk status FAIL atau CONDITIONAL
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
