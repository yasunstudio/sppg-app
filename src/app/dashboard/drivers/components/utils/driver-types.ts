export interface Driver {
  id: string
  employeeId: string
  name: string
  phone: string
  email?: string | null
  licenseNumber: string
  licenseExpiry: string
  address?: string | null
  emergencyContact?: string | null
  emergencyPhone?: string | null
  isActive: boolean
  rating?: number | null
  totalDeliveries: number
  notes?: string | null
  createdAt: string
  updatedAt: string
  _count: {
    distributions: number
    deliveries: number
  }
}

export interface DriverStats {
  totalDrivers: number
  activeDrivers: number
  inactiveDrivers: number
  totalDeliveries: number
  averageRating: number
  expiringSoonCount: number
}

export interface FilterState {
  searchTerm: string
  statusFilter: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
}

export interface PaginationData {
  total: number
  totalPages: number
  currentPage: number
  hasMore: boolean
  hasPrev: boolean
}

export interface DriverResponse {
  success: boolean
  data: Driver[]
  pagination: {
    total: number
    page: number
    limit: number
    hasMore: boolean
  }
}
