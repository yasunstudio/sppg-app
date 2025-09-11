/**
 * Dynamic Database-Driven Permission Engine
 * Core permission resolution system for SPPG Application
 */

import { PrismaClient } from "../../../generated/prisma"
import { LRUCache } from "lru-cache"

const prisma = new PrismaClient()

export type PermissionResult = {
  granted: boolean
  reason?: string
  roleSource?: string[]
  cached?: boolean
}

export type UserPermissionContext = {
  userId: string
  roles: Array<{
    id: string
    name: string
    priority: number
    permissions: string[]
    color?: string
    metadata?: any
  }>
  permissions: Set<string>
  highestPriority: number
  cacheKey: string
}

// LRU Cache for permission results (5 minute TTL)
const permissionCache = new LRUCache<string, PermissionResult>({
  max: 1000,
  ttl: 5 * 60 * 1000 // 5 minutes
})

// User context cache (2 minute TTL for frequently accessed users)
const userContextCache = new LRUCache<string, UserPermissionContext>({
  max: 100,
  ttl: 2 * 60 * 1000 // 2 minutes
})

export class PermissionEngine {
  /**
   * Get user permission context from database with caching
   */
  async getUserPermissionContext(userId: string): Promise<UserPermissionContext> {
    const cacheKey = `user-context:${userId}`
    const cached = userContextCache.get(cacheKey)
    
    if (cached) {
      return cached
    }

    // Get user roles via UserRole junction table
    const userRoleAssignments = await prisma.userRole.findMany({
      where: { userId }
    })

    if (userRoleAssignments.length === 0) {
      const emptyContext: UserPermissionContext = {
        userId,
        roles: [],
        permissions: new Set(),
        highestPriority: 0,
        cacheKey
      }
      userContextCache.set(cacheKey, emptyContext)
      return emptyContext
    }

    // Get role details
    const roleIds = userRoleAssignments.map(ur => ur.roleId)
    const roles = await prisma.role.findMany({
      where: { 
        id: { in: roleIds },
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        permissions: true,
        priority: true,
        color: true,
        metadata: true
      }
    })

    // Process roles and collect permissions
    const processedRoles = roles
      .map(role => ({
        id: role.id,
        name: role.name,
        priority: role.priority || 0,
        permissions: Array.isArray(role.permissions) ? role.permissions : [],
        color: role.color || undefined,
        metadata: role.metadata || undefined
      }))
      .sort((a, b) => b.priority - a.priority) // Sort by priority descending

    // Collect all unique permissions
    const allPermissions = new Set<string>()
    processedRoles.forEach(role => {
      role.permissions.forEach(permission => {
        if (typeof permission === 'string') {
          allPermissions.add(permission)
        }
      })
    })

    const context: UserPermissionContext = {
      userId,
      roles: processedRoles,
      permissions: allPermissions,
      highestPriority: processedRoles.length > 0 ? processedRoles[0].priority : 0,
      cacheKey
    }

    userContextCache.set(cacheKey, context)
    return context
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const cacheKey = `permission:${userId}:${permission}`
    const cached = permissionCache.get(cacheKey)
    
    if (cached) {
      return cached.granted
    }

    const context = await this.getUserPermissionContext(userId)
    const granted = context.permissions.has(permission)

    const result: PermissionResult = {
      granted,
      reason: granted ? 'Permission granted' : 'Permission denied',
      roleSource: granted ? context.roles.filter(r => r.permissions.includes(permission)).map(r => r.name) : undefined,
      cached: false
    }

    permissionCache.set(cacheKey, result)
    return granted
  }

  /**
   * Check multiple permissions (requires ALL to be true)
   */
  async hasAllPermissions(userId: string, permissions: string[]): Promise<boolean> {
    const context = await this.getUserPermissionContext(userId)
    return permissions.every(permission => context.permissions.has(permission))
  }

  /**
   * Check multiple permissions (requires ANY to be true)
   */
  async hasAnyPermission(userId: string, permissions: string[]): Promise<boolean> {
    const context = await this.getUserPermissionContext(userId)
    return permissions.some(permission => context.permissions.has(permission))
  }

  /**
   * Get user's role hierarchy
   */
  async getUserRoles(userId: string): Promise<UserPermissionContext['roles']> {
    const context = await this.getUserPermissionContext(userId)
    return context.roles
  }

  /**
   * Check if user has role
   */
  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const context = await this.getUserPermissionContext(userId)
    return context.roles.some(role => role.name === roleName)
  }

  /**
   * Check if user has minimum role priority
   */
  async hasMinimumPriority(userId: string, minPriority: number): Promise<boolean> {
    const context = await this.getUserPermissionContext(userId)
    return context.highestPriority >= minPriority
  }

  /**
   * Get all permissions for user
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const context = await this.getUserPermissionContext(userId)
    return Array.from(context.permissions)
  }

  /**
   * Invalidate user cache
   */
  invalidateUserCache(userId: string): void {
    const cacheKey = `user-context:${userId}`
    userContextCache.delete(cacheKey)
    
    // Also clear related permission caches
    const permissionKeys = Array.from(permissionCache.keys()).filter(key => key.startsWith(`permission:${userId}:`))
    permissionKeys.forEach(key => permissionCache.delete(key))
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      permissionCache: {
        size: permissionCache.size,
        maxSize: permissionCache.max,
        calculatedSize: permissionCache.calculatedSize,
      },
      userContextCache: {
        size: userContextCache.size,
        maxSize: userContextCache.max,
        calculatedSize: userContextCache.calculatedSize,
      }
    }
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    permissionCache.clear()
    userContextCache.clear()
  }
}

// Export singleton instance
export const permissionEngine = new PermissionEngine()

// Utility constants for common permission patterns
export const Permission = {
  Users: {
    CREATE: 'users.create',
    VIEW: 'users.view',
    EDIT: 'users.edit',
    DELETE: 'users.delete'
  },
  Menu: {
    CREATE: 'menus.create',
    VIEW: 'menus.view',
    EDIT: 'menus.edit',
    APPROVE: 'menus.approve'
  },
  Production: {
    CREATE: 'production.create',
    VIEW: 'production.view',
    MANAGE: 'production.manage'
  },
  Quality: {
    CHECK: 'quality.check',
    CREATE: 'quality.create',
    EDIT: 'quality.edit'
  },
  System: {
    CONFIG: 'system.config',
    AUDIT: 'audit.view'
  },
  Inventory: {
    CREATE: 'inventory.create',
    VIEW: 'inventory.view',
    EDIT: 'inventory.edit'
  },
  Finance: {
    VIEW: 'finance.view',
    MANAGE: 'finance.manage'
  }
} as const

export type PermissionType = typeof Permission[keyof typeof Permission][keyof typeof Permission[keyof typeof Permission]]
