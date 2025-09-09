'use client'

import { useSupplierCreateForm } from "./hooks/use-supplier-create-form"
import { SupplierFormLayout } from "./supplier-form-layout"

export function CreateSupplier() {
  const { form, isSubmitting, onSubmit } = useSupplierCreateForm()

  return (
    <SupplierFormLayout
      title="Tambah Supplier Baru"
      description="Daftarkan supplier baru untuk sistem pembelian"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Simpan Supplier"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}
