'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, RefreshCw } from 'lucide-react'

// Modular Components
import { WasteStatsCards } from './waste-stats/waste-stats-cards'
import { WasteSearchFilters } from './waste-filters/waste-search-filters'
import { WasteGridView } from './waste-table/waste-grid-view'
import { WasteTableView } from './waste-table/waste-table-view'
import { WastePagination } from './waste-pagination/waste-pagination'

// Local Hooks
import { useResponsive } from './hooks/use-responsive'
import { useWasteRecords } from './hooks/use-waste-records'

// Types
import type { FilterState, PaginationState } from './utils/waste-types'

export function WasteRecordsManagement() {
  const router = useRouter()
  const { isMobile } = useResponsive()
  
  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedWasteType: 'all',
    selectedSource: 'all'
  })
  
  // Pagination State
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10
  })

  // Data Fetching
  const { wasteRecords, stats, paginationData, loading, isFiltering } = useWasteRecords({
    filters,
    pagination
  })

  // Event Handlers
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleWasteTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, selectedWasteType: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleSourceChange = (value: string) => {
    setFilters(prev => ({ ...prev, selectedSource: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleItemsPerPageChange = (value: string) => {
    setPagination(prev => ({ 
      ...prev, 
      itemsPerPage: Number(value),
      currentPage: 1 
    }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const [showStats, setShowStats] = useState(false)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-end">
          <div className="h-9 w-32 bg-gray-200 animate-pulse rounded-md" />
        </div>
        
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">Memuat catatan limbah...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <WasteStatsCards 
        stats={stats} 
        showStats={showStats} 
        onToggleStats={() => setShowStats(!showStats)} 
      />

      {/* Search & Filters */}
      <WasteSearchFilters
        filters={filters}
        onSearchChange={handleSearchChange}
        onWasteTypeChange={handleWasteTypeChange}
        onSourceChange={handleSourceChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPage={pagination.itemsPerPage}
      />

      {/* Summary Info */}
      <div className="flex justify-start items-center py-2">
        <div className="text-sm text-muted-foreground">
          {paginationData?.totalCount && paginationData.totalCount > 0 && 
            `Menampilkan ${paginationData.totalCount} catatan limbah`
          }
        </div>
      </div>

      {/* Data View - Auto Responsive */}
      {isMobile ? (
        // Mobile: Grid view
        <WasteGridView 
          wasteRecords={wasteRecords}
          isFiltering={isFiltering}
        />
      ) : (
        // Tablet & Desktop: Table view
        <WasteTableView 
          wasteRecords={wasteRecords}
          isFiltering={isFiltering}
        />
      )}

      {/* Pagination */}
      {paginationData && paginationData.totalPages > 1 && (
        <WastePagination
          pagination={paginationData}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
