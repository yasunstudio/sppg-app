"use client"

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { User, UserStats, PaginationData, UsersResponse, FilterState, PaginationState } from '../utils/user-types'

interface UseUsersProps {
  filters: FilterState
  pagination: PaginationState
}

export const useUsers = ({ filters, pagination }: UseUsersProps) => {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)

  const fetchUsers = useCallback(async (isFilteringRequest = false) => {
    try {
      if (isFilteringRequest) {
        setIsFiltering(true)
      } else {
        setLoading(true)
      }
      
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        search: filters.searchTerm || '',
        role: filters.selectedRole !== 'all' ? filters.selectedRole : '',
        status: filters.selectedStatus !== 'all' ? filters.selectedStatus : '',
        school: filters.selectedSchool !== 'all' ? filters.selectedSchool : ''
      })

      const response = await fetch(`/api/users?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data: UsersResponse = await response.json()
      
      if (data.success) {
        setUsers(data.data)
        setStats(data.stats)
        setPaginationData(data.pagination)
      } else {
        toast.error('Gagal memuat data pengguna')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Terjadi kesalahan saat memuat data pengguna')
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
    fetchUsers()
  }, [])

  // Filter/pagination changes
  useEffect(() => {
    if (!loading) {
      fetchUsers(true)
    }
  }, [filters, pagination, fetchUsers, loading])

  return {
    users,
    stats,
    paginationData,
    loading,
    isFiltering,
    refetch: () => fetchUsers(true)
  }
}
