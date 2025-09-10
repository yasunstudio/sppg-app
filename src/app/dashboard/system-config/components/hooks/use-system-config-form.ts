"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { systemConfigCreateSchema, type SystemConfigCreateInput } from "../utils/system-config-schemas"

interface UseSystemConfigCreateFormOptions {
  defaultValues?: Partial<SystemConfigCreateInput>
  onSuccess?: () => void
  redirectPath?: string
}

export function useSystemConfigCreateForm(options?: UseSystemConfigCreateFormOptions) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Create proper default values
  const defaultValues = {
    key: options?.defaultValues?.key || '',
    value: options?.defaultValues?.value || '',
    description: options?.defaultValues?.description || '',
    dataType: options?.defaultValues?.dataType || 'STRING' as const,
    category: options?.defaultValues?.category || 'GENERAL',
    isActive: options?.defaultValues?.isActive ?? true
  }

  const form = useForm({
    resolver: zodResolver(systemConfigCreateSchema),
    defaultValues,
    mode: "onChange"
  })

  const onSubmit = async (data: SystemConfigCreateInput) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/system-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal membuat konfigurasi sistem')
      }

      const result = await response.json()
      
      toast.success('Konfigurasi sistem berhasil ditambahkan!')
      
      if (options?.onSuccess) {
        options.onSuccess()
      }
      
      if (options?.redirectPath) {
        router.push(options.redirectPath)
      } else {
        router.push('/dashboard/system-config')
      }
      
      return result
    } catch (error) {
      console.error('Error creating system config:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal menambahkan konfigurasi sistem')
      throw error
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
