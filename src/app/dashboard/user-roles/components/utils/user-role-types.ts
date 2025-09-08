// User Role Management Types
export interface UserRole {
  id: string
  userId: string
  roleId: string
  assignedAt: string
  assignedBy: string
  isActive: boolean
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  role: {
    id: string
    name: string
    description: string
    permissions: string[]
  }
  assignedByUser?: {
    id: string
    name: string
    email: string
  }
}

export interface UserRoleStats {
  total: number
  active: number
  inactive: number
  rolesCount: number
  recent30Days: number
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  itemsPerPage: number
}

export interface UserRolesResponse {
  success: boolean
  data: UserRole[]
  stats: UserRoleStats
  pagination: PaginationData
}

export interface FilterState {
  searchTerm: string
  selectedRole: string
  selectedStatus: string
  selectedUser: string
}

export interface UserRoleFilters {
  search: string
  role: string
  status: string
  dateRange: string
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isActive: boolean
}
