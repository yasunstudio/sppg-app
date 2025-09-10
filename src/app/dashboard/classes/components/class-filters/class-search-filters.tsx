'use client'

import { LayoutGrid, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ClassSearchFiltersProps {
  viewMode: 'table' | 'grid'
  onViewModeChange: (mode: 'table' | 'grid') => void
}

export function ClassSearchFilters({
  viewMode,
  onViewModeChange
}: ClassSearchFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan data kelas
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('table')}
            >
              <Table className="mr-2 h-4 w-4" />
              Tabel
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Grid
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
