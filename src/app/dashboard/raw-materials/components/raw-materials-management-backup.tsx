'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Grid, List, RefreshCw, Package } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Import modular components
import { useResponsive } from './hooks/use-responsive'
import { RawMaterialStatsCards } from './raw-material-stats/raw-material-stats-cards'
import { RawMaterialSearchFilters } from './raw-material-filters/raw-material-search-filters'
import { RawMaterialGridView } from './raw-material-table/raw-material-grid-view'
import { RawMaterialTableView } from './raw-material-table/raw-material-table-view'
import { RawMaterialPagination } from './raw-material-pagination/raw-material-pagination'
import { RESPONSIVE_SPACING, LAYOUT_PATTERNS } from './utils/raw-material-spacing'
import type { 
  RawMaterial, 
  RawMaterialStats,
  FilterState,
  PaginationState,
  PaginationData,
  ViewMode
} from './utils/raw-material-types'

// Mock data - will be replaced with API calls
const mockRawMaterials: RawMaterial[] = [
  {
    id: '1',
    name: 'Beras Putih',
    category: 'GRAIN',
    unit: 'kg',
    description: 'Beras putih organik kualitas premium',
    minimumStock: 50,
    currentStock: 150,
    costPerUnit: 12000,
    supplier: {
      id: '1',
      name: 'PT Beras Nusantara'
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    _count: {
      inventory: 5,
      menuItemIngredients: 12
    }
  },
  {
    id: '2',
    name: 'Daging Ayam',
    category: 'PROTEIN',
    unit: 'kg',
    description: 'Daging ayam segar tanpa kulit',
    minimumStock: 30,
    currentStock: 25,
    costPerUnit: 35000,
    supplier: {
      id: '2',
      name: 'CV Ayam Sehat'
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
    _count: {
      inventory: 3,
      menuItemIngredients: 8
    }
  },
  {
    id: '3',
    name: 'Wortel',
    category: 'VEGETABLE',
    unit: 'kg',
    description: 'Wortel segar pilihan',
    minimumStock: 20,
    currentStock: 80,
    costPerUnit: 8000,
    supplier: {
      id: '3',
      name: 'Tani Sejahtera'
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12',
    _count: {
      inventory: 2,
      menuItemIngredients: 15
    }
  }
]

const mockStats: RawMaterialStats = {
  total: 156,
  lowStock: 8,
  categories: 9,
  totalValue: 25000000
}

export function RawMaterialsManagement() {
  const router = useRouter()
  const { isMobile } = useResponsive()
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: 'all',
    selectedStatus: 'all'
  })

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10
  })

  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(mockRawMaterials)
  const [stats, setStats] = useState<RawMaterialStats>(mockStats)
  const [loading, setLoading] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)

  // Filter logic
  const filteredRawMaterials = rawMaterials.filter(material => {
    const matchesSearch = filters.searchTerm === '' || 
      material.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
    
    const matchesCategory = filters.selectedCategory === 'all' || 
      material.category === filters.selectedCategory
      
    const matchesStatus = filters.selectedStatus === 'all' || 
      (filters.selectedStatus === 'active' && material.isActive) ||
      (filters.selectedStatus === 'inactive' && !material.isActive)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Pagination logic
  const totalItems = filteredRawMaterials.length
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage)
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
  const endIndex = startIndex + pagination.itemsPerPage
  const paginatedRawMaterials = filteredRawMaterials.slice(startIndex, endIndex)
  
  const paginationData: PaginationData = {
    totalCount: totalItems,
    totalPages,
    currentPage: pagination.currentPage,
    hasNextPage: pagination.currentPage < totalPages,
    hasPreviousPage: pagination.currentPage > 1,
    limit: pagination.itemsPerPage
  }

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, selectedCategory: value }))
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

  const handleCreateRawMaterial = () => {
    router.push('/dashboard/raw-materials/create')
  }

  const handleDelete = async (rawMaterialId: string): Promise<boolean> => {
    try {
      // Mock delete operation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setRawMaterials(prev => prev.filter(material => material.id !== rawMaterialId))
      toast.success('Bahan baku berhasil dihapus')
      return true
    } catch (error) {
      toast.error('Gagal menghapus bahan baku')
      return false
    }
  }
  
  const isFiltering = filters.searchTerm !== '' || 
    filters.selectedCategory !== 'all' || 
    filters.selectedStatus !== 'all'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 space-y-8">
        {/* Professional Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Manajemen Bahan Baku
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Kelola dan pantau stok bahan baku untuk produksi makanan sekolah
              </p>
            </div>
            
            {/* Action Buttons with Professional Design */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full sm:w-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className={cn(
                  "w-4 h-4 mr-2",
                  refreshing && "animate-spin"
                )} />
                {refreshing ? 'Memperbarui...' : 'Perbarui'}
              </Button>
              
              <Link href="/dashboard/raw-materials/create">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Bahan Baku
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Professional Statistics Section */}
        <div className="space-y-4">
          <RawMaterialStatsCards 
            stats={stats} 
            loading={loading}
          />
        </div>

        {/* Enhanced Main Content Card */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Daftar Bahan Baku
                </CardTitle>
                {isFiltering && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Menampilkan {filteredRawMaterials.length} dari {rawMaterials.length} item
                  </p>
                )}
              </div>
              
              {/* Professional View Toggle */}
              {!isMobile && (
                <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                  <Tabs 
                    value={viewMode} 
                    onValueChange={(value) => setViewMode(value as ViewMode)}
                    className="w-auto"
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0 space-x-1">
                      <TabsTrigger 
                        value="grid" 
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Grid className="w-4 h-4" />
                        <span className="hidden sm:inline">Grid</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="table" 
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <List className="w-4 h-4" />
                        <span className="hidden sm:inline">Tabel</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Professional Search and Filters Section */}
            <div className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30">
              <div className="p-6">
                <RawMaterialSearchFilters
                  filters={filters}
                  onSearchChange={(value: string) => handleFilterChange({ searchTerm: value })}
                  onCategoryChange={(value: string) => handleFilterChange({ selectedCategory: value })}
                  onStatusChange={(value: string) => handleFilterChange({ selectedStatus: value })}
                  onItemsPerPageChange={(itemsPerPage: string) => 
                    handlePaginationChange({ itemsPerPage: parseInt(itemsPerPage), currentPage: 1 })
                  }
                  itemsPerPage={pagination.itemsPerPage}
                />
              </div>
            </div>
            
            {/* Enhanced Data Display Section */}
            <div className="p-6">
              {paginatedRawMaterials.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {isFiltering ? 'Tidak ada data yang sesuai' : 'Belum ada bahan baku'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                      {isFiltering 
                        ? 'Coba ubah filter pencarian atau tambah bahan baku baru'
                        : 'Mulai dengan menambah bahan baku pertama Anda'
                      }
                    </p>
                  </div>
                  {!isFiltering && (
                    <Link href="/dashboard/raw-materials/create">
                      <Button className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Bahan Baku
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Enhanced Responsive View Logic */}
                  {isMobile ? (
                    /* Mobile: Always Grid View */
                    <RawMaterialGridView
                      rawMaterials={paginatedRawMaterials}
                      isFiltering={isFiltering}
                      onDelete={handleDelete}
                    />
                  ) : (
                    /* Desktop/Tablet: Switchable Views */
                    <>
                      {viewMode === 'grid' && (
                        <RawMaterialGridView
                          rawMaterials={paginatedRawMaterials}
                          isFiltering={isFiltering}
                          onDelete={handleDelete}
                        />
                      )}
                      
                      {viewMode === 'table' && (
                        <RawMaterialTableView
                          rawMaterials={paginatedRawMaterials}
                          isFiltering={isFiltering}
                          onDelete={handleDelete}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Professional Pagination Section */}
            {paginatedRawMaterials.length > 0 && totalPages > 1 && (
              <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 px-6 py-4">
                <RawMaterialPagination
                  pagination={paginationData}
                  currentPage={pagination.currentPage}
                  itemsPerPage={pagination.itemsPerPage}
                  onPageChange={(currentPage) => handlePaginationChange({ currentPage })}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
