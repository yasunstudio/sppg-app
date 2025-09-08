'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { vehicleUpdateSchema, type VehicleUpdateFormData, VehicleType, VehicleStatus } from '../utils/vehicle-schemas'

export function useVehicleEditForm(vehicleId: string) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<VehicleUpdateFormData>({
    resolver: zodResolver(vehicleUpdateSchema),
    defaultValues: {
      id: vehicleId,
      plateNumber: '',
      type: VehicleType.TRUCK,
      capacity: 0,
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      fuelType: 'DIESEL',
      status: VehicleStatus.ACTIVE,
      lastService: undefined,
      nextService: undefined,
      mileage: 0,
      insuranceExpiry: undefined,
      registrationExpiry: undefined,
      notes: ''
    }
  })

  // Fetch vehicle data on mount
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle')
        }

        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Vehicle not found')
        }

        const vehicle = result.data
        
        // Reset form with fetched data
        form.reset({
          id: vehicleId,
          plateNumber: vehicle.plateNumber || '',
          type: vehicle.type || VehicleType.TRUCK,
          capacity: vehicle.capacity || 0,
          brand: vehicle.brand || '',
          model: vehicle.model || '',
          year: vehicle.year || new Date().getFullYear(),
          fuelType: vehicle.fuelType || 'DIESEL',
          status: vehicle.status || VehicleStatus.ACTIVE,
          lastService: vehicle.lastService ? new Date(vehicle.lastService).toISOString().split('T')[0] : undefined,
          nextService: vehicle.nextService ? new Date(vehicle.nextService).toISOString().split('T')[0] : undefined,
          mileage: vehicle.mileage || 0,
          insuranceExpiry: vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toISOString().split('T')[0] : undefined,
          registrationExpiry: vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry).toISOString().split('T')[0] : undefined,
          notes: vehicle.notes || ''
        })

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        toast.error('Gagal memuat data kendaraan')
        router.push('/dashboard/vehicles')
      }
    }

    if (vehicleId) {
      fetchVehicle()
    }
  }, [vehicleId, form, router])

  const onSubmit = async (data: VehicleUpdateFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update vehicle')
      }

      if (result.success) {
        toast.success('Kendaraan berhasil diperbarui')
        router.push('/dashboard/vehicles')
        router.refresh()
      } else {
        throw new Error(result.error || 'Failed to update vehicle')
      }
    } catch (error: any) {
      console.error('Error updating vehicle:', error)
      toast.error(error.message || 'Gagal memperbarui kendaraan')
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
