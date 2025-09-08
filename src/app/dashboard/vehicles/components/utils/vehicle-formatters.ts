import type { Vehicle } from './vehicle-types'

// Vehicle status formatters - Updated for boolean isActive
export const formatVehicleStatus = (isActive: boolean): string => {
  return isActive ? 'Aktif' : 'Tidak Aktif'
}

// Vehicle type formatters - Keep the same but also handle common types
export const formatVehicleType = (type: string): string => {
  const typeMap = {
    'TRUCK': 'Truk',
    'VAN': 'Van', 
    'MOTORCYCLE': 'Motor',
    'CAR': 'Mobil',
    'Pickup Truck': 'Pickup Truck',
    'Mini Truck': 'Mini Truck',
    'Sedan': 'Sedan',
    'SUV': 'SUV'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

// Capacity formatter
export const formatCapacity = (capacity: number): string => {
  if (capacity >= 1000) {
    return `${(capacity / 1000).toFixed(1)} ton`
  }
  return `${capacity} kg`
}

// Date formatters - Handle both Date objects and ISO strings
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Vehicle badge variant helper - Updated for boolean status
export const getVehicleStatusVariant = (isActive: boolean) => {
  return isActive ? 'default' : 'secondary'
}

// Vehicle validation helpers
export const validatePlateNumber = (plate: string): boolean => {
  // Indonesian plate number format validation
  const plateRegex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/
  return plateRegex.test(plate.toUpperCase())
}

// Search helper - Updated for new field names
export const filterVehicles = (
  vehicles: Vehicle[],
  searchTerm: string,
  typeFilter: string,
  statusFilter: string
): Vehicle[] => {
  return vehicles.filter(vehicle => {
    const matchesSearch = !searchTerm || 
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.notes && vehicle.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && vehicle.isActive) ||
      (statusFilter === 'inactive' && !vehicle.isActive)
    
    return matchesSearch && matchesType && matchesStatus
  })
}
