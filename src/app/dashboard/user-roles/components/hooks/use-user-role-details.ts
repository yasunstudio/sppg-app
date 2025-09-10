"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { UserRole } from "../utils/user-role-types"

interface UseUserRoleDetailsOptions {
  userRoleId: string
  onError?: (error: string) => void
}

export function useUserRoleDetails(options: UseUserRoleDetailsOptions) {
  const { userRoleId, onError } = options
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserRole = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/user-roles/${userRoleId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User role assignment tidak ditemukan")
        }
        throw new Error("Gagal memuat data user role assignment")
      }

      const data = await response.json()
      setUserRole(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan"
      setError(errorMessage)
      if (onError) {
        onError(errorMessage)
      } else {
        toast.error("Error", {
          description: errorMessage
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userRoleId) {
      fetchUserRole()
    }
  }, [userRoleId])

  const refresh = () => {
    if (userRoleId) {
      fetchUserRole()
    }
  }

  const deleteUserRole = async () => {
    try {
      const response = await fetch(`/api/user-roles/${userRoleId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menghapus user role assignment")
      }

      toast.success("User role assignment berhasil dihapus")
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus"
      toast.error("Gagal menghapus user role assignment", {
        description: errorMessage
      })
      throw error
    }
  }

  return {
    userRole,
    isLoading,
    error,
    refresh,
    deleteUserRole,
  }
}
