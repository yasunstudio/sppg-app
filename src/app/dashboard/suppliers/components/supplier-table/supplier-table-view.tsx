'use client'

import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { MoreVertical, Eye, Edit, Trash2, Phone, Mail, MapPin, RefreshCw, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Supplier } from '../utils/supplier-types'
import { formatSupplierStatus, formatDate, formatPhone, truncateText } from '../utils/supplier-formatters'

interface SupplierTableViewProps {
  suppliers: Supplier[]
  isFiltering: boolean
  onDelete?: (supplierId: string) => Promise<boolean>
}

export function SupplierTableView({ suppliers, isFiltering, onDelete }: SupplierTableViewProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (supplierId: string) => {
    if (!onDelete) return
    
    setDeletingId(supplierId)
    try {
      const success = await onDelete(supplierId)
      if (success) {
        toast.success('Supplier berhasil dihapus')
      }
    } catch (error) {
      toast.error('Gagal menghapus supplier')
    } finally {
      setDeletingId(null)
    }
  }

  if (isFiltering) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin flex-shrink-0 mx-auto mb-4">
            <RefreshCw className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Memfilter data supplier...</p>
        </div>
      </div>
    )
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-2">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Tidak ada supplier ditemukan</h3>
        <p className="text-muted-foreground mb-4">
          Belum ada data supplier atau tidak ada yang sesuai dengan filter pencarian.
        </p>
        <Button onClick={() => router.push('/dashboard/suppliers/create')}>
          Tambah Supplier Pertama
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border dark:border-border">
            <TableHead className="text-foreground dark:text-foreground">Nama Supplier</TableHead>
            <TableHead className="text-foreground dark:text-foreground">Kontak</TableHead>
            <TableHead className="text-foreground dark:text-foreground">Telepon</TableHead>
            <TableHead className="text-foreground dark:text-foreground">Email</TableHead>
            <TableHead className="text-foreground dark:text-foreground">Alamat</TableHead>
            <TableHead className="text-foreground dark:text-foreground">Status</TableHead>
            <TableHead className="text-foreground dark:text-foreground">Statistik</TableHead>
            <TableHead className="text-foreground dark:text-foreground">Dibuat</TableHead>
            <TableHead className="text-foreground dark:text-foreground w-[50px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow 
              key={supplier.id} 
              className="border-border dark:border-border hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium text-foreground dark:text-foreground">
                <div className="flex flex-col">
                  <span className="font-semibold">{supplier.name}</span>
                  <span className="text-xs text-muted-foreground">ID: {supplier.id.slice(-8)}</span>
                </div>
              </TableCell>
              <TableCell className="text-foreground dark:text-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  {supplier.contactName}
                </div>
              </TableCell>
              <TableCell className="text-foreground dark:text-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  {formatPhone(supplier.phone)}
                </div>
              </TableCell>
              <TableCell className="text-foreground dark:text-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  {supplier.email ? (
                    <span className="text-sm">{truncateText(supplier.email, 25)}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm italic">Tidak ada</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-foreground dark:text-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{truncateText(supplier.address, 30)}</span>
                </div>
              </TableCell>
              <TableCell>
                {formatSupplierStatus(supplier.isActive)}
              </TableCell>
              <TableCell className="text-foreground dark:text-foreground">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {supplier._count.purchaseOrders} pesanan
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {supplier._count.inventoryItems} item
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(supplier.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-muted dark:hover:bg-muted"
                      disabled={deletingId === supplier.id}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="bg-popover dark:bg-popover border-border dark:border-border"
                  >
                    <DropdownMenuItem 
                      onClick={() => router.push(`/dashboard/suppliers/${supplier.id}`)}
                      className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push(`/dashboard/suppliers/${supplier.id}/edit`)}
                      className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(supplier.id)}
                      disabled={deletingId === supplier.id}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingId === supplier.id ? 'Menghapus...' : 'Hapus'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
