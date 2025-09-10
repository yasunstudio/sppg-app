"use client"

import { useState, useCallback } from 'react'

interface FilterState {
  search: string
  gradeLevel: string
  academicYear: string
  status: string
}

interface UseClassFiltersReturn {
  filters: FilterState
  setFilter: (key: keyof FilterState, value: string) => void
  setFilters: (filters: Partial<FilterState>) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  getFilterCount: () => number
}

const initialFilters: FilterState = {
  search: '',
  gradeLevel: '',
  academicYear: '',
  status: ''
}

export function useClassFilters(): UseClassFiltersReturn {
  const [filters, setFiltersState] = useState<FilterState>(initialFilters)

  const setFilter = useCallback((key: keyof FilterState, value: string) => {
    setFiltersState(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFiltersState(initialFilters)
  }, [])

  const hasActiveFilters = Boolean(
    filters.gradeLevel || 
    filters.academicYear || 
    filters.status
  )

  const getFilterCount = useCallback(() => {
    return [filters.gradeLevel, filters.academicYear, filters.status]
      .filter(Boolean).length
  }, [filters])

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
    getFilterCount
  }
}
