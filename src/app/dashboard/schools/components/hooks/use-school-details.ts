'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface SchoolDetailsData {
  id: string
  name: string
  principalName: string
  principalPhone: string
  address: string
  totalStudents: number
  notes?: string
  latitude?: number
  longitude?: number
  district?: string
  city?: string
  province?: string
  postalCode?: string
  createdAt: string
  updatedAt: string
}

interface UseSchoolDetailsOptions {
  schoolId: string
  onSuccess?: (school: SchoolDetailsData) => void
  onError?: (error: string) => void
}

interface UseSchoolDetailsReturn {
  school: SchoolDetailsData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  deleteSchool: () => Promise<void>
  isDeleting: boolean
}

export function useSchoolDetails({ 
  schoolId, 
  onSuccess, 
  onError 
}: UseSchoolDetailsOptions): UseSchoolDetailsReturn {
  const [school, setSchool] = useState<SchoolDetailsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSchool = async () => {
    if (!schoolId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/schools/${schoolId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch school details')
      }

      if (result.success && result.data) {
        setSchool(result.data)
        onSuccess?.(result.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load school details'
      setError(errorMessage)
      onError?.(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSchool = async (): Promise<void> => {
    if (!schoolId || !school) return

    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete school')
      }

      toast.success('Sekolah berhasil dihapus')
      
      // Redirect will be handled by the component
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete school'
      toast.error(errorMessage)
      throw err // Re-throw to let component handle it
    } finally {
      setIsDeleting(false)
    }
  }

  const refetch = async (): Promise<void> => {
    await fetchSchool()
  }

  useEffect(() => {
    fetchSchool()
  }, [schoolId])

  return {
    school,
    isLoading,
    error,
    refetch,
    deleteSchool,
    isDeleting
  }
}
