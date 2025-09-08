'use client'

import { MoreVertical, Eye, Edit, Trash2, SortAsc, SortDesc } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCapacity, formatDate, getVehicleStatusVariant, formatVehicleStatus, formatVehicleType } from '../utils/vehicle-formatters'
import type { Vehicle } from '../utils/vehicle-types'
import { useState } from 'react'

interface VehicleTableViewProps {
  vehicles: Vehicle[]
  loading?: boolean
  onView?: (vehicleId: string) => void
  onEdit?: (vehicleId: string) => void
  onDelete?: (vehicleId: string) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
}

type SortColumn = 'plateNumber' | 'type' | 'isActive' | 'capacity' | 'lastService' | 'createdAt'
type SortDirection = 'asc' | 'desc'

export function VehicleTableView({
  vehicles,
  loading,
  onView,
  onEdit,
  onDelete,
  onSort
}: VehicleTableViewProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (column: SortColumn) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(newDirection)
    onSort?.(column, newDirection)
  }

  const SortButton = ({ column, children }: { column: SortColumn; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(column)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {children}
      {sortColumn === column && (
        sortDirection === 'asc' ? 
          <SortAsc className="ml-1 h-4 w-4" /> : 
          <SortDesc className="ml-1 h-4 w-4" />
      )}
    </Button>
  )

  const LoadingSkeleton = () => (
    <TableRow>
      {[...Array(7)].map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Kendaraan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">
                  <SortButton column="plateNumber">Plat Nomor</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="type">Tipe</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="isActive">Status</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="capacity">Kapasitas</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="lastService">Service Terakhir</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="createdAt">Terdaftar</SortButton>
                </TableHead>
                <TableHead className="w-[70px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => <LoadingSkeleton key={i} />)
              ) : vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      Belum ada data kendaraan
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                    <TableCell>{formatVehicleType(vehicle.type)}</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.isActive ? 'default' : 'secondary'}>
                        {vehicle.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatCapacity(vehicle.capacity)}
                    </TableCell>
                    <TableCell>
                      {vehicle.lastService ? formatDate(vehicle.lastService) : 'Belum pernah'}
                    </TableCell>
                    <TableCell>
                      {formatDate(vehicle.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(vehicle.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(vehicle.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => onDelete(vehicle.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
