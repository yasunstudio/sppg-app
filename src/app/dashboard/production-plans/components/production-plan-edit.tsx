"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { ArrowLeft, Save, Calendar, Users, Clock } from "lucide-react"
import { toast } from "sonner"

interface Menu {
  id: string
  name: string
  description?: string
  mealType: string
  targetGroup: string
  totalCalories?: number
}

interface ProductionPlan {
  id: string
  planDate: string
  targetPortions: number
  menuId?: string
  kitchenId?: string
  status: string
  plannedStartTime?: string
  plannedEndTime?: string
  actualStartTime?: string
  actualEndTime?: string
  notes?: string
}

export function ProductionPlanEdit() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [menus, setMenus] = useState<Menu[]>([])
  const [originalData, setOriginalData] = useState<ProductionPlan | null>(null)

  const [formData, setFormData] = useState({
    planDate: '',
    targetPortions: '',
    menuId: 'none',
    kitchenId: '',
    status: '',
    plannedStartTime: '',
    plannedEndTime: '',
    actualStartTime: '',
    actualEndTime: '',
    notes: ''
  })

  useEffect(() => {
    if (params.id) {
      fetchData()
      fetchProductionPlan(params.id as string)
    }
  }, [params.id])

  const fetchData = async () => {
    try {
      // Fetch menus
      const menusResponse = await fetch('/api/menus')
      if (menusResponse.ok) {
        const menusData = await menusResponse.json()
        setMenus(menusData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Gagal memuat data')
    }
  }

  const fetchProductionPlan = async (id: string) => {
    try {
      setLoadingData(true)
      const response = await fetch(`/api/production-plans/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch production plan')
      }

      const data: ProductionPlan = await response.json()
      setOriginalData(data)
      
      // Convert dates to local datetime-local format
      const planDate = new Date(data.planDate).toISOString().split('T')[0]
      const plannedStartTime = data.plannedStartTime ? new Date(data.plannedStartTime).toISOString().slice(0, 16) : ''
      const plannedEndTime = data.plannedEndTime ? new Date(data.plannedEndTime).toISOString().slice(0, 16) : ''
      const actualStartTime = data.actualStartTime ? new Date(data.actualStartTime).toISOString().slice(0, 16) : ''
      const actualEndTime = data.actualEndTime ? new Date(data.actualEndTime).toISOString().slice(0, 16) : ''

      setFormData({
        planDate,
        targetPortions: data.targetPortions.toString(),
        menuId: data.menuId || 'none',
        kitchenId: data.kitchenId || '',
        status: data.status,
        plannedStartTime,
        plannedEndTime,
        actualStartTime,
        actualEndTime,
        notes: data.notes || ''
      })
    } catch (error) {
      console.error('Error fetching production plan:', error)
      toast.error('Gagal memuat data production plan')
      router.push('/dashboard/production-plans')
    } finally {
      setLoadingData(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.planDate || !formData.targetPortions) {
      toast.error('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    if (Number(formData.targetPortions) <= 0) {
      toast.error('Target porsi harus lebih dari 0')
      return
    }

    try {
      setLoading(true)

      const requestData = {
        planDate: new Date(formData.planDate).toISOString(),
        targetPortions: Number(formData.targetPortions),
        menuId: formData.menuId === 'none' ? null : formData.menuId,
        kitchenId: formData.kitchenId || null,
        status: formData.status,
        ...(formData.plannedStartTime && { plannedStartTime: new Date(formData.plannedStartTime).toISOString() }),
        ...(formData.plannedEndTime && { plannedEndTime: new Date(formData.plannedEndTime).toISOString() }),
        ...(formData.actualStartTime && { actualStartTime: new Date(formData.actualStartTime).toISOString() }),
        ...(formData.actualEndTime && { actualEndTime: new Date(formData.actualEndTime).toISOString() }),
        notes: formData.notes || null
      }

      const response = await fetch(`/api/production-plans/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update production plan')
      }

      toast.success('Production plan berhasil diperbarui')
      router.push(`/dashboard/production-plans/${params.id}`)
    } catch (error: any) {
      console.error('Error updating production plan:', error)
      toast.error(error.message || 'Gagal memperbarui production plan')
    } finally {
      setLoading(false)
    }
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

  if (!originalData) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center py-8">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Production plan not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Data production plan yang dicari tidak ditemukan.
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Production Plan</h2>
          <p className="text-muted-foreground">
            Perbarui data rencana produksi makanan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>
              Perbarui informasi dasar rencana produksi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="planDate">Tanggal Rencana <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="planDate"
                    type="date"
                    value={formData.planDate}
                    onChange={(e) => handleInputChange('planDate', e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetPortions">Target Porsi <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="targetPortions"
                    type="number"
                    min="1"
                    value={formData.targetPortions}
                    onChange={(e) => handleInputChange('targetPortions', e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="menuId">Menu</Label>
                <Select value={formData.menuId} onValueChange={(value) => handleInputChange('menuId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih menu (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada menu</SelectItem>
                    {menus.map((menu) => (
                      <SelectItem key={menu.id} value={menu.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{menu.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {menu.mealType} - {menu.targetGroup}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNED">Planned</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kitchenId">Kitchen ID</Label>
              <Input
                id="kitchenId"
                value={formData.kitchenId}
                onChange={(e) => handleInputChange('kitchenId', e.target.value)}
                placeholder="Masukkan ID dapur/kitchen"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jadwal Produksi Rencana</CardTitle>
            <CardDescription>
              Perbarui waktu produksi yang direncanakan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plannedStartTime">Waktu Mulai Rencana</Label>
                <div className="relative">
                  <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="plannedStartTime"
                    type="datetime-local"
                    value={formData.plannedStartTime}
                    onChange={(e) => handleInputChange('plannedStartTime', e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plannedEndTime">Waktu Selesai Rencana</Label>
                <div className="relative">
                  <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="plannedEndTime"
                    type="datetime-local"
                    value={formData.plannedEndTime}
                    onChange={(e) => handleInputChange('plannedEndTime', e.target.value)}
                    min={formData.plannedStartTime}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jadwal Produksi Aktual</CardTitle>
            <CardDescription>
              Perbarui waktu produksi yang sebenarnya terjadi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actualStartTime">Waktu Mulai Aktual</Label>
                <div className="relative">
                  <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="actualStartTime"
                    type="datetime-local"
                    value={formData.actualStartTime}
                    onChange={(e) => handleInputChange('actualStartTime', e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actualEndTime">Waktu Selesai Aktual</Label>
                <div className="relative">
                  <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="actualEndTime"
                    type="datetime-local"
                    value={formData.actualEndTime}
                    onChange={(e) => handleInputChange('actualEndTime', e.target.value)}
                    min={formData.actualStartTime}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Duration calculation display */}
            {formData.plannedStartTime && formData.plannedEndTime && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Durasi Rencana:</strong> {
                    Math.round((new Date(formData.plannedEndTime).getTime() - new Date(formData.plannedStartTime).getTime()) / (1000 * 60 * 60 * 100)) / 10
                  } jam
                </p>
                {formData.actualStartTime && formData.actualEndTime && (
                  <p className="text-sm text-blue-600 mt-1">
                    <strong>Durasi Aktual:</strong> {
                      Math.round((new Date(formData.actualEndTime).getTime() - new Date(formData.actualStartTime).getTime()) / (1000 * 60 * 60 * 100)) / 10
                    } jam
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catatan</CardTitle>
            <CardDescription>
              Perbarui catatan atau informasi penting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Masukkan catatan rencana produksi..."
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
                Simpan Perubahan
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
