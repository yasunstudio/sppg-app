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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Back Button */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 shrink-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg shrink-0">
            <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{vehicle.plateNumber}</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Detail Kendaraan</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kendaraan</CardTitle>
              <CardDescription>
                Detail lengkap dan spesifikasi kendaraan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Nomor Plat</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{vehicle.plateNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <Truck className="h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kendaraan</p>
                      <Badge 
                        variant="outline" 
                        className={typeColors[vehicle.type as keyof typeof typeColors] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"}
                      >
                        {vehicle.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <Package className="h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Kapasitas</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{vehicle.capacity} kg</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <CircleCheck className="h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
                      <Badge 
                        variant="outline" 
                        className={vehicle.isActive ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700" : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700"}
                      >
                        {vehicle.isActive ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <Timer className="h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Servis Terakhir</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {vehicle.lastService ? formatDateShort(vehicle.lastService) : "Belum ada data"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Terdaftar</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatDateShort(vehicle.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {vehicle.notes && (
                <>
                  <Separator />
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Catatan</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{vehicle.notes}</p>
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100"></div>
                </div>
              ) : recentDeliveries.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Belum Ada Riwayat Pengiriman</h3>
                  <p className="text-gray-600 dark:text-gray-400">Kendaraan ini belum pernah melakukan pengiriman.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
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
                                className={statusColors[delivery.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"}
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
                                <span className="text-sm text-muted-foreground truncate max-w-[200px]">{delivery.school.address}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {recentDeliveries.map((delivery) => (
                      <div key={delivery.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{formatDateShort(delivery.deliveryDate)}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{delivery.school.name}</h4>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={statusColors[delivery.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"}
                          >
                            {statusTranslations[delivery.status as keyof typeof statusTranslations] || delivery.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Porsi:</span>
                            <span className="ml-2 font-medium">{delivery.portionsDelivered || 0} porsi</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <span className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{delivery.school.address}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Pengiriman</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{vehicle._count.deliveries}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">pengiriman selesai</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400 shrink-0" />
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Distribusi</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{vehicle._count.distributions}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">distribusi dilakukan</p>
                  </div>
                  <Package className="h-8 w-8 text-green-600 dark:text-green-400 shrink-0" />
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Kapasitas Maksimal</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{vehicle.capacity}</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">kilogram</p>
                  </div>
                  <Truck className="h-8 w-8 text-orange-600 dark:text-orange-400 shrink-0" />
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
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">ID Kendaraan</span>
                <span className="text-sm font-mono text-gray-900 dark:text-gray-100">{vehicle.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Dibuat</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{formatDate(vehicle.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Diperbarui</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{formatDate(vehicle.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
