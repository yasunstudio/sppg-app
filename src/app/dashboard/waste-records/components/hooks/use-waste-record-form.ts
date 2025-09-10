"use client"

import { useState } from "react"
import { toast } from "sonner"

interface UseWasteRecordFormOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useWasteRecordForm(options: UseWasteRecordFormOptions = {}) {
  const { onSuccess, onError } = options
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitWasteRecord = async (
    data: any,
    method: "POST" | "PATCH" | "DELETE",
    endpoint: string
  ) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method !== "DELETE" ? JSON.stringify(data) : undefined,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Operasi gagal")
      }

      const result = await response.json()

      if (onSuccess) {
        onSuccess()
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan"
      
      if (onError) {
        onError(errorMessage)
      } else {
        toast.error("Operasi gagal", {
          description: errorMessage
        })
      }
      
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateWasteRecordData = (data: any) => {
    const errors: Record<string, string> = {}

    if (!data.recordDate) {
      errors.recordDate = "Tanggal pencatatan wajib diisi"
    }

    if (!data.wasteType) {
      errors.wasteType = "Jenis limbah wajib dipilih"
    }

    if (!data.source) {
      errors.source = "Sumber limbah wajib dipilih"
    }

    if (!data.weight || data.weight <= 0) {
      errors.weight = "Berat limbah harus lebih dari 0"
    }

    if (data.weight > 10000) {
      errors.weight = "Berat limbah maksimal 10.000 kg"
    }

    if (data.notes && data.notes.length > 500) {
      errors.notes = "Catatan maksimal 500 karakter"
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  return {
    isSubmitting,
    submitWasteRecord,
    validateWasteRecordData,
  }
}
