'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DriverStatsCards } from './driver-stats/driver-stats-cards'
import { DriverTableView } from './driver-table/driver-table-view'
import { DriverGridView } from './driver-table/driver-grid-view'
import { DriverSearchFilters } from './driver-filters/driver-search-filters'
import { DriverPagination } from './driver-pagination/driver-pagination'
import { useDrivers } from './hooks/use-drivers'
import { useResponsive } from './hooks/use-responsive'
import type { FilterState, PaginationState } from './utils/driver-types'

export function DriversManagement() {
  const router = useRouter()
  const { isMobile, isTablet, isDesktop } = useResponsive()
  
  // UI State
  const [showStats, setShowStats] = useState(true)
  
  // State for filters and pagination
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    statusFilter: 'all',
    licenseTypeFilter: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  })
  
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10
  })

  // Use the drivers hook with filters and pagination
  const {
    drivers,
    stats,
    paginationData,
    loading,
    refetch,
    deleteDriver
  } = useDrivers({ filters, pagination })

  // Get pagination data from API response
  const totalItems = paginationData?.total || 0
  const totalPages = paginationData?.totalPages || 0

  // Handlers
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, currentPage: 1 })) // Reset to first page when filters change
  }

  const handleFiltersReset = () => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      licenseTypeFilter: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    })
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination(prev => ({ ...prev, itemsPerPage: newItemsPerPage, currentPage: 1 }))
  }

  const handleViewDriver = (driverId: string) => {
    router.push(`/dashboard/drivers/${driverId}`)
  }

  const handleEditDriver = (driverId: string) => {
    router.push(`/dashboard/drivers/${driverId}/edit`)
  }

  const handleDeleteDriver = async (driverId: string, driverName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus driver ${driverName}?`)) {
      return false
    }

    try {
      const success = await deleteDriver(driverId, driverName)
      if (success) {
        toast.success('Driver berhasil dihapus')
        return true
      } else {
        toast.error('Gagal menghapus driver')
        return false
      }
    } catch (error) {
      toast.error('Gagal menghapus driver')
      console.error('Error deleting driver:', error)
      return false
    }
  }

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy: column, sortOrder: direction }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleToggleStats = () => {
    setShowStats(prev => !prev)
  }

  // Show error state with retry
  if (!loading && drivers.length === 0 && filters.searchTerm) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">Tidak ada driver yang sesuai dengan filter</div>
          <Button onClick={() => handleFiltersReset()}>
            Reset Filter
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <DriverStatsCards 
        stats={stats} 
        showStats={showStats}
        onToggleStats={handleToggleStats}
      />

      {/* Search and Filters */}
      <DriverSearchFilters
        filters={filters}
        onSearchChange={(value: string) => handleFiltersChange({ ...filters, searchTerm: value })}
        onStatusChange={(value: string) => handleFiltersChange({ ...filters, statusFilter: value })}
        onLicenseTypeChange={(value: string) => handleFiltersChange({ ...filters, licenseTypeFilter: value })}
        onSortByChange={(value: string) => handleFiltersChange({ ...filters, sortBy: value })}
        onSortOrderChange={(value: 'asc' | 'desc') => handleFiltersChange({ ...filters, sortOrder: value })}
        onItemsPerPageChange={(value: string) => handleItemsPerPageChange(parseInt(value))}
        itemsPerPage={pagination.itemsPerPage}
      />

      {/* Summary Info */}
      <div className="flex justify-start items-center py-2">
        <div className="text-sm text-muted-foreground">
          {totalItems > 0 && `Menampilkan ${totalItems} driver`}
        </div>
      </div>

      {/* Data View - Auto Responsive */}
      {isMobile ? (
        // Mobile: Always grid view
        <DriverGridView
          drivers={drivers}
          isFiltering={loading}
          onDelete={handleDeleteDriver}
        />
      ) : (
        // Tablet & Desktop: Always table view
        <DriverTableView
          drivers={drivers}
          isFiltering={loading}
          onDelete={handleDeleteDriver}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <DriverPagination
          pagination={paginationData}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
