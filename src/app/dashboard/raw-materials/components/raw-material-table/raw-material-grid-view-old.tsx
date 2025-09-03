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
  Package, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Scale,
  Calendar,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { RawMaterial } from '../utils/raw-material-types'
import { 
  formatRawMaterialStatus, 
  formatStockStatus, 
  formatCurrency, 
  formatNumber, 
  formatDate, 
  getCategoryColor 
} from '../utils/raw-material-formatters'

interface RawMaterialGridViewProps {
  rawMaterials: RawMaterial[]
  isFiltering: boolean
  onDelete?: (rawMaterialId: string) => Promise<boolean>
}

export function RawMaterialGridView({ rawMaterials, isFiltering, onDelete }: RawMaterialGridViewProps) {
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
      <div className="flex items-center justify-center min-h-[200px]">
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
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rawMaterials.map((rawMaterial) => (
        <Card 
          key={rawMaterial.id} 
          className="bg-card dark:bg-card border-border dark:border-border hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-primary/20 dark:hover:border-primary/20 overflow-hidden"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm sm:text-base font-semibold text-foreground dark:text-foreground truncate">
                    {rawMaterial.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                    ID: {rawMaterial.id.slice(-8)}
                  </p>
                </div>
              </div>
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
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Badge variant="outline" className={getCategoryColor(rawMaterial.category)}>
                {rawMaterial.category}
              </Badge>
              {formatRawMaterialStatus(rawMaterial.isActive)}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3 px-4 py-3">
            {/* Stock Information */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground dark:text-muted-foreground">Stok Saat Ini:</span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground dark:text-foreground font-medium">
                    {formatNumber(rawMaterial.currentStock)} {rawMaterial.unit}
                  </span>
                  {rawMaterial.currentStock <= rawMaterial.minimumStock ? (
                    <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground dark:text-muted-foreground">Minimum:</span>
                <span className="text-foreground dark:text-foreground">
                  {formatNumber(rawMaterial.minimumStock)} {rawMaterial.unit}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground dark:text-muted-foreground">Harga per Unit:</span>
                <span className="text-foreground dark:text-foreground font-medium">
                  {formatCurrency(rawMaterial.costPerUnit)}
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="pt-2 border-t border-border dark:border-border">
              {formatStockStatus(rawMaterial.currentStock, rawMaterial.minimumStock)}
            </div>

            {/* Statistics */}
            <div className="flex gap-2 pt-2 border-t border-border dark:border-border">
              <Badge variant="outline" className="flex items-center gap-1 text-xs flex-shrink-0">
                <Scale className="h-3 w-3" />
                <span className="hidden sm:inline">Inv:</span>
                {rawMaterial._count.inventory}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1 text-xs flex-shrink-0">
                <Package className="h-3 w-3" />
                <span className="hidden sm:inline">Menu:</span>
                {rawMaterial._count.menuItemIngredients}
              </Badge>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground pt-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">Dibuat: {formatDate(rawMaterial.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
