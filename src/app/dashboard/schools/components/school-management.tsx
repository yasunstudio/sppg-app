'use client'

import { useState } from 'react'
import { Download, FileText, Upload, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'

// Import components
import { SchoolStatsCards } from './school-stats/school-stats-cards'
import { SchoolSearchFilters } from './school-filters/school-search-filters'
import { SchoolTableView } from './school-table/school-table-view'
import { SchoolGridView } from './school-table/school-grid-view'
import { SchoolPagination } from './school-pagination'

// Import hooks
import { useSchools } from './hooks/use-schools'
import { useResponsive } from './hooks/use-responsive'

// Import types
import type { SchoolFilters } from './utils/school-types'

export default function SchoolManagement() {
  const router = useRouter()
  const { isMobile } = useResponsive()
  
  const [view, setView] = useState<'table' | 'grid'>(isMobile ? 'grid' : 'table')
  const [filters, setFilters] = useState<SchoolFilters>({
    searchTerm: '',
    selectedGrade: 'all',
    selectedRegion: 'all'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const {
    schools,
    stats,
    pagination,
    loading,
    error,
    isFiltering,
    refreshSchools,
    deleteSchool
  } = useSchools({
    filters,
    page: currentPage,
    limit: pageSize
  })

  const totalPages = pagination?.totalPages || 0
  const totalRecords = pagination?.totalCount || 0

  const handleFilterChange = (newFilters: SchoolFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  const handleSchoolView = (schoolId: string) => {
    router.push(`/dashboard/schools/${schoolId}`)
  }

  const handleSchoolEdit = (schoolId: string) => {
    router.push(`/dashboard/schools/${schoolId}/edit`)
  }

  const handleSchoolCreate = () => {
    router.push('/dashboard/schools/create')
  }

  const handleSchoolDelete = async (schoolId: string): Promise<boolean> => {
    try {
      await deleteSchool(schoolId)
      await refreshSchools()
      return true
    } catch (error) {
      return false
    }
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export schools data')
  }

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Import schools data')
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gagal memuat data</h3>
            <p className="text-muted-foreground mb-4">
              Terjadi kesalahan saat memuat data sekolah
            </p>
            <Button onClick={() => refreshSchools()}>Coba Lagi</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Sekolah</h1>
          <p className="text-muted-foreground">
            Kelola data sekolah dan informasi terkait
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleImport} className="w-full sm:w-auto">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSchoolCreate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Sekolah
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <SchoolStatsCards stats={stats} loading={loading} />

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Daftar Sekolah</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Filters */}
          <div className="p-6 border-b">
            <SchoolSearchFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
              onCreateSchool={handleSchoolCreate}
              onRefresh={refreshSchools}
              loading={loading}
            />
          </div>

          {/* View Tabs */}
          <div className="p-6 border-b">
            <Tabs 
              value={view} 
              onValueChange={(value) => setView(value as 'table' | 'grid')}
            >
              <TabsList>
                <TabsTrigger value="table">Tabel</TabsTrigger>
                <TabsTrigger value="grid">Kartu</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="mt-4">
                <SchoolTableView
                  schools={schools}
                  loading={loading}
                  isFiltering={isFiltering}
                  onDeleteSchool={handleSchoolDelete}
                />
              </TabsContent>

              <TabsContent value="grid" className="mt-4">
                <SchoolGridView
                  schools={schools}
                  loading={loading}
                  isFiltering={isFiltering}
                  onDelete={handleSchoolDelete}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Pagination */}
          <SchoolPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={loading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
