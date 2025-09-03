// Vehicle Management Types

export interface Vehicle {
  id: string
  plateNumber: string
  type: string
  capacity: number
  isActive: boolean
  lastService?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  _count: {
    distributions: number
    deliveries: number
  }
}

export interface VehicleStats {
  totalVehicles: number
  activeVehicles: number
  inactiveVehicles: number
  totalCapacity: number
  averageCapacity: number
  totalDeliveries: number
  vehicleTypeBreakdown: Array<{
    type: string
    count: number
    percentage: number
  }>
}

export interface FilterState {
  searchTerm: string
  selectedType: string
  selectedStatus: string
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  hasMore: boolean
  itemsPerPage: number
}

export interface VehiclesResponse {
  success: boolean
  data: Vehicle[]
  stats: VehicleStats
  pagination: PaginationData
}

export type VehicleType = 'Truck' | 'Van' | 'Pickup' | 'Motorcycle' | 'Car'

export type VehicleStatus = 'active' | 'inactive'

export interface VehicleFormData {
  plateNumber: string
  type: VehicleType
  capacity: number
  isActive: boolean
  lastService?: string
  notes?: string
}
