'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ClassStatsCards } from './class-stats/class-stats-cards'
import { ClassTableView } from './class-table/class-table-view'
import { ClassGridView } from './class-table/class-grid-view'
import { ClassSearchFilters } from './class-filters/class-search-filters'
import { ClassPagination } from './class-pagination/class-pagination'
import { useClasses } from './hooks/use-classes'
import { useResponsive } from './hooks/use-responsive'
import type { ClassFilters } from './utils/class-types'

export function ClassManagement() {
  const router = useRouter()
  const { isMobile, isTablet, isDesktop } = useResponsive()
  
  // State for filters and pagination
  const [filters, setFilters] = useState<ClassFilters>({
    searchTerm: '',
    selectedGrade: 'all',
    selectedSchool: 'all'
  })
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Use the classes hook with filters and pagination
  const {
    classes,
    stats,
    pagination,
    loading,
    error,
    refreshClasses,
    deleteClass
  } = useClasses({
    filters,
    page: currentPage,
    limit: itemsPerPage
  })

  // Get pagination data from API response
  const totalItems = pagination?.totalCount || 0
  const totalPages = pagination?.totalPages || 0

  // Handlers
  const handleFiltersChange = (newFilters: ClassFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleFiltersReset = () => {
    setFilters({
      searchTerm: '',
      selectedGrade: 'all',
      selectedSchool: 'all'
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

  const handleViewClass = (classId: string) => {
    router.push(`/dashboard/classes/${classId}`)
  }

  const handleEditClass = (classId: string) => {
    router.push(`/dashboard/classes/${classId}/edit`)
  }

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
      return
    }

    try {
      await deleteClass(classId)
      toast.success('Kelas berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus kelas')
      console.error('Error deleting class:', error)
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
          <Button onClick={refreshClasses}>
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
      <ClassStatsCards stats={stats} loading={loading} />

      {/* Search and Filters */}
      <ClassSearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
        loading={loading}
      />

      {/* Summary Info */}
      <div className="flex justify-start items-center py-2">
        <div className="text-sm text-muted-foreground">
          {totalItems > 0 && `Menampilkan ${totalItems} kelas`}
        </div>
      </div>

      {/* Data View - Auto Responsive */}
      {isMobile ? (
        // Mobile: Always grid view
        <ClassGridView
          classes={classes}
          loading={loading}
          onView={handleViewClass}
          onEdit={handleEditClass}
          onDelete={handleDeleteClass}
        />
      ) : (
        // Tablet & Desktop: Always table view
        <ClassTableView
          classes={classes}
          loading={loading}
          onView={handleViewClass}
          onEdit={handleEditClass}
          onDelete={handleDeleteClass}
          onSort={handleSort}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <ClassPagination
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
