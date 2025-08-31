import { PrismaClient } from './src/generated/prisma/index.js'
import { PERMISSIONS, hasPermission, getUserPermissions } from './src/lib/permissions.js'

const prisma = new PrismaClient()

async function testPermissions() {
  console.log('🔍 Testing SPPG Permission System\n')
  
  // Get all roles with their permissions
  const roles = await prisma.role.findMany({
    include: {
      users: {
        include: {
          user: true
        }
      }
    }
  })

  console.log('📋 ROLE PERMISSIONS OVERVIEW:')
  console.log('=' .repeat(50))
  
  for (const role of roles) {
    console.log(`\n🎭 ${role.name} (${role.description})`)
    console.log(`👤 Users: ${role.users.length}`)
    console.log(`🔐 Permissions (${role.permissions.length}):`)
    
    // Group permissions by category
    const permissionGroups = {}
    
    role.permissions.forEach(perm => {
      const category = perm.split('.')[0]
      if (!permissionGroups[category]) {
        permissionGroups[category] = []
      }
      permissionGroups[category].push(perm)
    })
    
    Object.entries(permissionGroups).forEach(([category, perms]) => {
      console.log(`   📂 ${category.toUpperCase()}: ${perms.map(p => p.split('.')[1]).join(', ')}`)
    })
    
    // List users with this role
    if (role.users.length > 0) {
      console.log(`   👥 Assigned to: ${role.users.map(ur => ur.user.name).join(', ')}`)
    }
  }

  console.log('\n\n🧪 PERMISSION TESTING:')
  console.log('=' .repeat(50))
  
  // Test specific permission scenarios
  const testScenarios = [
    {
      role: 'SUPER_ADMIN',
      permissions: ['users.create', 'users.delete', 'system.config', 'budget.approve']
    },
    {
      role: 'NUTRITIONIST', 
      permissions: ['menus.create', 'nutrition.consult', 'users.create', 'finance.manage']
    },
    {
      role: 'CHEF',
      permissions: ['production.create', 'inventory.edit', 'menus.create', 'users.delete']
    },
    {
      role: 'DRIVER',
      permissions: ['delivery.view', 'schools.view', 'production.manage', 'budget.create']
    }
  ]

  for (const scenario of testScenarios) {
    console.log(`\n🎭 Testing ${scenario.role}:`)
    
    for (const permission of scenario.permissions) {
      const hasAccess = hasPermission([scenario.role], permission)
      const status = hasAccess ? '✅' : '❌'
      console.log(`   ${status} ${permission}`)
    }
  }

  console.log('\n\n📊 PERMISSION STATISTICS:')
  console.log('=' .repeat(50))
  
  const totalPermissions = Object.keys(PERMISSIONS).length
  const totalRoles = roles.length
  
  console.log(`🔐 Total Permissions Available: ${totalPermissions}`)
  console.log(`🎭 Total Roles: ${totalRoles}`)
  
  // Calculate permission distribution
  const permissionCounts = roles.map(r => ({
    role: r.name,
    count: r.permissions.length,
    percentage: Math.round((r.permissions.length / totalPermissions) * 100)
  })).sort((a, b) => b.count - a.count)
  
  console.log('\n📈 Permission Distribution:')
  permissionCounts.forEach(item => {
    console.log(`   ${item.role}: ${item.count} permissions (${item.percentage}%)`)
  })

  console.log('\n✅ Permission system test completed!')
}

testPermissions()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
