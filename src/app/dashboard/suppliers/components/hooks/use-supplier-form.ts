"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { supplierCreateSchema, supplierUpdateSchema, type SupplierCreateInput, type SupplierUpdateInput } from "../utils/supplier-schemas"

interface UseSupplierCreateFormOptions {
  mode: 'create'
  defaultValues?: Partial<SupplierCreateInput>
  onSuccess?: () => void
  redirectPath?: string
}

interface UseSupplierEditFormOptions {
  mode: 'edit'
  defaultValues: SupplierUpdateInput
  onSuccess?: () => void
  redirectPath?: string
}

type UseSupplierFormOptions = UseSupplierCreateFormOptions | UseSupplierEditFormOptions

export function useSupplierForm(options: UseSupplierFormOptions) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const schema = options.mode === 'create' ? supplierCreateSchema : supplierUpdateSchema
  const defaultValues = options.defaultValues || {}

  const form = useForm<SupplierCreateInput | SupplierUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange"
  })

  const onSubmit = async (data: SupplierCreateInput | SupplierUpdateInput) => {
    setIsSubmitting(true)
    
    try {
      const endpoint = options.mode === 'create' 
        ? '/api/suppliers'
        : `/api/suppliers/${(data as SupplierUpdateInput).id}`
      
      const method = options.mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${options.mode} supplier`)
      }

      toast.success(
        options.mode === 'create' 
          ? 'Supplier berhasil ditambahkan' 
          : 'Supplier berhasil diperbarui'
      )

      // Call success callback if provided
      options.onSuccess?.()

      // Redirect
      const redirectPath = options.redirectPath || '/dashboard/suppliers'
      router.push(redirectPath)
      
    } catch (error) {
      console.error(`Error ${options.mode === 'create' ? 'creating' : 'updating'} supplier:`, error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : `Gagal ${options.mode === 'create' ? 'menambahkan' : 'memperbarui'} supplier`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = form.handleSubmit(onSubmit)

  return {
    form,
    isSubmitting,
    onSubmit: handleSubmit,
    reset: form.reset,
    setValue: form.setValue,
    getValues: form.getValues,
    watch: form.watch,
    formState: form.formState
  }
}
