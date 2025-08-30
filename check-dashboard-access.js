const { PrismaClient } = require('./src/generated/prisma')

const prisma = new PrismaClient()

async function checkBasicDashboardAccess() {
  console.log('🔍 Checking Dashboard Basic Access Rights...\n')

  try {
    // Get all users with their roles
    const usersWithRoles = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        }
      },
      orderBy: {
        email: 'asc'
      }
    })

    console.log('👥 All Users and Their Dashboard Access:\n')

    // Dashboard routing logic analysis
    const adminRoles = ['SUPER_ADMIN', 'ADMIN']
    const financialRoles = ['FINANCIAL_ANALYST']
    
    let basicDashboardUsers = []
    let adminDashboardUsers = []
    let financialDashboardUsers = []

    usersWithRoles.forEach(user => {
      const userRoles = user.roles.map(ur => ur.role.name)
      const roleNames = userRoles.join(', ')
      
      // Determine dashboard access based on routing logic
      let dashboardType = 'Basic'
      let dashboardUrl = '/dashboard/basic'
      
      if (userRoles.some(role => adminRoles.includes(role))) {
        dashboardType = 'Admin'
        dashboardUrl = '/dashboard/admin'
        adminDashboardUsers.push(user)
      } else if (userRoles.some(role => financialRoles.includes(role))) {
        dashboardType = 'Financial'
        dashboardUrl = '/dashboard/financial'
        financialDashboardUsers.push(user)
      } else {
        basicDashboardUsers.push(user)
      }

      console.log(`📧 ${user.email}`)
      console.log(`   👤 Name: ${user.name}`)
      console.log(`   🏷️  Roles: ${roleNames}`)
      console.log(`   📊 Dashboard: ${dashboardType} (${dashboardUrl})`)
      console.log(`   ✅ Basic Access: ${dashboardType === 'Basic' ? 'YES' : 'Can access, but redirected to ' + dashboardType}`)
      console.log('')
    })

    // Summary
    console.log('📊 Dashboard Access Summary:\n')
    
    console.log(`🏠 Basic Dashboard Users (${basicDashboardUsers.length}):`)
    basicDashboardUsers.forEach(user => {
      const roles = user.roles.map(ur => ur.role.name).join(', ')
      console.log(`   - ${user.name} (${user.email}) - ${roles}`)
    })
    
    console.log(`\n🔧 Admin Dashboard Users (${adminDashboardUsers.length}):`)
    adminDashboardUsers.forEach(user => {
      const roles = user.roles.map(ur => ur.role.name).join(', ')
      console.log(`   - ${user.name} (${user.email}) - ${roles}`)
    })
    
    console.log(`\n💰 Financial Dashboard Users (${financialDashboardUsers.length}):`)
    financialDashboardUsers.forEach(user => {
      const roles = user.roles.map(ur => ur.role.name).join(', ')
      console.log(`   - ${user.name} (${user.email}) - ${roles}`)
    })

    // Role analysis for Basic Dashboard
    console.log('\n🎯 Roles That Access Basic Dashboard:\n')
    
    const basicDashboardRoles = new Set()
    basicDashboardUsers.forEach(user => {
      user.roles.forEach(ur => {
        basicDashboardRoles.add(ur.role.name)
      })
    })

    Array.from(basicDashboardRoles).forEach(role => {
      const usersWithThisRole = basicDashboardUsers.filter(user => 
        user.roles.some(ur => ur.role.name === role)
      )
      console.log(`🏷️  ${role}: ${usersWithThisRole.length} users`)
      usersWithThisRole.forEach(user => {
        console.log(`     - ${user.name} (${user.email})`)
      })
    })

    // Permission analysis
    console.log('\n🔐 Dashboard Basic Permission Requirements:\n')
    console.log('✅ Dashboard Basic (/dashboard/basic):')
    console.log('   - Permission Required: NONE (available for all authenticated users)')
    console.log('   - Sidebar Visibility: Always visible for all users')
    console.log('   - Access Control: Any authenticated user can access')
    
    console.log('\n📋 Content Customization by Role:')
    console.log('   🥗 CHEF/KITCHEN_STAFF: Kitchen & production content')
    console.log('   🏥 POSYANDU_COORDINATOR/VOLUNTEER: Health monitoring content')
    console.log('   ✅ QUALITY_CONTROLLER: Quality control content')
    console.log('   🚚 DELIVERY_MANAGER/DRIVER: Delivery & logistics content')
    console.log('   💰 FINANCIAL_ANALYST: Financial overview content')
    console.log('   👤 Other roles: General welcome & notification content')

    console.log('\n🎯 Key Findings:')
    console.log(`   - Total users who can access Basic Dashboard: ${basicDashboardUsers.length}`)
    console.log(`   - Total users in system: ${usersWithRoles.length}`)
    console.log(`   - Percentage using Basic Dashboard: ${Math.round((basicDashboardUsers.length / usersWithRoles.length) * 100)}%`)
    console.log('   - Access Control: Open to all authenticated users')
    console.log('   - Content: Dynamically customized based on user roles')

  } catch (error) {
    console.error('❌ Error checking dashboard access:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBasicDashboardAccess()
