'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, RefreshCw, Plus, Download } from 'lucide-react'

// Permission Guard
import { usePermission } from '@/components/guards/permission-guard'

// Modular Components
import { WasteStatsCards } from './waste-stats/waste-stats-cards'
import { WasteSearchFilters } from './waste-filters/waste-search-filters'
import { WasteGridView } from './waste-table/waste-grid-view'
import { WasteTableView } from './waste-table/waste-table-view'
import { WastePagination } from './waste-pagination/waste-pagination'

// Custom Hooks
import { useResponsive } from './hooks/use-responsive'
import { useWasteRecords } from './hooks/use-waste-records'

// Types
import type { FilterState, PaginationState } from './utils/waste-types'

export function WasteRecordsManagement() {
  const router = useRouter()
  const { isMobile } = useResponsive()
  
  // Permission checks
  const canCreateWaste = usePermission('waste.create')
  const canEditWaste = usePermission('waste.edit')
  const canDeleteWaste = usePermission('waste.delete')
  const canAnalyzeWaste = usePermission('waste.analyze')
  
  // UI State
  const [showStats, setShowStats] = useState(true)
  
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manajemen Limbah</h1>
            <p className="text-muted-foreground">Memuat catatan limbah...</p>
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manajemen Limbah</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau catatan limbah sekolah
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
          {canCreateWaste && (
            <Button 
              onClick={() => router.push('/dashboard/waste-management/create')}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Catatan
            </Button>
          )}
        </div>
      </div>

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

      {/* Data Table/Grid */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <Trash2 className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Catatan Limbah</span>
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
            <WasteGridView 
              wasteRecords={wasteRecords}
              isFiltering={isFiltering}
            />
          ) : (
            <div className="overflow-x-auto">
              <WasteTableView 
                wasteRecords={wasteRecords}
                isFiltering={isFiltering}
              />
            </div>
          )}
        </CardContent>
        
        {/* Pagination */}
        {paginationData && (
          <WastePagination
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
