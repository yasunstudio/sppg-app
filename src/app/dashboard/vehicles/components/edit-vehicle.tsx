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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/vehicles/${vehicleId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Detail
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Kendaraan</h1>
            <p className="text-muted-foreground">Perbarui informasi dan detail kendaraan</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>Identifikasi kendaraan dan detail dasar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Nomor Plat *</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                  placeholder="contoh: B 1234 ABC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Jenis Kendaraan *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kendaraan" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Kapasitas (kg) *</Label>
                <div className="space-y-2">
                  <Select
                    value={formData.capacity.toString()}
                    onValueChange={(value) => setFormData({ ...formData, capacity: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kapasitas" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonCapacities.map((cap) => (
                        <SelectItem key={cap.value} value={cap.value.toString()}>
                          {cap.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    placeholder="Atau masukkan kapasitas custom"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Operasional</CardTitle>
              <CardDescription>Status dan detail operasional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="isActive">Status Kendaraan</Label>
                <Select
                  value={formData.isActive.toString()}
                  onValueChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastService">Tanggal Service Terakhir</Label>
                <Input
                  id="lastService"
                  type="date"
                  value={formData.lastService}
                  onChange={(e) => setFormData({ ...formData, lastService: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Kosongkan jika belum pernah service</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Catatan Tambahan</CardTitle>
            <CardDescription>Informasi tambahan tentang kendaraan ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Masukkan catatan atau komentar tambahan tentang kendaraan ini..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/dashboard/vehicles/${vehicleId}`)}
          >
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  )
}
