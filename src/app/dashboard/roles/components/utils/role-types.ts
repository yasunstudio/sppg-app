// Role types - Based on API schema
export interface Role {
  id: string
  name: string
  description: string | null
  permissions: string[]
  userCount: number
  permissionCount: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  _count?: {
    users: number
  }
}

export interface RoleStats {
  total: number
  active: number
  systemRoles: number
  customRoles: number
}

export interface RoleFilters {
  searchTerm: string
  selectedType: string
  selectedPermission: string
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  hasMore: boolean
  itemsPerPage: number
}

// Role form types
export interface CreateRoleData {
  name: string
  description?: string | null
  permissions: string[]
}

export interface UpdateRoleData extends Partial<CreateRoleData> {
  id: string
}

// API Response types
export interface RolesResponse {
  success: boolean
  data: Role[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface RoleResponse {
  success: boolean
  data: Role
}

export interface RoleStatsResponse {
  success: boolean
  data: RoleStats
}

// Form field types
export interface RoleFormData {
  name: string
  description: string
  permissions: string[]
}

export interface RoleFormErrors {
  name?: string
  description?: string
  permissions?: string
}

// Filter and search types
export interface UseRolesParams {
  page?: number
  limit?: number
  search?: string
  type?: string
  permission?: string
}

// Available permissions list
export const ROLE_PERMISSIONS = [
  'manage_users',
  'manage_roles', 
  'manage_schools',
  'manage_students',
  'manage_suppliers',
  'manage_vehicles',
  'manage_waste_records',
  'manage_system_config',
  'view_reports',
  'view_analytics'
] as const

export type RolePermission = typeof ROLE_PERMISSIONS[number]
