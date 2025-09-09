"use client"

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
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Phone,
  User
} from 'lucide-react'
import { usePermission } from '@/components/guards/permission-guard'
import type { Driver } from '../utils/driver-types'
import { 
  getStatusColor, 
  getStatusText,
  formatPhoneNumber,
  formatDate,
  formatLicenseType
} from '../utils/driver-formatters'

interface DriverTableViewProps {
  drivers: Driver[]
  isFiltering: boolean
  onDelete?: (id: string, name: string) => Promise<boolean>
}

export function DriverTableView({ drivers, isFiltering, onDelete }: DriverTableViewProps) {
  const router = useRouter()
  
  // Permission checks
  const canViewDriver = usePermission('drivers.view')
  const canEditDriver = usePermission('drivers.edit')
  const canDeleteDriver = usePermission('drivers.delete')
  const canCreateDriver = usePermission('drivers.create')

  return (
    <div className={`rounded-md border transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Driver</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead className="hidden lg:table-cell">Tipe SIM</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden xl:table-cell">Pengiriman</TableHead>
            <TableHead className="hidden xl:table-cell">Bergabung</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.length > 0 ? (
            drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-muted-foreground">{driver.licenseNumber}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatPhoneNumber(driver.phone)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="secondary" className="text-xs">
                    {formatLicenseType(driver.licenseType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(driver.isActive)}>
                    {getStatusText(driver.isActive)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Badge variant="outline">
                    {driver._count?.deliveries || 0} pengiriman
                  </Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(driver.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canViewDriver && (
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/drivers/${driver.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                      )}
                      {canEditDriver && (
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/drivers/${driver.id}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Driver
                        </DropdownMenuItem>
                      )}
                      {canDeleteDriver && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete?.(driver.id, driver.name)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Driver
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <User className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Tidak ada driver ditemukan</p>
                  {canCreateDriver && (
                    <Button
                      variant="outline"
                      onClick={() => router.push('/dashboard/drivers/create')}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Driver Pertama
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
