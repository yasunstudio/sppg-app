import { useState, useEffect } from 'react'

interface FoodSample {
  id: string
  sampleDate: string
  menuName: string
  batchNumber: string
  sampleType: 'RAW_MATERIAL' | 'COOKED_FOOD' | 'PACKAGED_MEAL'
  storageDays: number
  status: 'STORED' | 'TESTED' | 'DISPOSED'
  notes?: string
  disposedAt?: string
  createdAt: string
  updatedAt: string
}

interface FoodSampleStats {
  overview: {
    total: number
    stored: number
    tested: number
    disposed: number
    thisWeek: number
    expiringSoon: number
    completionRate: number
  }
  byType: Array<{
    type: string
    count: number
  }>
  recent: Array<{
    id: string
    menuName: string
    sampleType: string
    status: string
    createdAt: string
  }>
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface UseFoodSamplesParams {
  page?: number
  limit?: number
  search?: string
  sampleType?: string
  status?: string
}

interface UseFoodSamplesReturn {
  samples: FoodSample[] | null
  stats: FoodSampleStats | null
  loading: boolean
  error: string | null
  pagination: Pagination | null
  refetch: () => void
}

export function useFoodSamples(
  params: UseFoodSamplesParams = {}
): UseFoodSamplesReturn {
  const [samples, setSamples] = useState<FoodSample[] | null>(null)
  const [stats, setStats] = useState<FoodSampleStats | null>(null)
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
      if (params.sampleType) searchParams.set('sampleType', params.sampleType)
      if (params.status) searchParams.set('status', params.status)

      // Fetch samples and stats in parallel
      const [samplesResponse, statsResponse] = await Promise.all([
        fetch(`/api/food-samples?${searchParams.toString()}`),
        fetch('/api/food-samples/stats')
      ])

      if (!samplesResponse.ok) {
        throw new Error('Failed to fetch food samples')
      }

      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats')
      }

      const samplesData = await samplesResponse.json()
      const statsData = await statsResponse.json()

      setSamples(samplesData.data)
      setPagination(samplesData.pagination)
      setStats(statsData.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [params.page, params.limit, params.search, params.sampleType, params.status])

  return {
    samples,
    stats,
    loading,
    error,
    pagination,
    refetch: fetchData
  }
}

export function useFoodSample(id: string) {
  const [sample, setSample] = useState<FoodSample | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSample = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/food-samples/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch food sample')
      }

      const data = await response.json()
      setSample(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchSample()
    }
  }, [id])

  return {
    sample,
    loading,
    error,
    refetch: fetchSample
  }
}
