'use client'

import { Loader2 } from 'lucide-react'
import { useVehicleEditForm } from './hooks/use-vehicle-edit-form'
import { VehicleFormLayout } from "./vehicle-form-layout"

interface EditVehicleProps {
  vehicleId: string
}

export function EditVehicle({ vehicleId }: EditVehicleProps) {
  const { form, isSubmitting, isLoading, onSubmit } = useVehicleEditForm(vehicleId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data kendaraan...</span>
      </div>
    )
  }

  return (
    <VehicleFormLayout
      title="Edit Kendaraan"
      description="Perbarui informasi kendaraan dalam sistem"
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitButtonText="Perbarui Kendaraan"
      submitButtonLoadingText="Menyimpan..."
    />
  )
}
