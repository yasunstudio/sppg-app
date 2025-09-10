'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  hasMore: boolean
  itemsPerPage: number
}

interface RolePaginationProps {
  pagination: PaginationData
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  loading?: boolean
}

export function RolePagination({
  pagination,
  onPageChange,
  onLimitChange,
  loading = false
}: RolePaginationProps) {
  const { currentPage, totalPages, totalCount, itemsPerPage } = pagination

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalCount)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t dark:border-gray-700">
      {/* Items per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground dark:text-gray-400">Tampilkan</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onLimitChange(Number(value))}
          disabled={loading}
        >
          <SelectTrigger className="w-16 h-8 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
            <SelectItem value="5" className="dark:text-gray-100 dark:focus:bg-gray-600">5</SelectItem>
            <SelectItem value="10" className="dark:text-gray-100 dark:focus:bg-gray-600">10</SelectItem>
            <SelectItem value="20" className="dark:text-gray-100 dark:focus:bg-gray-600">20</SelectItem>
            <SelectItem value="50" className="dark:text-gray-100 dark:focus:bg-gray-600">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground dark:text-gray-400">entri</span>
      </div>

      {/* Page info */}
      <div className="text-sm text-muted-foreground dark:text-gray-400">
        Menampilkan {startItem} - {endItem} dari {totalCount} role
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || loading}
          className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number
            
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={currentPage === pageNum 
                  ? "dark:bg-blue-600 dark:text-white" 
                  : "dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                }
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || loading}
          className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
