'use client'

import { Search, Filter, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import type { VehicleFilters } from '../utils/vehicle-types'

interface VehicleSearchFiltersProps {
  filters: VehicleFilters
  onFiltersChange: (filters: VehicleFilters) => void
  onReset: () => void
  loading?: boolean
}

export function VehicleSearchFilters({
  filters,
  onFiltersChange,
  onReset,
  loading = false
}: VehicleSearchFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchTerm: value
    })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedStatus: value
    })
  }

  const handleTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedType: value
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
            <Label htmlFor="search">Cari Kendaraan</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Plat nomor, tipe, driver..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={filters.selectedStatus} 
              onValueChange={handleStatusChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <Label>Tipe Kendaraan</Label>
            <Select 
              value={filters.selectedType} 
              onValueChange={handleTypeChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="TRUCK">Truk</SelectItem>
                <SelectItem value="VAN">Van</SelectItem>
                <SelectItem value="MOTORCYCLE">Motor</SelectItem>
                <SelectItem value="CAR">Mobil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="flex-1"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atur Ulang
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.searchTerm || filters.selectedStatus !== 'all' || filters.selectedType !== 'all') && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Filter aktif:</span>
              
              {filters.searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
                  Pencarian: "{filters.searchTerm}"
                </span>
              )}
              
              {filters.selectedStatus !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs">
                  Status: {filters.selectedStatus}
                </span>
              )}
              
              {filters.selectedType !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-800 text-xs">
                  Tipe: {filters.selectedType}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
