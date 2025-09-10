"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { userRoleCreateSchema, type UserRoleCreateInput } from "../utils/user-role-schemas"

interface UseUserRoleCreateFormOptions {
  defaultValues?: Partial<UserRoleCreateInput>
  onSuccess?: () => void
  redirectPath?: string
}

export function useUserRoleCreateForm(options: UseUserRoleCreateFormOptions = {}) {
  const { defaultValues, onSuccess, redirectPath = "/dashboard/user-roles" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(userRoleCreateSchema),
    defaultValues: {
      userId: "",
      roleId: "",
      ...defaultValues
    }
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        ...data,
      }

      const response = await fetch("/api/user-roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal membuat user role")
      }

      const result = await response.json()

      toast.success("Penugasan role pengguna berhasil dibuat!", {
        description: `Assignment untuk ${result.user?.name} dengan role ${result.role?.name} telah dibuat.`
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
        router.refresh()
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat membuat penugasan role pengguna"
      toast.error("Gagal membuat penugasan role pengguna", {
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

  const setFieldValue = (field: keyof UserRoleCreateInput, value: any) => {
    form.setValue(field, value)
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    resetForm,
    setFieldValue,
    formState: form.formState,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
  }
}
