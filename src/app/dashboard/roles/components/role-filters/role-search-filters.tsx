'use client'

import { Search, Filter, RefreshCw, Shield } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { ROLE_TYPES, PERMISSION_OPTIONS } from '../utils/role-schemas'
import type { RoleFilters } from '../utils/role-types'

interface RoleSearchFiltersProps {
  filters: RoleFilters
  onFiltersChange: (filters: RoleFilters) => void
  onReset: () => void
  loading?: boolean
}

export function RoleSearchFilters({
  filters,
  onFiltersChange,
  onReset,
  loading = false
}: RoleSearchFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchTerm: value
    })
  }

  const handleTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedType: value
    })
  }

  const handlePermissionChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedPermission: value
    })
  }

  const handleReset = () => {
    onReset()
  }

  return (
    <Card className="dark:bg-gray-800/50 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="dark:text-gray-200">Cari Role</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-gray-400" />
              <Input
                id="search"
                placeholder="Nama role, deskripsi..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                disabled={loading}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <Label className="dark:text-gray-200">Tipe Role</Label>
            <Select 
              value={filters.selectedType} 
              onValueChange={handleTypeChange}
              disabled={loading}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                {ROLE_TYPES.map((type) => (
                  <SelectItem 
                    key={type.value} 
                    value={type.value}
                    className="dark:text-gray-100 dark:focus:bg-gray-600"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Permission Filter */}
          <div className="space-y-2">
            <Label className="dark:text-gray-200">Permission</Label>
            <Select 
              value={filters.selectedPermission} 
              onValueChange={handlePermissionChange}
              disabled={loading}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                <SelectValue placeholder="Pilih permission" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem 
                  value="all"
                  className="dark:text-gray-100 dark:focus:bg-gray-600"
                >
                  Semua Permission
                </SelectItem>
                {PERMISSION_OPTIONS.map((permission) => (
                  <SelectItem 
                    key={permission.value} 
                    value={permission.value}
                    className="dark:text-gray-100 dark:focus:bg-gray-600"
                  >
                    {permission.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <div className="space-y-2">
            <Label className="opacity-0">Reset</Label>
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={loading}
              className="w-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filters.searchTerm || filters.selectedType !== 'all' || filters.selectedPermission !== 'all') && (
          <div className="mt-4 pt-4 border-t dark:border-gray-600">
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
              <Filter className="h-4 w-4" />
              <span>Filter aktif:</span>
              {filters.searchTerm && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                  Pencarian: {filters.searchTerm}
                </span>
              )}
              {filters.selectedType !== 'all' && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs">
                  Tipe: {ROLE_TYPES.find(t => t.value === filters.selectedType)?.label}
                </span>
              )}
              {filters.selectedPermission !== 'all' && (
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs">
                  Permission: {PERMISSION_OPTIONS.find(p => p.value === filters.selectedPermission)?.label}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
