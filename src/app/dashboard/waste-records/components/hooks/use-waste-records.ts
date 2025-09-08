"use client"

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { WasteRecord, WasteStats, PaginationData, WasteRecordsResponse, FilterState, PaginationState } from '../utils/waste-types'

interface UseWasteRecordsProps {
  filters: FilterState
  pagination: PaginationState
}

export const useWasteRecords = ({ filters, pagination }: UseWasteRecordsProps) => {
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([])
  const [stats, setStats] = useState<WasteStats | null>(null)
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)

  const fetchWasteRecords = useCallback(async (isFilteringRequest = false) => {
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
        ...(filters.selectedWasteType !== 'all' && { wasteType: filters.selectedWasteType }),
        ...(filters.selectedSource !== 'all' && { source: filters.selectedSource }),
      })
      
      const response = await fetch(`/api/waste-records?${params}`)
      if (response.ok) {
        const result: WasteRecordsResponse = await response.json()
        if (result.success) {
          setWasteRecords(result.data)
          setStats(result.stats)
          setPaginationData(result.pagination)
        } else {
          toast.error('Gagal mengambil data waste records')
        }
      } else {
        toast.error('Gagal mengambil data waste records')
      }
    } catch (error) {
      console.error('Error fetching waste records:', error)
      toast.error('Gagal mengambil data waste records')
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
    fetchWasteRecords()
  }, [])

  // Filter/pagination changes
  useEffect(() => {
    if (!loading) {
      fetchWasteRecords(true)
    }
  }, [filters, pagination, fetchWasteRecords, loading])

  return {
    wasteRecords,
    stats,
    paginationData,
    loading,
    isFiltering,
    refetch: () => fetchWasteRecords(true)
  }
}
