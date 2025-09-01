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

export function ProductionPlanCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [menus, setMenus] = useState<Menu[]>([])

  const [formData, setFormData] = useState({
    planDate: '',
    targetPortions: '',
    menuId: 'none',
    kitchenId: '',
    plannedStartTime: '',
    plannedEndTime: '',
    notes: ''
  })

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menus')
      if (response.ok) {
        const data = await response.json()
        setMenus(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching menus:', error)
      toast.error('Gagal memuat data menu')
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
        ...(formData.menuId && formData.menuId !== 'none' && { menuId: formData.menuId }),
        ...(formData.kitchenId && { kitchenId: formData.kitchenId }),
        ...(formData.plannedStartTime && { plannedStartTime: new Date(formData.plannedStartTime).toISOString() }),
        ...(formData.plannedEndTime && { plannedEndTime: new Date(formData.plannedEndTime).toISOString() }),
        notes: formData.notes || null
      }

      const response = await fetch('/api/production-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create production plan')
      }

      const result = await response.json()
      toast.success('Production plan berhasil dibuat')
      router.push(`/dashboard/production-plans/${result.id}`)
    } catch (error: any) {
      console.error('Error creating production plan:', error)
      toast.error(error.message || 'Gagal membuat production plan')
    } finally {
      setLoading(false)
    }
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
          <h2 className="text-3xl font-bold tracking-tight">Buat Production Plan</h2>
          <p className="text-muted-foreground">
            Buat rencana produksi makanan baru
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>
              Masukkan informasi dasar untuk rencana produksi
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
                    min={new Date().toISOString().split('T')[0]}
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
                    placeholder="e.g., 500"
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

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
                          {menu.totalCalories && ` (${menu.totalCalories} kcal)`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jadwal Produksi</CardTitle>
            <CardDescription>
              Tentukan waktu mulai dan selesai produksi yang direncanakan
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

            {formData.plannedStartTime && formData.plannedEndTime && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Durasi Rencana:</strong> {
                    Math.round((new Date(formData.plannedEndTime).getTime() - new Date(formData.plannedStartTime).getTime()) / (1000 * 60 * 60 * 100)) / 10
                  } jam
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Tambahan</CardTitle>
            <CardDescription>
              Tambahkan catatan atau informasi penting lainnya
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kitchenId">Kitchen ID</Label>
              <Input
                id="kitchenId"
                value={formData.kitchenId}
                onChange={(e) => handleInputChange('kitchenId', e.target.value)}
                placeholder="Masukkan ID dapur/kitchen"
              />
            </div>

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
                Membuat...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Buat Production Plan
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
