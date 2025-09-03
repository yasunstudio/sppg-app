"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ArrowLeft, 
  Truck,
  Package,
  CircleCheck,
  CircleX,
  Calendar,
  FileText,
  Activity,
  MapPin,
  Timer,
  AlertTriangle
} from "lucide-react"
import { toast } from "sonner"

interface Vehicle {
  id: string
  plateNumber: string
  type: string
  capacity: number
  isActive: boolean
  lastService?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  _count: {
    distributions: number
    deliveries: number
  }
}

interface Delivery {
  id: string
  deliveryDate: string
  status: string
  school: {
    id: string
    name: string
    address: string
  }
  portionsDelivered?: number
  notes?: string
  distributionId: string
}

const typeColors = {
  "Truck": "bg-blue-100 text-blue-800 border-blue-200",
  "Van": "bg-green-100 text-green-800 border-green-200",
  "Pickup": "bg-orange-100 text-orange-800 border-orange-200",
  "Motorcycle": "bg-purple-100 text-purple-800 border-purple-200",
  "Car": "bg-pink-100 text-pink-800 border-pink-200",
}

const statusColors = {
  "PENDING": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "IN_TRANSIT": "bg-blue-100 text-blue-800 border-blue-200",
  "DELIVERED": "bg-green-100 text-green-800 border-green-200",
  "FAILED": "bg-red-100 text-red-800 border-red-200",
  "CANCELLED": "bg-gray-100 text-gray-800 border-gray-200",
}

interface VehicleDetailsProps {
  vehicleId: string
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const formatDateShort = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString))
}

const statusTranslations = {
  "PENDING": "Menunggu",
  "IN_TRANSIT": "Dalam Perjalanan", 
  "DELIVERED": "Terkirim",
  "FAILED": "Gagal",
  "CANCELLED": "Dibatalkan"
}

export default function VehicleDetails({ vehicleId }: VehicleDetailsProps) {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeliveriesLoading, setIsDeliveriesLoading] = useState(true)

  useEffect(() => {
    fetchVehicle()
    fetchRecentDeliveries()
  }, [vehicleId])

  const fetchVehicle = async () => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch vehicle')
      }
      const result = await response.json()
      if (result.success) {
        setVehicle(result.data)
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      toast.error('Gagal memuat data kendaraan')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRecentDeliveries = async () => {
    try {
      setIsDeliveriesLoading(true);
      const response = await fetch(`/api/vehicles/${vehicleId}/deliveries`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch deliveries');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setRecentDeliveries(result.data);
      } else {
        console.error('Error from API:', result.error);
        setRecentDeliveries([]);
      }
    } catch (error) {
      console.error('Error fetching recent deliveries:', error);
      setRecentDeliveries([]);
    } finally {
      setIsDeliveriesLoading(false);
    }
  };

  if (isLoading || !vehicle) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{vehicle.plateNumber}</h1>
              <p className="text-gray-600">Detail Kendaraan</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={vehicle.isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
          >
            {vehicle.isActive ? "Aktif" : "Tidak Aktif"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kendaraan</CardTitle>
              <CardDescription>
                Detail lengkap dan spesifikasi kendaraan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nomor Plat</p>
                      <p className="text-lg font-semibold text-gray-900">{vehicle.plateNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Truck className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Jenis Kendaraan</p>
                      <Badge 
                        variant="outline" 
                        className={typeColors[vehicle.type as keyof typeof typeColors] || "bg-gray-100 text-gray-800 border-gray-200"}
                      >
                        {vehicle.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Package className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Kapasitas</p>
                      <p className="text-lg font-semibold text-gray-900">{vehicle.capacity} kg</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CircleCheck className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <Badge 
                        variant="outline" 
                        className={vehicle.isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
                      >
                        {vehicle.isActive ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Timer className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Servis Terakhir</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {vehicle.lastService ? formatDateShort(vehicle.lastService) : "Belum ada data"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Terdaftar</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDateShort(vehicle.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {vehicle.notes && (
                <>
                  <Separator />
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-700">Catatan</p>
                        <p className="text-sm text-blue-600 mt-1">{vehicle.notes}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pengiriman Terbaru</CardTitle>
              <CardDescription>
                10 pengiriman terakhir yang dilakukan kendaraan ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isDeliveriesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : recentDeliveries.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Riwayat Pengiriman</h3>
                  <p className="text-gray-600">Kendaraan ini belum pernah melakukan pengiriman.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Sekolah</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Porsi</TableHead>
                      <TableHead>Lokasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDateShort(delivery.deliveryDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{delivery.school.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={statusColors[delivery.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200"}
                          >
                            {statusTranslations[delivery.status as keyof typeof statusTranslations] || delivery.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{delivery.portionsDelivered || 0} porsi</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{delivery.school.address}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistik Kendaraan</CardTitle>
              <CardDescription>
                Metrik performa dan penggunaan kendaraan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Pengiriman</p>
                    <p className="text-2xl font-bold text-blue-900">{vehicle._count.deliveries}</p>
                    <p className="text-xs text-blue-600">pengiriman selesai</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Distribusi</p>
                    <p className="text-2xl font-bold text-green-900">{vehicle._count.distributions}</p>
                    <p className="text-xs text-green-600">distribusi dilakukan</p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Kapasitas Maksimal</p>
                    <p className="text-2xl font-bold text-orange-900">{vehicle.capacity}</p>
                    <p className="text-xs text-orange-600">kilogram</p>
                  </div>
                  <Truck className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Sistem</CardTitle>
              <CardDescription>
                Data teknis dan metadata kendaraan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">ID Kendaraan</span>
                <span className="text-sm font-mono text-gray-900">{vehicle.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Dibuat</span>
                <span className="text-sm text-gray-900">{formatDate(vehicle.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Diperbarui</span>
                <span className="text-sm text-gray-900">{formatDate(vehicle.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
