"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import * as z from 'zod'
import type { Class } from '@/app/dashboard/classes/components/utils/class-types'

const classEditSchema = z.object({
  name: z.string().min(1, 'Nama kelas wajib diisi'),
  grade: z.number().min(1, 'Tingkat kelas minimal 1').max(12, 'Tingkat kelas maksimal 12'),
  capacity: z.number().min(1, 'Kapasitas minimal 1'),
  currentCount: z.number().min(0, 'Jumlah siswa tidak boleh negatif').optional(),
  teacherName: z.string().optional(),
  schoolId: z.string().min(1, 'Sekolah wajib dipilih')
})

type ClassEditFormData = z.infer<typeof classEditSchema>

export function useClassEditForm(classId: string) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const form = useForm<ClassEditFormData>({
    resolver: zodResolver(classEditSchema),
    defaultValues: {
      name: '',
      grade: 1,
      capacity: 30,
      currentCount: 0,
      teacherName: '',
      schoolId: ''
    }
  })

  // Load existing class data
  useEffect(() => {
    const loadClassData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/classes/${classId}`)
        
        if (!response.ok) {
          throw new Error('Failed to load class data')
        }

        const result = await response.json()
        const classData: Class = result.data

        form.reset({
          name: classData.name,
          grade: classData.grade,
          capacity: classData.capacity,
          teacherName: classData.teacherName || '',
          schoolId: classData.schoolId
        })
      } catch (error) {
        console.error('Error loading class:', error)
        toast.error('Gagal memuat data kelas')
        router.push('/dashboard/classes')
      } finally {
        setLoading(false)
      }
    }

    loadClassData()
  }, [classId, form, router])

  const onSubmit = async (data: ClassEditFormData) => {
    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal memperbarui kelas')
      }

      toast.success('Kelas berhasil diperbarui!')
      router.push('/dashboard/classes')
      router.refresh()
    } catch (error) {
      console.error('Error updating class:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui kelas')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    loading,
    onSubmit: form.handleSubmit(onSubmit)
  }
}
