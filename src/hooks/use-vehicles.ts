'use client'

import { useState, useEffect } from 'react'

interface Vehicle {
  id: string
  plate: string
  type: string
  status: string
  capacity: number
  driver?: string
  lastMaintenance?: Date
  nextMaintenance?: Date
  model?: string
  year?: number
}

interface VehicleStats {
  total: number
  active: number
  maintenance: number
  inactive: number
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<VehicleStats>({
    total: 0,
    active: 0,
    maintenance: 0,
    inactive: 0
  })

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/vehicles')
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles')
      }
      
      const data = await response.json()
      setVehicles(data.vehicles || [])
      
      // Calculate stats
      const vehicleList = data.vehicles || []
      setStats({
        total: vehicleList.length,
        active: vehicleList.filter((v: Vehicle) => v.status === 'ACTIVE').length,
        maintenance: vehicleList.filter((v: Vehicle) => v.status === 'MAINTENANCE').length,
        inactive: vehicleList.filter((v: Vehicle) => v.status === 'INACTIVE').length,
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const refreshVehicles = () => {
    fetchVehicles()
  }

  return {
    vehicles,
    loading,
    error,
    stats,
    refreshVehicles,
  }
}
