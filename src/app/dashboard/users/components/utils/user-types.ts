// User Management Types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: string
  updatedAt: string
  school?: {
    id: string
    name: string
  }
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  suspended: number
  recent30Days: number
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  itemsPerPage: number
}

export interface UsersResponse {
  success: boolean
  data: User[]
  stats: UserStats
  pagination: PaginationData
}

export interface FilterState {
  searchTerm: string
  selectedRole: string
  selectedStatus: string
  selectedSchool: string
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
}
