"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { userRoleUpdateSchema, type UserRoleUpdateInput } from "../utils/user-role-schemas"

interface UseUserRoleEditFormOptions {
  userRoleId: string
  onSuccess?: () => void
  redirectPath?: string
}

export function useUserRoleEditForm(options: UseUserRoleEditFormOptions) {
  const { userRoleId, onSuccess, redirectPath = "/dashboard/user-roles" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm({
    resolver: zodResolver(userRoleUpdateSchema),
    defaultValues: {
      id: userRoleId,
      userId: "",
      roleId: "",
    }
  })

  // Fetch existing user role data
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/user-roles/${userRoleId}`)
        
        if (!response.ok) {
          throw new Error("Gagal memuat user role")
        }

        const data = await response.json()
        
        form.reset({
          id: data.id,
          userId: data.userId,
          roleId: data.roleId,
        })
      } catch (error) {
        console.error("Error fetching user role:", error)
        toast.error("Gagal memuat data user role")
      } finally {
        setIsLoading(false)
      }
    }

    if (userRoleId) {
      fetchUserRole()
    }
  }, [userRoleId, form])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        ...data,
      }

      const response = await fetch(`/api/user-roles/${userRoleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal memperbarui user role")
      }

      const result = await response.json()

      toast.success("Penugasan role pengguna berhasil diperbarui!", {
        description: `Assignment untuk ${result.user?.name} dengan role ${result.role?.name} telah diperbarui.`
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
        router.refresh()
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat memperbarui user role assignment"
      toast.error("Gagal memperbarui user role assignment", {
        description: errorMessage
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    form.reset()
  }

  const setFieldValue = (field: string, value: any) => {
    form.setValue(field as any, value)
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    isLoading,
    resetForm,
    setFieldValue,
    formState: form.formState,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
  }
}
