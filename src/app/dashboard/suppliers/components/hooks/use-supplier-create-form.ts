"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { supplierCreateSchema, type SupplierCreateInput, supplierCreateDefaults } from "../utils/supplier-schemas"

interface UseSupplierCreateFormOptions {
  defaultValues?: Partial<SupplierCreateInput>
  onSuccess?: () => void
  redirectPath?: string
}

export function useSupplierCreateForm(options: UseSupplierCreateFormOptions = {}) {
  const { defaultValues, onSuccess, redirectPath = "/suppliers" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SupplierCreateInput>({
    resolver: zodResolver(supplierCreateSchema),
    defaultValues: {
      ...supplierCreateDefaults,
      ...defaultValues
    }
  })

  const onSubmit = async (data: SupplierCreateInput) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        ...data,
        email: data.email || null, // Convert empty string to null
      }

      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal membuat supplier")
      }

      const result = await response.json()
      
      toast.success("Supplier berhasil dibuat")
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
      }
      
      form.reset()
      
    } catch (error) {
      console.error("Error creating supplier:", error)
      toast.error(error instanceof Error ? error.message : "Gagal membuat supplier")
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
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
    formState: form.formState
  }
}
