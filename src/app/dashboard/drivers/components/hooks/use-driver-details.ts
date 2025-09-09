'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface DriverDetailsData {
  id: string
  employeeId: string
  name: string
  phone: string
  email?: string
  address?: string
  dateOfBirth?: string
  licenseNumber: string
  licenseType: string
  licenseExpiry: string
  emergencyContact?: string
  emergencyPhone?: string
  status: string
  isActive: boolean
  totalDeliveries: number
  notes?: string
  createdAt: string
  updatedAt: string
}

interface DeliveryData {
  id: string
  status: string
  deliveryOrder: number
  plannedTime?: string
  departureTime?: string
  arrivalTime?: string
  completionTime?: string
  portionsDelivered?: number
  notes?: string
  school?: {
    id: string
    name: string
    address?: string
  }
  vehicle?: {
    id: string
    plateNumber: string
    model: string
    type: string
  }
  distribution?: {
    id: string
    date: string
    status: string
  }
  createdAt: string
  updatedAt: string
}

interface UseDriverDetailsReturn {
  driver: DriverDetailsData | null
  deliveries: DeliveryData[]
  isLoading: boolean
  isDeliveriesLoading: boolean
  error: string | null
  refreshDriver: () => Promise<void>
  refreshDeliveries: () => Promise<void>
}

export function useDriverDetails(driverId: string): UseDriverDetailsReturn {
  const [driver, setDriver] = useState<DriverDetailsData | null>(null)
  const [deliveries, setDeliveries] = useState<DeliveryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeliveriesLoading, setIsDeliveriesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDriver = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/drivers/${driverId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch driver')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Driver not found')
      }

      setDriver(result.data)
    } catch (error) {
      console.error('Error fetching driver:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      toast.error('Gagal memuat data driver')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDeliveries = async () => {
    try {
      setIsDeliveriesLoading(true)
      
      const response = await fetch(`/api/drivers/${driverId}/deliveries`)
      
      if (!response.ok) {
        // Log the error but don't throw - deliveries are optional data
        console.warn(`Failed to fetch deliveries for driver ${driverId}:`, response.status, response.statusText)
        setDeliveries([]) // Set empty array as fallback
        return
      }

      const result = await response.json()
      
      if (result.success) {
        setDeliveries(result.data || [])
      } else {
        console.warn('Deliveries API returned unsuccessful response:', result.error)
        setDeliveries([])
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error)
      // Set empty array as fallback - deliveries are optional
      setDeliveries([])
    } finally {
      setIsDeliveriesLoading(false)
    }
  }

  useEffect(() => {
    if (driverId) {
      fetchDriver()
      fetchDeliveries()
    }
  }, [driverId])

  const refreshDriver = async () => {
    await fetchDriver()
  }

  const refreshDeliveries = async () => {
    await fetchDeliveries()
  }

  return {
    driver,
    deliveries,
    isLoading,
    isDeliveriesLoading,
    error,
    refreshDriver,
    refreshDeliveries
  }
}
