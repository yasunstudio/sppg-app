"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import * as z from 'zod'
import type { CreateClassData } from '@/app/dashboard/classes/components/utils/class-types'

const classCreateSchema = z.object({
  name: z.string().min(1, 'Nama kelas wajib diisi'),
  grade: z.number().min(1, 'Tingkat kelas minimal 1').max(12, 'Tingkat kelas maksimal 12'),
  capacity: z.number().min(1, 'Kapasitas minimal 1'),
  currentCount: z.number().min(0, 'Jumlah siswa tidak boleh negatif').optional(),
  teacherName: z.string().optional(),
  schoolId: z.string().min(1, 'Sekolah wajib dipilih')
})

type ClassCreateFormData = z.infer<typeof classCreateSchema>

export function useClassCreateForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ClassCreateFormData>({
    resolver: zodResolver(classCreateSchema),
    defaultValues: {
      name: '',
      grade: 1,
      capacity: 30,
      currentCount: 0,
      teacherName: '',
      schoolId: ''
    }
  })

  const onSubmit = async (data: ClassCreateFormData) => {
    try {
      setIsSubmitting(true)

      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal membuat kelas')
      }

      const result = await response.json()
      
      toast.success('Kelas berhasil dibuat!')
      router.push('/dashboard/classes')
      router.refresh()
    } catch (error) {
      console.error('Error creating class:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal membuat kelas')
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
