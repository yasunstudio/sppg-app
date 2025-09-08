import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationData } from '../utils/waste-types'

interface WastePaginationProps {
  pagination: PaginationData
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function WastePagination({ pagination, currentPage, itemsPerPage, onPageChange }: WastePaginationProps) {
  if (!pagination || pagination.totalCount === 0) return null

  return (
    <div className="border-t">
      {/* Mobile Pagination */}
      <div className="px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="flex-shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 text-center">
            <div className="text-sm font-medium">
              {currentPage} / {pagination.totalPages}
            </div>
            <div className="text-xs text-muted-foreground">
              {pagination.totalCount} total
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage >= pagination.totalPages}
            className="flex-shrink-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Pagination */}
      <div className="hidden md:flex items-center justify-between px-6 py-4">
        <div className="text-sm text-muted-foreground">
          Menampilkan {((currentPage - 1) * itemsPerPage) + 1} sampai{' '}
          {Math.min(currentPage * itemsPerPage, pagination.totalCount)} dari{' '}
          {pagination.totalCount} entri
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, index) => {
              let pageNumber
              if (pagination.totalPages <= 5) {
                pageNumber = index + 1
              } else if (currentPage <= 3) {
                pageNumber = index + 1
              } else if (currentPage >= pagination.totalPages - 2) {
                pageNumber = pagination.totalPages - 4 + index
              } else {
                pageNumber = currentPage - 2 + index
              }
              
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage >= pagination.totalPages}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
