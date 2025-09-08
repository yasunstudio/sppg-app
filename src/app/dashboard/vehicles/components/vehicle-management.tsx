'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { VehicleStatsCards } from './vehicle-stats/vehicle-stats-cards'
import { VehicleTableView } from './vehicle-table/vehicle-table-view'
import { VehicleGridView } from './vehicle-table/vehicle-grid-view'
import { VehicleSearchFilters } from './vehicle-filters/vehicle-search-filters'
import { VehiclePagination } from './vehicle-pagination/vehicle-pagination'
import { useVehicles } from './hooks/use-vehicles'
import { useResponsive } from './hooks/use-responsive'
import type { VehicleFilters } from './utils/vehicle-types'

export function VehicleManagement() {
  const router = useRouter()
  const { isMobile, isTablet, isDesktop } = useResponsive()
  
  // State for filters and pagination
  const [filters, setFilters] = useState<VehicleFilters>({
    searchTerm: '',
    selectedStatus: 'all',
    selectedType: 'all'
  })
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Use the vehicles hook with filters and pagination
  const {
    vehicles,
    stats,
    pagination,
    loading,
    error,
    refreshVehicles,
    deleteVehicle
  } = useVehicles({
    filters,
    page: currentPage,
    limit: itemsPerPage
  })

  // Get pagination data from API response
  const totalItems = pagination?.totalCount || 0
  const totalPages = pagination?.totalPages || 0

  // Handlers
  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleFiltersReset = () => {
    setFilters({
      searchTerm: '',
      selectedStatus: 'all',
      selectedType: 'all'
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const handleViewVehicle = (vehicleId: string) => {
    router.push(`/dashboard/vehicles/${vehicleId}`)
  }

  const handleEditVehicle = (vehicleId: string) => {
    router.push(`/dashboard/vehicles/${vehicleId}/edit`)
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kendaraan ini?')) {
      return
    }

    try {
      await deleteVehicle(vehicleId)
      toast.success('Kendaraan berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus kendaraan')
      console.error('Error deleting vehicle:', error)
    }
  }

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    // This would typically be handled by the API
    console.log('Sort by:', column, direction)
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <Button onClick={refreshVehicles}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <VehicleStatsCards stats={stats} loading={loading} />

      {/* Search and Filters */}
      <VehicleSearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
        loading={loading}
      />

      {/* Summary Info */}
      <div className="flex justify-start items-center py-2">
        <div className="text-sm text-muted-foreground">
          {totalItems > 0 && `Menampilkan ${totalItems} kendaraan`}
        </div>
      </div>

      {/* Data View - Auto Responsive */}
      {isMobile ? (
        // Mobile: Always grid view
        <VehicleGridView
          vehicles={vehicles}
          loading={loading}
          onView={handleViewVehicle}
          onEdit={handleEditVehicle}
          onDelete={handleDeleteVehicle}
        />
      ) : (
        // Tablet & Desktop: Always table view
        <VehicleTableView
          vehicles={vehicles}
          loading={loading}
          onView={handleViewVehicle}
          onEdit={handleEditVehicle}
          onDelete={handleDeleteVehicle}
          onSort={handleSort}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <VehiclePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          loading={loading}
        />
      )}
    </div>
  )
}
