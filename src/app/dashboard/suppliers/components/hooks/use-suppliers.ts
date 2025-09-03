'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { Supplier, SupplierStats, PaginationData, SuppliersResponse, FilterState, PaginationState } from '../utils/supplier-types'

interface UseSuppliersProps {
  filters: FilterState
  pagination: PaginationState
}

export const useSuppliers = ({ filters, pagination }: UseSuppliersProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [stats, setStats] = useState<SupplierStats | null>(null)
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)

  const fetchSuppliers = useCallback(async (isFilteringRequest = false) => {
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
        ...(filters.selectedStatus !== 'all' && { status: filters.selectedStatus }),
      })
      
      const response = await fetch(`/api/suppliers?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch suppliers: ${response.status}`)
      }
      
      const result: SuppliersResponse = await response.json()
      
      if (!result.success) {
        throw new Error('Failed to fetch suppliers')
      }
      
      setSuppliers(result.data)
      setStats(result.stats)
      setPaginationData(result.pagination)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      toast.error('Gagal mengambil data supplier')
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
    fetchSuppliers()
  }, [])

  // Filter/pagination changes
  useEffect(() => {
    if (!loading) {
      fetchSuppliers(true)
    }
  }, [filters, pagination, fetchSuppliers, loading])

  const deleteSupplier = useCallback(async (supplierId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/suppliers/${supplierId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Supplier berhasil dihapus')
        fetchSuppliers() // Refresh data
        return true
      } else {
        toast.error('Gagal menghapus supplier')
        return false
      }
    } catch (error) {
      console.error('Error deleting supplier:', error)
      toast.error('Gagal menghapus supplier')
      return false
    }
  }, [fetchSuppliers])

  return {
    suppliers,
    stats,
    paginationData,
    loading,
    isFiltering,
    deleteSupplier,
    refetch: fetchSuppliers
  }
}
