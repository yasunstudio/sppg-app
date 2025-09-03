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
import type { FilterState } from '../utils/supplier-types'
import { SUPPLIER_STATUS_OPTIONS } from '../utils/supplier-formatters'

interface SupplierSearchFiltersProps {
  filters: FilterState
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onItemsPerPageChange: (value: string) => void
  itemsPerPage: number
}

export function SupplierSearchFilters({
  filters,
  onSearchChange,
  onStatusChange,
  onItemsPerPageChange,
  itemsPerPage
}: SupplierSearchFiltersProps) {
  const hasActiveFilters = filters.searchTerm || filters.selectedStatus !== 'all'

  const clearAllFilters = () => {
    onSearchChange('')
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
            <Input
              placeholder="Cari berdasarkan nama, kontak, telepon, atau alamat..."
              value={filters.searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 lg:gap-3">
            <Select value={filters.selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full sm:w-[150px] bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input">
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent className="bg-popover dark:bg-popover border-border dark:border-border">
                {SUPPLIER_STATUS_OPTIONS.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
              <SelectTrigger className="w-full sm:w-[140px] bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover dark:bg-popover border-border dark:border-border">
                <SelectItem value="5" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">5</SelectItem>
                <SelectItem value="10" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">10</SelectItem>
                <SelectItem value="25" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">25</SelectItem>
                <SelectItem value="50" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">50</SelectItem>
                <SelectItem value="100" className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent">100</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <X className="h-4 w-4" />
                Hapus Filter
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
