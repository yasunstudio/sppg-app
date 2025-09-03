'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Building2, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  RefreshCw,
  Package,
  ShoppingCart
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Supplier } from '../utils/supplier-types'
import { formatSupplierStatus, formatDate, formatPhone } from '../utils/supplier-formatters'

interface SupplierGridViewProps {
  suppliers: Supplier[]
  isFiltering: boolean
  onDelete?: (supplierId: string) => Promise<boolean>
}

export function SupplierGridView({ suppliers, isFiltering, onDelete }: SupplierGridViewProps) {
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
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {suppliers.map((supplier) => (
        <Card 
          key={supplier.id} 
          className="bg-card dark:bg-card border-border dark:border-border hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-primary/20 dark:hover:border-primary/20 overflow-hidden"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm sm:text-base font-semibold text-foreground dark:text-foreground truncate">
                    {supplier.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    ID: {supplier.id.slice(-8)}
                  </p>
                </div>
              </div>
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
            </div>
            <div className="mt-2">
              {formatSupplierStatus(supplier.isActive)}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3 px-4 py-3">
            {/* Contact Information */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground dark:text-foreground font-medium truncate">{supplier.contactName}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-foreground dark:text-foreground truncate">{formatPhone(supplier.phone)}</span>
              </div>
              
              {supplier.email ? (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground dark:text-foreground truncate text-xs sm:text-sm" title={supplier.email}>{supplier.email}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground italic">Tidak ada email</span>
                </div>
              )}
              
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-foreground dark:text-foreground text-xs sm:text-sm overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word'
                }} title={supplier.address}>{supplier.address}</span>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex gap-2 pt-2 border-t border-border dark:border-border">
              <Badge variant="outline" className="flex items-center gap-1 text-xs flex-shrink-0">
                <ShoppingCart className="h-3 w-3" />
                <span className="hidden sm:inline">PO:</span>
                {supplier._count.purchaseOrders}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1 text-xs flex-shrink-0">
                <Package className="h-3 w-3" />
                <span className="hidden sm:inline">Inv:</span>
                {supplier._count.inventory}
              </Badge>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">Dibuat: {formatDate(supplier.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
