"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { studentCreateSchema, type StudentCreateInput } from "../utils/student-schemas"

interface UseStudentCreateFormOptions {
  defaultValues?: Partial<StudentCreateInput>
  onSuccess?: () => void
  redirectPath?: string
}

export function useStudentCreateForm(options?: UseStudentCreateFormOptions) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Create proper default values - handle optional notes properly
  const defaultValues = {
    nisn: options?.defaultValues?.nisn || '',
    name: options?.defaultValues?.name || '',
    age: options?.defaultValues?.age || 6,
    gender: options?.defaultValues?.gender || 'MALE' as const,
    grade: options?.defaultValues?.grade || '',
    parentName: options?.defaultValues?.parentName || '',
    schoolId: options?.defaultValues?.schoolId || '',
    notes: options?.defaultValues?.notes
  }

  const form = useForm({
    resolver: zodResolver(studentCreateSchema),
    defaultValues,
    mode: "onChange"
  })

  const onSubmit = async (data: StudentCreateInput) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create student')
      }

      const result = await response.json()
      
      toast.success('Siswa berhasil ditambahkan!')
      
      if (options?.onSuccess) {
        options.onSuccess()
      }
      
      if (options?.redirectPath) {
        router.push(options.redirectPath)
      } else {
        router.push('/dashboard/students')
      }
      
      return result
    } catch (error) {
      console.error('Error creating student:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal menambahkan siswa')
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
