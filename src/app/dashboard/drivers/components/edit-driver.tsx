'use client'

import { Loader2 } from 'lucide-react'
import { useDriverEditForm } from './hooks/use-driver-edit-form'
import { DriverFormLayout } from "./driver-form-layout"
import { FormProvider } from "react-hook-form"

interface EditDriverProps {
  driverId: string
}

export function EditDriver({ driverId }: EditDriverProps) {
  const { form, isSubmitting, isLoading, onSubmit } = useDriverEditForm(driverId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data driver...</span>
      </div>
    )
  }

  return (
    <FormProvider {...form}>
      <DriverFormLayout
        title="Edit Driver"
        description="Perbarui informasi driver dalam sistem transportasi"
        control={form.control}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        submitButtonText="Perbarui Driver"
        submitButtonLoadingText="Memperbarui..."
      />
    </FormProvider>
  )
}
