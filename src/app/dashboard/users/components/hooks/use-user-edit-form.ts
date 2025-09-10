"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { updateUserSchema, type UpdateUserFormData } from "../utils/user-schemas"
import { mapFormToApiData, formatUserForForm } from "../utils/user-formatters"

interface UseUserEditFormOptions {
  onSuccess?: () => void
  redirectPath?: string
}

export function useUserEditForm(userId: string, options: UseUserEditFormOptions = {}) {
  const { onSuccess, redirectPath = "/dashboard/users" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      isActive: true,
      roleIds: []
    }
  })

  // Fetch user data for editing
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/users/${userId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }

        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'User not found')
        }

        const user = result.data
        const userWithFullName = formatUserForForm(user)
        
        // Set form values
        form.reset({
          fullName: userWithFullName.fullName || "",
          email: userWithFullName.email || "",
          username: userWithFullName.username || null,
          phone: userWithFullName.phone || null,
          address: userWithFullName.address || null,
          isActive: userWithFullName.isActive ?? true,
          roleIds: userWithFullName.roles?.map((r: any) => r.roleId) || []
        })
        
      } catch (error) {
        console.error("Error fetching user:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to load user"
        toast.error(errorMessage)
        router.push(redirectPath)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId, form, router, redirectPath])

  const onSubmit = async (data: UpdateUserFormData) => {
    setIsSubmitting(true)
    
    try {
      // Map fullName to name and transform data for API
      const apiData = mapFormToApiData(data)
      const submitData = {
        ...apiData,
        roleIds: data.roleIds || []
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal memperbarui pengguna")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Gagal memperbarui pengguna")
      }

      toast.success("Pengguna berhasil diperbarui")
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
      }

    } catch (error) {
      console.error("Error updating user:", error)
      const errorMessage = error instanceof Error ? error.message : "Gagal memperbarui pengguna"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
    reset: form.reset,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues
  }
}
