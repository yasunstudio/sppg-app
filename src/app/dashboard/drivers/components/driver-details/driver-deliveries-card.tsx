'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MapPin,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Truck
} from "lucide-react"
import { useDriverDetails } from "../hooks/use-driver-details"

interface DriverDeliveriesCardProps {
  driverId: string
}

const formatDateShort = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString))
}

const formatTime = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const getDeliveryStatusBadge = (status: string) => {
  const statusConfig = {
    "PENDING": {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
      text: "Menunggu"
    },
    "IN_TRANSIT": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Truck,
      text: "Dalam Perjalanan"
    },
    "DELIVERED": {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      text: "Terkirim"
    },
    "FAILED": {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertCircle,
      text: "Gagal"
    },
    "CANCELLED": {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: AlertCircle,
      text: "Dibatalkan"
    }
  }[status] || {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: AlertCircle,
    text: status
  }

  const Icon = statusConfig.icon

  return (
    <Badge variant="outline" className={`${statusConfig.color} border`}>
      <Icon className="w-3 h-3 mr-1" />
      {statusConfig.text}
    </Badge>
  )
}

const DeliveryItem = ({ delivery }: { delivery: any }) => {
  return (
    <div className="border-l-4 border-blue-200 pl-4 py-3 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">{delivery.school?.name || 'N/A'}</span>
        </div>
        {getDeliveryStatusBadge(delivery.status)}
      </div>

      {/* Details */}
      <div className="space-y-1">
        {delivery.distribution?.date && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatDateShort(delivery.distribution.date)}</span>
          </div>
        )}
        
        {delivery.portionsDelivered && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Package className="w-3 h-3" />
            <span>{delivery.portionsDelivered} porsi</span>
          </div>
        )}

        {delivery.vehicle && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Truck className="w-3 h-3" />
            <span>{delivery.vehicle.plateNumber} ({delivery.vehicle.model})</span>
          </div>
        )}
      </div>

      {/* Times */}
      {(delivery.plannedTime || delivery.departureTime || delivery.arrivalTime || delivery.completionTime) && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          {delivery.plannedTime && (
            <div className="text-muted-foreground">
              <span className="font-medium">Rencana:</span> {formatTime(delivery.plannedTime)}
            </div>
          )}
          {delivery.departureTime && (
            <div className="text-muted-foreground">
              <span className="font-medium">Berangkat:</span> {formatTime(delivery.departureTime)}
            </div>
          )}
          {delivery.arrivalTime && (
            <div className="text-muted-foreground">
              <span className="font-medium">Tiba:</span> {formatTime(delivery.arrivalTime)}
            </div>
          )}
          {delivery.completionTime && (
            <div className="text-muted-foreground">
              <span className="font-medium">Selesai:</span> {formatTime(delivery.completionTime)}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {delivery.notes && (
        <p className="text-xs text-muted-foreground italic">
          {delivery.notes}
        </p>
      )}
    </div>
  )
}

export function DriverDeliveriesCard({ driverId }: DriverDeliveriesCardProps) {
  const { deliveries, isDeliveriesLoading, refreshDeliveries } = useDriverDetails(driverId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <CardTitle>Riwayat Pengiriman</CardTitle>
        </div>
        <CardDescription>
          Riwayat pengiriman terbaru oleh driver ini
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
              <DeliveryItem key={delivery.id} delivery={delivery} />
            ))}
            {deliveries.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="link" size="sm">
                  Lihat {deliveries.length - 5} pengiriman lainnya
                </Button>
              </div>
            )}
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
  )
}
