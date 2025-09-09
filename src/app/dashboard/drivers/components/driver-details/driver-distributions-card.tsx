'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  Clock,
  MapPin,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users
} from "lucide-react"
import { useDriverDistributions } from "../hooks/use-driver-distributions"

interface DriverDistributionsCardProps {
  driverId: string
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString))
}

const formatDateShort = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString))
}

const getDistributionStatusBadge = (status: string) => {
  const statusConfig = {
    "PREPARING": {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
      text: "Persiapan"
    },
    "IN_PROGRESS": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Truck,
      text: "Dalam Perjalanan"
    },
    "COMPLETED": {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      text: "Selesai"
    },
    "CANCELLED": {
      color: "bg-red-100 text-red-800 border-red-200",
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

const DistributionItem = ({ distribution }: { distribution: any }) => {
  const progressPercentage = distribution.stats.totalDeliveries > 0 
    ? Math.round((distribution.stats.completedDeliveries / distribution.stats.totalDeliveries) * 100)
    : 0

  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{formatDateShort(distribution.distributionDate)}</span>
        </div>
        {getDistributionStatusBadge(distribution.status)}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress Pengiriman</span>
          <span className="font-medium">{distribution.stats.completedDeliveries}/{distribution.stats.totalDeliveries}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground text-right">
          {progressPercentage}% selesai
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{distribution.totalPortions}</div>
            <div className="text-muted-foreground text-xs">Target Porsi</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{distribution.stats.totalDeliveredPortions}</div>
            <div className="text-muted-foreground text-xs">Porsi Terkirim</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{distribution.stats.totalSchools}</div>
            <div className="text-muted-foreground text-xs">Sekolah</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{distribution.vehicle?.plateNumber || 'N/A'}</div>
            <div className="text-muted-foreground text-xs">Kendaraan</div>
          </div>
        </div>
      </div>

      {/* Duration */}
      {(distribution.estimatedDuration || distribution.actualDuration) && (
        <>
          <Separator />
          <div className="flex justify-between text-sm">
            {distribution.estimatedDuration && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Est: {distribution.estimatedDuration} menit</span>
              </div>
            )}
            {distribution.actualDuration && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Aktual: {distribution.actualDuration} menit</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Notes */}
      {distribution.notes && (
        <>
          <Separator />
          <p className="text-xs text-muted-foreground">{distribution.notes}</p>
        </>
      )}
    </div>
  )
}

export function DriverDistributionsCard({ driverId }: DriverDistributionsCardProps) {
  const { distributions, isLoading, error, refreshDistributions } = useDriverDistributions(driverId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <CardTitle>Rencana Distribusi</CardTitle>
        </div>
        <CardDescription>
          Rencana distribusi yang ditangani driver ini
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm">Memuat data distribusi...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 mb-2">Gagal memuat data distribusi</p>
            <Button variant="outline" size="sm" onClick={refreshDistributions}>
              Coba Lagi
            </Button>
          </div>
        ) : distributions.length > 0 ? (
          <div className="space-y-4">
            {distributions.slice(0, 3).map((distribution) => (
              <DistributionItem key={distribution.id} distribution={distribution} />
            ))}
            {distributions.length > 3 && (
              <div className="text-center pt-2">
                <Button variant="link" size="sm">
                  Lihat {distributions.length - 3} distribusi lainnya
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Belum ada rencana distribusi
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
