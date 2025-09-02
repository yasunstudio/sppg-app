'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, RefreshCw, Plus, Download } from 'lucide-react'

// Modular Components
import { DriverStatsCards } from './driver-stats/driver-stats-cards'
import { DriverSearchFilters } from './driver-filters/driver-search-filters'
import { DriverGridView } from './driver-table/driver-grid-view'
import { DriverTableView } from './driver-table/driver-table-view'
import { DriverPagination } from './driver-pagination/driver-pagination'

// Custom Hooks
import { useResponsive } from './hooks/use-responsive'
import { useDrivers } from './hooks/use-drivers'

// Types
import type { FilterState, PaginationState } from './utils/driver-types'

export function DriversManagementV2() {
  const router = useRouter()
  const { isMobile } = useResponsive()
  
  // UI State
  const [showStats, setShowStats] = useState(true)
  
  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    statusFilter: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  })
  
  // Pagination State
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10
  })

  // Data Fetching
  const { drivers, stats, paginationData, loading, isFiltering, refetch, deleteDriver } = useDrivers({
    filters,
    pagination
  })

  // Event Handlers
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, statusFilter: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleSortByChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortOrder: value }))
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

  const handleDelete = async (id: string, name: string) => {
    return await deleteDriver(id, name)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manajemen Driver</h1>
            <p className="text-muted-foreground">Memuat data driver...</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">Memuat...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manajemen Driver</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau data driver pengiriman
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={() => {/* TODO: Export functionality */}}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Ekspor
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/drivers/create')}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Driver
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <DriverStatsCards 
        stats={stats}
        showStats={showStats}
        onToggleStats={() => setShowStats(!showStats)}
      />

      {/* Search & Filters */}
      <DriverSearchFilters
        filters={filters}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPage={pagination.itemsPerPage}
      />

      {/* Data Table/Grid */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <Users className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Data Driver</span>
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
                  {paginationData.total} total
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {isMobile ? (
            <DriverGridView 
              drivers={drivers}
              isFiltering={isFiltering}
              onDelete={handleDelete}
            />
          ) : (
            <div className="overflow-x-auto">
              <DriverTableView 
                drivers={drivers}
                isFiltering={isFiltering}
                onDelete={handleDelete}
              />
            </div>
          )}
        </CardContent>
        
        {/* Pagination */}
        {paginationData && (
          <DriverPagination
            pagination={paginationData}
            currentPage={pagination.currentPage}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </Card>
    </div>
  )
}
