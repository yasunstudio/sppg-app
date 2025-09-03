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
import { Badge } from '@/components/ui/badge'
import { MoreVertical, Eye, Edit, Trash2, RefreshCw, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatCurrency, formatNumber, formatDate } from '../utils/raw-material-formatters'

interface RawMaterialTableViewProps {
  rawMaterials: any[]
  isFiltering: boolean
  onDelete?: (rawMaterialId: string) => Promise<boolean>
  selectedItems?: string[]
  onSelectItem?: (itemId: string) => void
  onSelectAll?: () => void
}

export function RawMaterialTableView({ 
  rawMaterials, 
  isFiltering, 
  onDelete,
  selectedItems = [],
  onSelectItem,
  onSelectAll
}: RawMaterialTableViewProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-700">
            <TableHead className="font-semibold">Nama Bahan Baku</TableHead>
            <TableHead className="font-semibold text-center">Kategori</TableHead>
            <TableHead className="font-semibold text-center">Stok</TableHead>
            <TableHead className="font-semibold text-right">Harga/Unit</TableHead>
            <TableHead className="font-semibold text-center">Status</TableHead>
            <TableHead className="font-semibold text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rawMaterials.map((material) => (
            <TableRow key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <TableCell className="font-medium">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {material.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {material.description}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {material.category}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="space-y-1">
                  <div className="font-medium">
                    {formatNumber(material.currentStock)} {material.unit}
                  </div>
                  <div className="text-xs text-gray-500">
                    Min: {formatNumber(material.minimumStock)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="font-medium">
                  {formatCurrency(material.costPerUnit)}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge 
                  variant={material.isActive ? 'default' : 'secondary'}
                  className={material.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                >
                  {material.isActive ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/dashboard/raw-materials/${material.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/dashboard/raw-materials/${material.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
