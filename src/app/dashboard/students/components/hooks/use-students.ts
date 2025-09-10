'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { Student, StudentStats, PaginationData, StudentsResponse, StudentFilters } from '../utils/student-types'

interface UseStudentsProps {
  filters: StudentFilters
  page: number
  limit: number
}

export const useStudents = ({ filters, page, limit }: UseStudentsProps) => {
  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFiltering, setIsFiltering] = useState(false)

  const fetchStudents = useCallback(async (isFilteringRequest = false) => {
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
        ...(filters.selectedGender !== 'all' && { gender: filters.selectedGender }),
        ...(filters.selectedSchool !== 'all' && { school: filters.selectedSchool }),
        ...(filters.selectedAge !== 'all' && { age: filters.selectedAge }),
      })
      
      const response = await fetch(`/api/students?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }
      
      const result: StudentsResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch students')
      }
      
      setStudents(result.data)
      setPagination(result.pagination)
      
      // Calculate stats from the student data
      const totalStudents = result.data.length
      const totalMaleStudents = result.data.filter(student => student.gender === 'MALE').length
      const totalFemaleStudents = result.data.filter(student => student.gender === 'FEMALE').length
      
      // Calculate average age
      const averageAge = totalStudents > 0 
        ? Math.round(result.data.reduce((acc, student) => acc + student.age, 0) / totalStudents)
        : 0
      
      // Get unique schools count
      const uniqueSchools = new Set(result.data.map(student => student.schoolId).filter(Boolean))
      const totalSchools = uniqueSchools.size
      
      // Calculate consultation stats if available
      const studentsWithConsultations = result.data.filter(student => 
        student._count?.nutritionConsultations && student._count.nutritionConsultations > 0
      ).length
      
      const recentConsultations = result.data.reduce((acc, student) => 
        acc + (student._count?.nutritionConsultations || 0), 0
      )
      
      // Set calculated stats
      setStats({
        totalStudents,
        totalMaleStudents,
        totalFemaleStudents,
        averageAge,
        totalSchools,
        studentsWithConsultations,
        recentConsultations
      })
      
    } catch (error) {
      console.error('Error fetching students:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      toast.error('Gagal memuat data siswa')
    } finally {
      setLoading(false)
      setIsFiltering(false)
    }
  }, [filters, page, limit])

  // Initial fetch
  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  // Refresh function
  const refreshStudents = useCallback(() => {
    fetchStudents()
  }, [fetchStudents])

  // Delete student function
  const deleteStudent = useCallback(async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete student')
      }
      
      toast.success('Siswa berhasil dihapus')
      await fetchStudents()
      
    } catch (error) {
      console.error('Error deleting student:', error)
      throw error
    }
  }, [fetchStudents])

  return {
    students,
    stats,
    pagination,
    loading,
    error,
    isFiltering,
    refreshStudents,
    deleteStudent
  }
}
