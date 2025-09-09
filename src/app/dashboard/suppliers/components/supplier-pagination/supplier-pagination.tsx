'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationData } from '../utils/supplier-types'

interface SupplierPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (newItemsPerPage: number) => void
  loading?: boolean
}

export function SupplierPagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange,
  loading 
}: SupplierPaginationProps) {
  if (!totalItems || totalItems === 0) return null

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
              {currentPage} / {totalPages}
            </div>
            <div className="text-xs text-muted-foreground">
              {totalItems} total
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
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
          {Math.min(currentPage * itemsPerPage, totalItems)} dari{' '}
          {totalItems} entri
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
            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              let pageNumber
              if (totalPages <= 5) {
                pageNumber = index + 1
              } else if (currentPage <= 3) {
                pageNumber = index + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + index
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
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
