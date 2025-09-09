"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { driverCreateSchema, type DriverCreateFormData, DriverStatus, LicenseType } from "../utils/driver-schemas"

interface UseDriverCreateFormOptions {
  defaultValues?: Partial<DriverCreateFormData>
  onSuccess?: () => void
  redirectPath?: string
}

export function useDriverCreateForm(options: UseDriverCreateFormOptions = {}) {
  const { defaultValues, onSuccess, redirectPath = "/dashboard/drivers" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DriverCreateFormData>({
    resolver: zodResolver(driverCreateSchema),
    defaultValues: {
      employeeId: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      dateOfBirth: "",
      licenseNumber: "",
      licenseType: LicenseType.SIM_A,
      licenseExpiry: "",
      emergencyContact: "",
      emergencyPhone: "",
      status: DriverStatus.ACTIVE,
      isActive: true,
      totalDeliveries: 0,
      notes: "",
      ...defaultValues
    }
  })

  const onSubmit = async (data: DriverCreateFormData) => {
    setIsSubmitting(true)
    
    try {
      // Transform data for API
      const submitData = {
        ...data,
        totalDeliveries: Number(data.totalDeliveries),
        licenseExpiry: new Date(data.licenseExpiry).toISOString(),
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
        // Remove empty strings for optional fields
        email: data.email || null,
        address: data.address || null,
        emergencyContact: data.emergencyContact || null,
        emergencyPhone: data.emergencyPhone || null,
        notes: data.notes || null,
      }

      const response = await fetch('/api/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create driver')
      }

      toast.success('Driver berhasil ditambahkan')
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
      }
    } catch (error) {
      console.error('Error creating driver:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal menambahkan driver')
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
