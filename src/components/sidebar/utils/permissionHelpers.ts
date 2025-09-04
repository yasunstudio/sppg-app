import type { Permission } from "@/lib/permissions"

// Permission mapping for all menu items
export const PERMISSION_MAP: Record<string, Permission[]> = {
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
  '/dashboard/admin': ['system.config'],
  '/dashboard/notifications': ['system.config'],
  '/dashboard/profile': [], // No permission required for user profile
  '/dashboard/items': ['inventory.view'],
  '/dashboard/monitoring': ['production.view'], // Using production.view as monitoring permission
  '/dashboard/monitoring/real-time': ['production.view'],
  '/dashboard/monitoring/analytics': ['production.view'],
  '/dashboard/performance': ['production.view'],
  '/dashboard/monitoring/reports': ['production.view'],
  '/dashboard/menu-planning/nutrition': ['nutrition.consult'],
  '/dashboard/menu-planning/ai-planner': ['menus.view'],
  '/dashboard/production/batches': ['production.view'],
  '/dashboard/production/resources': ['production.view'],
  '/dashboard/production/ai-optimizer': ['production.view'],
  '/dashboard/production/analytics': ['production.view'],
}

/**
 * Gets required permissions for a specific menu item href
 */
export const getMenuPermissions = (href: string): Permission[] => {
  return PERMISSION_MAP[href] || []
}

/**
 * Checks if permissions array is empty (no permission required)
 */
export const isPublicMenuItem = (href: string): boolean => {
  const permissions = getMenuPermissions(href)
  return permissions.length === 0
}

/**
 * Gets all unique permissions from the permission map
 */
export const getAllPermissions = (): Permission[] => {
  const allPermissions = Object.values(PERMISSION_MAP).flat()
  return Array.from(new Set(allPermissions))
}

/**
 * Groups menu items by their required permissions
 */
export const groupMenuItemsByPermission = (): Record<string, string[]> => {
  const groups: Record<string, string[]> = {}
  
  Object.entries(PERMISSION_MAP).forEach(([href, permissions]) => {
    permissions.forEach(permission => {
      if (!groups[permission]) {
        groups[permission] = []
      }
      groups[permission].push(href)
    })
  })
  
  return groups
}

/**
 * Finds menu items that require specific permission
 */
export const findMenuItemsByPermission = (permission: Permission): string[] => {
  return Object.entries(PERMISSION_MAP)
    .filter(([_, permissions]) => permissions.includes(permission))
    .map(([href]) => href)
}

/**
 * Checks if a href requires admin-level permissions
 */
export const requiresAdminPermission = (href: string): boolean => {
  const permissions = getMenuPermissions(href)
  const adminPermissions: Permission[] = ['system.config', 'users.edit', 'audit.view']
  
  return permissions.some(permission => adminPermissions.includes(permission))
}

/**
 * Gets permission level for a menu item (public, user, admin)
 */
export const getPermissionLevel = (href: string): 'public' | 'user' | 'admin' => {
  if (isPublicMenuItem(href)) {
    return 'public'
  }
  
  if (requiresAdminPermission(href)) {
    return 'admin'
  }
  
  return 'user'
}

/**
 * Validates if a user has all required permissions for a menu item
 */
export const validateMenuItemAccess = (
  href: string, 
  userPermissions: Permission[]
): boolean => {
  const requiredPermissions = getMenuPermissions(href)
  
  if (requiredPermissions.length === 0) {
    return true // Public access
  }
  
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  )
}

/**
 * Filters menu items based on user permissions
 */
export const filterMenuItemsByPermissions = (
  menuItems: string[], 
  userPermissions: Permission[]
): string[] => {
  return menuItems.filter(href => 
    validateMenuItemAccess(href, userPermissions)
  )
}

/**
 * Gets missing permissions for a menu item
 */
export const getMissingPermissions = (
  href: string, 
  userPermissions: Permission[]
): Permission[] => {
  const requiredPermissions = getMenuPermissions(href)
  
  return requiredPermissions.filter(permission => 
    !userPermissions.includes(permission)
  )
}
