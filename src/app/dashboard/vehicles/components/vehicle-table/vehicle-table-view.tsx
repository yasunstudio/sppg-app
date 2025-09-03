'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

interface VehicleTableViewProps {
  vehicles: Vehicle[]
  isFiltering: boolean
}

export function VehicleTableView({ vehicles, isFiltering }: VehicleTableViewProps) {
  const router = useRouter()

  return (
    <div className={`rounded-md border transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nomor Plat</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Kapasitas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Service Terakhir</TableHead>
            <TableHead className="hidden xl:table-cell">Catatan</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm sm:text-base font-medium">
                      {formatPlateNumber(vehicle.plateNumber)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={VEHICLE_TYPE_COLORS[vehicle.type as VehicleType] || 'bg-slate-100 text-slate-800'}>
                    {formatVehicleType(vehicle.type as VehicleType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm sm:text-base">
                      {formatCapacity(vehicle.capacity)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={vehicle.isActive ? 'default' : 'secondary'}>
                    {vehicle.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {vehicle.lastService ? 
                        new Date(vehicle.lastService).toLocaleDateString('id-ID') : 
                        '-'
                      }
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                    {vehicle.notes || '-'}
                  </span>
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center py-8">
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
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
