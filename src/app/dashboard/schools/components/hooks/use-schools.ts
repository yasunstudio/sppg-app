'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { School, SchoolStats, PaginationData, SchoolsResponse, SchoolFilters } from '../utils/school-types'

interface UseSchoolsProps {
  filters: SchoolFilters
  page: number
  limit: number
}

export const useSchools = ({ filters, page, limit }: UseSchoolsProps) => {
  const [schools, setSchools] = useState<School[]>([])
  const [stats, setStats] = useState<SchoolStats | null>(null)
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFiltering, setIsFiltering] = useState(false)

  const fetchSchools = useCallback(async (isFilteringRequest = false) => {
    try {
      if (isFilteringRequest) {
        setIsFiltering(true)
      } else {
        setLoading(true)
      }
      
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.searchTerm && { search: filters.searchTerm }),
        ...(filters.selectedGrade !== 'all' && { grade: filters.selectedGrade }),
        ...(filters.selectedRegion !== 'all' && { region: filters.selectedRegion }),
      })
      
      const response = await fetch(`/api/schools?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch schools')
      }
      
      const result: SchoolsResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch schools')
      }
      
      setSchools(result.data)
      setStats(result.stats)
      setPagination(result.pagination)
      
    } catch (error) {
      console.error('Error fetching schools:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      toast.error('Gagal memuat data sekolah')
    } finally {
      setLoading(false)
      setIsFiltering(false)
    }
  }, [filters, page, limit])

  useEffect(() => {
    fetchSchools()
  }, [fetchSchools])

  const refreshSchools = useCallback(() => {
    fetchSchools()
  }, [fetchSchools])

  const deleteSchool = useCallback(async (schoolId: string) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete school')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete school')
      }
      
      // Refresh data after successful deletion
      await fetchSchools()
      
    } catch (error) {
      console.error('Error deleting school:', error)
      throw error
    }
  }, [fetchSchools])

  return {
    schools,
    stats,
    pagination,
    loading,
    error,
    isFiltering,
    refreshSchools,
    deleteSchool
  }
}
