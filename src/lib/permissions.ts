// SPPG Application Permission System
// Comprehensive role-based access control

export const PERMISSIONS = {
  // User Management
  'users.create': ['KEPALA_SPPG', 'ADMIN'],
  'users.view': ['KEPALA_SPPG', 'ADMIN', 'AKUNTAN'],
  'users.edit': ['KEPALA_SPPG', 'ADMIN'],
  'users.delete': ['KEPALA_SPPG'],
  
  // Menu Planning & Nutrition
  'menus.create': ['AHLI_GIZI', 'KEPALA_SPPG'],
  'menus.view': ['AHLI_GIZI', 'KEPALA_SPPG', 'STAFF_OPERASIONAL'],
  'menus.edit': ['AHLI_GIZI', 'KEPALA_SPPG'],
  'menus.approve': ['KEPALA_SPPG'],
  'nutrition.consult': ['AHLI_GIZI'],
  
  // Inventory & Raw Materials
  'inventory.create': ['AKUNTAN', 'KEPALA_SPPG'],
  'inventory.view': ['AKUNTAN', 'KEPALA_SPPG', 'STAFF_OPERASIONAL', 'AHLI_GIZI'],
  'inventory.edit': ['AKUNTAN', 'KEPALA_SPPG'],
  'suppliers.manage': ['AKUNTAN', 'KEPALA_SPPG'],
  
  // Production Management
  'production.create': ['STAFF_OPERASIONAL', 'KEPALA_SPPG'],
  'production.view': ['STAFF_OPERASIONAL', 'KEPALA_SPPG', 'AHLI_GIZI'],
  'production.manage': ['STAFF_OPERASIONAL', 'KEPALA_SPPG'],
  'quality.check': ['AHLI_GIZI', 'STAFF_OPERASIONAL'],
  
  // Distribution & Logistics
  'distribution.create': ['ASISTEN_LAPANGAN', 'KEPALA_SPPG'],
  'distribution.view': ['ASISTEN_LAPANGAN', 'KEPALA_SPPG', 'DRIVER'],
  'distribution.manage': ['ASISTEN_LAPANGAN', 'KEPALA_SPPG'],
  'delivery.execute': ['DRIVER', 'ASISTEN_LAPANGAN'],
  'schools.manage': ['ASISTEN_LAPANGAN', 'KEPALA_SPPG'],
  
  // Financial Management
  'finance.view': ['AKUNTAN', 'KEPALA_SPPG'],
  'finance.manage': ['AKUNTAN', 'KEPALA_SPPG'],
  'budget.create': ['AKUNTAN', 'KEPALA_SPPG'],
  'budget.approve': ['KEPALA_SPPG'],
  'transactions.create': ['AKUNTAN'],
  
  // Reporting & Analytics
  'reports.view': ['KEPALA_SPPG', 'AKUNTAN', 'AHLI_GIZI', 'ASISTEN_LAPANGAN'],
  'analytics.view': ['KEPALA_SPPG'],
  
  // System Administration
  'system.config': ['KEPALA_SPPG'],
  'audit.view': ['KEPALA_SPPG'],
  
  // Feedback Management
  'feedback.view': ['KEPALA_SPPG', 'AHLI_GIZI', 'ASISTEN_LAPANGAN'],
  'feedback.respond': ['KEPALA_SPPG', 'AHLI_GIZI', 'ASISTEN_LAPANGAN'],
}

export type Permission = keyof typeof PERMISSIONS

export const USER_ROLES = {
  KEPALA_SPPG: {
    name: 'Kepala SPPG',
    description: 'Full access, monitoring & evaluation',
    color: 'red',
    dashboard: '/dashboard/kepala-sppg'
  },
  AHLI_GIZI: {
    name: 'Ahli Gizi',
    description: 'Menu planning, quality control, nutrition consultation',
    color: 'green',
    dashboard: '/dashboard/ahli-gizi'
  },
  AKUNTAN: {
    name: 'Akuntan',
    description: 'Financial management, procurement, reporting',
    color: 'blue',
    dashboard: '/dashboard/akuntan'
  },
  ASISTEN_LAPANGAN: {
    name: 'Asisten Lapangan',
    description: 'Distribution management, school relations',
    color: 'purple',
    dashboard: '/dashboard/asisten-lapangan'
  },
  STAFF_OPERASIONAL: {
    name: 'Staff Operasional',
    description: 'Preparation, cooking, portioning, packing, cleaning',
    color: 'orange',
    dashboard: '/dashboard/staff-operasional'
  },
  DRIVER: {
    name: 'Driver',
    description: 'Distribution, logistics',
    color: 'yellow',
    dashboard: '/dashboard/driver'
  },
  PENERIMA_MANFAAT: {
    name: 'Penerima Manfaat',
    description: 'Feedback system',
    color: 'pink',
    dashboard: '/dashboard/penerima-manfaat'
  },
  ADMIN: {
    name: 'Administrator',
    description: 'System administration',
    color: 'gray',
    dashboard: '/dashboard/admin'
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
