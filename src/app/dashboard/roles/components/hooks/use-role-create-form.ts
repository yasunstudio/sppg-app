"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { roleFormSchema, type RoleFormInput, defaultRoleFormValues } from "../utils/role-schemas"

interface UseRoleCreateFormOptions {
  defaultValues?: Partial<RoleFormInput>
  onSuccess?: () => void
  redirectPath?: string
}

export function useRoleCreateForm(options: UseRoleCreateFormOptions = {}) {
  const { defaultValues, onSuccess, redirectPath = "/dashboard/roles" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RoleFormInput>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      ...defaultRoleFormValues,
      ...defaultValues
    }
  })

  const onSubmit = async (data: RoleFormInput) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        permissions: data.permissions
      }

      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Gagal membuat role')
      }

      toast.success('Role berhasil dibuat')
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
      }
    } catch (error) {
      console.error('Error creating role:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal membuat role')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit)
  }
}
