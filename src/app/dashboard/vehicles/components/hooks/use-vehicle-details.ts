'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface VehicleDetailsData {
  id: string
  plateNumber: string
  type: string
  capacity: number
  brand?: string
  model?: string
  year?: number
  fuelType?: string
  status: string
  lastService?: string
  nextService?: string
  mileage?: number
  insuranceExpiry?: string
  registrationExpiry?: string
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface DeliveryData {
  id: string
  status: string
  deliveryDate: string
  route?: string
  description?: string
  school?: {
    name: string
  }
}

interface UseVehicleDetailsReturn {
  vehicle: VehicleDetailsData | null
  deliveries: DeliveryData[]
  isLoading: boolean
  isDeliveriesLoading: boolean
  error: string | null
  refreshVehicle: () => Promise<void>
  refreshDeliveries: () => Promise<void>
}

export function useVehicleDetails(vehicleId: string): UseVehicleDetailsReturn {
  const [vehicle, setVehicle] = useState<VehicleDetailsData | null>(null)
  const [deliveries, setDeliveries] = useState<DeliveryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeliveriesLoading, setIsDeliveriesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVehicle = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/vehicles/${vehicleId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicle')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Vehicle not found')
      }

      setVehicle(result.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load vehicle'
      setError(errorMessage)
      console.error('Error fetching vehicle:', err)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDeliveries = async () => {
    try {
      setIsDeliveriesLoading(true)

      const response = await fetch(`/api/vehicles/${vehicleId}/deliveries`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch deliveries')
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        setDeliveries(result.data)
      } else {
        setDeliveries([])
      }
    } catch (err) {
      console.error('Error fetching deliveries:', err)
      setDeliveries([])
      // Don't show toast for deliveries error, it's not critical
    } finally {
      setIsDeliveriesLoading(false)
    }
  }

  const refreshVehicle = async () => {
    await fetchVehicle()
  }

  const refreshDeliveries = async () => {
    await fetchDeliveries()
  }

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle()
      fetchDeliveries()
    }
  }, [vehicleId])

  return {
    vehicle,
    deliveries,
    isLoading,
    isDeliveriesLoading,
    error,
    refreshVehicle,
    refreshDeliveries
  }
}
