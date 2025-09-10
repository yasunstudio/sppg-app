'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StudentStatsCards } from './student-stats/student-stats-cards'
import { StudentTableView } from './student-table/student-table-view'
import { StudentGridView } from './student-table/student-grid-view'
import { StudentSearchFilters } from './student-filters/student-search-filters'
import { default as StudentPagination } from './student-pagination/student-pagination'
import { useStudents } from './hooks/use-students'
import { useResponsive } from './hooks/use-responsive'
import type { StudentFilters } from './utils/student-types'

export default function StudentManagement() {
  const router = useRouter()
  const { isMobile } = useResponsive()

  // State management
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filters, setFilters] = useState<StudentFilters>({
    searchTerm: '',
    selectedGrade: 'all',
    selectedGender: 'all',
    selectedSchool: 'all',
    selectedAge: 'all'
  })

  // Fetch students data
  const {
    students,
    stats,
    pagination,
    loading,
    error,
    refreshStudents
  } = useStudents({
    page: currentPage,
    limit: itemsPerPage,
    filters
  })

  // Event handlers
  const handleFiltersChange = (newFilters: StudentFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page
  }

  const handleFiltersReset = () => {
    setFilters({
      searchTerm: '',
      selectedGrade: 'all',
      selectedGender: 'all',
      selectedSchool: 'all',
      selectedAge: 'all'
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage)
    setCurrentPage(1)
  }

  const handleViewStudent = (studentId: string) => {
    router.push(`/dashboard/students/${studentId}`)
  }

  const handleEditStudent = (studentId: string) => {
    router.push(`/dashboard/students/${studentId}/edit`)
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Gagal menghapus siswa')
      }

      await refreshStudents()
      toast.success('Siswa berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus siswa')
      console.error('Error deleting student:', error)
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
          <Button onClick={refreshStudents}>
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
      <StudentStatsCards stats={stats} loading={loading} />

      {/* Search and Filters */}
      <StudentSearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onCreateStudent={() => router.push('/dashboard/students/create')}
        onRefresh={refreshStudents}
        loading={loading}
      />

      {/* Summary Info */}
      <div className="flex justify-start items-center py-2">
        <div className="text-sm text-muted-foreground">
          {pagination?.totalCount && pagination.totalCount > 0 && `Menampilkan ${pagination.totalCount} siswa`}
        </div>
      </div>

      {/* Data View - Auto Responsive */}
      {isMobile ? (
        // Mobile: Always grid view
        <StudentGridView
          students={students}
          loading={loading}
          onView={handleViewStudent}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
      ) : (
        // Tablet & Desktop: Always table view
        <StudentTableView
          students={students}
          loading={loading}
          onView={handleViewStudent}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onSort={handleSort}
        />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <StudentPagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalRecords={pagination.totalCount}
          pageSize={itemsPerPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handleItemsPerPageChange}
          isLoading={loading}
        />
      )}
    </div>
  )
}
