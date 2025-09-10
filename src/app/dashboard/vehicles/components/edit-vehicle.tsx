'use client'

import { VehicleEditForm } from "./forms/vehicle-edit-form"

interface EditVehicleProps {
  vehicleId: string
}

export function EditVehicle({ vehicleId }: EditVehicleProps) {
  return <VehicleEditForm vehicleId={vehicleId} />
}
