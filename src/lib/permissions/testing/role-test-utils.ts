// ============================================================================
// PERMISSION TESTING UTILITIES (src/lib/permissions/testing/role-test-utils.ts)
// Testing utilities untuk menguji permission-based menu dengan berbagai role
// ============================================================================

import { PERMISSION_TEMPLATES, ROLE_TEMPLATES } from '../templates/permission-templates'

export interface TestUser {
  id: string
  name: string
  email: string
  roles: string[]
  permissions?: string[]
}

// Test users dengan berbagai role
export const TEST_USERS: TestUser[] = [
  {
    id: 'user-superadmin-1',
    name: 'Super Admin User',
    email: 'superadmin@sppg.com',
    roles: ['super-admin'],
    permissions: PERMISSION_TEMPLATES.map(p => p.id)
  },
  {
    id: 'user-admin-1', 
    name: 'Admin User',
    email: 'admin@sppg.com',
    roles: ['admin'],
    permissions: ROLE_TEMPLATES.find(r => r.id === 'admin')?.permissions || []
  },
  {
    id: 'user-manager-1',
    name: 'Manager User', 
    email: 'manager@sppg.com',
    roles: ['manager'],
    permissions: ROLE_TEMPLATES.find(r => r.id === 'manager')?.permissions || []
  },
  {
    id: 'user-staff-1',
    name: 'Staff User',
    email: 'staff@sppg.com', 
    roles: ['staff'],
    permissions: ROLE_TEMPLATES.find(r => r.id === 'staff')?.permissions || []
  },
  {
    id: 'user-basic-1',
    name: 'Basic User',
    email: 'user@sppg.com',
    roles: ['user'],
    permissions: ROLE_TEMPLATES.find(r => r.id === 'user')?.permissions || []
  }
]

// Function untuk mensimulasikan permission check
export function simulatePermissionCheck(userId: string, permission: string): boolean {
  const user = TEST_USERS.find(u => u.id === userId)
  if (!user || !user.permissions) return false
  
  return user.permissions.includes(permission)
}

// Function untuk mendapatkan accessible menu untuk user tertentu
export function getAccessibleMenusForUser(userId: string): string[] {
  const user = TEST_USERS.find(u => u.id === userId)
  if (!user || !user.permissions) return []
  
  // Map permission ke menu paths yang bisa diakses
  const menuMaps = {
    'dashboard:view': ['/dashboard'],
    'schools:view': ['/dashboard/schools'],
    'students:view': ['/dashboard/students'],
    'classes:view': ['/dashboard/classes'],
    'vehicles:view': ['/dashboard/vehicles'],
    'drivers:view': ['/dashboard/drivers'],
    'raw_materials:view': ['/dashboard/raw-materials'],
    'suppliers:view': ['/dashboard/suppliers'],
    'items:view': ['/dashboard/items'],
    'recipes:view': ['/dashboard/recipes'],
    'menu_planning:view': ['/dashboard/menu-planning'],
    'production_batches:view': ['/dashboard/production/batches'],
    'inventory:view': ['/dashboard/inventory'],
    'distribution:view': ['/dashboard/distribution', '/dashboard/distributions'],
    'quality_standards:view': ['/dashboard/quality-standards'],
    'quality_checks:view': ['/dashboard/quality-checks'],
    'analytics:view': ['/dashboard/analytics'],
    'monitoring:view': ['/dashboard/monitoring'],
    'financial:view': ['/dashboard/financial'],
    'users:read': ['/dashboard/users'],
    'roles:view': ['/dashboard/roles'],
    'admin:access': ['/dashboard/admin']
  }
  
  const accessibleMenus: string[] = []
  
  user.permissions.forEach(permission => {
    const menus = menuMaps[permission as keyof typeof menuMaps]
    if (menus) {
      accessibleMenus.push(...menus)
    }
  })
  
  return [...new Set(accessibleMenus)] // Remove duplicates
}

// Function untuk generate test report
export function generateAccessibilityReport(): Record<string, string[]> {
  const report: Record<string, string[]> = {}
  
  TEST_USERS.forEach(user => {
    report[user.name] = getAccessibleMenusForUser(user.id)
  })
  
  return report
}

// Console testing function
export function testMenuAccessibility() {
  console.log('🧪 TESTING MENU ACCESSIBILITY BY ROLE')
  console.log('=====================================')
  
  const report = generateAccessibilityReport()
  
  Object.entries(report).forEach(([userName, accessibleMenus]) => {
    console.log(`\n👤 ${userName}:`)
    console.log(`   📋 Accessible menus (${accessibleMenus.length}):`)
    accessibleMenus.forEach(menu => {
      console.log(`   ✅ ${menu}`)
    })
  })
  
  console.log('\n🎯 SUMMARY:')
  Object.entries(report).forEach(([userName, accessibleMenus]) => {
    console.log(`${userName}: ${accessibleMenus.length} accessible menus`)
  })
}
