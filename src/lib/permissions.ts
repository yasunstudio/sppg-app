// SPPG Application Permission System
// Comprehensive role-based access control

export const PERMISSIONS = {
  // User Management
  'users.create': ['SUPER_ADMIN', 'ADMIN'],
  'users.view': ['SUPER_ADMIN', 'ADMIN', 'POSYANDU_COORDINATOR'],
  'users.edit': ['SUPER_ADMIN', 'ADMIN'],
  'users.delete': ['SUPER_ADMIN'],
  
  // Menu Planning & Nutrition
  'menus.create': ['NUTRITIONIST', 'CHEF', 'SUPER_ADMIN'],
  'menus.view': ['NUTRITIONIST', 'CHEF', 'QUALITY_CONTROLLER', 'ADMIN', 'SUPER_ADMIN'],
  'menus.edit': ['NUTRITIONIST', 'CHEF', 'SUPER_ADMIN'],
  'menus.approve': ['SUPER_ADMIN', 'ADMIN'],
  'nutrition.consult': ['NUTRITIONIST', 'HEALTH_WORKER'],
  
  // Inventory & Raw Materials
  'inventory.create': ['ADMIN', 'CHEF', 'SUPER_ADMIN'],
  'inventory.view': ['ADMIN', 'CHEF', 'NUTRITIONIST', 'QUALITY_CONTROLLER', 'SUPER_ADMIN'],
  'inventory.edit': ['ADMIN', 'CHEF', 'SUPER_ADMIN'],
  'suppliers.manage': ['ADMIN', 'SUPER_ADMIN'],
  
  // Production Management
  'production.create': ['CHEF', 'SUPER_ADMIN'],
  'production.view': ['CHEF', 'NUTRITIONIST', 'QUALITY_CONTROLLER', 'ADMIN', 'SUPER_ADMIN'],
  'production.manage': ['CHEF', 'SUPER_ADMIN'],
  'quality.check': ['CHEF', 'NUTRITIONIST', 'QUALITY_CONTROLLER'],
  'quality.create': ['QUALITY_CONTROLLER', 'ADMIN', 'SUPER_ADMIN'],
  'quality.edit': ['QUALITY_CONTROLLER', 'ADMIN', 'SUPER_ADMIN'],
  
  // Posyandu Management
  'posyandu.create': ['SUPER_ADMIN', 'ADMIN', 'POSYANDU_COORDINATOR'],
  'posyandu.view': ['POSYANDU_COORDINATOR', 'HEALTH_WORKER', 'VOLUNTEER', 'ADMIN', 'SUPER_ADMIN'],
  'posyandu.edit': ['SUPER_ADMIN', 'ADMIN', 'POSYANDU_COORDINATOR'],
  'posyandu.delete': ['SUPER_ADMIN', 'ADMIN'],
  
  // Volunteer Management
  'volunteers.create': ['POSYANDU_COORDINATOR', 'ADMIN', 'SUPER_ADMIN'],
  'volunteers.view': ['POSYANDU_COORDINATOR', 'HEALTH_WORKER', 'ADMIN', 'SUPER_ADMIN'],
  'volunteers.edit': ['POSYANDU_COORDINATOR', 'ADMIN', 'SUPER_ADMIN'],
  'volunteers.assign': ['POSYANDU_COORDINATOR', 'ADMIN', 'SUPER_ADMIN'],
  
  // Programs Management
  'programs.create': ['POSYANDU_COORDINATOR', 'HEALTH_WORKER', 'ADMIN', 'SUPER_ADMIN'],
  'programs.view': ['POSYANDU_COORDINATOR', 'HEALTH_WORKER', 'VOLUNTEER', 'ADMIN', 'SUPER_ADMIN'],
  'programs.edit': ['POSYANDU_COORDINATOR', 'HEALTH_WORKER', 'ADMIN', 'SUPER_ADMIN'],
  'programs.participate': ['VOLUNTEER'],
  
  // Participants Management
  'participants.create': ['HEALTH_WORKER', 'POSYANDU_COORDINATOR', 'ADMIN', 'SUPER_ADMIN'],
  'participants.view': ['HEALTH_WORKER', 'POSYANDU_COORDINATOR', 'VOLUNTEER', 'NUTRITIONIST', 'ADMIN', 'SUPER_ADMIN'],
  'participants.edit': ['HEALTH_WORKER', 'POSYANDU_COORDINATOR', 'ADMIN', 'SUPER_ADMIN'],
  'participants.health_check': ['HEALTH_WORKER', 'NUTRITIONIST'],
  
  // Health & Nutrition Data
  'health.read': ['HEALTH_WORKER', 'NUTRITIONIST', 'POSYANDU_COORDINATOR', 'ADMIN', 'SUPER_ADMIN'],
  'health.write': ['HEALTH_WORKER', 'NUTRITIONIST'],
  'nutrition.read': ['NUTRITIONIST', 'HEALTH_WORKER', 'CHEF', 'QUALITY_CONTROLLER', 'ADMIN', 'SUPER_ADMIN'],
  'nutrition.write': ['NUTRITIONIST', 'HEALTH_WORKER'],
  
  // Activities & Reports
  'activities.read': ['VOLUNTEER', 'HEALTH_WORKER', 'POSYANDU_COORDINATOR', 'ADMIN', 'SUPER_ADMIN'],
  'activities.create': ['HEALTH_WORKER', 'POSYANDU_COORDINATOR', 'ADMIN', 'SUPER_ADMIN'],
  
  // Financial Management
  'finance.view': ['ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ANALYST'],
  'finance.manage': ['ADMIN', 'SUPER_ADMIN'],
  'budget.create': ['ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ANALYST'],
  'budget.view': ['ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ANALYST'],
  'budget.approve': ['SUPER_ADMIN'],
  'transactions.create': ['ADMIN'],
  'transactions.view': ['ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ANALYST'],
  
  // Delivery & Logistics
  'delivery.manage': ['DELIVERY_MANAGER', 'SUPER_ADMIN'],
  'delivery.view': ['DELIVERY_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
  'logistics.plan': ['DELIVERY_MANAGER', 'SUPER_ADMIN'],
  'logistics.manage': ['DELIVERY_MANAGER', 'SUPER_ADMIN'],
  
  // Training & Compliance
  'training.manage': ['SUPER_ADMIN', 'ADMIN'],
  'compliance.audit': ['SUPER_ADMIN', 'QUALITY_CONTROLLER'],
  
  // Reporting & Analytics
  'reports.view': ['SUPER_ADMIN', 'ADMIN', 'POSYANDU_COORDINATOR', 'HEALTH_WORKER', 'QUALITY_CONTROLLER', 'DELIVERY_MANAGER', 'FINANCIAL_ANALYST', 'OPERATIONS_SUPERVISOR'],
  'analytics.view': ['SUPER_ADMIN', 'ADMIN', 'FINANCIAL_ANALYST', 'OPERATIONS_SUPERVISOR'],
  
  // System Administration
  'system.config': ['SUPER_ADMIN'],
  'audit.view': ['SUPER_ADMIN', 'ADMIN', 'QUALITY_CONTROLLER'],
  
  // Feedback Management
  'feedback.view': ['SUPER_ADMIN', 'ADMIN', 'POSYANDU_COORDINATOR', 'HEALTH_WORKER', 'QUALITY_CONTROLLER', 'OPERATIONS_SUPERVISOR'],
  'feedback.respond': ['SUPER_ADMIN', 'ADMIN', 'POSYANDU_COORDINATOR', 'HEALTH_WORKER', 'QUALITY_CONTROLLER', 'OPERATIONS_SUPERVISOR'],
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
  POSYANDU_COORDINATOR: {
    name: 'Koordinator Posyandu',
    description: 'Manages posyandu operations and volunteers',
    color: 'green',
    dashboard: '/dashboard/posyandu-coordinator'
  },
  HEALTH_WORKER: {
    name: 'Tenaga Kesehatan',
    description: 'Healthcare professional with access to health data',
    color: 'teal',
    dashboard: '/dashboard/health-worker'
  },
  VOLUNTEER: {
    name: 'Kader Posyandu',
    description: 'Posyandu volunteer with limited access',
    color: 'purple',
    dashboard: '/dashboard/volunteer'
  },
  NUTRITIONIST: {
    name: 'Ahli Gizi',
    description: 'Nutrition specialist with meal planning access',
    color: 'emerald',
    dashboard: '/dashboard/nutritionist'
  },
  QUALITY_CONTROLLER: {
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
    'POSYANDU_COORDINATOR',
    'FINANCIAL_ANALYST',
    'DELIVERY_MANAGER',
    'NUTRITIONIST',
    'CHEF',
    'QUALITY_CONTROLLER',
    'HEALTH_WORKER',
    'VOLUNTEER'
  ]
  
  for (const role of roleHierarchy) {
    if (userRoles.includes(role)) {
      return role
    }
  }
  
  return null
}
