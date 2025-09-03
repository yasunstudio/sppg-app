'use client'

import { useState } from 'react'
import { Plus, RefreshCw, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RawMaterialStatsCards } from './raw-material-stats/raw-material-stats-cards'
import { RawMaterialSearchFilters } from './raw-material-filters/raw-material-search-filters'
import { RawMaterialTableView } from './raw-material-table/raw-material-table-view'
import { RawMaterialGridView } from './raw-material-table/raw-material-grid-view'
import { RawMaterialPagination } from './raw-material-pagination/raw-material-pagination'
import { useRawMaterials } from './hooks/use-raw-materials'
import { useResponsive } from './hooks/use-responsive'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { 
  FilterState,
  PaginationState
} from './utils/raw-material-types'

export function RawMaterialsManagement() {
  const router = useRouter()
  const { isMobile } = useResponsive()
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: 'all',
    selectedStatus: 'all'
  })

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10
  })

  const {
    rawMaterials,
    stats,
    paginationData,
    loading,
    isFiltering,
    deleteRawMaterial,
    refetch
  } = useRawMaterials({ filters, pagination })

    // Filter logic - now handled by API hook
  // const filteredRawMaterials = ... (removed, handled by API)

  // Pagination logic - now handled by API hook  
  // const paginationData = ... (removed, handled by API)

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, selectedCategory: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, selectedStatus: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleItemsPerPageChange = (value: string) => {
    setPagination(prev => ({ 
      ...prev, 
      itemsPerPage: parseInt(value),
      currentPage: 1 
    }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const handleDelete = async (rawMaterialId: string) => {
    try {
      const success = await deleteRawMaterial(rawMaterialId)
      if (success) {
        toast.success('Bahan baku berhasil dihapus')
      } else {
        toast.error('Gagal menghapus bahan baku')
      }
    } catch (error) {
      console.error('Error deleting raw material:', error)
      toast.error('Terjadi kesalahan saat menghapus bahan baku')
    }
  }

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, selectedCategory: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, selectedStatus: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleItemsPerPageChange = (value: string) => {
    setPagination(prev => ({ ...prev, itemsPerPage: parseInt(value), currentPage: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const handleCreateRawMaterial = () => {
    router.push('/dashboard/raw-materials/create')
  }

  const handleDelete = async (rawMaterialId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setRawMaterials(prev => prev.filter(material => material.id !== rawMaterialId))
      toast.success('Bahan baku berhasil dihapus')
      return true
    } catch (error) {
      toast.error('Gagal menghapus bahan baku')
      return false
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
            Manajemen Bahan Baku
          </h1>
          <p className="text-muted-foreground">
            Kelola dan pantau stok bahan baku untuk produksi makanan sekolah
          </p>
        </div>
        <Button onClick={handleCreateRawMaterial} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Bahan Baku
        </Button>
      </div>

      {/* Stats */}
      <RawMaterialStatsCards stats={stats} loading={loading} />

      {/* Filters */}
      <RawMaterialSearchFilters
        filters={filters}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPage={pagination.itemsPerPage}
      />

      {/* Data View */}
      <Card className="bg-card dark:bg-card border-border dark:border-border">
        <CardHeader>
          <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 flex-shrink-0 text-foreground dark:text-foreground" />
              <span className="text-foreground dark:text-foreground">Data Bahan Baku</span>
              {isFiltering && (
                <div className="animate-spin flex-shrink-0">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap ml-auto">
              <Badge variant="outline" className="text-xs whitespace-nowrap">
                {isMobile ? 'Grid' : 'Tabel'}
              </Badge>
              {paginationData && (
                <Badge variant="secondary" className="whitespace-nowrap">
                  {paginationData.totalCount} total
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {isMobile ? (
            <RawMaterialGridView 
              rawMaterials={paginatedRawMaterials}
              isFiltering={isFiltering}
              onDelete={handleDelete}
            />
          ) : (
            <div className="overflow-x-auto">
              <RawMaterialTableView 
                rawMaterials={paginatedRawMaterials}
                isFiltering={isFiltering}
                onDelete={handleDelete}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {paginationData && paginationData.totalPages > 1 && (
        <RawMaterialPagination
          pagination={paginationData}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
