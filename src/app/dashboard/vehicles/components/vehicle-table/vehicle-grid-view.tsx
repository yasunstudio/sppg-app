'use client'

import { MoreVertical, Eye, Edit, Trash2, Calendar, User } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { formatCapacity, formatDate, getVehicleStatusVariant } from '../utils/vehicle-formatters'
import type { Vehicle } from '../utils/vehicle-types'

interface VehicleGridViewProps {
  vehicles: Vehicle[]
  loading?: boolean
  onView?: (vehicleId: string) => void
  onEdit?: (vehicleId: string) => void
  onDelete?: (vehicleId: string) => void
}

export function VehicleGridView({
  vehicles,
  loading,
  onView,
  onEdit,
  onDelete
}: VehicleGridViewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
                <div className="h-6 w-16 bg-muted rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Belum ada kendaraan
        </h3>
        <p className="text-sm text-muted-foreground">
          Data kendaraan akan ditampilkan di sini
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{vehicle.plateNumber}</h3>
                <p className="text-sm text-muted-foreground">{vehicle.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getVehicleStatusVariant(vehicle.isActive)}>
                  {vehicle.isActive ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
                
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
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Capacity */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Kapasitas:</span>
                <span className="font-medium">{formatCapacity(vehicle.capacity)}</span>
              </div>

              {/* Last Service */}
              {vehicle.lastService && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Service terakhir:</span>
                  <span className="font-medium">{formatDate(vehicle.lastService)}</span>
                </div>
              )}

              {/* Notes */}
              {vehicle.notes && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Catatan:</span>
                  <span className="font-medium text-xs">{vehicle.notes.substring(0, 50)}{vehicle.notes.length > 50 ? '...' : ''}</span>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-2 flex gap-2">
                {onView && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onView(vehicle.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detail
                  </Button>
                )}
                {onEdit && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onEdit(vehicle.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
