'use client'

import { useUserRoleCreateForm } from "../hooks/use-user-role-create-form"
import { UserRoleFormLayout } from "../user-role-form-layout"

export function UserRoleCreateForm() {
  const { form, isSubmitting, onSubmit } = useUserRoleCreateForm()

  return (
    <UserRoleFormLayout
      title="Tugaskan Role kepada Pengguna"
      description="Berikan role baru kepada user dalam sistem"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Tugaskan Role"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}
