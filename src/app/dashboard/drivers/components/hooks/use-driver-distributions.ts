'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface DistributionData {
  id: string
  distributionDate: string
  status: string
  totalPortions: number
  notes?: string
  estimatedDuration?: number
  actualDuration?: number
  vehicle?: {
    id: string
    plateNumber: string
    model: string
    type: string
  }
  schools: Array<{
    id: string
    name: string
    address?: string
    plannedPortions: number
    actualPortions?: number
    routeOrder: number
  }>
  deliveries: Array<{
    id: string
    status: string
    deliveryOrder: number
    portionsDelivered?: number
    school?: {
      id: string
      name: string
    }
  }>
  stats: {
    totalDeliveries: number
    totalSchools: number
    completedDeliveries: number
    totalDeliveredPortions: number
  }
  createdAt: string
  updatedAt: string
}

interface UseDriverDistributionsReturn {
  distributions: DistributionData[]
  isLoading: boolean
  error: string | null
  refreshDistributions: () => Promise<void>
}

export function useDriverDistributions(driverId: string): UseDriverDistributionsReturn {
  const [distributions, setDistributions] = useState<DistributionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDistributions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/drivers/${driverId}/distributions`)
      
      if (!response.ok) {
        // Log the error but don't throw - distributions are optional data
        console.warn(`Failed to fetch distributions for driver ${driverId}:`, response.status, response.statusText)
        setDistributions([]) // Set empty array as fallback
        return
      }

      const result = await response.json()
      
      if (result.success) {
        setDistributions(result.data || [])
      } else {
        console.warn('Distributions API returned unsuccessful response:', result.error)
        setDistributions([])
      }
    } catch (error) {
      console.error('Error fetching distributions:', error)
      // Set empty array as fallback - distributions are optional
      setDistributions([])
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (driverId) {
      fetchDistributions()
    }
  }, [driverId])

  const refreshDistributions = async () => {
    await fetchDistributions()
  }

  return {
    distributions,
    isLoading,
    error,
    refreshDistributions
  }
}
