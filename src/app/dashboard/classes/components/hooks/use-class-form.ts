"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { classCreateSchema, classUpdateSchema, type ClassCreateFormData, type ClassUpdateFormData, ClassLevel } from "../utils/class-schemas"

interface UseClassCreateFormOptions {
  mode: 'create'
  defaultValues?: Partial<ClassCreateFormData>
  onSuccess?: () => void
  redirectPath?: string
}

interface UseClassEditFormOptions {
  mode: 'edit'
  defaultValues: ClassUpdateFormData
  onSuccess?: () => void
  redirectPath?: string
}

type UseClassFormOptions = UseClassCreateFormOptions | UseClassEditFormOptions

export function useClassForm(options: UseClassFormOptions) {
  const { mode, defaultValues, onSuccess, redirectPath = "/dashboard/classes" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create form for create mode
  const createForm = useForm<ClassCreateFormData>({
    resolver: zodResolver(classCreateSchema),
    defaultValues: {
      name: "",
      level: ClassLevel.ELEMENTARY,
      grade: 1,
      section: "A",
      academicYear: "",
      schoolId: "",
      maxStudents: 30,
      currentStudents: 0,
      roomNumber: "",
      teacherName: "",
      notes: "",
      ...(mode === 'create' ? defaultValues : {})
    }
  })

  // Edit form for edit mode  
  const editForm = useForm<ClassUpdateFormData>({
    resolver: zodResolver(classUpdateSchema),
    defaultValues: mode === 'edit' ? defaultValues : undefined
  })

  // Choose the right form based on mode
  const form = mode === 'create' ? createForm : editForm

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      const url = mode === 'create' ? '/api/classes' : `/api/classes/${data.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      // Transform data for API
      const submitData = {
        ...data,
        grade: Number(data.grade),
        maxStudents: Number(data.maxStudents),
        currentStudents: Number(data.currentStudents),
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${mode} class`)
      }

      toast.success(`Class ${mode === 'create' ? 'created' : 'updated'} successfully`)
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
      }
    } catch (error) {
      console.error(`Error ${mode}ing class:`, error)
      toast.error(error instanceof Error ? error.message : `Failed to ${mode} class`)
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
