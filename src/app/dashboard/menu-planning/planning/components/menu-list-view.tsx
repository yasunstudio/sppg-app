'use client'

import { MenuFilters } from './menu-filters'
import { MenuCard } from './menu-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface MenuListViewProps {
  menus: any[]
  isLoading: boolean
  error: any
  filters: any
  onFiltersChange: (filters: any) => void
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function MenuListView({
  menus,
  isLoading,
  error,
  filters,
  onFiltersChange,
  pagination,
}: MenuListViewProps) {
  if (error) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardContent className="p-8 text-center">
          <p className="text-destructive">Failed to load menu data</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <MenuFilters 
        filters={filters}
        onFiltersChange={onFiltersChange}
      />

      {/* Menu Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-card/80 backdrop-blur-sm border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : menus.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => onFiltersChange({ page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
                className="border-border hover:bg-muted"
              >
                Previous
              </Button>
              
              <span className="text-sm text-muted-foreground px-4">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => onFiltersChange({ page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.totalPages}
                className="border-border hover:bg-muted"
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No menus found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your filters or create a new menu
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
