'use client'

import { useState } from 'react'
import { RefreshCw, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { RoleStatsCards } from './role-stats/role-stats-cards'
import { RoleTableView } from './role-table/role-table-view'
import { RoleGridView } from './role-table/role-grid-view'
import { RoleSearchFilters } from './role-filters/role-search-filters'
import { RolePagination } from './role-pagination/role-pagination'
import { useRoles } from './hooks/use-roles'
import { useResponsive } from './hooks/use-responsive'
import type { RoleFilters } from './utils/role-types'

export function RoleManagement() {
  const router = useRouter()
  const { isMobile, isTablet, isDesktop } = useResponsive()
  
  // State for filters and pagination
  const [filters, setFilters] = useState<RoleFilters>({
    searchTerm: '',
    selectedType: 'all',
    selectedPermission: 'all'
  })
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Use the roles hook with filters and pagination
  const {
    roles,
    stats,
    pagination,
    loading,
    isFiltering,
    error,
    refreshRoles,
    deleteRole
  } = useRoles({
    filters,
    page: currentPage,
    limit: itemsPerPage
  })

  // Handlers
  const handleFiltersChange = (newFilters: RoleFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleFiltersReset = () => {
    setFilters({
      searchTerm: '',
      selectedType: 'all',
      selectedPermission: 'all'
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

  const handleCreateRole = () => {
    router.push('/dashboard/roles/create')
  }

  const handleViewRole = (roleId: string) => {
    router.push(`/dashboard/roles/${roleId}`)
  }

  const handleEditRole = (roleId: string) => {
    router.push(`/dashboard/roles/${roleId}/edit`)
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus role ini?')) {
      return
    }

    try {
      await deleteRole(roleId)
      toast.success('Role berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus role')
      console.error('Error deleting role:', error)
    }
  }

  // Prepare pagination data for component
  const paginationData = pagination ? {
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalCount: pagination.totalCount,
    hasMore: pagination.hasMore,
    itemsPerPage: pagination.itemsPerPage
  } : {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false,
    itemsPerPage: 10
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-gray-100">Manajemen Role</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Kelola role dan permissions pengguna dalam sistem
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={refreshRoles}
            disabled={loading || isFiltering}
            className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(loading || isFiltering) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleCreateRole}
            className="dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Role
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <RoleStatsCards stats={stats} loading={loading} />

      {/* Search Filters */}
      <RoleSearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
        loading={loading || isFiltering}
      />

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/10">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Terjadi kesalahan
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={refreshRoles}
                  className="border-red-300 text-red-800 hover:bg-red-100 dark:border-red-600 dark:text-red-200 dark:hover:bg-red-900/20"
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Count */}
      <div className="flex justify-start items-center py-2">
        <div className="text-sm text-muted-foreground">
          {pagination?.totalCount && pagination.totalCount > 0 && `Menampilkan ${pagination.totalCount} role`}
        </div>
      </div>

      {/* Data View - Auto Responsive */}
      {isMobile ? (
        // Mobile: Always grid view
        <RoleGridView
          roles={roles}
          loading={loading || isFiltering}
          onView={handleViewRole}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
        />
      ) : (
        // Tablet & Desktop: Always table view
        <RoleTableView
          roles={roles}
          loading={loading || isFiltering}
          onRefresh={refreshRoles}
        />
      )}

      {/* Pagination */}
      {pagination && (
        <RolePagination
          pagination={paginationData}
          onPageChange={handlePageChange}
          onLimitChange={handleItemsPerPageChange}
          loading={loading || isFiltering}
        />
      )}
    </div>
  )
}
