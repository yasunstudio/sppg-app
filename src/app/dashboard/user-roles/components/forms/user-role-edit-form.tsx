'use client'

import { useUserRoleEditForm } from "../hooks/use-user-role-edit-form"
import { UserRoleFormLayout } from "../user-role-form-layout"

interface UserRoleEditFormProps {
  userRoleId: string
}

export function UserRoleEditForm({ userRoleId }: UserRoleEditFormProps) {
  const { form, isSubmitting, isLoading, onSubmit } = useUserRoleEditForm({ userRoleId })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <UserRoleFormLayout
      title="Edit Penugasan Role"
      description="Perbarui penugasan role untuk user"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Perbarui Penugasan"
      submitButtonLoadingText="Memperbarui..."
      isEditMode={true}
    />
  )
}
