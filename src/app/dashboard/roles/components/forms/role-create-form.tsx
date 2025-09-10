'use client'

import { useRoleCreateForm } from "../hooks/use-role-create-form"
import { RoleFormLayout } from "../role-form-layout"

export function RoleCreateForm() {
  const { form, isSubmitting, onSubmit } = useRoleCreateForm()

  return (
    <RoleFormLayout
      title="Tambah Role Baru"
      description="Buat role baru dengan mengatur permissions dan akses pengguna"
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Simpan Role"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}
