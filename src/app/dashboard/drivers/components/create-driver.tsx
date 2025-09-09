'use client'

import { useDriverCreateForm } from "./hooks/use-driver-create-form"
import { DriverFormLayout } from "./driver-form-layout"
import { FormProvider } from "react-hook-form"

export function CreateDriver() {
  const { form, isSubmitting, onSubmit } = useDriverCreateForm()

  return (
    <FormProvider {...form}>
      <DriverFormLayout
        title="Tambah Driver Baru"
        description="Daftarkan driver baru untuk sistem transportasi"
        control={form.control}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        submitButtonText="Simpan Driver"
        submitButtonLoadingText="Menyimpan..."
      />
    </FormProvider>
  )
}
