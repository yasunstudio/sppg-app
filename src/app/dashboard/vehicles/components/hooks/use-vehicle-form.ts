"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { vehicleCreateSchema, vehicleUpdateSchema, type VehicleCreateFormData, type VehicleUpdateFormData, VehicleType, VehicleStatus } from "../utils/vehicle-schemas"

interface UseVehicleCreateFormOptions {
  mode: 'create'
  defaultValues?: Partial<VehicleCreateFormData>
  onSuccess?: () => void
  redirectPath?: string
}

interface UseVehicleEditFormOptions {
  mode: 'edit'
  defaultValues: VehicleUpdateFormData
  onSuccess?: () => void
  redirectPath?: string
}

type UseVehicleFormOptions = UseVehicleCreateFormOptions | UseVehicleEditFormOptions

export function useVehicleForm(options: UseVehicleFormOptions) {
  const { mode, defaultValues, onSuccess, redirectPath = "/dashboard/vehicles" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create form for create mode
  const createForm = useForm<VehicleCreateFormData>({
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
      ...(mode === 'create' ? defaultValues : {})
    }
  })

  // Edit form for edit mode  
  const editForm = useForm<VehicleUpdateFormData>({
    resolver: zodResolver(vehicleUpdateSchema),
    defaultValues: mode === 'edit' ? defaultValues : undefined
  })

  // Choose the right form based on mode
  const form = mode === 'create' ? createForm : editForm

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      const url = mode === 'create' ? '/api/vehicles' : `/api/vehicles/${data.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      
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

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${mode} vehicle`)
      }

      toast.success(`Vehicle ${mode === 'create' ? 'created' : 'updated'} successfully`)
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
      }
    } catch (error) {
      console.error(`Error ${mode}ing vehicle:`, error)
      toast.error(error instanceof Error ? error.message : `Failed to ${mode} vehicle`)
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
