"use client"

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
  Truck,
  Package,
  CircleCheck,
  CircleX,
  Calendar,
  FileText,
  Activity,
  MapPin,
  Timer,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { useVehicleDetails } from "./hooks/use-vehicle-details"

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
  const { 
    vehicle, 
    deliveries, 
    isLoading, 
    isDeliveriesLoading, 
    error,
    refreshVehicle 
  } = useVehicleDetails(vehicleId)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data kendaraan...</span>
      </div>
    )
  }

  // Error state
  if (error || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Kendaraan Tidak Ditemukan</h3>
          <p className="text-muted-foreground">
            {error || 'Data kendaraan tidak dapat dimuat'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refreshVehicle} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CircleCheck className="w-4 h-4 text-green-500" />
    ) : (
      <CircleX className="w-4 h-4 text-red-500" />
    )
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Aktif" : "Tidak Aktif"
  }

  const getStatusVariant = (isActive: boolean) => {
    return isActive ? "default" : "destructive"
  }

  const getDeliveryStatusBadge = (status: string) => {
    const statusColor = {
      "PENDING": "bg-yellow-100 text-yellow-800",
      "IN_TRANSIT": "bg-blue-100 text-blue-800",
      "DELIVERED": "bg-green-100 text-green-800",
      "FAILED": "bg-red-100 text-red-800",
      "CANCELLED": "bg-gray-100 text-gray-800"
    }[status] || "bg-gray-100 text-gray-800"

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
        {statusTranslations[status as keyof typeof statusTranslations] || status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <CardTitle>Informasi Kendaraan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nomor Plat</p>
                    <p className="text-lg font-semibold">{vehicle.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Jenis Kendaraan</p>
                    <p className="text-sm">{vehicle.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Kapasitas</p>
                    <p className="text-sm">{vehicle.capacity} kg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(vehicle.isActive)}
                      <Badge variant={getStatusVariant(vehicle.isActive)}>
                        {getStatusText(vehicle.isActive)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  {vehicle.brand && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Merek</p>
                      <p className="text-sm">{vehicle.brand}</p>
                    </div>
                  )}
                  {vehicle.model && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Model</p>
                      <p className="text-sm">{vehicle.model}</p>
                    </div>
                  )}
                  {vehicle.year && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tahun</p>
                      <p className="text-sm">{vehicle.year}</p>
                    </div>
                  )}
                  {vehicle.fuelType && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Jenis Bahan Bakar</p>
                      <p className="text-sm">{vehicle.fuelType}</p>
                    </div>
                  )}
                </div>
              </div>

              {vehicle.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Catatan</p>
                    <p className="text-sm">{vehicle.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <CardTitle>Informasi Service & Maintenance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {vehicle.lastService && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Terakhir Service</p>
                      <p className="text-sm">{formatDateShort(vehicle.lastService)}</p>
                    </div>
                  )}
                  {vehicle.nextService && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Service Berikutnya</p>
                      <p className="text-sm">{formatDateShort(vehicle.nextService)}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {vehicle.mileage !== undefined && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Kilometer</p>
                      <p className="text-sm">{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <CardTitle>Informasi Dokumen</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {vehicle.insuranceExpiry && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Masa Berlaku Asuransi</p>
                      <p className="text-sm">{formatDateShort(vehicle.insuranceExpiry)}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {vehicle.registrationExpiry && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Masa Berlaku STNK</p>
                      <p className="text-sm">{formatDateShort(vehicle.registrationExpiry)}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dibuat</p>
                <p className="text-sm">{formatDate(vehicle.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</p>
                <p className="text-sm">{formatDate(vehicle.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Deliveries */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <CardTitle>Pengiriman Terbaru</CardTitle>
              </div>
              <CardDescription>
                5 pengiriman terakhir menggunakan kendaraan ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isDeliveriesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2 text-sm">Memuat data pengiriman...</span>
                </div>
              ) : deliveries.length > 0 ? (
                <div className="space-y-4">
                  {deliveries.slice(0, 5).map((delivery) => (
                    <div key={delivery.id} className="border-l-2 border-blue-200 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{delivery.school?.name || 'N/A'}</p>
                        {getDeliveryStatusBadge(delivery.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDateShort(delivery.deliveryDate)}
                      </p>
                      {delivery.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {delivery.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Belum ada data pengiriman
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
