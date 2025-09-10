"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { systemConfigUpdateSchema, type SystemConfigUpdateInput } from "../utils/system-config-schemas"

interface UseSystemConfigEditFormOptions {
  defaultValues?: SystemConfigUpdateInput
  onSuccess?: () => void
  redirectPath?: string
}

export function useSystemConfigEditForm(
  configId: string,
  options?: UseSystemConfigEditFormOptions
) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm({
    resolver: zodResolver(systemConfigUpdateSchema),
    defaultValues: options?.defaultValues,
    mode: "onChange"
  })

  // Load config data
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(`/api/system-config/${configId}`)
        
        if (!response.ok) {
          throw new Error('Gagal memuat konfigurasi sistem')
        }

        const result = await response.json()
        
        if (result.success) {
          const config = result.data
          form.reset({
            id: config.id,
            value: config.value,
            description: config.description || '',
            isActive: config.isActive
          })
        } else {
          throw new Error(result.error || 'Gagal memuat konfigurasi sistem')
        }
      } catch (error) {
        console.error('Error loading system config:', error)
        toast.error('Gagal memuat data konfigurasi sistem')
        router.push('/dashboard/system-config')
      } finally {
        setIsLoading(false)
      }
    }

    if (configId) {
      loadConfig()
    }
  }, [configId, form, router])

  const onSubmit = async (data: SystemConfigUpdateInput) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/system-config/${configId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal memperbarui konfigurasi sistem')
      }

      const result = await response.json()
      
      toast.success('Konfigurasi sistem berhasil diperbarui!')
      
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
      console.error('Error updating system config:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui konfigurasi sistem')
      throw error
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
