'use client'

import { useState, useEffect, useCallback } from 'react'
import { MonitoringData } from '@/types/monitoring'
import { authenticatedApiCall } from '@/lib/api-utils'

export function useMonitoringData() {
  const [data, setData] = useState<MonitoringData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('7d')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30000)

  // Fetch monitoring data from API
  const fetchData = useCallback(async (selectedPeriod?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const currentPeriod = selectedPeriod || period
      const result = await authenticatedApiCall<MonitoringData>(
        `/api/monitoring?period=${currentPeriod}`
      )
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch monitoring data')
      }
      
      // Ensure we have valid data structure
      if (result.data && typeof result.data === 'object') {
        setData(result.data)
      } else {
        // If API returned direct data (not wrapped in result), use it
        const directData = result as unknown as MonitoringData
        if (directData && directData.metrics) {
          setData(directData)
        } else {
          throw new Error('Invalid data format received from API')
        }
      }
    } catch (err) {
      console.error('Error fetching monitoring data:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch monitoring data'
      setError(errorMessage)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [period])

  // Refresh function for manual refresh
  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  // Handle period change
  const handlePeriodChange = useCallback((newPeriod: string) => {
    setPeriod(newPeriod)
    fetchData(newPeriod)
  }, [fetchData])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchData])

  return {
    data,
    loading,
    error,
    period,
    setPeriod: handlePeriodChange,
    fetchData,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    refresh
  }
}
