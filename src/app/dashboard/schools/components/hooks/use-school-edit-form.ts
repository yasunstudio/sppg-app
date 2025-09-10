'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { schoolUpdateSchema, type SchoolUpdateInput } from '../utils/school-schemas'

export function useSchoolEditForm(schoolId: string) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<SchoolUpdateInput>({
    resolver: zodResolver(schoolUpdateSchema),
    defaultValues: {
      id: schoolId,
      name: '',
      principalName: '',
      principalPhone: '',
      address: '',
      totalStudents: 0,
      notes: null,
      latitude: null,
      longitude: null,
    }
  })

  // Fetch school data on mount
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await fetch(`/api/schools/${schoolId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch school')
        }

        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'School not found')
        }

        const school = result.data
        
        // Reset form with fetched data
        form.reset({
          id: school.id,
          name: school.name,
          principalName: school.principalName,
          principalPhone: school.principalPhone,
          address: school.address,
          totalStudents: school.totalStudents,
          notes: school.notes || "",
          latitude: school.latitude || null,
          longitude: school.longitude || null,
        })

      } catch (error) {
        console.error('Error fetching school:', error)
        toast.error(error instanceof Error ? error.message : 'Gagal memuat data sekolah')
        router.push('/schools')
      } finally {
        setIsLoading(false)
      }
    }

    if (schoolId) {
      fetchSchool()
    }
  }, [schoolId, form, router])

  const onSubmit = async (data: SchoolUpdateInput) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        ...data,
        notes: data.notes || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      }

      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal memperbarui sekolah')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Gagal memperbarui sekolah')
      }

      toast.success('Sekolah berhasil diperbarui')
      router.push('/schools')

    } catch (error) {
      console.error('Error updating school:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui sekolah')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = form.handleSubmit(onSubmit)

  return {
    form,
    isSubmitting,
    isLoading,
    onSubmit: handleSubmit,
    reset: form.reset,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
    formState: form.formState
  }
}
