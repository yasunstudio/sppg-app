"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { schoolCreateSchema, type SchoolCreateInput, schoolCreateDefaults } from "../utils/school-schemas"

interface UseSchoolCreateFormOptions {
  defaultValues?: Partial<SchoolCreateInput>
  onSuccess?: () => void
  redirectPath?: string
}

export function useSchoolCreateForm(options: UseSchoolCreateFormOptions = {}) {
  const { defaultValues, onSuccess, redirectPath = "/schools" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SchoolCreateInput>({
    resolver: zodResolver(schoolCreateSchema),
    defaultValues: {
      ...schoolCreateDefaults,
      ...defaultValues
    }
  })

  const onSubmit = async (data: SchoolCreateInput) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        ...data,
        notes: data.notes || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      }

      const response = await fetch("/api/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal membuat sekolah")
      }

      const result = await response.json()
      
      toast.success("Sekolah berhasil dibuat")
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
      }
      
      form.reset()
      
    } catch (error) {
      console.error("Error creating school:", error)
      toast.error(error instanceof Error ? error.message : "Gagal membuat sekolah")
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
