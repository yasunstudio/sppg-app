'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Eye, Edit, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatNumber } from '../utils/raw-material-formatters'

interface RawMaterialGridViewProps {
  rawMaterials: any[]
  isFiltering: boolean
  onDelete?: (rawMaterialId: string) => Promise<boolean>
  selectedItems?: string[]
  onSelectItem?: (itemId: string) => void
  onSelectAll?: () => void
}

export function RawMaterialGridView({ 
  rawMaterials, 
  isFiltering, 
  onDelete,
  selectedItems = [],
  onSelectItem,
  onSelectAll
}: RawMaterialGridViewProps) {
  const router = useRouter()

  if (isFiltering) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Memfilter data bahan baku...</p>
        </div>
      </div>
    )
  }

  if (rawMaterials.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Tidak ada bahan baku</h3>
        <p className="text-sm text-gray-500">Mulai dengan menambah bahan baku baru</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rawMaterials.map((material) => (
        <Card 
          key={material.id} 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {material.name}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                >
                  {material.category}
                </Badge>
              </div>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-4">
            {/* Stock Info */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Stok Saat Ini</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatNumber(material.currentStock)} {material.unit}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Minimum Stok</span>
                <span className="text-sm text-gray-500">
                  {formatNumber(material.minimumStock)} {material.unit}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Harga/Unit</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(material.costPerUnit)}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <Badge 
                variant={material.isActive ? 'default' : 'secondary'}
                className={material.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
              >
                {material.isActive ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => router.push(`/dashboard/raw-materials/${material.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Lihat
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => router.push(`/dashboard/raw-materials/${material.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
