'use client'

import { useWasteRecordEditForm } from "../hooks"
import { WasteRecordFormLayout } from "../waste-record-form-layout"

interface WasteRecordEditFormProps {
  wasteRecordId: string
}

export function WasteRecordEditForm({ wasteRecordId }: WasteRecordEditFormProps) {
  const { form, isSubmitting, onSubmit } = useWasteRecordEditForm({ wasteRecordId })

  return (
    <WasteRecordFormLayout
      title="Edit Pencatatan Limbah"
      description="Perbarui data pencatatan limbah"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Update Pencatatan"
      submitButtonLoadingText="Mengupdate..."
    />
  )
}
