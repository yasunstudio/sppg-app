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
import { cn } from '@/lib/utils'
import type { RawMaterial } from '../utils/raw-material-types'
import { 
  formatRawMaterialStatus, 
  formatStockStatus, 
  formatCurrency, 
  formatNumber, 
  formatDate, 
  getCategoryColor 
} from '../utils/raw-material-formatters'
import { RESPONSIVE_SPACING } from '../utils/raw-material-spacing'

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
          <h3 className="text-lg font-semibold mb-2">Tidak ada bahan baku</h3>
          <p className="text-sm">Mulai dengan menambah bahan baku baru</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Professional Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
        {rawMaterials.map((material) => {
          const stockStatus = material.currentStock <= material.minimumStock ? 'low' : 'adequate'
          const stockPercentage = Math.min((material.currentStock / (material.minimumStock * 2)) * 100, 100)
          
          return (
            <Card 
              key={material.id} 
              className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 overflow-hidden"
            >
              {/* Professional Card Header */}
              <CardHeader className="p-4 pb-3 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-2">
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {material.name}
                    </CardTitle>
                    {material.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {material.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Professional Action Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 opacity-60 hover:opacity-100 transition-opacity shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                      <DropdownMenuItem 
                        onClick={() => router.push(`/dashboard/raw-materials/${material.id}`)}
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => router.push(`/dashboard/raw-materials/${material.id}/edit`)}
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(material.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={deletingId === material.id}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        {deletingId === material.id ? 'Menghapus...' : 'Hapus'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Professional Category and Status */}
                <div className="flex items-center justify-between gap-2">
                  {getCategoryColor(material.category)}
                  
                  <Badge 
                    variant={stockStatus === 'low' ? 'destructive' : 'secondary'}
                    className={cn(
                      "text-xs px-2 py-1",
                      stockStatus === 'low' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    )}
                  >
                    {stockStatus === 'low' ? 'Stok Rendah' : 'Stok Cukup'}
                  </Badge>
                </div>
              </CardHeader>

              {/* Professional Card Content */}
              <CardContent className="p-4 pt-0 space-y-4">
                {/* Enhanced Stock Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Stok Tersedia</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatNumber(material.currentStock)} {material.unit}
                    </span>
                  </div>
                  
                  {/* Professional Stock Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          stockStatus === 'low' 
                            ? "bg-red-500 dark:bg-red-400" 
                            : "bg-green-500 dark:bg-green-400"
                        )}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Min: {formatNumber(material.minimumStock)} {material.unit}</span>
                      <span>{stockPercentage.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Professional Financial Summary */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Harga/Unit</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(material.costPerUnit)}
                    </p>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Nilai</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(material.costPerUnit * material.currentStock)}
                    </p>
                  </div>
                </div>

                {/* Supplier Info */}
                {material.supplier && (
                  <div className="pt-1.5 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Supplier</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[100px]">
                        {material.supplier.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Usage Stats */}
                <div className="pt-1.5 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{material._count?.menuItemIngredients || 0} resep</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Scale className="h-3 w-3" />
                      <span>{material._count?.inventory || 0} inv</span>
                    </div>
                  </div>
                </div>

                {/* Mobile-Optimized Action Buttons */}
                <div className="flex gap-1.5 pt-2 sm:hidden">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/dashboard/raw-materials/${material.id}`)}
                    className="flex-1 text-xs h-7"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Lihat
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/dashboard/raw-materials/${material.id}/edit`)}
                    className="flex-1 text-xs h-7"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>

                {/* Last Updated - Only on larger screens */}
                <div className="hidden sm:block pt-1 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>Update: {formatDate(material.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Loading State for Delete Operations */}
      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <RefreshCw className="animate-spin h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Menghapus bahan baku...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
