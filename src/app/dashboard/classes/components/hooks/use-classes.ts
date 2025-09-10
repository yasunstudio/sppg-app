"use client"

import { useState, useEffect } from 'react'
import { Class, ClassStats, PaginationData } from '../utils/class-types'

interface ClassFilters {
  search?: string
  gradeLevel?: string
  academicYear?: string
  status?: string
}

interface UseClassesReturn {
  classes: Class[]
  stats: ClassStats
  pagination: PaginationData
  filters: ClassFilters
  isLoading: boolean
  error: string | null
  setPagination: (pagination: PaginationData | ((prev: PaginationData) => PaginationData)) => void
  setFilters: (filters: ClassFilters) => void
  refetch: () => void
}

export function useClasses(): UseClassesReturn {
  const [classes, setClasses] = useState<Class[]>([])
  const [stats, setStats] = useState<ClassStats>({
    totalClasses: 0,
    totalStudents: 0,
    averageCapacity: 0,
    occupancyRate: 0
  })
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const [filters, setFilters] = useState<ClassFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClasses = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.gradeLevel && { gradeLevel: filters.gradeLevel }),
        ...(filters.academicYear && { academicYear: filters.academicYear }),
        ...(filters.status && { status: filters.status })
      })

      const response = await fetch(`/api/classes?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch classes')
      }

      const data = await response.json()
      
      setClasses(data.classes || [])
      setStats(data.stats || {
        totalClasses: 0,
        totalStudents: 0,
        averageCapacity: 0,
        occupancyRate: 0
      })
      setPagination(prev => ({
        ...prev,
        totalPages: data.pagination?.totalPages || 1,
        totalItems: data.pagination?.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching classes:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch classes')
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    fetchClasses()
  }

  useEffect(() => {
    fetchClasses()
  }, [pagination.currentPage, pagination.itemsPerPage, filters])

  return {
    classes,
    stats,
    pagination,
    filters,
    isLoading,
    error,
    setPagination,
    setFilters,
    refetch
  }
}
