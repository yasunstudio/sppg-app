'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { Vehicle, VehicleStats, PaginationData, VehiclesResponse, FilterState, PaginationState } from '../utils/vehicle-types'

interface UseVehiclesProps {
  filters: FilterState
  pagination: PaginationState
}

export const useVehicles = ({ filters, pagination }: UseVehiclesProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [stats, setStats] = useState<VehicleStats | null>(null)
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)

  const fetchVehicles = useCallback(async (isFilteringRequest = false) => {
    try {
      if (isFilteringRequest) {
        setIsFiltering(true)
      } else {
        setLoading(true)
      }
      
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        ...(filters.searchTerm && { search: filters.searchTerm }),
        ...(filters.selectedType !== 'all' && { type: filters.selectedType }),
        ...(filters.selectedStatus !== 'all' && { status: filters.selectedStatus }),
      })
      
      const response = await fetch(`/api/vehicles?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch vehicles: ${response.status}`)
      }
      
      const result: VehiclesResponse = await response.json()
      
      if (!result.success) {
        throw new Error('Failed to fetch vehicles')
      }
      
      setVehicles(result.data)
      setStats(result.stats)
      setPaginationData(result.pagination)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast.error('Gagal mengambil data kendaraan')
    } finally {
      if (isFilteringRequest) {
        setIsFiltering(false)
      } else {
        setLoading(false)
      }
    }
  }, [filters, pagination])

  // Initial load
  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  // Filter changes (with debouncing for search)
  useEffect(() => {
    if (filters.searchTerm) {
      const timeoutId = setTimeout(() => {
        fetchVehicles(true)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      fetchVehicles(true)
    }
  }, [filters.selectedType, filters.selectedStatus, filters.searchTerm, fetchVehicles])

  const deleteVehicle = useCallback(async (vehicleId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Kendaraan berhasil dihapus')
        fetchVehicles() // Refresh data
        return true
      } else {
        toast.error('Gagal menghapus kendaraan')
        return false
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      toast.error('Gagal menghapus kendaraan')
      return false
    }
  }, [fetchVehicles])

  return {
    vehicles,
    stats,
    paginationData,
    loading,
    isFiltering,
    deleteVehicle,
    refetch: fetchVehicles
  }
}
