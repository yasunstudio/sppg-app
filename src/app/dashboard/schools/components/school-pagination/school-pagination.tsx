'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SchoolPaginationProps {
  currentPage: number
  totalPages: number
  totalRecords: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  isLoading?: boolean
}

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 per halaman' },
  { value: '25', label: '25 per halaman' },
  { value: '50', label: '50 per halaman' },
  { value: '100', label: '100 per halaman' },
]

export default function SchoolPagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false
}: SchoolPaginationProps) {
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalRecords)

  const canGoPrevious = currentPage > 1 && !isLoading
  const canGoNext = currentPage < totalPages && !isLoading

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalRecords === 0) {
    return null
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-t bg-background">
      {/* Info & Page Size Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Menampilkan {startRecord}-{endRecord} dari {totalRecords.toLocaleString('id-ID')} sekolah
        </div>
        
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value))}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
          className="hidden sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Sebelumnya</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              )
            }

            const pageNumber = page as number
            const isCurrent = pageNumber === currentPage

            return (
              <Button
                key={pageNumber}
                variant={isCurrent ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                disabled={isLoading}
                className={
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }
              >
                {pageNumber}
              </Button>
            )
          })}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
        >
          <span className="hidden sm:inline mr-1">Selanjutnya</span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          className="hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
