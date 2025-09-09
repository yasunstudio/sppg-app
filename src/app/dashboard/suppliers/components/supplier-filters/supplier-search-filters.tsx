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
import { Search, X, Plus, RefreshCw } from 'lucide-react'
import type { SupplierFilters } from '../utils/supplier-types'

interface SupplierSearchFiltersProps {
  filters: SupplierFilters
  onFiltersChange: (filters: SupplierFilters) => void
  onCreateSupplier: () => void
  onRefresh: () => void
  loading: boolean
}

export function SupplierSearchFilters({
  filters,
  onFiltersChange,
  onCreateSupplier,
  onRefresh,
  loading
}: SupplierSearchFiltersProps) {
  const hasActiveFilters = filters.searchTerm || filters.selectedStatus !== 'all'

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: '',
      selectedStatus: 'all'
    })
  }

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, selectedStatus: value as 'all' | 'active' | 'inactive' })
  }

  return (
    <Card className="bg-card dark:bg-card border-border dark:border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-foreground">
            <Search className="h-5 w-5" />
            Pencarian & Filter
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              onClick={onRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={onCreateSupplier} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Supplier
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* All components in one row for desktop, stacked for mobile */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari supplier, kontak, telepon..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-background dark:bg-background text-foreground dark:text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="min-w-[140px]">
            <Select value={filters.selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-background dark:bg-background text-foreground dark:text-foreground border-border dark:border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-background border-border dark:border-border">
                <SelectItem value="all" className="text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted">
                  Semua Status
                </SelectItem>
                <SelectItem value="active" className="text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted">
                  Aktif
                </SelectItem>
                <SelectItem value="inactive" className="text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted">
                  Tidak Aktif
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
