'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Vehicle {
  id: string
  plateNumber: string
  type: string
  capacity: number
  isActive: boolean
  lastService?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface EditVehicleProps {
  vehicleId: string
}

export function EditVehicle({ vehicleId }: EditVehicleProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    capacity: 0,
    isActive: true,
    lastService: '',
    notes: ''
  })

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetails()
    }
  }, [vehicleId])

  const fetchVehicleDetails = async () => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const vehicleData = result.data
          setVehicle(vehicleData)
          setFormData({
            plateNumber: vehicleData.plateNumber || '',
            type: vehicleData.type || '',
            capacity: vehicleData.capacity || 0,
            isActive: vehicleData.isActive ?? true,
            lastService: vehicleData.lastService 
              ? new Date(vehicleData.lastService).toISOString().split('T')[0] 
              : '',
            notes: vehicleData.notes || ''
          })
        } else {
          toast.error('Kendaraan tidak ditemukan')
          router.push('/dashboard/vehicles')
        }
      } else {
        toast.error('Gagal memuat detail kendaraan')
        router.push('/dashboard/vehicles')
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      toast.error('Gagal memuat detail kendaraan')
      router.push('/dashboard/vehicles')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.plateNumber || !formData.type) {
      toast.error('Mohon isi semua field yang wajib')
      return
    }

    if (formData.capacity <= 0) {
      toast.error('Kapasitas harus lebih dari 0 kg')
      return
    }

    setSaving(true)
    try {
      const submitData = {
        plateNumber: formData.plateNumber.toUpperCase(),
        type: formData.type,
        capacity: formData.capacity,
        isActive: formData.isActive,
        lastService: formData.lastService || null,
        notes: formData.notes || null
      }

      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Kendaraan berhasil diperbarui')
        router.push(`/dashboard/vehicles/${vehicleId}`)
      } else {
        toast.error(result.error || 'Gagal memperbarui kendaraan')
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      toast.error('Gagal memperbarui kendaraan')
    } finally {
      setSaving(false)
    }
  }

  const vehicleTypes = [
    { value: 'Pickup Truck', label: 'Pickup Truck' },
    { value: 'Mini Truck', label: 'Mini Truck' },
    { value: 'Van', label: 'Van' },
    { value: 'Motorcycle', label: 'Motor' },
    { value: 'Sedan', label: 'Sedan' },
    { value: 'SUV', label: 'SUV' }
  ]

  const commonCapacities = [
    { value: 50, label: 'Kecil (50 kg)' },
    { value: 200, label: 'Sedang (200 kg)' },
    { value: 300, label: 'Besar (300 kg)' },
    { value: 500, label: 'Sangat Besar (500 kg)' },
    { value: 1000, label: 'Heavy Duty (1000+ kg)' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Memuat detail kendaraan...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Kendaraan tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Edit Kendaraan</h1>
        <p className="text-muted-foreground">Perbarui informasi dan detail kendaraan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Informasi Dasar</CardTitle>
              <CardDescription className="text-muted-foreground">Identifikasi kendaraan dan detail dasar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plateNumber" className="text-foreground">Nomor Plat *</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                  placeholder="contoh: B 1234 ABC"
                  required
                  className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground">Jenis Kendaraan *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input">
                    <SelectValue placeholder="Pilih jenis kendaraan" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover dark:bg-popover border-border dark:border-border">
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-foreground">Kapasitas (kg) *</Label>
                <Select
                  value={formData.capacity.toString()}
                  onValueChange={(value) => setFormData({ ...formData, capacity: parseInt(value) })}
                >
                  <SelectTrigger className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input">
                    <SelectValue placeholder="Pilih kapasitas" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover dark:bg-popover border-border dark:border-border">
                    {commonCapacities.map((cap) => (
                      <SelectItem key={cap.value} value={cap.value.toString()} className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">
                        {cap.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Operational Information */}
          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Informasi Operasional</CardTitle>
              <CardDescription className="text-muted-foreground">Status dan detail operasional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="isActive" className="text-foreground">Status Kendaraan</Label>
                <Select
                  value={formData.isActive.toString()}
                  onValueChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}
                >
                  <SelectTrigger className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover dark:bg-popover border-border dark:border-border">
                    <SelectItem value="true" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Aktif</SelectItem>
                    <SelectItem value="false" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastService" className="text-foreground">Tanggal Service Terakhir</Label>
                <Input
                  id="lastService"
                  type="date"
                  value={formData.lastService}
                  onChange={(e) => setFormData({ ...formData, lastService: e.target.value })}
                  className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
                />
                <p className="text-xs text-muted-foreground">Kosongkan jika belum pernah service</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card className="bg-card dark:bg-card border-border dark:border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Catatan Tambahan</CardTitle>
            <CardDescription className="text-muted-foreground">Informasi tambahan tentang kendaraan ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground">Catatan</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Masukkan catatan atau komentar tambahan tentang kendaraan ini..."
                rows={4}
                className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input placeholder:text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/dashboard/vehicles/${vehicleId}`)}
            className="w-full sm:w-auto bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input hover:bg-accent dark:hover:bg-accent"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            className="w-full sm:w-auto bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  )
}
