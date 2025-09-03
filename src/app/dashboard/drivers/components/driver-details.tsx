'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  ArrowLeft,
  Edit, 
  Trash2, 
  Star, 
  Phone, 
  Mail, 
  CreditCard, 
  TrendingUp,
  Truck,
  Package,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Users,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'
import type { Driver } from './utils/driver-types'
import { formatDate, formatRating, formatPhoneNumber } from './utils/driver-formatters'

interface DriverDetailsProps {
  driverId: string
}

export function DriverDetails({ driverId }: DriverDetailsProps) {
  const router = useRouter()
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(`/api/drivers/${driverId}`)
        const result = await response.json()
        
        if (result.success) {
          setDriver(result.data)
        } else {
          toast.error('Driver tidak ditemukan')
          router.push('/dashboard/drivers')
        }
      } catch (error) {
        console.error('Error fetching driver:', error)
        toast.error('Gagal memuat data driver')
      } finally {
        setLoading(false)
      }
    }

    if (driverId) {
      fetchDriver()
    }
  }, [driverId, router])

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus driver ini?')) {
      return
    }

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/drivers/${driverId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Driver berhasil dihapus')
        router.push('/dashboard/drivers')
      } else {
        toast.error('Gagal menghapus driver')
      }
    } catch (error) {
      console.error('Error deleting driver:', error)
      toast.error('Terjadi kesalahan saat menghapus driver')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detail Driver</h1>
            <p className="text-muted-foreground">Memuat informasi driver...</p>
          </div>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!driver) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Driver Tidak Ditemukan</h1>
            <p className="text-muted-foreground">Driver yang Anda cari tidak tersedia</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detail Driver</h1>
            <p className="text-muted-foreground">Informasi lengkap driver {driver.name}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/drivers/${driverId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteLoading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Driver Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg font-semibold">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{driver.name}</h3>
                  <p className="text-muted-foreground">ID: {driver.employeeId}</p>
                </div>
                <Badge variant={driver.isActive ? "default" : "secondary"}>
                  {driver.isActive ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telepon</p>
                    <p className="font-medium">{formatPhoneNumber(driver.phone)}</p>
                  </div>
                </div>
                
                {driver.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{driver.email}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nomor SIM</p>
                    <p className="font-medium">{driver.licenseNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Berakhir SIM</p>
                    <p className="font-medium">{formatDate(driver.licenseExpiry)}</p>
                  </div>
                </div>
              </div>
              
              {driver.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Alamat</p>
                    <p className="font-medium">{driver.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* License Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informasi SIM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Nomor SIM</p>
                    <p className="font-semibold">{driver.licenseNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Tanggal Berakhir</p>
                    <p className="font-semibold">{formatDate(driver.licenseExpiry)}</p>
                  </div>
                </div>
                
                {driver.licenseExpiry && (
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      {new Date(driver.licenseExpiry) < new Date() ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-600 font-medium">SIM telah berakhir</span>
                        </>
                      ) : new Date(driver.licenseExpiry).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000 ? (
                        <>
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-yellow-600 font-medium">SIM akan berakhir dalam 30 hari</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">SIM masih berlaku</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {(driver.emergencyContact || driver.emergencyPhone) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kontak Darurat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {driver.emergencyContact && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nama</p>
                        <p className="font-medium">{driver.emergencyContact}</p>
                      </div>
                    </div>
                  )}
                  
                  {driver.emergencyPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telepon</p>
                        <p className="font-medium">{formatPhoneNumber(driver.emergencyPhone)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {driver.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Catatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{driver.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Performance Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Statistik Performa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{formatRating(driver.rating ?? null)}</span>
                </div>
                <p className="text-sm text-muted-foreground">Rating Keseluruhan</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{driver.totalDeliveries || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Pengiriman</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/dashboard/drivers/${driverId}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Driver
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/dashboard/deliveries?driver=${driverId}`)}
              >
                <Truck className="h-4 w-4 mr-2" />
                Lihat Pengiriman
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`tel:${driver.phone}`, '_self')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Hubungi Driver
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
