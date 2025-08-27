"use client"

import { useState, useEffect, useCallback } from "react"

export interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface UsersResponse {
  users: User[]
  pagination: Pagination
}

export interface UseUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export function useUsers(params: UseUsersParams = {}) {
  const [data, setData] = useState<UsersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      
      if (params.page) searchParams.set("page", params.page.toString())
      if (params.limit) searchParams.set("limit", params.limit.toString())
      if (params.search) searchParams.set("search", params.search)
      if (params.role) searchParams.set("role", params.role)
      if (params.sortBy) searchParams.set("sortBy", params.sortBy)
      if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder)

      const response = await fetch(`/api/users?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [params.page, params.limit, params.search, params.role, params.sortBy, params.sortOrder])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const refetch = useCallback(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    data,
    loading,
    error,
    refetch,
  }
}
