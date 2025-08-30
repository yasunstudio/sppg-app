import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function standardizeAllRolePermissions() {
  try {
    console.log("🔧 Standardizing all role permissions to match frontend system...")
    
    // Define proper permissions for each role based on frontend requirements and business logic
    const rolePermissions = {
      SUPER_ADMIN: [
        '*' // Wildcard - has access to everything
      ],
      
      ADMIN: [
        // User Management
        'users.create', 'users.view', 'users.edit', 'users.delete',
        
        // Menu & Nutrition Management
        'menus.view', 'menus.approve', 'nutrition.read',
        
        // Inventory Management
        'inventory.create', 'inventory.view', 'inventory.edit', 'suppliers.manage',
        
        // Production Management
        'production.view', 'quality.check',
        
        // Posyandu Management
        'posyandu.create', 'posyandu.view', 'posyandu.edit', 'posyandu.delete',
        'volunteers.create', 'volunteers.view', 'volunteers.edit', 'volunteers.assign',
        'programs.create', 'programs.view', 'programs.edit',
        'participants.create', 'participants.view', 'participants.edit',
        
        // Health & Activities
        'health.read', 'activities.read', 'activities.create',
        
        // Financial Management
        'finance.view', 'finance.manage', 'budget.create', 'transactions.create',
        
        // Feedback & Reports
        'feedback.view', 'feedback.respond', 'reports.view', 'analytics.view',
        
        // System Administration
        'audit.view'
      ],
      
      POSYANDU_COORDINATOR: [
        // Posyandu Operations
        'posyandu.create', 'posyandu.view', 'posyandu.edit',
        
        // Volunteer Management
        'volunteers.create', 'volunteers.view', 'volunteers.edit', 'volunteers.assign',
        
        // Program Management
        'programs.create', 'programs.view', 'programs.edit',
        
        // Participant Management
        'participants.create', 'participants.view', 'participants.edit',
        
        // Health & Activities
        'health.read', 'activities.read', 'activities.create',
        
        // User Management (limited)
        'users.view',
        
        // Feedback & Reports
        'feedback.view', 'feedback.respond', 'reports.view'
      ],
      
      HEALTH_WORKER: [
        // Health & Nutrition
        'health.read', 'health.write', 'nutrition.read', 'nutrition.write', 'nutrition.consult',
        
        // Participant Management
        'participants.create', 'participants.view', 'participants.edit', 'participants.health_check',
        
        // Posyandu Operations
        'posyandu.view',
        
        // Volunteer & Program Access
        'volunteers.view', 'programs.create', 'programs.view', 'programs.edit',
        
        // Activities
        'activities.read', 'activities.create',
        
        // Feedback & Reports
        'feedback.view', 'feedback.respond', 'reports.view'
      ],
      
      NUTRITIONIST: [
        // Menu & Nutrition Management
        'menus.create', 'menus.view', 'menus.edit', 'nutrition.read', 'nutrition.write', 'nutrition.consult',
        
        // Inventory (for menu planning)
        'inventory.view',
        
        // Production (for menu implementation)
        'production.view', 'quality.check',
        
        // Participant Management (for nutrition consultation)
        'participants.view', 'participants.health_check',
        
        // Health Data Access
        'health.read'
      ],
      
      CHEF: [
        // Production Management
        'production.create', 'production.view', 'production.manage', 'quality.check',
        
        // Menu Management
        'menus.create', 'menus.view', 'menus.edit', 'nutrition.read',
        
        // Inventory Management
        'inventory.create', 'inventory.view', 'inventory.edit'
      ],
      
      VOLUNTEER: [
        // Basic Access
        'posyandu.view',
        
        // Activities
        'activities.read',
        
        // Participants (read only)
        'participants.view',
        
        // Programs
        'programs.view', 'programs.participate'
      ]
    }
    
    // Update each role
    for (const [roleName, permissions] of Object.entries(rolePermissions)) {
      console.log(`\n🔄 Updating ${roleName}...`)
      
      const updatedRole = await prisma.role.update({
        where: { name: roleName },
        data: { permissions }
      })
      
      console.log(`✅ ${roleName} updated with ${permissions.length} permissions`)
      console.log(`   Permissions: ${permissions.slice(0, 5).join(', ')}${permissions.length > 5 ? '...' : ''}`)
    }
    
    console.log("\n🎉 All roles standardized successfully!")
    
    // Verify the updates
    console.log("\n📊 Verification - Updated Roles:")
    const updatedRoles = await prisma.role.findMany({
      select: {
        name: true,
        permissions: true,
        _count: {
          select: { users: true }
        }
      }
    })
    
    updatedRoles.forEach(role => {
      console.log(`\n🏷️  ${role.name} (${role._count.users} users):`)
      role.permissions.forEach(perm => {
        console.log(`   - ${perm}`)
      })
    })
    
  } catch (error) {
    console.error("❌ Error standardizing permissions:", error)
  } finally {
    await prisma.$disconnect()
  }
}

standardizeAllRolePermissions()
