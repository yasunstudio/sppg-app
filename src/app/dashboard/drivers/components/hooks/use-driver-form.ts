"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { driverCreateSchema, driverUpdateSchema, type DriverCreateFormData, type DriverUpdateFormData, DriverStatus, LicenseType } from "../utils/driver-schemas"

interface UseDriverCreateFormOptions {
  mode: 'create'
  defaultValues?: Partial<DriverCreateFormData>
  onSuccess?: () => void
  redirectPath?: string
}

interface UseDriverEditFormOptions {
  mode: 'edit'
  defaultValues: DriverUpdateFormData
  onSuccess?: () => void
  redirectPath?: string
}

type UseDriverFormOptions = UseDriverCreateFormOptions | UseDriverEditFormOptions

export function useDriverForm(options: UseDriverFormOptions) {
  const { mode, defaultValues, onSuccess, redirectPath = "/dashboard/drivers" } = options
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create form for create mode
  const createForm = useForm<DriverCreateFormData>({
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
      ...(mode === 'create' ? defaultValues : {})
    }
  })

  // Edit form for edit mode
  const editForm = useForm<DriverUpdateFormData>({
    resolver: zodResolver(driverUpdateSchema),
    defaultValues: mode === 'edit' ? defaultValues : undefined
  })

  const form = mode === 'create' ? createForm : editForm

  const onSubmit = async (data: DriverCreateFormData | DriverUpdateFormData) => {
    setIsSubmitting(true)
    
    try {
      let response: Response
      let submitData: any

      if (mode === 'create') {
        // Transform data for create API
        const createData = data as DriverCreateFormData
        submitData = {
          ...data,
          totalDeliveries: Number(createData.totalDeliveries),
          licenseExpiry: new Date(createData.licenseExpiry).toISOString(),
          dateOfBirth: createData.dateOfBirth && createData.dateOfBirth !== "" ? new Date(createData.dateOfBirth).toISOString() : null,
          // Remove empty strings for optional fields
          email: createData.email || null,
          address: createData.address || null,
          emergencyContact: createData.emergencyContact || null,
          emergencyPhone: createData.emergencyPhone || null,
          notes: createData.notes || null,
        }

        response = await fetch('/api/drivers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        })
      } else {
        // Edit mode
        const editData = data as DriverUpdateFormData
        response = await fetch(`/api/drivers/${editData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editData),
        })
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${mode} driver`)
      }

      toast.success(`Driver berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}`)
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectPath)
        router.refresh()
      }
    } catch (error) {
      console.error(`Error ${mode}ing driver:`, error)
      toast.error(error instanceof Error ? error.message : `Gagal ${mode === 'create' ? 'menambahkan' : 'memperbarui'} driver`)
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
