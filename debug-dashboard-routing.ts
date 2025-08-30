/**
 * Debug script untuk memverifikasi dashboard routing
 */

import { getDashboardRoute, requireDashboardAccess } from '@/lib/dashboard-routing'
import { hasPermission, getUserPermissions } from '@/lib/permissions'

// Simulate user roles yang mungkin ada di database
const testCases = [
  {
    name: 'Financial Analyst User',
    roles: ['FINANCIAL_ANALYST'],
    expectedRoute: '/dashboard/financial'
  },
  {
    name: 'Super Admin User', 
    roles: ['SUPER_ADMIN'],
    expectedRoute: '/dashboard/admin'
  },
  {
    name: 'Admin User',
    roles: ['ADMIN'], 
    expectedRoute: '/dashboard/admin'
  },
  {
    name: 'Chef User',
    roles: ['CHEF'],
    expectedRoute: '/dashboard/basic'
  },
  {
    name: 'Volunteer User',
    roles: ['VOLUNTEER'],
    expectedRoute: '/dashboard/basic'
  },
  {
    name: 'Quality Controller User',
    roles: ['QUALITY_CONTROLLER'],
    expectedRoute: '/dashboard/basic'
  }
]

async function debugDashboardRouting() {
  console.log('🔍 DEBUGGING Dashboard Routing System\n')
  
  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`)
    console.log(`   Roles: [${testCase.roles.join(', ')}]`)
    
    // Get user permissions
    const permissions = getUserPermissions(testCase.roles)
    console.log(`   Permissions: [${permissions.slice(0, 5).join(', ')}${permissions.length > 5 ? '...' : ''}] (${permissions.length} total)`)
    
    // Check specific permissions that determine dashboard routing
    const hasUserCreate = hasPermission(testCase.roles, 'users.create')
    const hasUserEdit = hasPermission(testCase.roles, 'users.edit')
    const hasBudgetView = hasPermission(testCase.roles, 'budget.view')
    const hasFinanceView = hasPermission(testCase.roles, 'finance.view')
    
    console.log(`   Key Permissions:`)
    console.log(`     - users.create: ${hasUserCreate}`)
    console.log(`     - users.edit: ${hasUserEdit}`) 
    console.log(`     - budget.view: ${hasBudgetView}`)
    console.log(`     - finance.view: ${hasFinanceView}`)
    
    // Get actual route (await because it's async)
    const actualRoute = await getDashboardRoute(testCase.roles)
    console.log(`   Route: ${actualRoute}`)
    console.log(`   Expected: ${testCase.expectedRoute}`)
    console.log(`   Status: ${actualRoute === testCase.expectedRoute ? '✅ PASS' : '❌ FAIL'}`)
  }
  
  console.log('\n🔍 Dashboard Routing Logic Analysis:')
  console.log('1. Admin Dashboard: requires users.create OR users.edit')
  console.log('2. Financial Dashboard: requires budget.view OR budget.create OR finance.view') 
  console.log('3. Basic Dashboard: default for all other users')
}

// Run the debug
if (require.main === module) {
  debugDashboardRouting()
}

export { debugDashboardRouting }
