"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { wasteRecordUpdateSchema, type WasteRecordUpdateInput } from "../utils"

interface UseWasteRecordEditFormOptions {
  wasteRecordId: string
  onSuccess?: () => void
  redirectPath?: string
}

export function useWasteRecordEditForm(options: UseWasteRecordEditFormOptions) {
  const { wasteRecordId, onSuccess, redirectPath = "/dashboard/waste-records" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm({
    resolver: zodResolver(wasteRecordUpdateSchema),
    defaultValues: {
      id: wasteRecordId,
      recordDate: "",
      wasteType: 'ORGANIC' as const,
      source: 'PREPARATION' as const,
      weight: 1,
      notes: "",
    }
  })

  // Fetch existing waste record data
  useEffect(() => {
    const fetchWasteRecord = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/waste-records/${wasteRecordId}`)
        
        if (!response.ok) {
          throw new Error("Gagal memuat pencatatan limbah")
        }

        const data = await response.json()
        
        form.reset({
          id: data.id,
          recordDate: new Date(data.recordDate).toISOString().split('T')[0],
          wasteType: data.wasteType,
          source: data.source,
          weight: data.weight,
          notes: data.notes || "",
        })
      } catch (error) {
        console.error("Error fetching waste record:", error)
        toast.error("Gagal memuat data pencatatan limbah")
      } finally {
        setIsLoading(false)
      }
    }

    if (wasteRecordId) {
      fetchWasteRecord()
    }
  }, [wasteRecordId, form])

  const onSubmit = async (data: WasteRecordUpdateInput) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        ...data,
        recordDate: new Date(data.recordDate).toISOString(),
        notes: data.notes || null,
      }

      const response = await fetch(`/api/waste-records/${wasteRecordId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal memperbarui pencatatan limbah")
      }

      const result = await response.json()

      toast.success("Pencatatan limbah berhasil diperbarui!", {
        description: `Pencatatan ${result.wasteType} seberat ${result.weight} kg telah diperbarui.`
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
        router.refresh()
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat memperbarui pencatatan limbah"
      toast.error("Gagal memperbarui pencatatan limbah", {
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

  const setFieldValue = (field: keyof WasteRecordUpdateInput, value: any) => {
    form.setValue(field, value)
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    isLoading,
    resetForm,
    setFieldValue,
  }
}
