"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { roleFormSchema, roleCreateSchema, roleUpdateSchema, type RoleFormInput, type RoleCreateInput, type RoleUpdateInput, defaultRoleFormValues } from "../utils/role-schemas"

interface UseRoleCreateFormOptions {
  mode: 'create'
  defaultValues?: Partial<RoleFormInput>
  onSuccess?: () => void
  redirectPath?: string
}

interface UseRoleEditFormOptions {
  mode: 'edit'
  defaultValues: RoleUpdateInput
  onSuccess?: () => void
  redirectPath?: string
}

type UseRoleFormOptions = UseRoleCreateFormOptions | UseRoleEditFormOptions

export function useRoleForm(options: UseRoleFormOptions) {
  const { mode, defaultValues, onSuccess, redirectPath = "/dashboard/roles" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create form for create mode
  const createForm = useForm<RoleFormInput>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      ...defaultRoleFormValues,
      ...(mode === 'create' ? defaultValues : {})
    }
  })

  // Edit form for edit mode  
  const editForm = useForm<RoleUpdateInput>({
    resolver: zodResolver(roleUpdateSchema),
    defaultValues: mode === 'edit' ? defaultValues : undefined
  })

  // Choose the right form based on mode
  const form = mode === 'create' ? createForm : editForm

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      const url = mode === 'create' ? '/api/roles' : `/api/roles/${data.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      // Transform data for API
      const submitData = {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        permissions: data.permissions
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `Gagal ${mode === 'create' ? 'membuat' : 'memperbarui'} role`)
      }

      toast.success(`Role berhasil ${mode === 'create' ? 'dibuat' : 'diperbarui'}`)
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
      }
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} role:`, error)
      toast.error(error instanceof Error ? error.message : `Gagal ${mode === 'create' ? 'membuat' : 'memperbarui'} role`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    mode
  }
}
