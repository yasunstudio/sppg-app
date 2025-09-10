// User Role Management Types
export interface UserRole {
  id: string
  userId: string
  roleId: string
  assignedAt: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string | null
  }
  role: {
    id: string
    name: string
    description: string | null
    permissions: string[]
  }
}

export interface UserRoleStats {
  total: number
  active: number
  inactive: number
  rolesCount: number
  usersCount: number
  recent30Days: number
  roleBreakdown: {
    role: string
    count: number
    percentage: number
  }[]
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
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
  searchTerm?: string
  selectedRole?: string
  selectedStatus?: string
  selectedUser?: string
  currentPage?: number
  itemsPerPage?: number
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalPages: number
  totalCount: number
}

export interface Role {
  id: string
  name: string
  description: string | null
  permissions: string[]
  userCount?: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  isActive: boolean
  roles: {
    role: {
      id: string
      name: string
      description: string | null
    }
  }[]
}
