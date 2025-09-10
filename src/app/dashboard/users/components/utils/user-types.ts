// User types - Following vehicle pattern
export interface User {
  id: string
  email: string
  username?: string | null
  name: string
  fullName?: string // For compatibility with forms
  phone?: string | null
  address?: string | null
  avatar?: string | null
  isActive: boolean
  emailVerified?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  roles?: {
    id: string
    userId: string
    roleId: string
    assignedAt: string
    role: {
      id: string
      name: string
      description?: string | null
      permissions: string[]
    }
  }[]
  _count?: {
    auditLogs: number
    notifications: number
    orderedPurchases: number
    receivedPurchases: number
  }
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  verifiedUsers: number
  totalOrders: number
  totalAuditLogs: number
  roleBreakdown: {
    role: string
    count: number
    percentage: number
  }[]
}

export interface UserFilters {
  searchTerm: string
  selectedRole: string
  selectedStatus: string  // 'all' | 'active' | 'inactive'
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

// User form types
export interface CreateUserData {
  email: string
  username?: string | null
  name: string
  password: string
  phone?: string | null
  address?: string | null
  isActive?: boolean
}

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password'>> {
  id: string
}

// Filter options
export const USER_STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Tidak Aktif' }
]

export const USER_ROLE_OPTIONS = [
  { value: 'all', label: 'Semua Role' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'CHEF', label: 'Chef' },
  { value: 'NUTRITIONIST', label: 'Ahli Gizi' },
  { value: 'SUPPLIER', label: 'Supplier' },
  { value: 'DRIVER', label: 'Driver' },
  { value: 'STAFF', label: 'Staff' }
]

// Form validation types
export interface UserFormErrors {
  email?: string[]
  username?: string[]
  name?: string[]
  password?: string[]
  phone?: string[]
  address?: string[]
}

export interface UserFormCreateInput {
  email: string
  username?: string
  fullName: string // Use fullName for forms, map to name in API
  password: string
  phone?: string
  address?: string
  isActive: boolean
}

export interface UserFormUpdateInput {
  email?: string
  username?: string
  fullName?: string // Use fullName for forms, map to name in API
  phone?: string
  address?: string
  isActive?: boolean
}
