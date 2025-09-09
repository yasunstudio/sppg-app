'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { SupplierStatsCards } from './supplier-stats/supplier-stats-cards'
import { SupplierTableView } from './supplier-table/supplier-table-view'
import { SupplierGridView } from './supplier-table/supplier-grid-view'
import { SupplierSearchFilters } from './supplier-filters/supplier-search-filters'
import { SupplierPagination } from './supplier-pagination/supplier-pagination'
import { useSuppliers } from './hooks/use-suppliers'
import { useResponsive } from './hooks/use-responsive'
import type { SupplierFilters } from './utils/supplier-types'

export function SupplierManagement() {
  const router = useRouter()
  const { isMobile, isTablet, isDesktop } = useResponsive()
  
  // State for filters and pagination
  const [filters, setFilters] = useState<SupplierFilters>({
    searchTerm: '',
    selectedStatus: 'all'
  })
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Use the suppliers hook with filters and pagination
  const {
    suppliers,
    stats,
    pagination,
    loading,
    error,
    refreshSuppliers,
    deleteSupplier
  } = useSuppliers({
    filters,
    page: currentPage,
    limit: itemsPerPage
  })

  // Get pagination data from API response
  const totalItems = pagination?.totalCount || 0
  const totalPages = pagination?.totalPages || 0

  // Handlers
  const handleFiltersChange = (newFilters: SupplierFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  const handleCreateSupplier = () => {
    router.push('/suppliers/create')
  }

  const handleRefresh = async () => {
    try {
      await refreshSuppliers()
      toast.success('Data supplier berhasil diperbarui')
    } catch (error) {
      toast.error('Gagal memperbarui data supplier')
    }
  }

  const handleDeleteSupplier = async (supplierId: string): Promise<boolean> => {
    try {
      await deleteSupplier(supplierId)
      toast.success('Supplier berhasil dihapus')
      return true
    } catch (error) {
      toast.error('Gagal menghapus supplier')
      return false
    }
  }

  // Determine view mode based on screen size
  const showGridView = isMobile || isTablet
  const showTableView = isDesktop

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-destructive">Gagal memuat data supplier</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Coba Lagi
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <SupplierStatsCards stats={stats} loading={loading} />

      {/* Search and Filters */}
      <SupplierSearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onCreateSupplier={handleCreateSupplier}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Suppliers List */}
      <div className="space-y-4">
        {/* Table View for Desktop */}
        {showTableView && (
          <SupplierTableView
            suppliers={suppliers}
            loading={loading}
            isFiltering={loading}
            onDeleteSupplier={handleDeleteSupplier}
          />
        )}

        {/* Grid View for Mobile/Tablet */}
        {showGridView && (
          <SupplierGridView
            suppliers={suppliers}
            loading={loading}
            isFiltering={loading}
            onDelete={handleDeleteSupplier}
          />
        )}

        {/* Pagination */}
        <SupplierPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          loading={loading}
        />
      </div>
    </div>
  )
}
