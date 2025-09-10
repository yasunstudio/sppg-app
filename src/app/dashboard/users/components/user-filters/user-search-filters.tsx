'use client'

import { Search, Filter, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import type { UserFilters } from '../utils/user-types'
import { USER_STATUS_OPTIONS, USER_ROLE_OPTIONS } from '../utils/user-types'

interface UserSearchFiltersProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
  onReset: () => void
  loading?: boolean
}

export function UserSearchFilters({
  filters,
  onFiltersChange,
  onReset,
  loading = false
}: UserSearchFiltersProps) {
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

  const handleRoleChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedRole: value
    })
  }

  const handleReset = () => {
    onReset()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          {/* Search Input */}
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Cari pengguna
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Cari nama, email, atau username..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <Label htmlFor="status" className="sr-only">
              Filter status
            </Label>
            <Select
              value={filters.selectedStatus}
              onValueChange={handleStatusChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                {USER_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role Filter */}
          <div className="w-full lg:w-48">
            <Label htmlFor="role" className="sr-only">
              Filter role
            </Label>
            <Select
              value={filters.selectedRole}
              onValueChange={handleRoleChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter role" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={loading}
            className="w-full lg:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Active Filters Indicator */}
        {(filters.searchTerm || filters.selectedStatus !== 'all' || filters.selectedRole !== 'all') && (
          <div className="mt-4 text-sm text-muted-foreground">
            <Filter className="inline h-3 w-3 mr-1" />
            Filter aktif: {' '}
            {[
              filters.searchTerm && `Pencarian: "${filters.searchTerm}"`,
              filters.selectedStatus !== 'all' && `Status: ${USER_STATUS_OPTIONS.find(opt => opt.value === filters.selectedStatus)?.label}`,
              filters.selectedRole !== 'all' && `Role: ${USER_ROLE_OPTIONS.find(opt => opt.value === filters.selectedRole)?.label}`
            ].filter(Boolean).join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
