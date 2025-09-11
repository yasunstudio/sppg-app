// ============================================================================
// PERMISSION TEMPLATES (src/lib/permissions/templates/permission-templates.ts)
// Central registry for all permission and role templates
// ============================================================================

export interface PermissionTemplate {
  id: string
  name: string
  displayName: string
  description?: string
  category: string
  resource?: string
  action: string
  module: string
}

export interface RoleTemplate {
  id: string
  name: string
  description?: string
  permissions: string[]
  isSystemRole?: boolean
  color?: string
  priority?: number
  metadata?: any
}

// Permission Templates
export const PERMISSION_TEMPLATES: PermissionTemplate[] = [
  // Dashboard permissions
  { id: 'dashboard:view', name: 'dashboard:view', displayName: 'View Dashboard', category: 'dashboard', resource: 'dashboard', action: 'view', module: 'dashboard' },

  // User management permissions
  { id: 'users:create', name: 'users:create', displayName: 'Create Users', category: 'users', resource: 'users', action: 'create', module: 'users' },
  { id: 'users:read', name: 'users:read', displayName: 'Read Users', category: 'users', resource: 'users', action: 'read', module: 'users' },
  { id: 'users:update', name: 'users:update', displayName: 'Update Users', category: 'users', resource: 'users', action: 'update', module: 'users' },
  { id: 'users:delete', name: 'users:delete', displayName: 'Delete Users', category: 'users', resource: 'users', action: 'delete', module: 'users' },

  // Institution Management
  { id: 'schools:view', name: 'schools:view', displayName: 'View Schools', category: 'schools', resource: 'schools', action: 'view', module: 'schools' },
  { id: 'schools:create', name: 'schools:create', displayName: 'Create Schools', category: 'schools', resource: 'schools', action: 'create', module: 'schools' },
  { id: 'schools:update', name: 'schools:update', displayName: 'Update Schools', category: 'schools', resource: 'schools', action: 'update', module: 'schools' },
  { id: 'schools:delete', name: 'schools:delete', displayName: 'Delete Schools', category: 'schools', resource: 'schools', action: 'delete', module: 'schools' },

  { id: 'students:view', name: 'students:view', displayName: 'View Students', category: 'students', resource: 'students', action: 'view', module: 'students' },
  { id: 'students:create', name: 'students:create', displayName: 'Create Students', category: 'students', resource: 'students', action: 'create', module: 'students' },
  { id: 'students:update', name: 'students:update', displayName: 'Update Students', category: 'students', resource: 'students', action: 'update', module: 'students' },

  { id: 'classes:view', name: 'classes:view', displayName: 'View Classes', category: 'classes', resource: 'classes', action: 'view', module: 'classes' },
  { id: 'classes:create', name: 'classes:create', displayName: 'Create Classes', category: 'classes', resource: 'classes', action: 'create', module: 'classes' },
  { id: 'classes:update', name: 'classes:update', displayName: 'Update Classes', category: 'classes', resource: 'classes', action: 'update', module: 'classes' },

  // Supply Chain Management
  { id: 'raw_materials:view', name: 'raw_materials:view', displayName: 'View Raw Materials', category: 'raw_materials', resource: 'raw_materials', action: 'view', module: 'raw_materials' },
  { id: 'raw_materials:create', name: 'raw_materials:create', displayName: 'Create Raw Materials', category: 'raw_materials', resource: 'raw_materials', action: 'create', module: 'raw_materials' },
  
  { id: 'suppliers:view', name: 'suppliers:view', displayName: 'View Suppliers', category: 'suppliers', resource: 'suppliers', action: 'view', module: 'suppliers' },
  { id: 'suppliers:create', name: 'suppliers:create', displayName: 'Create Suppliers', category: 'suppliers', resource: 'suppliers', action: 'create', module: 'suppliers' },

  { id: 'items:view', name: 'items:view', displayName: 'View Items', category: 'items', resource: 'items', action: 'view', module: 'items' },
  { id: 'items:create', name: 'items:create', displayName: 'Create Items', category: 'items', resource: 'items', action: 'create', module: 'items' },

  // Logistics
  { id: 'vehicles:view', name: 'vehicles:view', displayName: 'View Vehicles', category: 'vehicles', resource: 'vehicles', action: 'view', module: 'vehicles' },
  { id: 'vehicles:create', name: 'vehicles:create', displayName: 'Create Vehicles', category: 'vehicles', resource: 'vehicles', action: 'create', module: 'vehicles' },
  
  { id: 'drivers:view', name: 'drivers:view', displayName: 'View Drivers', category: 'drivers', resource: 'drivers', action: 'view', module: 'drivers' },
  { id: 'drivers:create', name: 'drivers:create', displayName: 'Create Drivers', category: 'drivers', resource: 'drivers', action: 'create', module: 'drivers' },

  // Production & Planning
  { id: 'recipes:view', name: 'recipes:view', displayName: 'View Recipes', category: 'recipes', resource: 'recipes', action: 'view', module: 'recipes' },
  { id: 'recipes:create', name: 'recipes:create', displayName: 'Create Recipes', category: 'recipes', resource: 'recipes', action: 'create', module: 'recipes' },

  { id: 'menu_planning:view', name: 'menu_planning:view', displayName: 'View Menu Planning', category: 'menu_planning', resource: 'menu_planning', action: 'view', module: 'menu_planning' },
  { id: 'menu_planning:create', name: 'menu_planning:create', displayName: 'Create Menu Planning', category: 'menu_planning', resource: 'menu_planning', action: 'create', module: 'menu_planning' },

  { id: 'production_batches:view', name: 'production_batches:view', displayName: 'View Production Batches', category: 'production_batches', resource: 'production_batches', action: 'view', module: 'production_batches' },
  { id: 'production_batches:create', name: 'production_batches:create', displayName: 'Create Production Batches', category: 'production_batches', resource: 'production_batches', action: 'create', module: 'production_batches' },

  { id: 'production_resources:view', name: 'production_resources:view', displayName: 'View Production Resources', category: 'production_resources', resource: 'production_resources', action: 'view', module: 'production_resources' },
  { id: 'production_resources:create', name: 'production_resources:create', displayName: 'Create Production Resources', category: 'production_resources', resource: 'production_resources', action: 'create', module: 'production_resources' },

  // Inventory & Distribution
  { id: 'inventory:view', name: 'inventory:view', displayName: 'View Inventory', category: 'inventory', resource: 'inventory', action: 'view', module: 'inventory' },
  { id: 'inventory:create', name: 'inventory:create', displayName: 'Create Inventory', category: 'inventory', resource: 'inventory', action: 'create', module: 'inventory' },

  { id: 'distribution:view', name: 'distribution:view', displayName: 'View Distribution', category: 'distribution', resource: 'distribution', action: 'view', module: 'distribution' },
  { id: 'distribution:create', name: 'distribution:create', displayName: 'Create Distribution', category: 'distribution', resource: 'distribution', action: 'create', module: 'distribution' },

  { id: 'purchase_orders:view', name: 'purchase_orders:view', displayName: 'View Purchase Orders', category: 'purchase_orders', resource: 'purchase_orders', action: 'view', module: 'purchase_orders' },
  { id: 'purchase_orders:create', name: 'purchase_orders:create', displayName: 'Create Purchase Orders', category: 'purchase_orders', resource: 'purchase_orders', action: 'create', module: 'purchase_orders' },

  // Quality Management
  { id: 'quality_standards:view', name: 'quality_standards:view', displayName: 'View Quality Standards', category: 'quality_standards', resource: 'quality_standards', action: 'view', module: 'quality_standards' },
  { id: 'quality_standards:create', name: 'quality_standards:create', displayName: 'Create Quality Standards', category: 'quality_standards', resource: 'quality_standards', action: 'create', module: 'quality_standards' },

  { id: 'quality_checks:view', name: 'quality_checks:view', displayName: 'View Quality Checks', category: 'quality_checks', resource: 'quality_checks', action: 'view', module: 'quality_checks' },
  { id: 'quality_checks:create', name: 'quality_checks:create', displayName: 'Create Quality Checks', category: 'quality_checks', resource: 'quality_checks', action: 'create', module: 'quality_checks' },

  { id: 'quality_checkpoints:view', name: 'quality_checkpoints:view', displayName: 'View Quality Checkpoints', category: 'quality_checkpoints', resource: 'quality_checkpoints', action: 'view', module: 'quality_checkpoints' },

  { id: 'food_samples:view', name: 'food_samples:view', displayName: 'View Food Samples', category: 'food_samples', resource: 'food_samples', action: 'view', module: 'food_samples' },
  { id: 'nutrition_consultations:view', name: 'nutrition_consultations:view', displayName: 'View Nutrition Consultations', category: 'nutrition_consultations', resource: 'nutrition_consultations', action: 'view', module: 'nutrition_consultations' },

  // Analytics & Reports
  { id: 'analytics:view', name: 'analytics:view', displayName: 'View Analytics', category: 'analytics', resource: 'analytics', action: 'view', module: 'analytics' },
  { id: 'monitoring:view', name: 'monitoring:view', displayName: 'View Monitoring', category: 'monitoring', resource: 'monitoring', action: 'view', module: 'monitoring' },
  { id: 'performance:view', name: 'performance:view', displayName: 'View Performance', category: 'performance', resource: 'performance', action: 'view', module: 'performance' },

  // Financial Management
  { id: 'financial:view', name: 'financial:view', displayName: 'View Financial', category: 'financial', resource: 'financial', action: 'view', module: 'financial' },
  { id: 'financial:create', name: 'financial:create', displayName: 'Create Financial', category: 'financial', resource: 'financial', action: 'create', module: 'financial' },

  // System Management
  { id: 'notifications:view', name: 'notifications:view', displayName: 'View Notifications', category: 'notifications', resource: 'notifications', action: 'view', module: 'notifications' },
  { id: 'roles:view', name: 'roles:view', displayName: 'View Roles', category: 'roles', resource: 'roles', action: 'view', module: 'roles' },
  { id: 'user_roles:view', name: 'user_roles:view', displayName: 'View User Roles', category: 'user_roles', resource: 'user_roles', action: 'view', module: 'user_roles' },

  // Admin permissions
  { id: 'admin:access', name: 'admin:access', displayName: 'Admin Access', category: 'admin', resource: 'admin', action: 'access', module: 'admin' },
  { id: 'system_config:edit', name: 'system_config:edit', displayName: 'Edit System Config', category: 'system_config', resource: 'system_config', action: 'edit', module: 'system_config' },
  { id: 'audit_logs:view', name: 'audit_logs:view', displayName: 'View Audit Logs', category: 'audit_logs', resource: 'audit_logs', action: 'view', module: 'audit_logs' },

  // Waste management permissions
  { id: 'waste.view', name: 'waste.view', displayName: 'View Waste Records', category: 'waste', resource: 'waste', action: 'view', module: 'waste' },
  { id: 'waste.create', name: 'waste.create', displayName: 'Create Waste Records', category: 'waste', resource: 'waste', action: 'create', module: 'waste' },
  { id: 'waste.edit', name: 'waste.edit', displayName: 'Edit Waste Records', category: 'waste', resource: 'waste', action: 'edit', module: 'waste' },
  { id: 'waste.delete', name: 'waste.delete', displayName: 'Delete Waste Records', category: 'waste', resource: 'waste', action: 'delete', module: 'waste' },

  // Resource permissions - legacy support
  { id: 'resource:read', name: 'resource:read', displayName: 'Read Resources', category: 'resources', resource: 'resources', action: 'read', module: 'resources' },
  { id: 'resource:create', name: 'resource:create', displayName: 'Create Resources', category: 'resources', resource: 'resources', action: 'create', module: 'resources' },
  { id: 'resource:update', name: 'resource:update', displayName: 'Update Resources', category: 'resources', resource: 'resources', action: 'update', module: 'resources' },
  { id: 'resource:delete', name: 'resource:delete', displayName: 'Delete Resources', category: 'resources', resource: 'resources', action: 'delete', module: 'resources' },

  // Profile permissions - legacy support
  { id: 'profiles:create', name: 'profiles:create', displayName: 'Create Profiles', category: 'profiles', resource: 'profiles', action: 'create', module: 'profiles' },
  { id: 'profiles:read', name: 'profiles:read', displayName: 'Read Profiles', category: 'profiles', resource: 'profiles', action: 'read', module: 'profiles' },
  { id: 'profiles:update', name: 'profiles:update', displayName: 'Update Profiles', category: 'profiles', resource: 'profiles', action: 'update', module: 'profiles' },
  { id: 'profiles:delete', name: 'profiles:delete', displayName: 'Delete Profiles', category: 'profiles', resource: 'profiles', action: 'delete', module: 'profiles' },
]

