'use client'

import { useVehicleCreateForm } from "./hooks/use-vehicle-create-form"
import { VehicleFormLayout } from "./vehicle-form-layout"

export function CreateVehicle() {
  const { form, isSubmitting, onSubmit } = useVehicleCreateForm()

  return (
    <VehicleFormLayout
      title="Tambah Kendaraan Baru"
      description="Daftarkan kendaraan baru untuk sistem distribusi"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Simpan Kendaraan"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}
