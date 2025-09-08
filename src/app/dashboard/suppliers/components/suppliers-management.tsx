'use client'

import { useState } from 'react'
import { Plus, RefreshCw, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/layout'
import { SupplierStatsCards } from './supplier-stats/supplier-stats-cards'
import { SupplierSearchFilters } from './supplier-filters/supplier-search-filters'
import { SupplierTableView } from './supplier-table/supplier-table-view'
import { SupplierGridView } from './supplier-table/supplier-grid-view'
import { SupplierPagination } from './supplier-pagination/supplier-pagination'
import { useSuppliers } from './hooks/use-suppliers'
import { useResponsive } from '@/hooks/use-responsive'
import { useRouter } from 'next/navigation'
import type { FilterState, PaginationState } from './utils/supplier-types'

export function SuppliersManagement() {
  const router = useRouter()
  const { isMobile } = useResponsive()
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedStatus: 'all'
  })

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10
  })

  const {
    suppliers,
    stats,
    paginationData,
    loading,
    isFiltering,
    deleteSupplier,
    refetch
  } = useSuppliers({ filters, pagination })

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }))
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

  const handleCreateSupplier = () => {
    router.push('/dashboard/suppliers/create')
  }

  return (
    <PageContainer
      title="Manajemen Supplier"
      description="Kelola data supplier untuk pengadaan bahan baku dan kebutuhan operasional"
      showBreadcrumb={true}
      actions={
        <Button onClick={handleCreateSupplier} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Supplier
        </Button>
      }
    >
      {/* Stats */}
      <SupplierStatsCards stats={stats} loading={loading} />

      {/* Filters */}
      <SupplierSearchFilters
        filters={filters}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPage={pagination.itemsPerPage}
      />

      {/* Data View */}
      <Card className="bg-card dark:bg-card border-border dark:border-border">
        <CardHeader>
          <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 flex-shrink-0 text-foreground dark:text-foreground" />
              <span className="text-foreground dark:text-foreground">Data Supplier</span>
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
            <SupplierGridView 
              suppliers={suppliers}
              isFiltering={isFiltering}
              onDelete={deleteSupplier}
            />
          ) : (
            <div className="overflow-x-auto">
              <SupplierTableView 
                suppliers={suppliers}
                isFiltering={isFiltering}
                onDelete={deleteSupplier}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {paginationData && (
        <SupplierPagination
          pagination={paginationData}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </PageContainer>
  )
}
