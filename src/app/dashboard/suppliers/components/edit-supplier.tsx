'use client'

import { Loader2 } from 'lucide-react'
import { useSupplierEditForm } from './hooks/use-supplier-edit-form'
import { SupplierFormLayout } from "./supplier-form-layout"

interface EditSupplierProps {
  supplierId: string
}

export function EditSupplier({ supplierId }: EditSupplierProps) {
  const { form, isSubmitting, isLoading, onSubmit } = useSupplierEditForm(supplierId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data supplier...</span>
      </div>
    )
  }

  return (
    <SupplierFormLayout
      title="Edit Supplier"
      description="Perbarui informasi supplier dalam sistem"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Perbarui Supplier"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}
