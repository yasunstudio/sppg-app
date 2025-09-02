"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Driver, FilterState, PaginationState, DriverStats } from '../utils/driver-types'
import { calculateStats, filterDrivers, sortDrivers } from '../utils/driver-formatters'

interface UseDriversProps {
  filters: FilterState
  pagination: PaginationState
}

export function useDrivers({ filters, pagination }: UseDriversProps) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [allDrivers, setAllDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [stats, setStats] = useState<DriverStats>({
    totalDrivers: 0,
    activeDrivers: 0,
    inactiveDrivers: 0,
    totalDeliveries: 0,
    averageRating: 0,
    expiringSoonCount: 0
  })

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: '100', // Fetch more for client-side filtering
        offset: '0',
      })

      // Only add status filter if not "all"
      if (filters.statusFilter && filters.statusFilter !== 'all') {
        params.append('isActive', filters.statusFilter)
      }

      const response = await fetch(`/api/drivers?${params}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setAllDrivers(result.data)
        }
      } else {
        toast.error('Gagal memuat data driver')
      }
    } catch (error) {
      console.error('Error fetching drivers:', error)
      toast.error('Gagal memuat data driver')
    } finally {
      setLoading(false)
    }
  }

  const processDrivers = () => {
    setIsFiltering(true)
    
    let processed = [...allDrivers]

    // Apply status filter
    if (filters.statusFilter !== 'all') {
      const isActive = filters.statusFilter === 'true'
      processed = processed.filter(driver => driver.isActive === isActive)
    }

    // Apply search filter
    processed = filterDrivers(processed, filters.searchTerm)

    // Apply sorting
    processed = sortDrivers(processed, filters.sortBy, filters.sortOrder)

    // Apply pagination
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
    const endIndex = startIndex + pagination.itemsPerPage
    const paginatedDrivers = processed.slice(startIndex, endIndex)

    setDrivers(paginatedDrivers)
    
    // Calculate stats from all processed drivers (before pagination)
    const calculatedStats = calculateStats(processed)
    setStats(calculatedStats)

    setTimeout(() => setIsFiltering(false), 300)
  }

  const deleteDriver = async (id: string, name: string): Promise<boolean> => {
    if (!confirm(`Apakah Anda yakin ingin menghapus driver "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return false
    }

    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast.success('Driver berhasil dihapus')
          await fetchDrivers() // Refresh data
          return true
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal menghapus driver')
        return false
      }
    } catch (error) {
      console.error('Error deleting driver:', error)
      toast.error('Gagal menghapus driver')
      return false
    }
    
    return false
  }

  // Calculate pagination data
  const getPaginationData = () => {
    let filteredCount = allDrivers.length

    // Apply filters to get accurate count
    let filtered = [...allDrivers]
    
    if (filters.statusFilter !== 'all') {
      const isActive = filters.statusFilter === 'true'
      filtered = filtered.filter(driver => driver.isActive === isActive)
    }
    
    filtered = filterDrivers(filtered, filters.searchTerm)
    filteredCount = filtered.length

    const totalPages = Math.ceil(filteredCount / pagination.itemsPerPage)
    
    return {
      total: filteredCount,
      totalPages,
      currentPage: pagination.currentPage,
      hasMore: pagination.currentPage < totalPages,
      hasPrev: pagination.currentPage > 1
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchDrivers()
  }, [])

  // Process data when filters or pagination change
  useEffect(() => {
    if (allDrivers.length > 0) {
      processDrivers()
    }
  }, [allDrivers, filters, pagination])

  return {
    drivers,
    loading,
    isFiltering,
    stats,
    paginationData: getPaginationData(),
    refetch: fetchDrivers,
    deleteDriver
  }
}
