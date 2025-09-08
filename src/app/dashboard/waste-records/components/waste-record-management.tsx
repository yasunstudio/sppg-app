"use client"

import { useState } from "react"
import { WasteStatsCards } from "./waste-stats/waste-stats-cards"
import { WasteSearchFilters } from "./waste-filters/waste-search-filters"
import { WasteTableView } from "./waste-table/waste-table-view"
import { WasteGridView } from "./waste-table/waste-grid-view"
import { WastePagination } from "./waste-pagination/waste-pagination"
import { useResponsive } from "./hooks/use-responsive"
import { useWasteRecords } from "./hooks/use-waste-records"
import type { FilterState, PaginationState } from "./utils/waste-types"

export function WasteRecordManagement() {
  const { isMobile } = useResponsive()
  const [showStats, setShowStats] = useState(true)
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedWasteType: 'all',
    selectedSource: 'all'
  })
  
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10
  })

  const {
    wasteRecords,
    stats,
    paginationData,
    loading,
    isFiltering,
    refetch
  } = useWasteRecords({
    filters,
    pagination
  })

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <WasteStatsCards 
        stats={stats} 
        showStats={showStats}
        onToggleStats={() => setShowStats(!showStats)}
      />

      {/* Search and Filters */}
      <WasteSearchFilters
        filters={filters}
        onSearchChange={(searchTerm) => 
          handleFiltersChange({ ...filters, searchTerm })
        }
        onWasteTypeChange={(selectedWasteType) => 
          handleFiltersChange({ ...filters, selectedWasteType })
        }
        onSourceChange={(selectedSource) => 
          handleFiltersChange({ ...filters, selectedSource })
        }
        onItemsPerPageChange={(itemsPerPage) => 
          setPagination(prev => ({ ...prev, itemsPerPage: parseInt(itemsPerPage) }))
        }
        itemsPerPage={pagination.itemsPerPage}
      />

      {/* Table or Grid View */}
      {isMobile ? (
        <WasteGridView
          wasteRecords={wasteRecords}
          isFiltering={loading || isFiltering}
        />
      ) : (
        <WasteTableView
          wasteRecords={wasteRecords}
          isFiltering={loading || isFiltering}
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
