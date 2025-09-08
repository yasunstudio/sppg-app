"use client"

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
import type { FilterState } from '../utils/user-role-types'

interface UserRoleSearchFiltersProps {
  filters: FilterState
  onSearchChange: (value: string) => void
  onRoleChange: (value: string) => void
  onStatusChange: (value: string) => void
  onUserChange: (value: string) => void
  onItemsPerPageChange: (value: string) => void
  itemsPerPage: number
}

export function UserRoleSearchFilters({
  filters,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onUserChange,
  onItemsPerPageChange,
  itemsPerPage
}: UserRoleSearchFiltersProps) {
  const hasActiveFilters = filters.searchTerm || 
    filters.selectedRole !== 'all' || 
    filters.selectedStatus !== 'all' || 
    filters.selectedUser !== 'all'

  const clearAllFilters = () => {
    onSearchChange('')
    onRoleChange('all')
    onStatusChange('all') 
    onUserChange('all')
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
            placeholder="Cari berdasarkan nama pengguna, email, atau role..."
            value={filters.searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Role Filter */}
          <Select value={filters.selectedRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semua role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="CHEF">Chef</SelectItem>
              <SelectItem value="NUTRITIONIST">Nutritionist</SelectItem>
              <SelectItem value="PRODUCTION_STAFF">Production Staff</SelectItem>
              <SelectItem value="QUALITY_CONTROL">Quality Control</SelectItem>
              <SelectItem value="WAREHOUSE_MANAGER">Warehouse Manager</SelectItem>
              <SelectItem value="VIEWER">Viewer</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={filters.selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>

          {/* User Filter */}
          <Select value={filters.selectedUser} onValueChange={onUserChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semua pengguna" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pengguna</SelectItem>
              {/* TODO: Add dynamic user options */}
            </SelectContent>
          </Select>

          {/* Items Per Page */}
          <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per halaman</SelectItem>
              <SelectItem value="10">10 per halaman</SelectItem>
              <SelectItem value="20">20 per halaman</SelectItem>
              <SelectItem value="50">50 per halaman</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <div className="flex justify-end">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
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
