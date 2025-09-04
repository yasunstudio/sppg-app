"use client"

import { useMemo } from "react"
import { hasPermission } from "@/lib/permissions"
import type { Permission } from "@/lib/permissions"
import type { MenuItem } from "../types/sidebar.types"

export const useMenuPermissions = (userRoles: string[] = []) => {
  // Define permission requirements for each menu item
  const getMenuPermissions = (href: string): Permission[] | null => {
    const permissionMap: Record<string, Permission[]> = {
      '/dashboard': ['system.config'],
      '/dashboard/schools': ['schools.view'],
      '/dashboard/students': ['students.view'],
      '/dashboard/classes': ['students.view'],
      '/dashboard/vehicles': ['production.view'],
      '/dashboard/drivers': ['drivers.view'],
      '/dashboard/raw-materials': ['inventory.view'],
      '/dashboard/suppliers': ['suppliers.view'],
      '/dashboard/purchase-orders': ['purchase_orders.view'],
      '/dashboard/purchase-orders/analytics': ['purchase_orders.view'],
      '/dashboard/inventory': ['inventory.view'],
      '/dashboard/distribution': ['production.view'],
      '/dashboard/distributions': ['distributions.view'],
      '/dashboard/distributions/schools': ['distributions.view'],
      '/dashboard/distributions/tracking': ['distributions.track'],
      '/dashboard/distributions/routes': ['distributions.view'],
      '/dashboard/delivery-tracking': ['production.view'],
      '/dashboard/production': ['production.view'],
      '/dashboard/production-plans': ['production.view'],
      '/dashboard/resource-usage': ['production.view'],
      '/dashboard/production/execution': ['production.view'],
      '/dashboard/production/quality': ['quality.check'],
      '/dashboard/quality-checks': ['quality.check'],
      '/dashboard/quality-checkpoints': ['quality.check'],
      '/dashboard/quality': ['quality.check'],
      '/dashboard/recipes': ['recipes.view'],
      '/dashboard/menu-planning': ['menus.view'],
      '/dashboard/menu-planning/create': ['menus.create'],
      '/dashboard/menu-planning/planning': ['menus.view'],
      '/dashboard/recipes/new': ['recipes.create'],
      '/dashboard/feedback': ['feedback.view'],
      '/dashboard/nutrition-consultations': ['nutrition.consult'],
      '/dashboard/food-samples': ['quality.check'],
      '/dashboard/quality-standards': ['quality.check'],
      '/dashboard/waste-management': ['waste.view'],
      '/dashboard/financial': ['finance.view'],
      '/dashboard/users': ['users.view'],
      '/dashboard/roles': ['system.config'],
      '/dashboard/user-roles': ['users.edit', 'system.config'],
      '/dashboard/system-config': ['system.config'],
      '/dashboard/audit-logs': ['audit.view'],
      '/dashboard/admin': ['system.config']
    }

    return permissionMap[href] || null
  }

  // Check if user has permission for a specific menu item
  const checkPermission = (permissions: Permission[] | null): boolean => {
    if (!permissions || permissions.length === 0) return true // No permission required
    return permissions.some(permission => hasPermission(userRoles, permission))
  }

  // Filter menu items based on permissions
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      const requiredPermissions = getMenuPermissions(item.href)
      return checkPermission(requiredPermissions)
    })
  }

  // Check if user has access to any submenu items
  const hasAnySubMenuAccess = (subMenus: MenuItem[]): boolean => {
    return subMenus.some(subItem => {
      const permissions = getMenuPermissions(subItem.href)
      return checkPermission(permissions)
    })
  }

  // Get accessible menu count for a section
  const getAccessibleMenuCount = (items: MenuItem[]): number => {
    return filterMenuItems(items).length
  }

  // Check if user can access a specific menu section
  const canAccessMenuSection = (items: MenuItem[]): boolean => {
    return getAccessibleMenuCount(items) > 0
  }

  // Memoize permission checks for performance
  const permissionCache = useMemo(() => {
    const cache = new Map<string, boolean>()
    
    return {
      checkCached: (href: string): boolean => {
        if (cache.has(href)) {
          return cache.get(href)!
        }
        
        const permissions = getMenuPermissions(href)
        const hasAccess = checkPermission(permissions)
        cache.set(href, hasAccess)
        
        return hasAccess
      },
      
      clearCache: () => cache.clear()
    }
  }, [userRoles])

  return {
    // Core permission functions
    checkPermission,
    getMenuPermissions,
    
    // Menu filtering
    filterMenuItems,
    hasAnySubMenuAccess,
    
    // Utility functions
    getAccessibleMenuCount,
    canAccessMenuSection,
    
    // Performance optimized
    checkPermissionCached: permissionCache.checkCached,
    clearPermissionCache: permissionCache.clearCache,
    
    // Context info
    userRoles
  }
}
