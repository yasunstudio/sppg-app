"use client"

import { useState, useEffect, useCallback } from 'react'
import type { Class, ClassStats, ClassFilters } from '../utils/class-types'

interface UseClassesParams {
  filters?: ClassFilters
  page?: number
  limit?: number
}

interface UseClassesReturn {
  classes: Class[]
  stats: ClassStats
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    itemsPerPage: number
  } | null
  loading: boolean
  error: string | null
  refreshClasses: () => void
  createClass: (data: any) => Promise<Class>
  updateClass: (id: string, data: any) => Promise<Class>
  deleteClass: (id: string) => Promise<void>
  searchClasses: (term: string) => void
  filterByGrade: (grade: string) => void
  filterBySchool: (schoolId: string) => void
}

export function useClasses(params: UseClassesParams = {}): UseClassesReturn {
  const { filters, page = 1, limit = 10 } = params
  
  const [classes, setClasses] = useState<Class[]>([])
  const [stats, setStats] = useState<ClassStats>({
    totalClasses: 0,
    totalStudents: 0,
    totalCapacity: 0,
    averageCapacity: 0,
    occupancyRate: 0
  })
  const [pagination, setPagination] = useState<{
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    itemsPerPage: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const queryParams = new URLSearchParams({
        offset: ((page - 1) * limit).toString(),
        limit: limit.toString(),
        ...(filters?.selectedSchool && filters.selectedSchool !== 'all' && { 
          schoolId: filters.selectedSchool 
        }),
        ...(filters?.selectedGrade && filters.selectedGrade !== 'all' && { 
          grade: filters.selectedGrade 
        })
      })

      const response = await fetch(`/api/classes?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch classes')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch classes')
      }

      // Filter by search term on client side for now
      let classData = result.data || []
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        classData = classData.filter((classItem: any) => 
          classItem.name.toLowerCase().includes(searchLower) ||
          (classItem.teacherName && classItem.teacherName.toLowerCase().includes(searchLower)) ||
          (classItem.school?.name && classItem.school.name.toLowerCase().includes(searchLower))
        )
      }

      setClasses(classData)
      
      // Set stats from API response
      setStats(result.stats || {
        totalClasses: 0,
        totalStudents: 0,
        totalCapacity: 0,
        averageCapacity: 0,
        occupancyRate: 0
      })

      // Set pagination data
      setPagination(result.pagination || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching classes:', err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, filters])

  const createClass = useCallback(async (classData: any): Promise<Class> => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create class')
      }
      
      // Refresh the list
      await fetchClasses()
      
      return result.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create class')
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchClasses])

  const updateClass = useCallback(async (id: string, classData: any): Promise<Class> => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/classes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update class')
      }
      
      // Update local state
      setClasses(prev => 
        prev.map(classItem => 
          classItem.id === id ? result.data : classItem
        )
      )
      
      return result.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update class')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteClass = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/classes/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete class')
      }

      // Remove from local state
      setClasses(prev => prev.filter(classItem => classItem.id !== id))
      
      // Update stats
      await fetchClasses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete class')
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchClasses])

  const searchClasses = useCallback((term: string) => {
    // This will trigger a re-fetch through the filters dependency
    fetchClasses()
  }, [fetchClasses])

  const filterByGrade = useCallback((grade: string) => {
    fetchClasses()
  }, [fetchClasses])

  const filterBySchool = useCallback((schoolId: string) => {
    fetchClasses()
  }, [fetchClasses])

  const refreshClasses = useCallback(() => {
    fetchClasses()
  }, [fetchClasses])

  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  return {
    classes,
    stats,
    pagination,
    loading,
    error,
    refreshClasses,
    createClass,
    updateClass,
    deleteClass,
    searchClasses,
    filterByGrade,
    filterBySchool,
  }
}
