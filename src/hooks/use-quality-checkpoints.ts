import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface QualityCheckpoint {
  id: string
  productionPlanId?: string
  batchId?: string
  checkpointType: 'RAW_MATERIAL' | 'PRODUCTION' | 'PACKAGING' | 'DISTRIBUTION'
  checkedAt: string
  checkedBy: string
  status: 'PASS' | 'FAIL' | 'CONDITIONAL' | 'PENDING' | 'REWORK_REQUIRED'
  temperature?: number
  visualInspection?: string
  tasteTest?: string
  textureEvaluation?: string
  correctiveAction?: string
  photos: string[]
  metrics?: Record<string, number>
  notes?: string
  createdAt: string
  checker: {
    id: string
    name: string
    email: string
  }
  productionPlan?: {
    id: string
    planDate: string
    targetPortions: number
    menu: {
      name: string
    } | null
  }
  batch?: {
    id: string
    batchNumber: string
  }
}

export interface QualityCheckpointStatistics {
  total: number
  pass: number
  fail: number
  conditional: number
  rework: number
  pending: number
}

export interface QualityCheckpointFilters {
  type?: string
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface QualityCheckpointResponse {
  checkpoints: QualityCheckpoint[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  statistics: QualityCheckpointStatistics
}

export interface CreateQualityCheckpointData {
  productionPlanId?: string
  batchId?: string
  checkpointType: 'RAW_MATERIAL' | 'PRODUCTION' | 'PACKAGING' | 'DISTRIBUTION'
  checkedBy: string
  status: 'PASS' | 'FAIL' | 'CONDITIONAL' | 'PENDING' | 'REWORK_REQUIRED'
  temperature?: number
  visualInspection?: string
  tasteTest?: string
  textureEvaluation?: string
  correctiveAction?: string
  photos?: string[]
  metrics?: Record<string, number>
  notes?: string
}

export interface UpdateQualityCheckpointData extends Partial<CreateQualityCheckpointData> {}

export function useQualityCheckpoints(filters: QualityCheckpointFilters = {}) {
  const [data, setData] = useState<QualityCheckpointResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCheckpoints = async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      
      if (filters.type && filters.type !== 'ALL') queryParams.append('type', filters.type)
      if (filters.status && filters.status !== 'ALL') queryParams.append('status', filters.status)
      if (filters.startDate) queryParams.append('startDate', filters.startDate)
      if (filters.endDate) queryParams.append('endDate', filters.endDate)
      if (filters.page) queryParams.append('page', filters.page.toString())
      if (filters.limit) queryParams.append('limit', filters.limit.toString())

      const response = await fetch(`/api/quality-checkpoints?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch quality checkpoints')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCheckpoints()
  }, [JSON.stringify(filters)])

  return {
    data,
    loading,
    error,
    refetch: fetchCheckpoints
  }
}

export function useQualityCheckpoint(id: string) {
  const [checkpoint, setCheckpoint] = useState<QualityCheckpoint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCheckpoint = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/quality-checkpoints/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch quality checkpoint')
      }

      const result = await response.json()
      setCheckpoint(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchCheckpoint()
    }
  }, [id])

  return {
    checkpoint,
    loading,
    error,
    refetch: fetchCheckpoint
  }
}

export function useQualityCheckpointMutations() {
  const [loading, setLoading] = useState(false)

  const createCheckpoint = async (data: CreateQualityCheckpointData): Promise<QualityCheckpoint> => {
    try {
      setLoading(true)

      const response = await fetch('/api/quality-checkpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create quality checkpoint')
      }

      const checkpoint = await response.json()
      toast.success('Quality checkpoint berhasil dibuat')
      return checkpoint
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCheckpoint = async (id: string, data: UpdateQualityCheckpointData): Promise<QualityCheckpoint> => {
    try {
      setLoading(true)

      const response = await fetch(`/api/quality-checkpoints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update quality checkpoint')
      }

      const checkpoint = await response.json()
      toast.success('Quality checkpoint berhasil diperbarui')
      return checkpoint
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCheckpoint = async (id: string): Promise<void> => {
    try {
      setLoading(true)

      const response = await fetch(`/api/quality-checkpoints/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete quality checkpoint')
      }

      toast.success('Quality checkpoint berhasil dihapus')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createCheckpoint,
    updateCheckpoint,
    deleteCheckpoint,
    loading
  }
}
