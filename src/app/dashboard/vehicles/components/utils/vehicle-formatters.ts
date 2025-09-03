// Vehicle Management Formatters and Constants

import type { VehicleType } from './vehicle-types'

export const VEHICLE_TYPES: VehicleType[] = [
  'Truck',
  'Van', 
  'Pickup',
  'Motorcycle',
  'Car'
]

export const VEHICLE_TYPE_COLORS = {
  'Truck': 'bg-blue-100 text-blue-800 border-blue-200',
  'Van': 'bg-green-100 text-green-800 border-green-200',
  'Pickup': 'bg-orange-100 text-orange-800 border-orange-200',
  'Motorcycle': 'bg-purple-100 text-purple-800 border-purple-200',
  'Car': 'bg-pink-100 text-pink-800 border-pink-200',
} as const

// Pilihan type kendaraan untuk form dan filter dalam bahasa Indonesia
export const VEHICLE_TYPE_OPTIONS = [
  { value: 'Truck', label: 'Truk' },
  { value: 'Van', label: 'Van' },
  { value: 'Pickup', label: 'Pickup' },
  { value: 'Motorcycle', label: 'Motor' },
  { value: 'Car', label: 'Mobil' }
] as const

export const VEHICLE_STATUS_COLORS = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-red-100 text-red-800 border-red-200',
} as const

export const formatCapacity = (capacity: number): string => {
  if (capacity >= 1000) {
    return `${(capacity / 1000).toFixed(1)}k`
  }
  return capacity.toString()
}

export const formatPlateNumber = (plateNumber: string): string => {
  return plateNumber.toUpperCase()
}

export const formatVehicleType = (type: VehicleType): string => {
  const typeTranslations = {
    'Truck': 'Truk',
    'Van': 'Van',
    'Pickup': 'Pickup',
    'Motorcycle': 'Motor',
    'Car': 'Mobil'
  } as const
  
  return typeTranslations[type] || type
}

export const formatServiceDate = (dateString: string | null): string => {
  if (!dateString) return 'Belum pernah'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`
  
  return `${Math.floor(diffDays / 365)} tahun lalu`
}

export const getVehicleStatusText = (isActive: boolean): string => {
  return isActive ? 'Aktif' : 'Tidak Aktif'
}

export const getVehicleStatusVariant = (isActive: boolean): 'active' | 'inactive' => {
  return isActive ? 'active' : 'inactive'
}

export const DEFAULT_ITEMS_PER_PAGE = 10

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50] as const
