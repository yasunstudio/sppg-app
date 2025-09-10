"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { createUserSchema, type CreateUserFormData } from "../utils/user-schemas"
import { mapFormToApiData } from "../utils/user-formatters"

interface UseUserCreateFormOptions {
  defaultValues?: Partial<CreateUserFormData>
  onSuccess?: () => void
  redirectPath?: string
}

export function useUserCreateForm(options: UseUserCreateFormOptions = {}) {
  const { defaultValues, onSuccess, redirectPath = "/dashboard/users" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: null,
      phone: null,
      address: null,
      password: "",
      confirmPassword: "",
      isActive: true,
      roleIds: [],
      ...defaultValues
    }
  })

  const onSubmit = async (data: CreateUserFormData) => {
    setIsSubmitting(true)
    
    try {
      // Remove confirmPassword and map fullName to name
      const { confirmPassword, ...formData } = data
      const apiData = mapFormToApiData(formData)
      
      // Transform data for API
      const finalSubmitData = {
        ...apiData,
        roleIds: data.roleIds || []
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalSubmitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal membuat pengguna")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Gagal membuat pengguna")
      }

      toast.success("Pengguna berhasil dibuat")
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
      }

    } catch (error) {
      console.error("Error creating user:", error)
      const errorMessage = error instanceof Error ? error.message : "Gagal membuat pengguna"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    reset: form.reset,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues
  }
}
