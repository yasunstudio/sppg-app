'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationData } from '../utils/raw-material-types'
import { RESPONSIVE_SPACING } from '../utils/raw-material-spacing'

interface RawMaterialPaginationProps {
  pagination: PaginationData
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function RawMaterialPagination({ pagination, currentPage, itemsPerPage, onPageChange }: RawMaterialPaginationProps) {
  if (!pagination || pagination.totalCount === 0) return null

  return (
    <div className="border-t border-border dark:border-border">
      {/* Mobile Pagination */}
      <div className={`${RESPONSIVE_SPACING.tablePadding} py-3 md:hidden`}>
        <div className={`flex items-center justify-between ${RESPONSIVE_SPACING.buttonGroup}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="flex-shrink-0 bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 text-center">
            <div className="text-sm font-medium text-foreground dark:text-foreground">
              {currentPage} / {pagination.totalPages}
            </div>
            <div className="text-xs text-muted-foreground dark:text-muted-foreground">
              {pagination.totalCount} total
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage >= pagination.totalPages}
            className="flex-shrink-0 bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Pagination */}
      <div className={`hidden md:flex items-center justify-between ${RESPONSIVE_SPACING.tablePadding} py-4`}>
        <div className="text-sm text-muted-foreground dark:text-muted-foreground">
          Menampilkan {((currentPage - 1) * itemsPerPage) + 1} sampai{' '}
          {Math.min(currentPage * itemsPerPage, pagination.totalCount)} dari{' '}
          {pagination.totalCount} entri
        </div>
        <div className={`flex items-center ${RESPONSIVE_SPACING.buttonGroup}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          
          <div className={`flex items-center ${RESPONSIVE_SPACING.buttonGroup}`}>
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
                  className={`w-8 h-8 p-0 ${
                    currentPage === pageNumber 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent'
                  }`}
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
            className="bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent"
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
