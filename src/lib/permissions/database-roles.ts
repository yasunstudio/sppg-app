// ============================================================================
// DATABASE ROLE UTILS (src/lib/permissions/database-roles.ts)
// ============================================================================

import { prisma } from '@/lib/prisma'

// Cache untuk mengurangi database queries
let rolesCache: any[] | null = null
let lastCacheUpdate = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Types
export interface DatabaseRole {
  id: string
  name: string
  description: string | null
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

export interface RolePermissionMap {
  [roleName: string]: string[]
}

// Get all roles from database with caching
export async function getAllRoles(useCache = true): Promise<DatabaseRole[]> {
  const now = Date.now()
  
  if (useCache && rolesCache && (now - lastCacheUpdate) < CACHE_TTL) {
    return rolesCache
  }

  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    rolesCache = roles
    lastCacheUpdate = now
    
    return roles
  } catch (error) {
    console.error('Error fetching roles from database:', error)
    return []
  }
}

// Get role by name
export async function getRoleByName(roleName: string): Promise<DatabaseRole | null> {
  try {
    return await prisma.role.findFirst({
      where: {
        name: roleName
      }
    })
  } catch (error) {
    console.error(`Error fetching role ${roleName}:`, error)
    return null
  }
}

// Get role permissions
export async function getRolePermissions(roleName: string): Promise<string[]> {
  const role = await getRoleByName(roleName)
  return role?.permissions || []
}

// Check if user has permission
export async function hasPermission(roleName: string, permission: string): Promise<boolean> {
  const permissions = await getRolePermissions(roleName)
  return permissions.includes(permission)
}

// Check if user has any of the permissions
export async function hasAnyPermission(roleName: string, requiredPermissions: string[]): Promise<boolean> {
  const permissions = await getRolePermissions(roleName)
  return requiredPermissions.some(permission => permissions.includes(permission))
}

// Check if user has all permissions
export async function hasAllPermissions(roleName: string, requiredPermissions: string[]): Promise<boolean> {
  const permissions = await getRolePermissions(roleName)
  return requiredPermissions.every(permission => permissions.includes(permission))
}

// Get role permission map for faster lookups
export async function getRolePermissionMap(): Promise<RolePermissionMap> {
  const roles = await getAllRoles()
  const map: RolePermissionMap = {}
  
  roles.forEach(role => {
    map[role.name] = role.permissions
  })
  
  return map
}

// Check module access based on permissions
export async function canAccessModule(roleName: string, module: string): Promise<boolean> {
  const modulePermissions: Record<string, string[]> = {
    users: ['READ_USER'],
    menus: ['READ_MENU'],
    inventory: ['READ_INVENTORY'],
    production: ['READ_PRODUCTION'],
    distribution: ['READ_DISTRIBUTION'],
    financial: ['READ_FINANCIAL'],
    quality: ['READ_QC'],
    posyandu: ['READ_POSYANDU'],
    participants: ['READ_PARTICIPANT'],
    'health-records': ['READ_HEALTH_RECORD'],
    reports: ['VIEW_REPORTS'],
    admin: ['MANAGE_ROLES', 'SYSTEM_CONFIG'],
  }

  const requiredPermissions = modulePermissions[module]
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return false
  }

  return await hasAnyPermission(roleName, requiredPermissions)
}

// Refresh cache manually
export function refreshRoleCache(): void {
  rolesCache = null
  lastCacheUpdate = 0
}

// Get role labels for UI
export async function getRoleLabels(): Promise<Record<string, string>> {
  const roles = await getAllRoles()
  const labels: Record<string, string> = {}
  
  roles.forEach(role => {
    labels[role.name] = role.description || role.name
  })
  
  return labels
}

// Validate if role exists
export async function isValidRole(roleName: string): Promise<boolean> {
  const role = await getRoleByName(roleName)
  return !!role
}

// Get available permissions (all unique permissions across roles)
export async function getAllPermissions(): Promise<string[]> {
  const roles = await getAllRoles()
  const allPermissions = new Set<string>()
  
  roles.forEach(role => {
    role.permissions.forEach(permission => {
      allPermissions.add(permission)
    })
  })
  
  return Array.from(allPermissions).sort()
}

// Admin utilities
export async function isAdmin(roleName: string): Promise<boolean> {
  return roleName === 'ADMIN'
}

export async function isManagerLevel(roleName: string): Promise<boolean> {
  const managerRoles = ['ADMIN', 'KEPALA_SPPG', 'AHLI_GIZI']
  return managerRoles.includes(roleName)
}

export async function isStaffLevel(roleName: string): Promise<boolean> {
  const staffRoles = [
    'STAFF_PERSIAPAN', 'STAFF_PRODUKSI', 'STAFF_PEMORSIAN', 
    'STAFF_PACKING', 'STAFF_DISTRIBUSI', 'STAFF_KEBERSIHAN', 
    'STAFF_PENCUCIAN'
  ]
  return staffRoles.includes(roleName)
}

// Hook for components
export function useRolePermissions(roleName: string) {
  return {
    hasPermission: (permission: string) => hasPermission(roleName, permission),
    hasAnyPermission: (permissions: string[]) => hasAnyPermission(roleName, permissions),
    hasAllPermissions: (permissions: string[]) => hasAllPermissions(roleName, permissions),
    canAccessModule: (module: string) => canAccessModule(roleName, module),
    isAdmin: () => isAdmin(roleName),
    isManager: () => isManagerLevel(roleName),
    isStaff: () => isStaffLevel(roleName),
  }
}
