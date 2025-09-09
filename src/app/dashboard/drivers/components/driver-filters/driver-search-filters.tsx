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
import { Search, X, ArrowUpDown } from 'lucide-react'
import type { FilterState } from '../utils/driver-types'

interface DriverSearchFiltersProps {
  filters: FilterState
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onLicenseTypeChange: (value: string) => void
  onSortByChange: (value: string) => void
  onSortOrderChange: (value: 'asc' | 'desc') => void
  onItemsPerPageChange: (value: string) => void
  itemsPerPage: number
}

export function DriverSearchFilters({
  filters,
  onSearchChange,
  onStatusChange,
  onLicenseTypeChange,
  onSortByChange,
  onSortOrderChange,
  onItemsPerPageChange,
  itemsPerPage
}: DriverSearchFiltersProps) {
  const hasActiveFilters = filters.searchTerm || filters.statusFilter !== 'all' || filters.licenseTypeFilter !== 'all'

  const clearAllFilters = () => {
    onSearchChange('')
    onStatusChange('all')
    onLicenseTypeChange('all')
    onSortByChange('name')
    onSortOrderChange('asc')
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
        {/* Search Input */}
        <div className="w-full">
          <Input
            placeholder="Cari berdasarkan nama, ID karyawan, telepon, email, atau nomor SIM..."
            value={filters.searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <Select value={filters.statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status driver" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="true">Aktif</SelectItem>
              <SelectItem value="false">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.licenseTypeFilter} onValueChange={onLicenseTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tipe SIM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe SIM</SelectItem>
              <SelectItem value="SIM_A">SIM A</SelectItem>
              <SelectItem value="SIM_B1">SIM B1</SelectItem>
              <SelectItem value="SIM_B2">SIM B2</SelectItem>
              <SelectItem value="SIM_C">SIM C</SelectItem>
              <SelectItem value="SIM_D">SIM D</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Urutkan berdasarkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nama</SelectItem>
              <SelectItem value="employeeId">ID Karyawan</SelectItem>
              <SelectItem value="totalDeliveries">Total Pengiriman</SelectItem>
              <SelectItem value="licenseExpiry">Tanggal Habis SIM</SelectItem>
              <SelectItem value="createdAt">Tanggal Dibuat</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => onSortOrderChange(filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full justify-center"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {filters.sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </Button>

          <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per halaman</SelectItem>
              <SelectItem value="10">10 per halaman</SelectItem>
              <SelectItem value="25">25 per halaman</SelectItem>
              <SelectItem value="50">50 per halaman</SelectItem>
              <SelectItem value="100">100 per halaman</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="w-full justify-center"
            >
              <X className="mr-2 h-4 w-4" />
              Hapus Filter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
