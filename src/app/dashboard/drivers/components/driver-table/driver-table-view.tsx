import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Plus,
  Phone,
  Star,
  AlertTriangle,
  CircleCheck,
  CircleX
} from 'lucide-react'
import type { Driver } from '../utils/driver-types'
import { 
  formatDate, 
  formatPhoneNumber, 
  getStatusColor, 
  getStatusText,
  getRatingColor,
  formatRating,
  isLicenseExpiringSoon,
  isLicenseExpired
} from '../utils/driver-formatters'

interface DriverTableViewProps {
  drivers: Driver[]
  isFiltering: boolean
  onDelete: (id: string, name: string) => Promise<boolean>
}

export function DriverTableView({ drivers, isFiltering, onDelete }: DriverTableViewProps) {
  const router = useRouter()

  return (
    <div className={`rounded-md border transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Driver</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead className="hidden lg:table-cell">SIM</TableHead>
            <TableHead className="hidden lg:table-cell">Rating</TableHead>
            <TableHead className="hidden xl:table-cell">Pengiriman</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.length > 0 ? (
            drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {driver.employeeId}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(driver.isActive)}>
                    {driver.isActive ? (
                      <CircleCheck className="mr-1 h-3 w-3" />
                    ) : (
                      <CircleX className="mr-1 h-3 w-3" />
                    )}
                    {getStatusText(driver.isActive)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{formatPhoneNumber(driver.phone)}</span>
                    </div>
                    {driver.email && (
                      <div className="text-xs text-muted-foreground">
                        {driver.email}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{driver.licenseNumber}</div>
                    <div className={`text-xs flex items-center gap-1 ${
                      isLicenseExpired(driver.licenseExpiry) 
                        ? 'text-red-600' 
                        : isLicenseExpiringSoon(driver.licenseExpiry)
                        ? 'text-orange-600'
                        : 'text-muted-foreground'
                    }`}>
                      {(isLicenseExpired(driver.licenseExpiry) || isLicenseExpiringSoon(driver.licenseExpiry)) && (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      Habis: {formatDate(driver.licenseExpiry)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {driver.rating ? (
                    <div className="flex items-center gap-1">
                      <Star className={`h-4 w-4 ${getRatingColor(driver.rating)}`} />
                      <span className={`font-medium ${getRatingColor(driver.rating)}`}>
                        {formatRating(driver.rating)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Belum ada</span>
                  )}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="text-center">
                    <div className="font-medium">{driver.totalDeliveries}</div>
                    <div className="text-xs text-muted-foreground">pengiriman</div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
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
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <CircleX className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Tidak ada driver ditemukan</p>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/drivers/create')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Driver Pertama
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
