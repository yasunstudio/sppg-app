'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, Activity, Package, BarChart3 } from 'lucide-react'
import type { VehicleStats } from '../utils/vehicle-types'
import { formatCapacity } from '../utils/vehicle-formatters'

interface VehicleStatsCardsProps {
  stats: VehicleStats | null
  loading?: boolean
}

export function VehicleStatsCards({ stats, loading = false }: VehicleStatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded w-20" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-muted rounded w-16 mb-1" />
              <div className="h-3 bg-muted rounded w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Vehicles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Kendaraan</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVehicles}</div>
          <p className="text-xs text-muted-foreground">
            Semua kendaraan terdaftar
          </p>
        </CardContent>
      </Card>

      {/* Active Vehicles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kendaraan Aktif</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeVehicles}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalVehicles > 0 
              ? `${Math.round((stats.activeVehicles / stats.totalVehicles) * 100)}% dari total`
              : 'Tidak ada data'
            }
          </p>
        </CardContent>
      </Card>

      {/* Total Capacity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Kapasitas</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCapacity(stats.totalCapacity)} kg
          </div>
          <p className="text-xs text-muted-foreground">
            Rata-rata: {formatCapacity(stats.averageCapacity)} kg
          </p>
        </CardContent>
      </Card>

      {/* Total Deliveries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pengiriman</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
          <p className="text-xs text-muted-foreground">
            Semua waktu
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
