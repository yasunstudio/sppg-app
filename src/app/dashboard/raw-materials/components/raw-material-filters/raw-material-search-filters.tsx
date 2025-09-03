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
                className="pl-10 w-full bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 lg:gap-3">
            <Select value={filters.selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full sm:w-[150px] bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent className="bg-popover dark:bg-popover border-border dark:border-border">
                <SelectItem value="all" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Semua Kategori</SelectItem>
                <SelectItem value="CARBOHYDRATE" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Karbohidrat</SelectItem>
                <SelectItem value="PROTEIN" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Protein</SelectItem>
                <SelectItem value="VEGETABLE" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Sayuran</SelectItem>
                <SelectItem value="FRUIT" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Buah</SelectItem>
                <SelectItem value="DAIRY" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Produk Susu</SelectItem>
                <SelectItem value="SPICE" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Bumbu</SelectItem>
                <SelectItem value="OTHER" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Lainnya</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full sm:w-[130px] bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover dark:bg-popover border-border dark:border-border">
                <SelectItem value="all" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Semua Status</SelectItem>
                <SelectItem value="active" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Aktif</SelectItem>
                <SelectItem value="inactive" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>

            <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
              <SelectTrigger className="w-full sm:w-[80px] bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover dark:bg-popover border-border dark:border-border">
                <SelectItem value="5" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">5</SelectItem>
                <SelectItem value="10" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">10</SelectItem>
                <SelectItem value="20" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">20</SelectItem>
                <SelectItem value="50" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">50</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <X className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Filter aktif:</span>
            {filters.searchTerm && (
              <div className="flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                <span>Pencarian: "{filters.searchTerm}"</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-secondary-foreground/20"
                  onClick={() => onSearchChange('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            {filters.selectedCategory !== 'all' && (
              <div className="flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                <span>Kategori: {filters.selectedCategory}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-secondary-foreground/20"
                  onClick={() => onCategoryChange('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            {filters.selectedStatus !== 'all' && (
              <div className="flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                <span>Status: {filters.selectedStatus === 'active' ? 'Aktif' : 'Tidak Aktif'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-secondary-foreground/20"
                  onClick={() => onStatusChange('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
