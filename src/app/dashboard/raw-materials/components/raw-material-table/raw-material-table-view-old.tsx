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
import { MoreVertical, Eye, Edit, Trash2, RefreshCw, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { RawMaterial } from '../utils/raw-material-types'
import { 
  formatRawMaterialStatus, 
  formatStockStatus, 
  formatCurrency, 
  formatNumber, 
  formatDate, 
  getCategoryColor,
  truncateText 
} from '../utils/raw-material-formatters'

interface RawMaterialTableViewProps {
  rawMaterials: RawMaterial[]
  isFiltering: boolean
  onDelete?: (rawMaterialId: string) => Promise<boolean>
}

export function RawMaterialTableView({ rawMaterials, isFiltering, onDelete }: RawMaterialTableViewProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (rawMaterialId: string) => {
    if (!onDelete) return
    
    setDeletingId(rawMaterialId)
    try {
      const success = await onDelete(rawMaterialId)
      if (success) {
        toast.success('Bahan baku berhasil dihapus')
      }
    } catch (error) {
      toast.error('Gagal menghapus bahan baku')
    } finally {
      setDeletingId(null)
    }
  }

  if (isFiltering) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin flex-shrink-0 mx-auto mb-4">
            <RefreshCw className="h-8 w-8 text-muted-foreground dark:text-muted-foreground" />
          </div>
          <p className="text-muted-foreground dark:text-muted-foreground">Memfilter data bahan baku...</p>
        </div>
      </div>
    )
  }

  if (rawMaterials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground dark:text-muted-foreground mb-2">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-foreground dark:text-foreground mb-2">Tidak ada bahan baku ditemukan</h3>
        <p className="text-muted-foreground dark:text-muted-foreground mb-4">
          Belum ada data bahan baku atau tidak ada yang sesuai dengan filter pencarian.
        </p>
        <Button onClick={() => router.push('/dashboard/raw-materials/create')}>
          Tambah Bahan Baku Pertama
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border dark:border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 dark:bg-muted/50 border-border dark:border-border hover:bg-muted/80 dark:hover:bg-muted/80">
            <TableHead className="text-foreground dark:text-foreground font-semibold">Nama</TableHead>
            <TableHead className="text-foreground dark:text-foreground font-semibold">Kategori</TableHead>
            <TableHead className="text-foreground dark:text-foreground font-semibold">Stok</TableHead>
            <TableHead className="text-foreground dark:text-foreground font-semibold">Status Stok</TableHead>
            <TableHead className="text-foreground dark:text-foreground font-semibold">Harga/Unit</TableHead>
            <TableHead className="text-foreground dark:text-foreground font-semibold">Status</TableHead>
            <TableHead className="text-foreground dark:text-foreground font-semibold">Dibuat</TableHead>
            <TableHead className="text-foreground dark:text-foreground font-semibold w-[50px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rawMaterials.map((rawMaterial) => (
            <TableRow 
              key={rawMaterial.id}
              className="border-border dark:border-border hover:bg-muted/50 dark:hover:bg-muted/50"
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-foreground dark:text-foreground">
                      {truncateText(rawMaterial.name, 30)}
                    </div>
                    <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                      {rawMaterial.unit}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getCategoryColor(rawMaterial.category)}>
                  {rawMaterial.category}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-foreground dark:text-foreground">
                  <span className="font-medium">{formatNumber(rawMaterial.currentStock)}</span>
                  <span className="text-muted-foreground dark:text-muted-foreground text-xs ml-1">
                    / {formatNumber(rawMaterial.minimumStock)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {formatStockStatus(rawMaterial.currentStock, rawMaterial.minimumStock)}
              </TableCell>
              <TableCell>
                <span className="font-medium text-foreground dark:text-foreground">
                  {formatCurrency(rawMaterial.costPerUnit)}
                </span>
              </TableCell>
              <TableCell>
                {formatRawMaterialStatus(rawMaterial.isActive)}
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground dark:text-muted-foreground text-sm">
                  {formatDate(rawMaterial.createdAt)}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-muted dark:hover:bg-muted"
                      disabled={deletingId === rawMaterial.id}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="bg-popover dark:bg-popover border-border dark:border-border"
                  >
                    <DropdownMenuItem 
                      onClick={() => router.push(`/dashboard/raw-materials/${rawMaterial.id}`)}
                      className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push(`/dashboard/raw-materials/${rawMaterial.id}/edit`)}
                      className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(rawMaterial.id)}
                      disabled={deletingId === rawMaterial.id}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingId === rawMaterial.id ? 'Menghapus...' : 'Hapus'}
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
