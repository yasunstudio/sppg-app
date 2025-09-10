"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { wasteRecordCreateSchema, type WasteRecordCreateInput } from "../utils"

interface UseWasteRecordCreateFormOptions {
  defaultValues?: Partial<WasteRecordCreateInput>
  onSuccess?: () => void
  redirectPath?: string
}

export function useWasteRecordCreateForm(options: UseWasteRecordCreateFormOptions = {}) {
  const { defaultValues, onSuccess, redirectPath = "/dashboard/waste-records" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(wasteRecordCreateSchema),
    defaultValues: {
      recordDate: new Date().toISOString().split('T')[0],
      wasteType: 'ORGANIC' as const,
      source: 'PREPARATION' as const,
      weight: 1,
      notes: "",
      ...defaultValues
    }
  })

  const onSubmit = async (data: WasteRecordCreateInput) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        ...data,
        recordDate: new Date(data.recordDate).toISOString(),
        notes: data.notes || null,
      }

      const response = await fetch("/api/waste-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal membuat pencatatan limbah")
      }

      const result = await response.json()

      toast.success("Pencatatan limbah berhasil dibuat!", {
        description: `Pencatatan ${result.wasteType} seberat ${result.weight} kg telah disimpan.`
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
        router.refresh()
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat membuat pencatatan limbah"
      toast.error("Gagal membuat pencatatan limbah", {
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

  const setFieldValue = (field: keyof WasteRecordCreateInput, value: any) => {
    form.setValue(field, value)
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    resetForm,
    setFieldValue,
  }
}
