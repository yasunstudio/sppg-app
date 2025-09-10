'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { studentUpdateSchema, type StudentUpdateInput } from '../utils/student-schemas'

export function useStudentEditForm(studentId: string) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<StudentUpdateInput>({
    resolver: zodResolver(studentUpdateSchema) as any,
    defaultValues: {
      id: studentId,
      nisn: '',
      name: '',
      age: 7,
      gender: 'MALE',
      grade: '',
      parentName: '',
      schoolId: '',
      notes: undefined,
    }
  })

  // Fetch student data on mount
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${studentId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch student')
        }

        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Student not found')
        }

        const student = result.data
        
        // Reset form with fetched data
        form.reset({
          id: student.id,
          nisn: student.nisn,
          name: student.name,
          age: student.age,
          gender: student.gender,
          grade: student.grade,
          parentName: student.parentName,
          schoolId: student.schoolId,
          notes: student.notes || undefined,
        })
        
      } catch (error) {
        console.error('Error fetching student:', error)
        toast.error('Gagal memuat data siswa')
      } finally {
        setIsLoading(false)
      }
    }

    if (studentId) {
      fetchStudent()
    }
  }, [studentId, form])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    const isValid = await form.trigger()
    if (!isValid) return

    const formData = form.getValues()
    
    try {
      setIsSubmitting(true)
      
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Gagal memperbarui siswa')
      }

      toast.success('Data siswa berhasil diperbarui')
      router.push('/dashboard/students')
      
    } catch (error) {
      console.error('Error updating student:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui siswa')
    } finally {
      setIsSubmitting(false)
    }
  }

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
