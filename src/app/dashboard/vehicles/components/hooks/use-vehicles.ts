'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Vehicle, VehicleStats, VehicleFilters } from '../utils/vehicle-types'

interface UseVehiclesParams {
  filters?: VehicleFilters
  page?: number
  limit?: number
}

interface UseVehiclesReturn {
  vehicles: Vehicle[]
  stats: VehicleStats
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    itemsPerPage: number
  } | null
  loading: boolean
  error: string | null
  refreshVehicles: () => void
  createVehicle: (data: any) => Promise<Vehicle>
  updateVehicle: (id: string, data: any) => Promise<Vehicle>
  deleteVehicle: (id: string) => Promise<void>
  searchVehicles: (term: string) => void
  filterByStatus: (status: string) => void
  filterByType: (type: string) => void
}

export function useVehicles(params: UseVehiclesParams = {}): UseVehiclesReturn {
  const { filters, page = 1, limit = 10 } = params
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [stats, setStats] = useState<VehicleStats>({
    total: 0,
    active: 0,
    maintenance: 0,
    inactive: 0
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

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const queryParams = new URLSearchParams({
        offset: ((page - 1) * limit).toString(),
        limit: limit.toString(),
        ...(filters?.selectedStatus && filters.selectedStatus !== 'all' && { 
          isActive: filters.selectedStatus === 'active' ? 'true' : 'false' 
        }),
        ...(filters?.selectedType && filters.selectedType !== 'all' && { type: filters.selectedType })
      })

      const response = await fetch(`/api/vehicles?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch vehicles')
      }

      // Filter by search term on client side for now
      let vehicleData = result.data || []
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        vehicleData = vehicleData.filter((vehicle: any) => 
          vehicle.plateNumber.toLowerCase().includes(searchLower) ||
          vehicle.type.toLowerCase().includes(searchLower) ||
          (vehicle.notes && vehicle.notes.toLowerCase().includes(searchLower))
        )
      }

      setVehicles(vehicleData)
      
      // Convert API stats to our format
      const apiStats = result.stats || {}
      setStats({
        total: apiStats.totalVehicles || 0,
        active: apiStats.activeVehicles || 0,
        maintenance: 0, // Not provided by API yet
        inactive: apiStats.inactiveVehicles || 0
      })

      // Set pagination data
      setPagination(result.pagination || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, filters])

  const createVehicle = useCallback(async (vehicleData: any): Promise<Vehicle> => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create vehicle')
      }
      
      // Refresh the list
      await fetchVehicles()
      
      return result.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vehicle')
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchVehicles])

  const updateVehicle = useCallback(async (id: string, vehicleData: any): Promise<Vehicle> => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update vehicle')
      }
      
      // Update local state
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === id ? result.data : vehicle
        )
      )
      
      return result.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vehicle')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteVehicle = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete vehicle')
      }

      // Remove from local state
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id))
      
      // Update stats
      await fetchVehicles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vehicle')
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchVehicles])

  const searchVehicles = useCallback((term: string) => {
    // This will trigger a re-fetch through the filters dependency
    fetchVehicles()
  }, [fetchVehicles])

  const filterByStatus = useCallback((status: string) => {
    fetchVehicles()
  }, [fetchVehicles])

  const filterByType = useCallback((type: string) => {
    fetchVehicles()
  }, [fetchVehicles])

  const refreshVehicles = useCallback(() => {
    fetchVehicles()
  }, [fetchVehicles])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  return {
    vehicles,
    stats,
    pagination,
    loading,
    error,
    refreshVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    searchVehicles,
    filterByStatus,
    filterByType,
  }
}
