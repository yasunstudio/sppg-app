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

export function ClassManagement() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const { refetch, isLoading } = useClasses()
  
  const router = useRouter()

  const handleRefresh = () => {
    refetch()
    toast.success('Data berhasil dimuat ulang')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Kelas</h1>
          <p className="text-muted-foreground">
            Kelola data kelas dan informasi terkait
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Muat Ulang
        </Button>
      </div>

      <ClassStatsCards />

      <ClassSearchFilters 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'table' ? (
        <ClassTableView />
      ) : (
        <ClassGridView />
      )}

      {!isLoading && (
        <ClassPagination />
      )}
    </div>
  )
}
