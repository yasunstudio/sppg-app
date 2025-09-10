'use client'

import { useSchoolCreateForm } from "../hooks/use-school-create-form"
import { SchoolFormLayout } from "../school-form-layout"

export function SchoolCreateForm() {
  const { form, isSubmitting, onSubmit } = useSchoolCreateForm()

  return (
    <SchoolFormLayout
      title="Tambah Sekolah Baru"
      description="Daftarkan sekolah baru dalam sistem"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Simpan Sekolah"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}

export default SchoolCreateForm
