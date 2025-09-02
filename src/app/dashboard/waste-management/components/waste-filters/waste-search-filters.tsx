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
import type { FilterState } from '../utils/waste-types'

interface WasteSearchFiltersProps {
  filters: FilterState
  onSearchChange: (value: string) => void
  onWasteTypeChange: (value: string) => void
  onSourceChange: (value: string) => void
  onItemsPerPageChange: (value: string) => void
  itemsPerPage: number
}

export function WasteSearchFilters({
  filters,
  onSearchChange,
  onWasteTypeChange,
  onSourceChange,
  onItemsPerPageChange,
  itemsPerPage
}: WasteSearchFiltersProps) {
  const hasActiveFilters = filters.searchTerm || filters.selectedWasteType !== 'all' || filters.selectedSource !== 'all'

  const clearAllFilters = () => {
    onSearchChange('')
    onWasteTypeChange('all')
    onSourceChange('all')
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
        {/* Search Input - Full Width */}
        <div className="w-full">
          <Input
            placeholder="Cari berdasarkan sekolah, catatan, jenis, atau sumber..."
            value={filters.searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Filters - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select value={filters.selectedWasteType} onValueChange={onWasteTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semua jenis limbah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="ORGANIC">Organik</SelectItem>
              <SelectItem value="INORGANIC">Anorganik</SelectItem>
              <SelectItem value="PACKAGING">Kemasan</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.selectedSource} onValueChange={onSourceChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semua sumber" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Sumber</SelectItem>
              <SelectItem value="PREPARATION">Persiapan</SelectItem>
              <SelectItem value="PRODUCTION">Produksi</SelectItem>
              <SelectItem value="PACKAGING">Pengemasan</SelectItem>
              <SelectItem value="SCHOOL_LEFTOVER">Sisa Sekolah</SelectItem>
              <SelectItem value="EXPIRED_MATERIAL">Bahan Kadaluarsa</SelectItem>
            </SelectContent>
          </Select>

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
              className="w-full sm:w-auto justify-center"
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
