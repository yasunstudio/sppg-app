"use client"

import { useState, useEffect } from 'react'

interface ClassDetailsData {
  id: string
  name: string
  grade: number
  capacity: number
  currentCount: number
  teacherName?: string | null
  notes?: string | null
  schoolId: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  school?: {
    id: string
    name: string
  }
}

interface UseClassDetailsReturn {
  classData: ClassDetailsData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateClass: (data: Partial<ClassDetailsData>) => Promise<void>
  deleteClass: () => Promise<void>
}

export function useClassDetails(classId: string): UseClassDetailsReturn {
  const [classData, setClassData] = useState<ClassDetailsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClass = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/classes/${classId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch class')
      }

      const data = await response.json()
      setClassData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class')
    } finally {
      setIsLoading(false)
    }
  }

  const updateClass = async (updateData: Partial<ClassDetailsData>) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update class')
      }

      const data = await response.json()
      setClassData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update class')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteClass = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete class')
      }

      // In real implementation, this would redirect or notify parent
      console.log('Class deleted successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete class')
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = async () => {
    await fetchClass()
  }

  useEffect(() => {
    if (classId) {
      fetchClass()
    }
  }, [classId])

  return {
    classData,
    isLoading,
    error,
    refetch,
    updateClass,
    deleteClass
  }
}
