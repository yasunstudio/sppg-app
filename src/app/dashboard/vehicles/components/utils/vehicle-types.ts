// Vehicle types - Updated to match API schema
export interface Vehicle {
  id: string
  plateNumber: string  // Changed from 'plate' to match API
  type: string
  capacity: number
  isActive: boolean     // Changed from status enum to boolean to match API
  lastService?: string | null  // Changed from lastMaintenance
  notes?: string | null
  createdAt: string     // API returns ISO string
  updatedAt: string     // API returns ISO string  
  deletedAt?: string | null
  _count?: {            // Added to match API response
    distributions: number
    deliveries: number
  }
}

export interface VehicleStats {
  total: number
  active: number
  maintenance: number
  inactive: number
}

export interface VehicleFilters {
  searchTerm: string
  selectedType: string
  selectedStatus: string  // 'all' | 'active' | 'inactive'
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  hasMore: boolean
  itemsPerPage: number
}

// Vehicle form types
export interface CreateVehicleData {
  plateNumber: string
  type: string
  capacity: number
  isActive?: boolean    // Optional with default true
  lastService?: string | null
  notes?: string | null
}

export interface UpdateVehicleData extends Partial<CreateVehicleData> {
  id: string
}

// API response types - Updated to match actual API structure
export interface VehiclesApiResponse {
  success: boolean
  data: Vehicle[]
  stats: {
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
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    itemsPerPage: number
  }
}

export interface VehicleApiResponse {
  success: boolean
  data: Vehicle
}

export interface VehicleDeleteResponse {
  success: boolean
  message: string
}
