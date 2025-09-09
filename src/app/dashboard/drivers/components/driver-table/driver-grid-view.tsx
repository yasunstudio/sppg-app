"use client"

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
  Plus,
  Phone,
  AlertTriangle,
  CircleCheck,
  CircleX,
  User,
  CreditCard,
  Activity
} from 'lucide-react'
import type { Driver } from '../utils/driver-types'
import { 
  formatDate, 
  formatPhoneNumber, 
  getStatusColor, 
  getStatusText,
  isLicenseExpiringSoon,
  isLicenseExpired,
  formatLicenseType
} from '../utils/driver-formatters'

interface DriverGridViewProps {
  drivers: Driver[]
  isFiltering: boolean
  onDelete: (id: string, name: string) => Promise<boolean>
}

export function DriverGridView({ drivers, isFiltering, onDelete }: DriverGridViewProps) {
  const router = useRouter()

  if (drivers.length === 0) {
    return (
      <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CircleX className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Tidak ada driver ditemukan</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/drivers/create')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Driver Pertama
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
      <div className="space-y-4">
        {drivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-2">
                  <Badge className={getStatusColor(driver.isActive)}>
                    {driver.isActive ? (
                      <CircleCheck className="mr-1 h-3 w-3" />
                    ) : (
                      <CircleX className="mr-1 h-3 w-3" />
                    )}
                    {getStatusText(driver.isActive)}
                  </Badge>
                  {(isLicenseExpired(driver.licenseExpiry) || isLicenseExpiringSoon(driver.licenseExpiry)) && (
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      SIM {isLicenseExpired(driver.licenseExpiry) ? 'Expired' : 'Akan Habis'}
                    </Badge>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/drivers/${driver.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/drivers/${driver.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Driver
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(driver.id, driver.name)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Driver
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-sm text-muted-foreground">ID: {driver.employeeId}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm">{formatPhoneNumber(driver.phone)}</div>
                    {driver.email && (
                      <div className="text-xs text-muted-foreground">{driver.email}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 min-w-0">
                  <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{driver.licenseNumber}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {formatLicenseType(driver.licenseType)}
                      </Badge>
                      <div className={`text-xs ${
                        isLicenseExpired(driver.licenseExpiry) 
                          ? 'text-red-600' 
                          : isLicenseExpiringSoon(driver.licenseExpiry)
                          ? 'text-orange-600'
                          : 'text-muted-foreground'
                      }`}>
                        Habis: {formatDate(driver.licenseExpiry)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{driver.totalDeliveries}</div>
                      <div className="text-xs text-muted-foreground">Total Pengiriman</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
