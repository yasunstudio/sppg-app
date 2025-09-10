'use client'

import { Loader2 } from 'lucide-react'
import { useSystemConfigEditForm } from '../hooks/use-system-config-edit-form'
import { SystemConfigFormLayout } from "../system-config-form-layout"

interface SystemConfigEditFormProps {
  configId: string
}

export function SystemConfigEditForm({ configId }: SystemConfigEditFormProps) {
  const { form, isSubmitting, isLoading, onSubmit } = useSystemConfigEditForm(configId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 dark:text-white">Memuat data konfigurasi...</span>
      </div>
    )
  }

  return (
    <SystemConfigFormLayout
      title="Edit Konfigurasi Sistem"
      description="Perbarui konfigurasi sistem yang ada"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Perbarui Konfigurasi"
      submitButtonLoadingText="Memperbarui..."
      isEdit={true}
    />
  )
}
