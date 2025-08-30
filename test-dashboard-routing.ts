/**
 * Test script to verify dashboard routing functionality
 */

import { getDashboardRoute, requireDashboardAccess, DASHBOARD_ROLES } from '@/lib/dashboard-routing'

// Test different role scenarios
function testDashboardRouting() {
  console.log('🔍 Testing Dashboard Routing System\n')

  // Test Admin roles
  console.log('👤 Testing Admin Roles:')
  const adminRoles = ['SUPER_ADMIN']
  console.log(`  Roles: ${adminRoles.join(', ')}`)
  console.log(`  Route: ${getDashboardRoute(adminRoles)}`)
  console.log(`  Expected: /dashboard/admin\n`)

  // Test Financial Analyst
  console.log('💰 Testing Financial Analyst:')
  const financialRoles = ['FINANCIAL_ANALYST']
  console.log(`  Roles: ${financialRoles.join(', ')}`)
  console.log(`  Route: ${getDashboardRoute(financialRoles)}`)
  console.log(`  Expected: /dashboard/financial\n`)

  // Test Chef (Basic Dashboard)
  console.log('👨‍🍳 Testing Chef Role:')
  const chefRoles = ['CHEF']
  console.log(`  Roles: ${chefRoles.join(', ')}`)
  console.log(`  Route: ${getDashboardRoute(chefRoles)}`)
  console.log(`  Expected: /dashboard/basic\n`)

  // Test Volunteer (Basic Dashboard)
  console.log('🙋‍♀️ Testing Volunteer Role:')
  const volunteerRoles = ['VOLUNTEER']
  console.log(`  Roles: ${volunteerRoles.join(', ')}`)
  console.log(`  Route: ${getDashboardRoute(volunteerRoles)}`)
  console.log(`  Expected: /dashboard/basic\n`)

  // Test Multiple Roles (Should pick highest privilege)
  console.log('🔄 Testing Multiple Roles:')
  const multipleRoles = ['VOLUNTEER', 'FINANCIAL_ANALYST']
  console.log(`  Roles: ${multipleRoles.join(', ')}`)
  console.log(`  Route: ${getDashboardRoute(multipleRoles)}`)
  console.log(`  Expected: /dashboard/financial\n`)

  // Test Permission Access
  console.log('🔐 Testing Permission Access:')
  const hasFinancialAccess = requireDashboardAccess(['budget.view'], financialRoles)
  console.log(`  Financial Analyst can access budget.view: ${hasFinancialAccess}`)
  
  const hasAdminAccess = requireDashboardAccess(['users.create'], adminRoles)
  console.log(`  Super Admin can access users.create: ${hasAdminAccess}`)

  const chefAdminAccess = requireDashboardAccess(['users.create'], chefRoles)
  console.log(`  Chef can access users.create: ${chefAdminAccess}`)

  console.log('\n✅ Dashboard routing tests completed!')
}

// Run the tests if this file is executed directly
if (require.main === module) {
  testDashboardRouting()
}

export { testDashboardRouting }
