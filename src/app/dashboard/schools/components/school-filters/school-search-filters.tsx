'use client'

import { useState } from 'react'
import { Search, Plus, RefreshCw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import type { SchoolFilters } from '../utils/school-types'

interface SchoolSearchFiltersProps {
  filters: SchoolFilters
  onFiltersChange: (filters: SchoolFilters) => void
  onCreateSchool: () => void
  onRefresh: () => void
  loading?: boolean
}

export function SchoolSearchFilters({
  filters,
  onFiltersChange,
  onCreateSchool,
  onRefresh,
  loading = false
}: SchoolSearchFiltersProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm)

  const handleSearch = (value: string) => {
    setLocalSearchTerm(value)
    onFiltersChange({
      ...filters,
      searchTerm: value
    })
  }

  const handleGradeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedGrade: value
    })
  }

  const handleRegionChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedRegion: value
    })
  }

  const handleClearFilters = () => {
    setLocalSearchTerm('')
    onFiltersChange({
      searchTerm: '',
      selectedGrade: 'all',
      selectedRegion: 'all'
    })
  }

  const hasActiveFilters = filters.searchTerm || filters.selectedGrade !== 'all' || filters.selectedRegion !== 'all'

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search and Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama sekolah, kepala sekolah, atau alamat..."
                value={localSearchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:flex-shrink-0">
              <Button
                variant="outline"
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Muat Ulang</span>
              </Button>
              
              <Button
                onClick={onCreateSchool}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Tambah Sekolah</span>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Grade Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Filter Tingkat
              </label>
              <Select
                value={filters.selectedGrade}
                onValueChange={handleGradeChange}
                disabled={loading}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Semua tingkat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tingkat</SelectItem>
                  <SelectItem value="sd">Sekolah Dasar (SD)</SelectItem>
                  <SelectItem value="smp">Sekolah Menengah Pertama (SMP)</SelectItem>
                  <SelectItem value="sma">Sekolah Menengah Atas (SMA)</SelectItem>
                  <SelectItem value="smk">Sekolah Menengah Kejuruan (SMK)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Filter Wilayah
              </label>
              <Select
                value={filters.selectedRegion}
                onValueChange={handleRegionChange}
                disabled={loading}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Semua wilayah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Wilayah</SelectItem>
                  <SelectItem value="purwakarta-kota">Purwakarta Kota</SelectItem>
                  <SelectItem value="campaka">Campaka</SelectItem>
                  <SelectItem value="jatiluhur">Jatiluhur</SelectItem>
                  <SelectItem value="plered">Plered</SelectItem>
                  <SelectItem value="sukatani">Sukatani</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={handleClearFilters}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Hapus Filter
                </Button>
              </div>
            )}
          </div>

          {/* Active Filters Indicator */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Filter aktif:</span>
              {filters.searchTerm && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Pencarian: "{filters.searchTerm}"
                </span>
              )}
              {filters.selectedGrade !== 'all' && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Tingkat: {filters.selectedGrade.toUpperCase()}
                </span>
              )}
              {filters.selectedRegion !== 'all' && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Wilayah: {filters.selectedRegion}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
