'use client'

import { Loader2 } from 'lucide-react'
import { useRoleEditForm } from '../hooks/use-role-edit-form'
import { RoleFormLayout } from "../role-form-layout"

interface RoleEditFormProps {
  roleId: string
}

export function RoleEditForm({ roleId }: RoleEditFormProps) {
  const { form, isSubmitting, isLoading, onSubmit } = useRoleEditForm(roleId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data role...</span>
      </div>
    )
  }

  return (
    <RoleFormLayout
      title="Edit Role"
      description="Perbarui informasi role dan permissions dalam sistem"
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Perbarui Role"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}
