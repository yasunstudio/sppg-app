"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  ArrowLeft, 
  Save, 
  ClipboardCheck, 
  Thermometer, 
  Camera, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Upload,
  X,
  Package,
  Settings,
  Shield,
  Truck
} from "lucide-react"
import { useQualityCheckpointMutations, CreateQualityCheckpointData } from "@/hooks/use-quality-checkpoints"
import Link from "next/link"

export function CreateQualityCheckpointForm() {
  const router = useRouter()
  const { createCheckpoint, loading } = useQualityCheckpointMutations()
  const [photos, setPhotos] = useState<string[]>([])
  
  const [formData, setFormData] = useState<CreateQualityCheckpointData>({
    batchId: "",
    productionPlanId: "",
    checkpointType: "RAW_MATERIAL",
    checkedBy: "user-1", // This should come from current user context
    status: "PENDING",
    temperature: undefined,
    visualInspection: "",
    tasteTest: "",
    textureEvaluation: "",
    correctiveAction: "",
    photos: [],
    metrics: {},
    notes: ""
  })

  const checkpointTypes = [
    { value: "RAW_MATERIAL", label: "Bahan Baku", icon: Package },
    { value: "PRODUCTION", label: "Produksi", icon: Settings },
    { value: "PACKAGING", label: "Kemasan", icon: Shield },
    { value: "DISTRIBUTION", label: "Distribusi", icon: Truck }
  ]

  const statusOptions = [
    { value: "PASS", label: "Lulus", icon: CheckCircle, color: "text-green-600" },
    { value: "FAIL", label: "Gagal", icon: XCircle, color: "text-red-600" },
    { value: "CONDITIONAL", label: "Bersyarat", icon: AlertTriangle, color: "text-yellow-600" },
    { value: "PENDING", label: "Menunggu", icon: Clock, color: "text-gray-600" },
    { value: "REWORK_REQUIRED", label: "Perlu Rework", icon: AlertTriangle, color: "text-orange-600" }
  ]

  // Mock data untuk batches dan production plans
  const batches = [
    { value: "batch-1", label: "Batch Produksi #2024-001" },
    { value: "batch-2", label: "Batch Produksi #2024-002" },
    { value: "batch-3", label: "Batch Produksi #2024-003" },
    { value: "batch-4", label: "Batch Produksi #2024-004" }
  ]

  const productionPlans = [
    { value: "plan-1", label: "Menu Sekolah Senin" },
    { value: "plan-2", label: "Menu Sekolah Selasa" },
    { value: "plan-3", label: "Menu Sekolah Rabu" },
    { value: "plan-4", label: "Menu Sekolah Kamis" }
  ]

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

    try {
      const submitData = {
        ...formData,
        photos,
        batchId: formData.batchId && formData.batchId !== "NONE" ? formData.batchId : undefined,
        productionPlanId: formData.productionPlanId && formData.productionPlanId !== "NONE" ? formData.productionPlanId : undefined,
      }

      await createCheckpoint(submitData)
      router.push("/dashboard/quality-checkpoints")
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const newPhoto = `photo_${Date.now()}.jpg`
    setPhotos(prev => [...prev, newPhoto])
    setFormData(prev => ({ ...prev, photos: [...photos, newPhoto] }))
    toast.success("Foto berhasil ditambahkan")
  }

  const handlePhotoRemove = (index: number) => {
    const updatedPhotos = [...photos]
    updatedPhotos.splice(index, 1)
    setPhotos(updatedPhotos)
    setFormData(prev => ({ ...prev, photos: updatedPhotos }))
    toast.success("Foto berhasil dihapus")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/quality-checkpoints">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tambah Quality Checkpoint
          </h1>
          <p className="text-muted-foreground">
            Buat checkpoint kualitas baru untuk monitoring produksi
          </p>
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
                      value={formData.checkpointType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, checkpointType: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe checkpoint" />
                      </SelectTrigger>
                      <SelectContent>
                        {checkpointTypes.map((type) => {
                          const Icon = type.icon
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => {
                          const Icon = status.icon
                          return (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${status.color}`} />
                                {status.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="batchId">Batch Produksi</Label>
                    <Select 
                      value={formData.batchId || ""} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, batchId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih batch produksi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">Tidak ada batch</SelectItem>
                        {batches.map((batch) => (
                          <SelectItem key={batch.value} value={batch.value}>
                            {batch.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productionPlanId">Rencana Produksi</Label>
                    <Select 
                      value={formData.productionPlanId || ""} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, productionPlanId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih rencana produksi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">Tidak ada rencana</SelectItem>
                        {productionPlans.map((plan) => (
                          <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
                          </SelectItem>
                        ))}
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
                <CardTitle>Detail Inspeksi</CardTitle>
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
                              [field.key]: e.target.value ? parseFloat(e.target.value) : 0
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
                {photos.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {photos.map((photo, index) => (
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
                  {loading ? "Menyimpan..." : "Simpan Checkpoint"}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/quality-checkpoints">
                    Batal
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipe</span>
                  <Badge variant="secondary">
                    {checkpointTypes.find(t => t.value === formData.checkpointType)?.label || "Belum dipilih"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge>
                    {statusOptions.find(s => s.value === formData.status)?.label || "Belum dipilih"}
                  </Badge>
                </div>
                {formData.temperature && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Suhu</span>
                    <span className="text-sm font-medium">{formData.temperature}°C</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Foto</span>
                  <span className="text-sm font-medium">{photos.length}</span>
                </div>
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
                  • Minimal satu foto dokumentasi direkomendasikan
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
