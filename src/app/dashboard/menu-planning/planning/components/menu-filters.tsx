'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface MenuFiltersProps {
  filters: {
    search: string
    mealType: string
    isActive: boolean | undefined
    dateFrom: string
    dateTo: string
  }
  onFiltersChange: (filters: any) => void
}

export function MenuFilters({ filters, onFiltersChange }: MenuFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({
      search: '',
      mealType: 'all',
      isActive: undefined,
      dateFrom: '',
      dateTo: '',
    })
  }

  const hasActiveFilters = filters.search || 
    filters.mealType !== 'all' || 
    filters.isActive !== undefined || 
    filters.dateFrom || 
    filters.dateTo

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search menus..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="bg-background border-border"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select 
              value={filters.mealType} 
              onValueChange={(value) => onFiltersChange({ mealType: value })}
            >
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                <SelectValue placeholder="Meal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                <SelectItem value="LUNCH">Lunch</SelectItem>
                <SelectItem value="DINNER">Dinner</SelectItem>
                <SelectItem value="SNACK">Snack</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.isActive === undefined ? 'all' : filters.isActive.toString()} 
              onValueChange={(value) => onFiltersChange({ 
                isActive: value === 'all' ? undefined : value === 'true' 
              })}
            >
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="From Date"
                value={filters.dateFrom}
                onChange={(e) => onFiltersChange({ dateFrom: e.target.value })}
                className="w-full sm:w-40 bg-background border-border"
              />
              <Input
                type="date"
                placeholder="To Date"
                value={filters.dateTo}
                onChange={(e) => onFiltersChange({ dateTo: e.target.value })}
                className="w-full sm:w-40 bg-background border-border"
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-border hover:bg-muted"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
