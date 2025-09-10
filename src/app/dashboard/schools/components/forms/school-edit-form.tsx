'use client'

import { Loader2 } from 'lucide-react'
import { useSchoolEditForm } from '../hooks/use-school-edit-form'
import { SchoolFormLayout } from "../school-form-layout"

interface SchoolEditFormProps {
  schoolId: string
}

export function SchoolEditForm({ schoolId }: SchoolEditFormProps) {
  const { form, isSubmitting, isLoading, onSubmit } = useSchoolEditForm(schoolId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data sekolah...</span>
      </div>
    )
  }

  return (
    <SchoolFormLayout
      title="Edit Sekolah"
      description="Perbarui informasi sekolah dalam sistem"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Perbarui Sekolah"
      submitButtonLoadingText="Memperbarui..."
    />
  )
}

export default SchoolEditForm
