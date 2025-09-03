'use client'

import { useState } from 'react'
import { Plus, RefreshCw, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VehicleStatsCards } from './vehicle-stats/vehicle-stats-cards'
import { VehicleSearchFilters } from './vehicle-filters/vehicle-search-filters'
import { VehicleTableView } from './vehicle-table/vehicle-table-view'
import { VehicleGridView } from './vehicle-table/vehicle-grid-view'
import { VehiclePagination } from './vehicle-pagination/vehicle-pagination'
import { useVehicles } from '@/hooks/use-vehicles'
import { useResponsive } from '@/hooks/use-responsive'
import { useRouter } from 'next/navigation'
import type { FilterState, PaginationState } from './utils/vehicle-types'

export function VehicleManagement() {
  const router = useRouter()
  const { isMobile } = useResponsive()
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedType: 'all',
    selectedStatus: 'all'
  })

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10
  })

  const {
    vehicles,
    stats,
    paginationData,
    loading,
    isFiltering,
    deleteVehicle,
    refetch
  } = useVehicles({ filters, pagination })

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleVehicleTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, selectedType: value }))
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

  const handleCreateVehicle = () => {
    router.push('/dashboard/vehicles/create')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Kendaraan</h1>
          <p className="text-muted-foreground">
            Kelola data kendaraan untuk distribusi makanan
          </p>
        </div>
        <Button onClick={handleCreateVehicle}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kendaraan
        </Button>
      </div>

      {/* Stats */}
      <VehicleStatsCards stats={stats} loading={loading} />

      {/* Filters */}
      <VehicleSearchFilters
        filters={filters}
        onSearchChange={handleSearchChange}
        onVehicleTypeChange={handleVehicleTypeChange}
        onStatusChange={handleStatusChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPage={pagination.itemsPerPage}
      />

      {/* Data View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 flex-shrink-0" />
              <span>Data Kendaraan</span>
              {isFiltering && (
                <div className="animate-spin flex-shrink-0">
                  <RefreshCw className="h-4 w-4" />
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
            <VehicleGridView 
              vehicles={vehicles}
              isFiltering={isFiltering}
            />
          ) : (
            <div className="overflow-x-auto">
              <VehicleTableView 
                vehicles={vehicles}
                isFiltering={isFiltering}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {paginationData && (
        <VehiclePagination
          currentPage={paginationData.currentPage}
          totalPages={paginationData.totalPages}
          totalItems={paginationData.totalCount}
          onPageChange={handlePageChange}
          hasMore={paginationData.hasMore}
          loading={loading || isFiltering}
        />
      )}
    </div>
  )
}
