"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { schoolCreateSchema, schoolUpdateSchema, type SchoolCreateInput, type SchoolUpdateInput } from "../utils/school-schemas"

interface UseSchoolCreateFormOptions {
  mode: 'create'
  defaultValues?: Partial<SchoolCreateInput>
  onSuccess?: () => void
  redirectPath?: string
}

interface UseSchoolEditFormOptions {
  mode: 'edit'
  defaultValues: SchoolUpdateInput
  onSuccess?: () => void
  redirectPath?: string
}

type UseSchoolFormOptions = UseSchoolCreateFormOptions | UseSchoolEditFormOptions

export function useSchoolForm(options: UseSchoolFormOptions) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const schema = options.mode === 'create' ? schoolCreateSchema : schoolUpdateSchema
  const defaultValues = options.defaultValues || {}

  const form = useForm<SchoolCreateInput | SchoolUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange"
  })

  const onSubmit = async (data: SchoolCreateInput | SchoolUpdateInput) => {
    setIsSubmitting(true)
    
    try {
      const endpoint = options.mode === 'create' 
        ? '/api/schools'
        : `/api/schools/${(data as SchoolUpdateInput).id}`
      
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
        throw new Error(result.message || `Failed to ${options.mode} school`)
      }

      toast.success(
        options.mode === 'create' 
          ? 'Sekolah berhasil ditambahkan' 
          : 'Sekolah berhasil diperbarui'
      )

      // Call success callback if provided
      options.onSuccess?.()

      // Redirect
      const redirectPath = options.redirectPath || '/dashboard/schools'
      router.push(redirectPath)
      
    } catch (error) {
      console.error(`Error ${options.mode === 'create' ? 'creating' : 'updating'} school:`, error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : `Gagal ${options.mode === 'create' ? 'menambahkan' : 'memperbarui'} sekolah`
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