// Role Templates
export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Full system access',
    permissions: PERMISSION_TEMPLATES.map(p => p.id),
    isSystemRole: true,
    color: '#dc2626',
    priority: 1,
    metadata: { canManageUsers: true, canManageSystem: true }
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Administrative access to most modules',
    permissions: [
      'dashboard:view',
      'users:read', 'users:create', 'users:update',
      'schools:view', 'schools:create', 'schools:update',
      'students:view', 'students:create', 'students:update', 
      'classes:view', 'classes:create', 'classes:update',
      'raw_materials:view', 'raw_materials:create',
      'suppliers:view', 'suppliers:create',
      'items:view', 'items:create',
      'vehicles:view', 'vehicles:create',
      'drivers:view', 'drivers:create',
      'recipes:view', 'recipes:create',
      'menu_planning:view', 'menu_planning:create',
      'production_batches:view', 'production_batches:create',
      'production_resources:view', 'production_resources:create',
      'inventory:view', 'inventory:create',
      'distribution:view', 'distribution:create',
      'purchase_orders:view', 'purchase_orders:create',
      'quality_standards:view', 'quality_standards:create',
      'quality_checks:view', 'quality_checks:create',
      'quality_checkpoints:view',
      'food_samples:view',
      'nutrition_consultations:view',
      'analytics:view',
      'monitoring:view',
      'performance:view',
      'financial:view', 'financial:create',
      'notifications:view',
      'roles:view',
      'user_roles:view',
      'audit_logs:view',
      'waste.view', 'waste.create', 'waste.edit'
    ],
    isSystemRole: false,
    color: '#ea580c',
    priority: 2,
    metadata: { canManageUsers: true, canManageSystem: false }
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Management access to operational modules',
    permissions: [
      'dashboard:view',
      'schools:view', 'students:view', 'classes:view',
      'raw_materials:view',
      'suppliers:view',
      'items:view',
      'vehicles:view',
      'drivers:view',
      'recipes:view', 'recipes:create',
      'menu_planning:view', 'menu_planning:create',
      'production_batches:view', 'production_batches:create',
      'production_resources:view',
      'inventory:view',
      'distribution:view', 'distribution:create',
      'purchase_orders:view', 'purchase_orders:create',
      'quality_standards:view',
      'quality_checks:view', 'quality_checks:create',
      'quality_checkpoints:view',
      'food_samples:view',
      'nutrition_consultations:view',
      'analytics:view',
      'monitoring:view',
      'performance:view',
      'financial:view',
      'notifications:view',
      'waste.view', 'waste.create'
    ],
    isSystemRole: false,
    color: '#059669',
    priority: 3,
    metadata: { canManageUsers: false, canManageSystem: false }
  },
  {
    id: 'staff',
    name: 'Staff',
    description: 'Operational staff access',
    permissions: [
      'dashboard:view',
      'schools:view', 'students:view', 'classes:view',
      'raw_materials:view',
      'suppliers:view',
      'items:view',
      'vehicles:view',
      'drivers:view',
      'recipes:view',
      'menu_planning:view',
      'production_batches:view',
      'production_resources:view',
      'inventory:view',
      'distribution:view',
      'purchase_orders:view',
      'quality_standards:view',
      'quality_checks:view',
      'quality_checkpoints:view',
      'food_samples:view',
      'nutrition_consultations:view',
      'monitoring:view',
      'notifications:view',
      'waste.view'
    ],
    isSystemRole: false,
    color: '#0891b2',
    priority: 4,
    metadata: { canManageUsers: false, canManageSystem: false }
  },
  {
    id: 'user',
    name: 'User',
    description: 'Basic user access',
    permissions: [
      'dashboard:view',
      'schools:view',
      'students:view',
      'classes:view',
      'recipes:view',
      'menu_planning:view',
      'inventory:view',
      'distribution:view',
      'notifications:view',
      'profiles:read',
      'waste.view'
    ],
    isSystemRole: false,
    color: '#059669',
    priority: 5,
    metadata: { canManageUsers: false, canManageSystem: false }
  }
]

// Helper functions
export function getRolePermissions(roleId: string): string[] {
  const role = ROLE_TEMPLATES.find(r => r.id === roleId)
  return role?.permissions || []
}

export function getPermissionCategories(): string[] {
  const categories = new Set(PERMISSION_TEMPLATES.map(p => p.category).filter(Boolean))
  return Array.from(categories) as string[]
}

export function getPermissionsByCategory(category: string): PermissionTemplate[] {
  return PERMISSION_TEMPLATES.filter(p => p.category === category)
}