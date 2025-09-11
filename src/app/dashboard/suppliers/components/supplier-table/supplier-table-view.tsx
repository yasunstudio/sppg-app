'use client'

import { MoreVertical, Eye, Edit, Trash2, Building2, Phone, Mail, MapPin } from 'lucide-react'
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
import { formatDate, formatPhoneNumber } from '../utils/supplier-formatters'
import type { Supplier } from '../utils/supplier-types'
import { useRouter } from 'next/navigation'
import { usePermission } from '@/hooks/use-permission'

interface SupplierTableViewProps {
  suppliers: Supplier[]
  loading?: boolean
  isFiltering?: boolean
  onDeleteSupplier?: (supplierId: string) => Promise<boolean>
}

export function SupplierTableView({
  suppliers,
  loading,
  isFiltering,
  onDeleteSupplier
}: SupplierTableViewProps) {
  const router = useRouter()

  // Permissions
  const { hasPermission } = usePermission(['suppliers.view', 'suppliers.edit', 'suppliers.delete'])
  const canViewSupplier = hasPermission('suppliers.view')
  const canEditSupplier = hasPermission('suppliers.edit')
  const canDeleteSupplier = hasPermission('suppliers.delete')

  const handleView = (supplierId: string) => {
    if (canViewSupplier) {
      router.push(`/suppliers/${supplierId}`)
    }
  }

  const handleEdit = (supplierId: string) => {
    if (canEditSupplier) {
      router.push(`/suppliers/${supplierId}/edit`)
    }
  }

  const handleDelete = async (supplierId: string) => {
    if (canDeleteSupplier && onDeleteSupplier) {
      if (confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
        await onDeleteSupplier(supplierId)
      }
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Aktif' : 'Tidak Aktif'
  }

  if (loading) {
    return (
      <div className={`rounded-md border transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Alamat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden xl:table-cell">Total Order</TableHead>
              <TableHead className="hidden xl:table-cell">Bergabung</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                    <div>
                      <div className="h-4 w-32 bg-muted animate-pulse rounded mb-1" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (suppliers.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tidak ada supplier</h3>
          <p className="text-muted-foreground">
            Belum ada supplier yang terdaftar dalam sistem.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-md border transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Alamat</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden xl:table-cell">Total Order</TableHead>
            <TableHead className="hidden xl:table-cell">Bergabung</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-muted-foreground">{supplier.contactName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatPhoneNumber(supplier.phone)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {supplier.email ? (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{supplier.email}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm max-w-[200px] truncate" title={supplier.address}>
                      {supplier.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(supplier.isActive)}>
                    {getStatusText(supplier.isActive)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Badge variant="outline">
                    {supplier._count?.purchaseOrders || 0} order
                  </Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(supplier.createdAt)}
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
                      {canViewSupplier && (
                        <DropdownMenuItem
                          onClick={() => handleView(supplier.id)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                      )}
                      {canEditSupplier && (
                        <DropdownMenuItem
                          onClick={() => handleEdit(supplier.id)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {canDeleteSupplier && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(supplier.id)}
                            className="cursor-pointer text-destructive focus:text-destructive"
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
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-16">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak ada supplier</h3>
                <p className="text-muted-foreground">
                  Belum ada supplier yang terdaftar dalam sistem.
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
