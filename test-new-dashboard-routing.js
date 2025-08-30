// Test the new database-driven dashboard routing system
const { PrismaClient } = require('./src/generated/prisma')
const prisma = new PrismaClient()

async function testDashboardRouting() {
  console.log('🧪 TESTING DATABASE-DRIVEN DASHBOARD ROUTING\n')
  
  // Simulate getDashboardRoute function logic
  async function testGetDashboardRoute(userRoles) {
    try {
      console.log(`\n📋 Testing roles: ${userRoles.join(', ')}`)
      
      // Get role permissions from database
      const roles = await prisma.role.findMany({
        where: {
          name: {
            in: userRoles
          }
        },
        select: {
          name: true,
          permissions: true
        }
      })
      
      console.log(`📊 Found ${roles.length} role(s) in database:`)
      roles.forEach(role => {
        console.log(`   - ${role.name}: ${role.permissions.length} permissions`)
      })
      
      // Combine all permissions from user's roles
      const allPermissions = roles.reduce((permissions, role) => {
        return [...permissions, ...role.permissions]
      }, [])
      
      console.log(`🔑 Total permissions: ${allPermissions.length}`)
      console.log(`   Key permissions: ${allPermissions.filter(p => 
        p.includes('users.') || p.includes('budget.') || p.includes('finance.')
      ).join(', ')}`)
      
      // Admin Dashboard - Full system access (user management permissions)
      if (allPermissions.includes('users.create') || 
          allPermissions.includes('users.edit')) {
        console.log('✅ Route: /dashboard/admin (has user management permissions)')
        return '/dashboard/admin';
      }
      
      // Financial Dashboard - Financial analysis focus
      if (allPermissions.includes('budget.view') || 
          allPermissions.includes('budget.create') ||
          allPermissions.includes('finance.view')) {
        console.log('✅ Route: /dashboard/financial (has financial permissions)')
        return '/dashboard/financial';
      }
      
      // Default Basic Dashboard - Limited access
      console.log('✅ Route: /dashboard/basic (no special permissions)')
      return '/dashboard/basic';
      
    } catch (error) {
      console.error('❌ Error determining dashboard route:', error)
      return '/dashboard/basic';
    }
  }
  
  // Test cases
  const testCases = [
    { role: 'SUPER_ADMIN', expected: '/dashboard/admin' },
    { role: 'ADMIN', expected: '/dashboard/admin' },
    { role: 'FINANCIAL_ANALYST', expected: '/dashboard/financial' },
    { role: 'CHEF', expected: '/dashboard/basic' },
    { role: 'VOLUNTEER', expected: '/dashboard/basic' },
  ]
  
  console.log('🎯 TESTING INDIVIDUAL ROLES:')
  for (const testCase of testCases) {
    const result = await testGetDashboardRoute([testCase.role])
    const status = result === testCase.expected ? '✅ PASS' : '❌ FAIL'
    console.log(`${status} ${testCase.role} → Expected: ${testCase.expected}, Got: ${result}`)
  }
  
  console.log('\n🎯 TESTING MULTIPLE ROLES:')
  // Test multiple roles
  const multiRoleResult = await testGetDashboardRoute(['VOLUNTEER', 'FINANCIAL_ANALYST'])
  console.log(`Multiple roles test: VOLUNTEER + FINANCIAL_ANALYST → ${multiRoleResult}`)
  
  console.log('\n🎯 TESTING EDGE CASES:')
  // Test non-existent role
  const nonExistentResult = await testGetDashboardRoute(['NON_EXISTENT_ROLE'])
  console.log(`Non-existent role test → ${nonExistentResult}`)
  
  // Test empty roles
  const emptyRolesResult = await testGetDashboardRoute([])
  console.log(`Empty roles test → ${emptyRolesResult}`)
  
  await prisma.$disconnect()
}

testDashboardRouting().catch(console.error)
