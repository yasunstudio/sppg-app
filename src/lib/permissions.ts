// SPPG Application Permission System
// Comprehensive role-based access control

export const PERMISSIONS = {
  // User Management
  'users.create': ['SUPER_ADMIN', 'ADMIN'],
  'users.view': ['SUPER_ADMIN', 'ADMIN'],
  'users.edit': ['SUPER_ADMIN', 'ADMIN'],
  'users.delete': ['SUPER_ADMIN', 'ADMIN'],
  
  // Menu Planning & Nutrition
  'menus.create': ['NUTRITIONIST', 'CHEF', 'SUPER_ADMIN'],
  'menus.view': ['NUTRITIONIST', 'CHEF', 'QUALITY_CONTROL', 'ADMIN', 'SUPER_ADMIN'],
  'menus.edit': ['NUTRITIONIST', 'CHEF', 'SUPER_ADMIN'],
  'menus.approve': ['SUPER_ADMIN', 'ADMIN'],
  'nutrition.consult': ['NUTRITIONIST'],
  
  // Schools & Students
  'schools.view': ['ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'DISTRIBUTION_MANAGER', 'DRIVER', 'OPERATIONS_SUPERVISOR'],
  'schools.manage': ['ADMIN', 'SUPER_ADMIN'],
  'students.view': ['ADMIN', 'SCHOOL_ADMIN', 'NUTRITIONIST', 'SUPER_ADMIN', 'OPERATIONS_SUPERVISOR'],
  'students.manage': ['ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  
  // Inventory & Raw Materials
  'inventory.create': ['ADMIN', 'CHEF', 'SUPER_ADMIN'],
  'inventory.view': ['ADMIN', 'CHEF', 'NUTRITIONIST', 'QUALITY_CONTROL', 'SUPER_ADMIN'],
  'inventory.edit': ['ADMIN', 'CHEF', 'SUPER_ADMIN'],
  'suppliers.view': ['ADMIN', 'CHEF', 'NUTRITIONIST', 'QUALITY_CONTROL', 'SUPER_ADMIN'],
  'suppliers.manage': ['ADMIN', 'SUPER_ADMIN'],
  'purchase_orders.view': ['ADMIN', 'CHEF', 'NUTRITIONIST', 'QUALITY_CONTROL', 'SUPER_ADMIN'],
  'purchase_orders.create': ['ADMIN', 'CHEF', 'SUPER_ADMIN'],
  'purchase_orders.edit': ['ADMIN', 'CHEF', 'SUPER_ADMIN'],
  'purchase_orders.delete': ['ADMIN', 'SUPER_ADMIN'],
  
  // Production Management
  'production.create': ['CHEF', 'SUPER_ADMIN'],
  'production.view': ['CHEF', 'NUTRITIONIST', 'QUALITY_CONTROL', 'ADMIN', 'SUPER_ADMIN'],
  'production.manage': ['CHEF', 'SUPER_ADMIN'],
  'quality.check': ['CHEF', 'NUTRITIONIST', 'QUALITY_CONTROL', 'SUPER_ADMIN'],
  'quality.create': ['QUALITY_CONTROL', 'ADMIN', 'SUPER_ADMIN'],
  'quality.edit': ['QUALITY_CONTROL', 'ADMIN', 'SUPER_ADMIN'],
  
  // Financial Management
  'finance.view': ['ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ANALYST'],
  'finance.manage': ['ADMIN', 'SUPER_ADMIN'],
  'budget.create': ['ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ANALYST'],
  'budget.view': ['ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ANALYST'],
  'budget.approve': ['SUPER_ADMIN'],
  'transactions.create': ['ADMIN'],
  'transactions.view': ['ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ANALYST'],
  
  // Delivery & Logistics
  'delivery.manage': ['DISTRIBUTION_MANAGER', 'SUPER_ADMIN'],
  'delivery.view': ['DISTRIBUTION_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'DRIVER', 'WAREHOUSE_MANAGER', 'SCHOOL_ADMIN', 'OPERATIONS_SUPERVISOR'],
  'logistics.plan': ['DISTRIBUTION_MANAGER', 'SUPER_ADMIN'],
  'logistics.manage': ['DISTRIBUTION_MANAGER', 'SUPER_ADMIN'],
  
  // Distribution Schools
  'distribution_schools.manage': ['DISTRIBUTION_MANAGER', 'SUPER_ADMIN', 'OPERATIONS_SUPERVISOR'],
  'distribution_schools.view': ['DISTRIBUTION_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'DRIVER', 'SCHOOL_ADMIN', 'OPERATIONS_SUPERVISOR'],
  'distribution_schools.create': ['DISTRIBUTION_MANAGER', 'SUPER_ADMIN', 'OPERATIONS_SUPERVISOR'],
  'distribution_schools.edit': ['DISTRIBUTION_MANAGER', 'SUPER_ADMIN', 'OPERATIONS_SUPERVISOR'],
  
  // Training & Compliance
  'training.manage': ['SUPER_ADMIN', 'ADMIN'],
  'compliance.audit': ['SUPER_ADMIN', 'QUALITY_CONTROLLER'],
  
  // Reporting & Analytics
  'reports.view': ['SUPER_ADMIN', 'ADMIN', 'QUALITY_CONTROL', 'DISTRIBUTION_MANAGER', 'FINANCIAL_ANALYST'],
  'analytics.view': ['SUPER_ADMIN', 'ADMIN', 'FINANCIAL_ANALYST'],
  
  // System Administration
  'system.config': ['SUPER_ADMIN', 'ADMIN'],
  'audit.view': ['SUPER_ADMIN', 'ADMIN', 'QUALITY_CONTROL'],
  
  // Feedback Management
  'feedback.view': ['SUPER_ADMIN', 'ADMIN', 'QUALITY_CONTROL', 'SCHOOL_ADMIN'],
  'feedback.respond': ['SUPER_ADMIN', 'ADMIN', 'QUALITY_CONTROL'],
}

export type Permission = keyof typeof PERMISSIONS

export const USER_ROLES = {
  SUPER_ADMIN: {
    name: 'Super Administrator',
    description: 'Full system access and administration',
    color: 'red',
    dashboard: '/dashboard/super-admin'
  },
  ADMIN: {
    name: 'Administrator',
    description: 'System administration and user management',
    color: 'blue',
    dashboard: '/dashboard/admin'
  },
  CHEF: {
    name: 'Chef',
    description: 'Food production and kitchen management',
    color: 'orange',
    dashboard: '/dashboard/chef'
  },
  NUTRITIONIST: {
    name: 'Ahli Gizi',
    description: 'Nutrition specialist with meal planning access',
    color: 'emerald',
    dashboard: '/dashboard/nutritionist'
  },
  QUALITY_CONTROL: {
    name: 'Quality Controller',
    description: 'Quality control manager with inspection oversight',
    color: 'amber',
    dashboard: '/dashboard/quality-controller'
  },
  DELIVERY_MANAGER: {
    name: 'Delivery Manager',
    description: 'Delivery and logistics operations manager',
    color: 'indigo',
    dashboard: '/dashboard/delivery-manager'
  },
  FINANCIAL_ANALYST: {
    name: 'Financial Analyst',
    description: 'Financial analysis and budget oversight specialist',
    color: 'rose',
    dashboard: '/dashboard/financial-analyst'
  },
  OPERATIONS_SUPERVISOR: {
    name: 'Operations Supervisor',
    description: 'Middle management for daily operations oversight',
    color: 'slate',
    dashboard: '/dashboard/operations-supervisor'
  }
} as const

export type UserRole = keyof typeof USER_ROLES

// Helper function to check if user has permission
export function hasPermission(userRoles: string[], permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission] || []
  return userRoles.some(role => (allowedRoles as readonly string[]).includes(role))
}

// Helper function to get user permissions
export function getUserPermissions(userRoles: string[]): Permission[] {
  return Object.keys(PERMISSIONS).filter(permission => 
    hasPermission(userRoles, permission as Permission)
  ) as Permission[]
}

// Helper function to get user role details
export function getUserRoleDetails(roleName: string) {
  return USER_ROLES[roleName as UserRole] || null
}

// Helper function to check if user has specific role
export function hasRole(userRoles: string[], role: UserRole): boolean {
  return userRoles.includes(role)
}

// Helper function to get highest priority role (for dashboard routing)
export function getPrimaryRole(userRoles: string[]): UserRole | null {
  const roleHierarchy: UserRole[] = [
    'SUPER_ADMIN',
    'ADMIN', 
    'OPERATIONS_SUPERVISOR',
    'FINANCIAL_ANALYST',
    'DELIVERY_MANAGER',
    'NUTRITIONIST',
    'CHEF',
    'QUALITY_CONTROL'
  ]
  
  for (const role of roleHierarchy) {
    if (userRoles.includes(role)) {
      return role
    }
  }
  
  return null
}
