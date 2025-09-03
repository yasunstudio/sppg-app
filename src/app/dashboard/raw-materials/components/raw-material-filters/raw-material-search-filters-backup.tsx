'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import type { FilterState } from '../utils/raw-material-types'

interface RawMaterialSearchFiltersProps {
  filters: FilterState
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onItemsPerPageChange: (value: string) => void
  itemsPerPage: number
}

export function RawMaterialSearchFilters({
  filters,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onItemsPerPageChange,
  itemsPerPage
}: RawMaterialSearchFiltersProps) {
  const hasActiveFilters = filters.searchTerm || 
    filters.selectedCategory !== 'all' || 
    filters.selectedStatus !== 'all'

  const clearAllFilters = () => {
    onSearchChange('')
    onCategoryChange('all')
    onStatusChange('all')
  }

  return (
    <Card className="bg-card dark:bg-card border-border dark:border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground dark:text-foreground">
          <Search className="h-5 w-5" />
          Pencarian & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* All components in one row for desktop, stacked for mobile */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama bahan baku..."
                value={filters.searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Select value={filters.selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Protein">Protein</SelectItem>
            <SelectItem value="Sayuran">Sayuran</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-32 h-11">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>

        <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
          <SelectTrigger className="w-24 h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={() => {
              onSearchChange('')
              onCategoryChange('all')
              onStatusChange('all')
            }}
            className="h-11"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
