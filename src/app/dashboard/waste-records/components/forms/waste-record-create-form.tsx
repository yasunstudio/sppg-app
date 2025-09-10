'use client'

import { useWasteRecordCreateForm } from "../hooks"
import { WasteRecordFormLayout } from "../waste-record-form-layout"

export function WasteRecordCreateForm() {
  const { form, isSubmitting, onSubmit } = useWasteRecordCreateForm()

  return (
    <WasteRecordFormLayout
      title="Tambah Pencatatan Limbah Baru"
      description="Catat data limbah untuk monitoring dan pelaporan"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Simpan Pencatatan"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}
