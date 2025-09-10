'use client'

import { useStudentCreateForm } from "../hooks/use-student-form"
import { StudentFormLayout } from "../student-form-layout"

export function StudentCreateForm() {
  const { form, isSubmitting, onSubmit } = useStudentCreateForm()

  return (
    <StudentFormLayout
      title="Tambah Siswa Baru"
      description="Daftarkan siswa baru dalam sistem"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Simpan Siswa"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}

export default StudentCreateForm
