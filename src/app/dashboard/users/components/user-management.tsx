'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UserStatsCards } from './user-stats/user-stats-cards'
import { UserTableView, UserGridView } from './user-table'
import { UserSearchFilters } from './user-filters/user-search-filters'
import { UserPagination } from './user-pagination/user-pagination'
import { useUsers } from './hooks/use-users'
import { useResponsive } from './hooks/use-responsive'
import type { UserFilters, User } from './utils/user-types'

export function UserManagement() {
  const router = useRouter()
  const { isMobile, isTablet, isDesktop } = useResponsive()
  
  // State for filters and pagination
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: '',
    selectedRole: 'all',
    selectedStatus: 'all',
    currentPage: 1,
    itemsPerPage: 10
  })
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Use the users hook with filters and pagination
  const {
    users,
    stats,
    pagination,
    loading,
    error,
    refreshUsers,
    deleteUser
  } = useUsers({
    filters,
    page: currentPage,
    limit: itemsPerPage
  })

  // Get pagination data from API response
  const totalItems = pagination?.totalCount || 0
  const totalPages = pagination?.totalPages || 0

  // Handlers
  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleFiltersReset = () => {
    setFilters({
      searchTerm: '',
      selectedRole: 'all',
      selectedStatus: 'all',
      currentPage: 1,
      itemsPerPage: 10
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

  const handleViewUser = (userId: string) => {
    router.push(`/dashboard/users/${userId}`)
  }

  const handleEditUser = (userId: string) => {
    router.push(`/dashboard/users/${userId}/edit`)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return
    }

    try {
      await deleteUser(userId)
      toast.success('Pengguna berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus pengguna')
      console.error('Error deleting user:', error)
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
          <Button onClick={refreshUsers}>
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
      <UserStatsCards stats={stats} loading={loading} />

      {/* Search and Filters */}
      <UserSearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
        loading={loading}
      />

      {/* Summary Info */}
      <div className="flex justify-start items-center py-2">
        <div className="text-sm text-muted-foreground">
          {totalItems > 0 && `Menampilkan ${totalItems} pengguna`}
        </div>
      </div>

      {/* Data View - Auto Responsive */}
      {isMobile ? (
        // Mobile: Always grid view
        <UserGridView
          users={users}
          loading={loading}
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      ) : (
        // Tablet & Desktop: Always table view
        <UserTableView
          users={users}
          loading={loading}
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onSort={handleSort}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <UserPagination
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
