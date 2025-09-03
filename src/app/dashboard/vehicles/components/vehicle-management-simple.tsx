'use client'

import { useState } from 'react'
import { Plus, RefreshCw, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useVehicles } from '@/hooks/use-vehicles'
import { useResponsive } from '@/hooks/use-responsive'
import { useRouter } from 'next/navigation'

// Simple placeholder components until we create the full components
const VehicleStatsCards = ({ stats }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Kendaraan</CardTitle>
        <Truck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.total}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Aktif</CardTitle>
        <div className="h-4 w-4 rounded-full bg-green-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.active}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
        <div className="h-4 w-4 rounded-full bg-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.maintenance}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tidak Aktif</CardTitle>
        <div className="h-4 w-4 rounded-full bg-red-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.inactive}</div>
      </CardContent>
    </Card>
  </div>
)

const VehicleTableView = ({ vehicles, loading }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Daftar Kendaraan</CardTitle>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="flex justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {vehicles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada data kendaraan
            </p>
          ) : (
            vehicles.map((vehicle: any) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{vehicle.plate}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                </div>
                <Badge variant={vehicle.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {vehicle.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      )}
    </CardContent>
  </Card>
)

export function VehicleManagement() {
  const router = useRouter()
  const { isMobile } = useResponsive()
  const { vehicles, loading, stats, refreshVehicles } = useVehicles()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Kendaraan</h1>
          <p className="text-muted-foreground">
            Kelola semua kendaraan untuk distribusi makanan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshVehicles}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => router.push('/dashboard/vehicles/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kendaraan
          </Button>
        </div>
      </div>

      <VehicleStatsCards stats={stats} />
      
      <VehicleTableView vehicles={vehicles} loading={loading} />
    </div>
  )
}
