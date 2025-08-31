import { useState, useEffect } from 'react'

interface Student {
  id: string
  name: string
  school?: {
    id: string
    name: string
  }
}

interface NutritionConsultation {
  id: string
  studentId: string
  question: string
  answer?: string
  status: 'PENDING' | 'ANSWERED' | 'CLOSED'
  createdAt: string
  updatedAt: string
  student?: Student
}

interface NutritionConsultationStats {
  overview: {
    total: number
    pending: number
    answered: number
    closed: number
    completionRate: number
  }
  byStatus: Array<{
    status: string
    count: number
  }>
  recent: Array<{
    date: string
    count: number
  }>
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface UseNutritionConsultationsParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

interface UseNutritionConsultationsReturn {
  consultations: NutritionConsultation[] | null
  stats: NutritionConsultationStats | null
  loading: boolean
  error: string | null
  pagination: Pagination | null
  refetch: () => void
}

export function useNutritionConsultations(
  params: UseNutritionConsultationsParams = {}
): UseNutritionConsultationsReturn {
  const [consultations, setConsultations] = useState<NutritionConsultation[] | null>(null)
  const [stats, setStats] = useState<NutritionConsultationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const searchParams = new URLSearchParams()
      if (params.page) searchParams.set('page', params.page.toString())
      if (params.limit) searchParams.set('limit', params.limit.toString())
      if (params.search) searchParams.set('search', params.search)
      if (params.status) searchParams.set('status', params.status)

      // Fetch consultations and stats in parallel
      const [consultationsResponse, statsResponse] = await Promise.all([
        fetch(`/api/nutrition-consultations?${searchParams.toString()}`),
        fetch('/api/nutrition-consultations/stats')
      ])

      if (!consultationsResponse.ok) {
        throw new Error('Failed to fetch consultations')
      }

      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats')
      }

      const consultationsData = await consultationsResponse.json()
      const statsData = await statsResponse.json()

      setConsultations(consultationsData.data)
      setPagination(consultationsData.pagination)
      setStats(statsData.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [params.page, params.limit, params.search, params.status])

  return {
    consultations,
    stats,
    loading,
    error,
    pagination,
    refetch: fetchData
  }
}

export function useNutritionConsultation(id: string) {
  const [consultation, setConsultation] = useState<NutritionConsultation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConsultation = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/nutrition-consultations/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch consultation')
      }

      const data = await response.json()
      setConsultation(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchConsultation()
    }
  }, [id])

  return {
    consultation,
    loading,
    error,
    refetch: fetchConsultation
  }
}
