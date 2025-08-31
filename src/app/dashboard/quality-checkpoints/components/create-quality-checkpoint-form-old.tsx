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
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
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
    temperature: "",
    visualInspection: "",
    tasteTest: "",
    textureEvaluation: "",
    correctiveAction: "",
    notes: "",
    metrics: {
      quality: "",
      hygiene: "",
      freshness: "",
      taste: "",
      appearance: "",
      texture: "",
      temperature: "",
      packaging_integrity: "",
      seal_quality: "",
      labeling: "",
      temperature_compliance: "",
      packaging_condition: "",
      delivery_time: ""
    }
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
    { value: "plan-4", label: "Menu Sekolah Kamis" },
    { value: "plan-5", label: "Menu Sekolah Jumat" }
  ]

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('metrics.')) {
      const metricField = field.replace('metrics.', '')
      setFormData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          [metricField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handlePhotoAdd = () => {
    // Mock photo upload
    const newPhotoId = `photo_${Date.now()}.jpg`
    setPhotos(prev => [...prev, newPhotoId])
    toast.success("Foto berhasil ditambahkan")
  }

  const handlePhotoRemove = (photo: string) => {
    setPhotos(prev => prev.filter(p => p !== photo))
  }

  const getMetricsFields = () => {
    switch (formData.checkpointType) {
      case "RAW_MATERIAL":
        return [
          { key: "freshness", label: "Kesegaran (1-10)" },
          { key: "quality", label: "Kualitas (1-10)" },
          { key: "hygiene", label: "Kebersihan (1-10)" }
        ]
      case "PRODUCTION":
        return [
          { key: "temperature", label: "Suhu (1-10)" },
          { key: "taste", label: "Rasa (1-10)" },
          { key: "appearance", label: "Penampilan (1-10)" },
          { key: "texture", label: "Tekstur (1-10)" }
        ]
      case "PACKAGING":
        return [
          { key: "packaging_integrity", label: "Integritas Kemasan (1-10)" },
          { key: "seal_quality", label: "Kualitas Segel (1-10)" },
          { key: "labeling", label: "Label (1-10)" }
        ]
      case "DISTRIBUTION":
        return [
          { key: "temperature_compliance", label: "Kepatuhan Suhu (1-10)" },
          { key: "packaging_condition", label: "Kondisi Kemasan (1-10)" },
          { key: "delivery_time", label: "Ketepatan Waktu (1-10)" }
        ]
      default:
        return []
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.checkpointType || !formData.status) {
      toast.error("Harap lengkapi field yang wajib diisi")
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const checkpointData = {
        ...formData,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        photos,
        metrics: Object.fromEntries(
          Object.entries(formData.metrics).filter(([_, value]) => value !== "")
        ),
        checkedAt: new Date().toISOString()
      }
      
      console.log("Creating checkpoint:", checkpointData)
      
      toast.success("Quality checkpoint berhasil ditambahkan")
      router.push("/dashboard/quality-checkpoints")
    } catch (error) {
      toast.error("Gagal menambahkan checkpoint")
      console.error("Create checkpoint error:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedType = checkpointTypes.find(t => t.value === formData.checkpointType)
  const selectedStatus = statusOptions.find(s => s.value === formData.status)
  const metricsFields = getMetricsFields()

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
            <h1 className="text-3xl font-bold tracking-tight">Tambah Quality Checkpoint</h1>
            <p className="text-muted-foreground">
              Buat checkpoint kualitas baru untuk produksi
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Informasi Dasar
                </CardTitle>
                <CardDescription>
                  Informasi umum tentang checkpoint kualitas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="checkpointType">
                      Tipe Checkpoint <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.checkpointType} onValueChange={(value) => handleInputChange("checkpointType", value)}>
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
                    <Label htmlFor="status">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
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
                    <Select value={formData.batchId} onValueChange={(value) => handleInputChange("batchId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih batch (opsional)" />
                      </SelectTrigger>
                      <SelectContent>
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
                    <Select value={formData.productionPlanId} onValueChange={(value) => handleInputChange("productionPlanId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih rencana (opsional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {productionPlans.map((plan) => (
                          <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.checkpointType && (
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Suhu (°C)</Label>
                    <div className="relative">
                      <Thermometer className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="temperature"
                        type="number"
                        value={formData.temperature}
                        onChange={(e) => handleInputChange("temperature", e.target.value)}
                        placeholder="Masukkan suhu jika diperlukan"
                        className="pl-8"
                        step="0.1"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Inspection Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Detail Inspeksi
                </CardTitle>
                <CardDescription>
                  Hasil pemeriksaan dan evaluasi kualitas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visualInspection">Inspeksi Visual</Label>
                  <Textarea
                    id="visualInspection"
                    value={formData.visualInspection}
                    onChange={(e) => handleInputChange("visualInspection", e.target.value)}
                    placeholder="Deskripsi hasil inspeksi visual..."
                    rows={3}
                  />
                </div>

                {(formData.checkpointType === "PRODUCTION") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="tasteTest">Tes Rasa</Label>
                      <Textarea
                        id="tasteTest"
                        value={formData.tasteTest}
                        onChange={(e) => handleInputChange("tasteTest", e.target.value)}
                        placeholder="Hasil tes rasa dan bumbu..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="textureEvaluation">Evaluasi Tekstur</Label>
                      <Textarea
                        id="textureEvaluation"
                        value={formData.textureEvaluation}
                        onChange={(e) => handleInputChange("textureEvaluation", e.target.value)}
                        placeholder="Evaluasi tekstur makanan..."
                        rows={2}
                      />
                    </div>
                  </>
                )}

                {(formData.status === "FAIL" || formData.status === "CONDITIONAL" || formData.status === "REWORK_REQUIRED") && (
                  <div className="space-y-2">
                    <Label htmlFor="correctiveAction">Tindakan Perbaikan</Label>
                    <Textarea
                      id="correctiveAction"
                      value={formData.correctiveAction}
                      onChange={(e) => handleInputChange("correctiveAction", e.target.value)}
                      placeholder="Tindakan perbaikan yang diperlukan..."
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Tambahan</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Catatan atau komentar tambahan..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Metrics */}
            {metricsFields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Metrik Kualitas</CardTitle>
                  <CardDescription>
                    Penilaian kuantitatif untuk {selectedType?.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {metricsFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
                        <Input
                          id={field.key}
                          type="number"
                          value={formData.metrics[field.key as keyof typeof formData.metrics]}
                          onChange={(e) => handleInputChange(`metrics.${field.key}`, e.target.value)}
                          placeholder="1-10"
                          min="1"
                          max="10"
                          step="0.1"
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
                <CardDescription>
                  Upload foto sebagai bukti checkpoint
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="button" variant="outline" onClick={handlePhotoAdd} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Tambah Foto
                </Button>
                
                {photos.length > 0 && (
                  <div className="grid gap-2 md:grid-cols-3">
                    {photos.map((photo, index) => (
                      <div key={photo} className="relative bg-gray-100 rounded-lg p-4 text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Foto {index + 1}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={() => handlePhotoRemove(photo)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Ringkasan checkpoint yang akan dibuat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedType && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tipe</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <selectedType.icon className="h-4 w-4" />
                      <span>{selectedType.label}</span>
                    </div>
                  </div>
                )}
                
                {selectedStatus && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <selectedStatus.icon className={`h-4 w-4 ${selectedStatus.color}`} />
                      <span>{selectedStatus.label}</span>
                    </div>
                  </div>
                )}

                {formData.temperature && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Suhu</Label>
                    <p className="mt-1">{formData.temperature}°C</p>
                  </div>
                )}

                {photos.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Foto</Label>
                    <p className="mt-1">{photos.length} foto dilampirkan</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Checkpoint
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild className="w-full">
                    <Link href="/dashboard/quality-checkpoints">
                      Batal
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
