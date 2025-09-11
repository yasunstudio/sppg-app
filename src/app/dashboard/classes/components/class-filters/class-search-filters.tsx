'use client'

import { Search, Filter, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import type { ClassFilters } from '../utils/class-types'

interface ClassSearchFiltersProps {
  filters: ClassFilters
  onFiltersChange: (filters: ClassFilters) => void
  onReset: () => void
  loading?: boolean
}

export function ClassSearchFilters({
  filters,
  onFiltersChange,
  onReset,
  loading = false
}: ClassSearchFiltersProps) {
  const handleSearchChange = (value: string) => {
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

  const handleSchoolChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedSchool: value
    })
  }

  const handleReset = () => {
    onReset()
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Cari Kelas</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Nama kelas, guru, sekolah..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Grade Filter */}
          <div className="space-y-2">
            <Label>Tingkat</Label>
            <Select 
              value={filters.selectedGrade} 
              onValueChange={handleGradeChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tingkat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkat</SelectItem>
                <SelectItem value="1">Kelas 1</SelectItem>
                <SelectItem value="2">Kelas 2</SelectItem>
                <SelectItem value="3">Kelas 3</SelectItem>
                <SelectItem value="4">Kelas 4</SelectItem>
                <SelectItem value="5">Kelas 5</SelectItem>
                <SelectItem value="6">Kelas 6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* School Filter */}
          <div className="space-y-2">
            <Label>Sekolah</Label>
            <Select 
              value={filters.selectedSchool} 
              onValueChange={handleSchoolChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih sekolah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Sekolah</SelectItem>
                {/* TODO: Load schools dynamically */}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              disabled={loading}
              className="flex-1"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Reset
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.searchTerm || filters.selectedGrade !== 'all' || filters.selectedSchool !== 'all') && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2">Filter aktif:</span>
              {filters.searchTerm && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Pencarian: "{filters.searchTerm}"
                </span>
              )}
              {filters.selectedGrade !== 'all' && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Kelas {filters.selectedGrade}
                </span>
              )}
              {filters.selectedSchool !== 'all' && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Sekolah terpilih
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
