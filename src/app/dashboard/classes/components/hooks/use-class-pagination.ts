"use client"

import { useState, useCallback } from 'react'

interface UseClassPaginationProps {
  totalItems: number
  initialPage?: number
  initialItemsPerPage?: number
}

interface UseClassPaginationReturn {
  currentPage: number
  itemsPerPage: number
  totalPages: number
  startItem: number
  endItem: number
  canGoPrevious: boolean
  canGoNext: boolean
  setCurrentPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  goToFirstPage: () => void
  goToLastPage: () => void
  goToPreviousPage: () => void
  goToNextPage: () => void
  getPageItems: <T>(items: T[]) => T[]
}

export function useClassPagination({
  totalItems,
  initialPage = 1,
  initialItemsPerPage = 10
}: UseClassPaginationProps): UseClassPaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage)

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const setItemsPerPage = useCallback((newItemsPerPage: number) => {
    setItemsPerPageState(newItemsPerPage)
    // Reset to first page when changing items per page
    setCurrentPage(1)
  }, [])

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages)
  }, [totalPages])

  const goToPreviousPage = useCallback(() => {
    if (canGoPrevious) {
      setCurrentPage(prev => prev - 1)
    }
  }, [canGoPrevious])

  const goToNextPage = useCallback(() => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1)
    }
  }, [canGoNext])

  const getPageItems = useCallback(<T,>(items: T[]): T[] => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return items.slice(start, end)
  }, [currentPage, itemsPerPage])

  // Ensure current page is valid when totalPages changes
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages))
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage)
  }

  return {
    currentPage: validCurrentPage,
    itemsPerPage,
    totalPages,
    startItem,
    endItem,
    canGoPrevious,
    canGoNext,
    setCurrentPage,
    setItemsPerPage,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    getPageItems
  }
}
