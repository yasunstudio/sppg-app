"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { vehicleCreateSchema, type VehicleCreateFormData, VehicleType, VehicleStatus } from "../utils/vehicle-schemas"

interface UseVehicleCreateFormOptions {
  defaultValues?: Partial<VehicleCreateFormData>
  onSuccess?: () => void
  redirectPath?: string
}

export function useVehicleCreateForm(options: UseVehicleCreateFormOptions = {}) {
  const { defaultValues, onSuccess, redirectPath = "/dashboard/vehicles" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<VehicleCreateFormData>({
    resolver: zodResolver(vehicleCreateSchema),
    defaultValues: {
      plateNumber: "",
      type: VehicleType.TRUCK,
      capacity: 0,
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      fuelType: "DIESEL",
      status: VehicleStatus.ACTIVE,
      lastService: "",
      nextService: "",
      mileage: 0,
      insuranceExpiry: "",
      registrationExpiry: "",
      notes: "",
      ...defaultValues
    }
  })

  const onSubmit = async (data: VehicleCreateFormData) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        ...data,
        capacity: Number(data.capacity),
        year: Number(data.year),
        mileage: data.mileage ? Number(data.mileage) : null,
        lastService: data.lastService ? new Date(data.lastService).toISOString() : null,
        nextService: data.nextService ? new Date(data.nextService).toISOString() : null,
        insuranceExpiry: data.insuranceExpiry ? new Date(data.insuranceExpiry).toISOString() : null,
        registrationExpiry: data.registrationExpiry ? new Date(data.registrationExpiry).toISOString() : null,
      }

      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create vehicle')
      }

      toast.success('Vehicle created successfully')
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
      }
    } catch (error) {
      console.error('Error creating vehicle:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create vehicle')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit)
  }
}
