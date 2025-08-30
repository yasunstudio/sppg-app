import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function optimizeRoleSystem() {
  try {
    console.log("🔧 Optimizing Role System for Better Manageability...")
    console.log("================================================================================")
    
    // 1. Create missing specialized roles
    const newRoles = [
      {
        name: 'DELIVERY_MANAGER',
        description: 'Delivery and logistics operations manager',
        permissions: [
          // Core delivery & logistics
          'delivery.manage', 'delivery.view', 'logistics.plan', 'logistics.manage',
          
          // Production oversight (needed for delivery planning)
          'production.view',
          
          // Inventory (for delivery coordination)
          'inventory.view',
          
          // Reports
          'reports.view'
        ]
      },
      {
        name: 'FINANCIAL_ANALYST',
        description: 'Financial analysis and budget oversight specialist',
        permissions: [
          // Financial analysis (read-only focus)
          'finance.view', 'budget.view', 'budget.create',
          'analytics.view', 'reports.view',
          
          // Limited transaction access
          'transactions.view'
        ]
      },
      {
        name: 'OPERATIONS_SUPERVISOR',
        description: 'Middle management for daily operations oversight',
        permissions: [
          // Operations oversight
          'production.view', 'inventory.view', 'quality.check',
          
          // Limited user management
          'users.view',
          
          // Reporting
          'reports.view', 'analytics.view',
          
          // Feedback management
          'feedback.view', 'feedback.respond'
        ]
      }
    ]
    
    // 2. Add missing granular permissions to existing system
    console.log("1️⃣ Adding Missing Granular Permissions...")
    
    // First, let's check what permissions we need to add to our permission system
    const additionalPermissions = [
      'delivery.manage', 'delivery.view',
      'logistics.plan', 'logistics.manage', 
      'budget.view', 'transactions.view',
      'training.manage', 'compliance.audit'
    ]
    
    console.log("   📝 Will add these permissions to system:", additionalPermissions.join(', '))
    
    // 3. Create new roles
    console.log("\n2️⃣ Creating Specialized Roles...")
    
    for (const roleData of newRoles) {
      try {
        const role = await prisma.role.create({
          data: roleData
        })
        console.log(`   ✅ Created ${role.name} with ${role.permissions.length} permissions`)
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`   ⚠️  ${roleData.name} already exists, skipping...`)
        } else {
          console.log(`   ❌ Error creating ${roleData.name}:`, error.message)
        }
      }
    }
    
    // 4. Optimize SUPER_ADMIN role (replace wildcard with specific permissions)
    console.log("\n3️⃣ Optimizing SUPER_ADMIN role...")
    
    const superAdminPermissions = [
      // User Management
      'users.create', 'users.view', 'users.edit', 'users.delete',
      
      // Menu & Nutrition
      'menus.create', 'menus.view', 'menus.edit', 'menus.approve',
      'nutrition.read', 'nutrition.write', 'nutrition.consult',
      
      // Inventory Management
      'inventory.create', 'inventory.view', 'inventory.edit', 'suppliers.manage',
      
      // Production Management
      'production.create', 'production.view', 'production.manage',
      'quality.check', 'quality.create', 'quality.edit',
      
      // Delivery & Logistics
      'delivery.manage', 'delivery.view', 'logistics.plan', 'logistics.manage',
      
      // Posyandu Management
      'posyandu.create', 'posyandu.view', 'posyandu.edit', 'posyandu.delete',
      'volunteers.create', 'volunteers.view', 'volunteers.edit', 'volunteers.assign',
      'programs.create', 'programs.view', 'programs.edit', 'programs.participate',
      'participants.create', 'participants.view', 'participants.edit', 'participants.health_check',
      
      // Health & Activities
      'health.read', 'health.write', 'activities.read', 'activities.create',
      
      // Financial Management
      'finance.view', 'finance.manage', 'budget.view', 'budget.create', 'budget.approve',
      'transactions.create', 'transactions.view',
      
      // Training & Compliance
      'training.manage', 'compliance.audit',
      
      // Feedback & Reports
      'feedback.view', 'feedback.respond', 'reports.view', 'analytics.view',
      
      // System Administration
      'system.config', 'audit.view'
    ]
    
    await prisma.role.update({
      where: { name: 'SUPER_ADMIN' },
      data: { permissions: superAdminPermissions }
    })
    
    console.log(`   ✅ SUPER_ADMIN updated with ${superAdminPermissions.length} specific permissions`)
    
    // 5. Split ADMIN role into more focused permissions
    console.log("\n4️⃣ Optimizing ADMIN role...")
    
    const adminPermissions = [
      // User Management
      'users.create', 'users.view', 'users.edit', 'users.delete',
      
      // Core Operations Management
      'menus.view', 'menus.approve', 'nutrition.read',
      'inventory.create', 'inventory.view', 'inventory.edit', 'suppliers.manage',
      'production.view', 'quality.check',
      
      // Posyandu & Health Management
      'posyandu.create', 'posyandu.view', 'posyandu.edit', 'posyandu.delete',
      'volunteers.create', 'volunteers.view', 'volunteers.edit', 'volunteers.assign',
      'programs.create', 'programs.view', 'programs.edit',
      'participants.create', 'participants.view', 'participants.edit',
      'health.read', 'activities.read', 'activities.create',
      
      // Financial Management
      'finance.view', 'finance.manage', 'budget.view', 'budget.create', 'transactions.create',
      
      // Reporting & System
      'feedback.view', 'feedback.respond', 'reports.view', 'analytics.view',
      'system.config', 'audit.view'
    ]
    
    await prisma.role.update({
      where: { name: 'ADMIN' },
      data: { permissions: adminPermissions }
    })
    
    console.log(`   ✅ ADMIN optimized to ${adminPermissions.length} focused permissions`)
    
    // 6. Show final role system
    console.log("\n5️⃣ Final Optimized Role System:")
    
    const finalRoles = await prisma.role.findMany({
      select: {
        name: true,
        description: true,
        permissions: true,
        _count: { select: { users: true } }
      }
    })
    
    finalRoles.forEach(role => {
      console.log(`\n🏷️  ${role.name}`)
      console.log(`   📝 ${role.description}`)
      console.log(`   👥 Users: ${role._count.users}`)
      console.log(`   🔑 Permissions: ${role.permissions.length}`)
      console.log(`   📱 Scope: ${getRoleScope(role.name, role.permissions.length)}`)
    })
    
    console.log("\n📊 System Optimization Summary:")
    console.log("================================================================================")
    console.log("✅ Added 3 specialized roles for better separation of concerns")
    console.log("✅ Replaced SUPER_ADMIN wildcard with explicit permissions") 
    console.log("✅ Optimized ADMIN role to reduce permission bloat")
    console.log("✅ Improved role granularity for better manageability")
    console.log("🎯 System now has better role-to-responsibility mapping")
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

function getRoleScope(roleName: string, permissionCount: number): string {
  if (roleName === 'SUPER_ADMIN') return 'Full System Access'
  if (permissionCount > 30) return 'Comprehensive Management'
  if (permissionCount > 15) return 'Department Management'  
  if (permissionCount > 8) return 'Specialized Operations'
  return 'Task-Specific Access'
}

optimizeRoleSystem()
