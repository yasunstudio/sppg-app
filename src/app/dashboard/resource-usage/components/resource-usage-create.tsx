"use client"

import { useState, useEffect } from "react"
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
import { ArrowLeft, Save, Clock } from "lucide-react"
import { toast } from "sonner"

interface ProductionBatch {
  id: string
  batchNumber: string
  status: string
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

interface ProductionResource {
  id: string
  name: string
  type: string
  capacityPerHour?: number
  location?: string
  status: string
}

export function ResourceUsageCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [batches, setBatches] = useState<ProductionBatch[]>([])
  const [resources, setResources] = useState<ProductionResource[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    batchId: '',
    resourceId: '',
    startTime: '',
    endTime: '',
    plannedDuration: '',
    actualDuration: '',
    efficiency: '',
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoadingData(true)
      
      // Fetch production batches
      const batchesResponse = await fetch('/api/production-batches')
      if (batchesResponse.ok) {
        const batchesData = await batchesResponse.json()
        setBatches(batchesData.data || [])
      }

      // Fetch production resources
      const resourcesResponse = await fetch('/api/production-resources')
      if (resourcesResponse.ok) {
        const resourcesData = await resourcesResponse.json()
        setResources(resourcesData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Gagal memuat data')
    } finally {
      setLoadingData(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-calculate efficiency if both durations are provided
    if ((field === 'plannedDuration' || field === 'actualDuration') && 
        formData.plannedDuration && formData.actualDuration) {
      const planned = field === 'plannedDuration' ? Number(value) : Number(formData.plannedDuration)
      const actual = field === 'actualDuration' ? Number(value) : Number(formData.actualDuration)
      
      if (planned > 0 && actual > 0) {
        const efficiency = (planned / actual) * 100
        setFormData(prev => ({
          ...prev,
          [field]: value,
          efficiency: efficiency.toFixed(1)
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.batchId || !formData.resourceId || !formData.startTime || !formData.plannedDuration) {
      toast.error('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    try {
      setLoading(true)

      const requestData = {
        batchId: formData.batchId,
        resourceId: formData.resourceId,
        startTime: new Date(formData.startTime).toISOString(),
        ...(formData.endTime && { endTime: new Date(formData.endTime).toISOString() }),
        plannedDuration: Number(formData.plannedDuration),
        ...(formData.actualDuration && { actualDuration: Number(formData.actualDuration) }),
        ...(formData.efficiency && { efficiency: Number(formData.efficiency) }),
        ...(formData.notes && { notes: formData.notes })
      }

      const response = await fetch('/api/resource-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create resource usage')
      }

      toast.success('Resource usage berhasil dibuat')
      router.push('/dashboard/resource-usage')
    } catch (error: any) {
      console.error('Error creating resource usage:', error)
      toast.error(error.message || 'Gagal membuat resource usage')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
  }

  if (loadingData) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tambah Resource Usage</h2>
          <p className="text-muted-foreground">
            Tambah data penggunaan sumber daya produksi baru
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>
              Pilih production batch dan resource yang akan digunakan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchId">Production Batch <span className="text-red-500">*</span></Label>
                <Select value={formData.batchId} onValueChange={(value) => handleInputChange('batchId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih production batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{batch.batchNumber}</span>
                          <span className="text-sm text-muted-foreground">
                            {batch.productionPlan.menu?.name} - {batch.productionPlan.targetPortions} porsi
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resourceId">Production Resource <span className="text-red-500">*</span></Label>
                <Select value={formData.resourceId} onValueChange={(value) => handleInputChange('resourceId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih resource" />
                  </SelectTrigger>
                  <SelectContent>
                    {resources.map((resource) => (
                      <SelectItem key={resource.id} value={resource.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{resource.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {resource.type} {resource.location && `- ${resource.location}`}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waktu Penggunaan</CardTitle>
            <CardDescription>
              Atur waktu mulai dan selesai penggunaan resource
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Waktu Mulai <span className="text-red-500">*</span></Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  max={getCurrentDateTime()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Waktu Selesai</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  min={formData.startTime}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Durasi & Efisiensi</CardTitle>
            <CardDescription>
              Masukkan durasi yang direncanakan dan aktual (dalam menit)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plannedDuration">Durasi Rencana (menit) <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="plannedDuration"
                    type="number"
                    min="1"
                    value={formData.plannedDuration}
                    onChange={(e) => handleInputChange('plannedDuration', e.target.value)}
                    placeholder="e.g., 120"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actualDuration">Durasi Aktual (menit)</Label>
                <div className="relative">
                  <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="actualDuration"
                    type="number"
                    min="1"
                    value={formData.actualDuration}
                    onChange={(e) => handleInputChange('actualDuration', e.target.value)}
                    placeholder="e.g., 110"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="efficiency">Efisiensi (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.efficiency}
                  onChange={(e) => handleInputChange('efficiency', e.target.value)}
                  placeholder="Auto-calculated"
                  readOnly={!!(formData.plannedDuration && formData.actualDuration)}
                />
              </div>
            </div>

            {formData.plannedDuration && formData.actualDuration && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Perhitungan:</strong> Efisiensi = (Durasi Rencana ÷ Durasi Aktual) × 100%
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  ({formData.plannedDuration} ÷ {formData.actualDuration}) × 100% = {formData.efficiency}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catatan Tambahan</CardTitle>
            <CardDescription>
              Tambahkan catatan atau observasi selama penggunaan resource
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Masukkan catatan penggunaan resource..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Resource Usage
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
