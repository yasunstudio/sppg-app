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
import type { FilterState } from '../utils/vehicle-types'
import { VEHICLE_TYPE_OPTIONS } from '../utils/vehicle-formatters'

interface VehicleSearchFiltersProps {
  filters: FilterState
  onSearchChange: (value: string) => void
  onVehicleTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
  onItemsPerPageChange: (value: string) => void
  itemsPerPage: number
}

export function VehicleSearchFilters({
  filters,
  onSearchChange,
  onVehicleTypeChange,
  onStatusChange,
  onItemsPerPageChange,
  itemsPerPage
}: VehicleSearchFiltersProps) {
  const hasActiveFilters = filters.searchTerm || filters.selectedType !== 'all' || filters.selectedStatus !== 'all'

  const clearAllFilters = () => {
    onSearchChange('')
    onVehicleTypeChange('all')
    onStatusChange('all')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Pencarian & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* All components in one row */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Cari berdasarkan nomor plat, jenis, atau catatan..."
              value={filters.searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select value={filters.selectedType} onValueChange={onVehicleTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua jenis kendaraan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              {VEHICLE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>

          <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Hapus Filter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
