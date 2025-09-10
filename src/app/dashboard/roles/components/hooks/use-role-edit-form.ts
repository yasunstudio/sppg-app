"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { roleFormSchema, type RoleFormInput, defaultRoleFormValues } from "../utils/role-schemas"

interface UseRoleEditFormOptions {
  onSuccess?: () => void
  redirectPath?: string
}

export function useRoleEditForm(roleId: string, options: UseRoleEditFormOptions = {}) {
  const { onSuccess, redirectPath = "/dashboard/roles" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<RoleFormInput>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: defaultRoleFormValues
  })

  // Load existing role data
  useEffect(() => {
    const loadRole = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/roles/${roleId}`)
        
        if (!response.ok) {
          throw new Error('Failed to load role')
        }
        
        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to load role')
        }
        
        const roleData = result.data
        
        // Set form values
        form.reset({
          name: roleData.name || "",
          description: roleData.description || "",
          permissions: roleData.permissions || []
        })
        
      } catch (error) {
        console.error('Error loading role:', error)
        toast.error('Gagal memuat data role')
        router.push('/dashboard/roles')
      } finally {
        setIsLoading(false)
      }
    }

    if (roleId) {
      loadRole()
    }
  }, [roleId, form, router])

  const onSubmit = async (data: RoleFormInput) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        permissions: data.permissions
      }

      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Gagal memperbarui role')
      }

      toast.success('Role berhasil diperbarui')
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
      }
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui role')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit)
  }
}
