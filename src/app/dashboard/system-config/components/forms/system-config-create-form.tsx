'use client'

import { useSystemConfigCreateForm } from "../hooks/use-system-config-form"
import { SystemConfigFormLayout } from "../system-config-form-layout"

export function SystemConfigCreateForm() {
  const { form, isSubmitting, onSubmit } = useSystemConfigCreateForm()

  return (
    <SystemConfigFormLayout
      title="Tambah Konfigurasi Sistem"
      description="Buat konfigurasi sistem baru"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Simpan Konfigurasi"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}
