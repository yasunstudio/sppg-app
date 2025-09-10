'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface StudentDetailsData {
  id: string
  nisn: string
  name: string
  age: number
  gender: 'MALE' | 'FEMALE'
  grade: string
  parentName: string
  schoolId: string
  allergies?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  school?: {
    id: string
    name: string
    principalName: string
    principalPhone: string
  }
  _count?: {
    distributions: number
    nutritionRecords: number
  }
}

interface UseStudentDetailsOptions {
  studentId: string
  onSuccess?: (student: StudentDetailsData) => void
  onError?: (error: string) => void
}

interface UseStudentDetailsReturn {
  student: StudentDetailsData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  deleteStudent: () => Promise<void>
  isDeleting: boolean
}

export function useStudentDetails({ 
  studentId, 
  onSuccess, 
  onError 
}: UseStudentDetailsOptions): UseStudentDetailsReturn {
  const [student, setStudent] = useState<StudentDetailsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudent = async () => {
    if (!studentId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/students/${studentId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch student details')
      }

      if (result.success && result.data) {
        setStudent(result.data)
        onSuccess?.(result.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load student details'
      setError(errorMessage)
      onError?.(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteStudent = async (): Promise<void> => {
    if (!studentId || !student) return

    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete student')
      }

      toast.success('Siswa berhasil dihapus')
      
      // Redirect will be handled by the component
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete student'
      toast.error(errorMessage)
      throw err // Re-throw to let component handle it
    } finally {
      setIsDeleting(false)
    }
  }

  const refetch = async (): Promise<void> => {
    await fetchStudent()
  }

  useEffect(() => {
    fetchStudent()
  }, [studentId])

  return {
    student,
    isLoading,
    error,
    refetch,
    deleteStudent,
    isDeleting
  }
}
