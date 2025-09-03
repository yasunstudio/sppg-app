'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Truck,
  Package,
  Calendar,
  Plus
} from 'lucide-react'
import type { Vehicle, VehicleType } from '../utils/vehicle-types'
import { 
  VEHICLE_TYPE_COLORS, 
  formatCapacity,
  formatPlateNumber,
  formatVehicleType
} from '../utils/vehicle-formatters'

interface VehicleGridViewProps {
  vehicles: Vehicle[]
  isFiltering: boolean
}

export function VehicleGridView({ vehicles, isFiltering }: VehicleGridViewProps) {
  const router = useRouter()

  if (vehicles.length === 0) {
    return (
      <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Truck className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Tidak ada kendaraan ditemukan</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/vehicles/create')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kendaraan Pertama
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-2">
                  <Badge className={VEHICLE_TYPE_COLORS[vehicle.type as VehicleType] || 'bg-slate-100 text-slate-800'}>
                    {formatVehicleType(vehicle.type as VehicleType)}
                  </Badge>
                  <Badge variant={vehicle.isActive ? 'default' : 'secondary'}>
                    {vehicle.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Kendaraan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {/* TODO: Delete functionality */}}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Kendaraan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatPlateNumber(vehicle.plateNumber)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatCapacity(vehicle.capacity)}</span>
                </div>
                
                {vehicle.lastService && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">
                      Service: {new Date(vehicle.lastService).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                )}
                
                {vehicle.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {vehicle.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
