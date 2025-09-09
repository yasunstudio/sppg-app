'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { driverUpdateSchema, type DriverUpdateFormData, DriverStatus, LicenseType } from '../utils/driver-schemas'

export function useDriverEditForm(driverId: string) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<DriverUpdateFormData>({
    resolver: zodResolver(driverUpdateSchema),
    defaultValues: {
      id: driverId,
      employeeId: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: undefined,
      licenseNumber: '',
      licenseType: LicenseType.SIM_A,
      licenseExpiry: undefined,
      emergencyContact: '',
      emergencyPhone: '',
      status: DriverStatus.ACTIVE,
      notes: ''
    }
  })

  // Fetch driver data on mount
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(`/api/drivers/${driverId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch driver')
        }

        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Driver not found')
        }

        const driver = result.data
        
        // Reset form with fetched data
        form.reset({
          id: driverId,
          employeeId: driver.employeeId || '',
          name: driver.name || '',
          email: driver.email || '',
          phone: driver.phone || '',
          address: driver.address || '',
          dateOfBirth: driver.dateOfBirth ? new Date(driver.dateOfBirth).toISOString().split('T')[0] : undefined,
          licenseNumber: driver.licenseNumber || '',
          licenseType: driver.licenseType || LicenseType.SIM_A,
          licenseExpiry: driver.licenseExpiry ? new Date(driver.licenseExpiry).toISOString().split('T')[0] : undefined,
          emergencyContact: driver.emergencyContact || '',
          emergencyPhone: driver.emergencyPhone || '',
          status: driver.status || DriverStatus.ACTIVE,
          notes: driver.notes || ''
        })

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching driver:', error)
        toast.error('Gagal memuat data driver')
        router.push('/dashboard/drivers')
      }
    }

    if (driverId) {
      fetchDriver()
    }
  }, [driverId, form, router])

  const onSubmit = async (data: DriverUpdateFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/drivers/${driverId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update driver')
      }

      if (result.success) {
        toast.success('Driver berhasil diperbarui')
        router.push('/dashboard/drivers')
        router.refresh()
      } else {
        throw new Error(result.error || 'Failed to update driver')
      }
    } catch (error: any) {
      console.error('Error updating driver:', error)
      toast.error(error.message || 'Gagal memperbarui driver')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit)
  }
}
