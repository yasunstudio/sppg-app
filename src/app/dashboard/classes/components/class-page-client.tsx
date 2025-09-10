"use client"

import { useState } from 'react'
import { ClassStatsCards } from './class-stats/class-stats-cards'
import { ClassSearchFilters } from './class-filters/class-search-filters'
import { ClassTableView } from './class-table/class-table-view'
import { ClassGridView } from './class-table/class-grid-view'
import { ClassPagination } from './class-pagination/class-pagination'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useRouter } from 'next/navigation'

export function ClassPageClient() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const handleCreateClass = () => {
    router.push('/dashboard/classes/create')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Kelas</h1>
          <p className="text-muted-foreground">
            Kelola kelas dan monitor kapasitas siswa
          </p>
        </div>
        <Button onClick={handleCreateClass} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Kelas
        </Button>
      </div>

      {/* Stats Cards */}
      <ClassStatsCards />

      {/* Filters and View Options */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kelas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClassSearchFilters 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          {/* Table/Grid View */}
          {viewMode === 'table' ? (
            <ClassTableView />
          ) : (
            <ClassGridView />
          )}

          {/* Pagination */}
          <ClassPagination />
        </CardContent>
      </Card>
    </div>
  )
}
