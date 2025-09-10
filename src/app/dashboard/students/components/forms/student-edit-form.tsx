'use client'

import { Loader2 } from 'lucide-react'
import { useStudentEditForm } from '../hooks/use-student-edit-form'
import { StudentFormLayout } from "../student-form-layout"

interface StudentEditFormProps {
  studentId: string
}

export function StudentEditForm({ studentId }: StudentEditFormProps) {
  const { form, isSubmitting, isLoading, onSubmit } = useStudentEditForm(studentId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data siswa...</span>
      </div>
    )
  }

  return (
    <StudentFormLayout
      title="Edit Siswa"
      description="Perbarui informasi siswa dalam sistem"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Perbarui Siswa"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}
