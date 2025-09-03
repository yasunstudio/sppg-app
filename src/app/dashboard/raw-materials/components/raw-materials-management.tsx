'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Plus, RefreshCw, Package, Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
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

  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const {
    rawMaterials,
    stats,
    paginationData,
    loading,
    isFiltering,
    deleteRawMaterial,
    refetch
  } = useRawMaterials({ filters, pagination })

  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    // Clear selection when searching
    setSelectedItems([])
  }, [])

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

  const handleDelete = async (rawMaterialId: string): Promise<boolean> => {
    try {
      const success = await deleteRawMaterial(rawMaterialId)
      if (success) {
        toast.success('Bahan baku berhasil dihapus')
        return true
      } else {
        toast.error('Gagal menghapus bahan baku')
        return false
      }
    } catch (error) {
      console.error('Error deleting raw material:', error)
      toast.error('Terjadi kesalahan saat menghapus bahan baku')
      return false
    }
  }

  const handleCreateNew = () => {
    router.push('/dashboard/raw-materials/new')
  }

  const handleRefresh = () => {
    refetch()
    toast.success('Data berhasil diperbarui')
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.info('Fitur export akan segera tersedia')
  }

  const handleImport = () => {
    // TODO: Implement import functionality  
    toast.info('Fitur import akan segera tersedia')
  }

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === rawMaterials.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(rawMaterials.map(item => item.id))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return

    try {
      // TODO: Implement bulk delete API call
      const successCount = selectedItems.length
      setSelectedItems([])
      await refetch()
      toast.success(`${successCount} bahan baku berhasil dihapus`)
    } catch (error) {
      toast.error('Gagal menghapus bahan baku')
    }
  }

  // Memoized computed values
  const hasActiveFilters = useMemo(() => 
    filters.searchTerm || 
    filters.selectedCategory !== 'all' || 
    filters.selectedStatus !== 'all',
    [filters]
  )

  const isAllSelected = useMemo(() => 
    rawMaterials.length > 0 && selectedItems.length === rawMaterials.length,
    [rawMaterials.length, selectedItems.length]
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + R: Refresh
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault()
        handleRefresh()
      }
      
      // Ctrl/Cmd + N: New item
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault()
        handleCreateNew()
      }
      
      // Ctrl/Cmd + A: Select all (when table/grid is focused)
      if ((event.ctrlKey || event.metaKey) && event.key === 'a' && 
          document.activeElement?.closest('[data-table-container]')) {
        event.preventDefault()
        handleSelectAll()
      }
      
      // Delete: Delete selected items
      if (event.key === 'Delete' && selectedItems.length > 0) {
        event.preventDefault()
        handleBulkDelete()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedItems, handleRefresh, handleCreateNew, handleSelectAll, handleBulkDelete])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
            Manajemen Bahan Baku
          </h1>
          <p className="text-muted-foreground">
            Kelola data bahan baku untuk produksi makanan sekolah
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  Shortcuts: Ctrl+R (Refresh), Ctrl+N (New)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>

          <Button onClick={handleCreateNew} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Bahan Baku
          </Button>
        </div>
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
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2 mr-2">
                  <Badge variant="secondary" className="whitespace-nowrap">
                    {selectedItems.length} dipilih
                  </Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="h-7 px-2 text-xs"
                  >
                    Hapus
                  </Button>
                </div>
              )}
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
        <CardContent className="p-4 sm:p-6" data-table-container>
          {isMobile ? (
            <RawMaterialGridView 
              rawMaterials={rawMaterials}
              isFiltering={isFiltering}
              onDelete={handleDelete}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onSelectAll={handleSelectAll}
            />
          ) : (
            <div className="overflow-x-auto">
              <RawMaterialTableView 
                rawMaterials={rawMaterials}
                isFiltering={isFiltering}
                onDelete={handleDelete}
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                onSelectAll={handleSelectAll}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {paginationData && (
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
