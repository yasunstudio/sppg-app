// Test basic dashboard routing for VOLUNTEER user
const { PrismaClient } = require('./src/generated/prisma')
const prisma = new PrismaClient()

async function testVolunteerDashboardAccess() {
  try {
    console.log('🧪 TESTING VOLUNTEER USER DASHBOARD ACCESS\n')
    
    // Find volunteer user
    const user = await prisma.user.findFirst({
      where: {
        roles: {
          some: {
            role: {
              name: 'VOLUNTEER'
            }
          }
        }
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })
    
    if (!user) {
      console.log('❌ No VOLUNTEER user found')
      return
    }
    
    console.log('👤 Found VOLUNTEER user:')
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Roles: ${user.roles.map(ur => ur.role.name).join(', ')}`)
    
    // Get role permissions to verify routing logic
    const roles = await prisma.role.findMany({
      where: {
        name: {
          in: user.roles.map(ur => ur.role.name)
        }
      },
      select: {
        name: true,
        permissions: true
      }
    })
    
    console.log('\n🔑 User permissions:')
    roles.forEach(role => {
      console.log(`   ${role.name}: ${role.permissions.join(', ')}`)
    })
    
    const allPermissions = roles.reduce((permissions, role) => {
      return [...permissions, ...role.permissions]
    }, [])
    
    console.log('\n📊 Dashboard routing logic test:')
    
    // Check admin permissions
    const hasAdminPerms = allPermissions.includes('users.create') || allPermissions.includes('users.edit')
    console.log(`   Has admin permissions (users.create/edit): ${hasAdminPerms}`)
    
    // Check financial permissions
    const hasFinancialPerms = allPermissions.includes('budget.view') || 
                             allPermissions.includes('budget.create') ||
                             allPermissions.includes('finance.view')
    console.log(`   Has financial permissions (budget/finance): ${hasFinancialPerms}`)
    
    // Determine route
    let expectedRoute = '/dashboard/basic'
    if (hasAdminPerms) {
      expectedRoute = '/dashboard/admin'
    } else if (hasFinancialPerms) {
      expectedRoute = '/dashboard/financial'
    }
    
    console.log(`\n✅ Expected dashboard route: ${expectedRoute}`)
    console.log(`\n📋 To test manually:`)
    console.log(`1. Go to http://localhost:3000/auth/login`)
    console.log(`2. Login with email: ${user.email}`)
    console.log(`3. Should redirect to: ${expectedRoute}`)
    console.log(`4. Basic dashboard should now show:`)
    console.log(`   - ✅ Sidebar navigation menu`)
    console.log(`   - ✅ Real-time notifications`)
    console.log(`   - ✅ Consistent spacing with other dashboards`)
    
  } catch (error) {
    console.error('❌ Error testing volunteer dashboard access:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testVolunteerDashboardAccess().catch(console.error)
