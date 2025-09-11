/**
 * Database-Driven Permission System
 * Main entry point for the modular permission system
 */

// Core Engine
export { permissionEngine } from './core/permission-engine'

// Templates & Migration
export {
  PERMISSION_TEMPLATES,
  ROLE_TEMPLATES,
  getRolePermissions,
  getPermissionCategories,
  getPermissionsByCategory
} from './templates/permission-templates'

export {
  PermissionMigration
} from './migration/permission-migration'

// Middleware
export {
  checkRoutePermissions,
  withPermissions,
  ROUTE_PERMISSIONS
} from './middleware/permission-middleware'

export type { RoutePermission } from './middleware/permission-middleware'

// Types
export type {
  PermissionResult,
  UserPermissionContext
} from './core/permission-engine'

export type {
  PermissionTemplate,
  RoleTemplate
} from './templates/permission-templates'

// Legacy compatibility helpers
export function hasPermissionSync(userRoles: string[], permission: string): boolean {
  // This is for immediate migration compatibility
  // Will be deprecated once full migration is complete
  const legacyPermissions = require('../permissions').PERMISSIONS
  const allowedRoles = legacyPermissions[permission] || []
  return userRoles.some(role => (allowedRoles as readonly string[]).includes(role))
}
