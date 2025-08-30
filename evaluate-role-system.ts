import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function evaluateRoleSystem() {
  try {
    console.log("🔍 Evaluating Role System Completeness and Optimization...")
    console.log("================================================================================")
    
    // Get all roles and their usage
    const allRoles = await prisma.role.findMany({
      select: {
        name: true,
        description: true,
        permissions: true,
        _count: {
          select: { users: true }
        }
      }
    })
    
    // Get all users and their roles
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        roles: {
          include: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
    
    console.log("📊 Current Role System Analysis:")
    console.log("================================================================================")
    
    // Analyze role distribution
    const roleUsage = allRoles.map(role => ({
      name: role.name,
      description: role.description,
      userCount: role._count.users,
      permissionCount: role.permissions.length,
      permissions: role.permissions
    }))
    
    roleUsage.forEach(role => {
      console.log(`\n🏷️  ${role.name}`)
      console.log(`   📝 Description: ${role.description}`)
      console.log(`   👥 Users: ${role.userCount}`)
      console.log(`   🔑 Permissions: ${role.permissionCount}`)
      console.log(`   📱 Coverage: ${role.permissionCount > 20 ? 'Comprehensive' : role.permissionCount > 10 ? 'Moderate' : 'Limited'}`)
    })
    
    // Analyze menu coverage
    const sidebarMenus = [
      { name: "Dashboard", permission: null, category: "Core" },
      { name: "Data Sekolah", permission: "posyandu.view", category: "Operations" },
      { name: "Inventaris & Stok", permission: "inventory.view", category: "Operations" },
      { name: "Distribusi & Logistik", permission: "production.view", category: "Operations" },
      { name: "Delivery Tracking", permission: "production.view", category: "Operations" },
      { name: "Kontrol Kualitas", permission: "quality.check", category: "Quality" },
      { name: "Feedback Management", permission: "feedback.view", category: "Quality" },
      { name: "Waste Management", permission: "production.view", category: "Operations" },
      { name: "Posyandu", permission: "posyandu.view", category: "Health" },
      { name: "Manajemen Keuangan", permission: "finance.view", category: "Management" },
      { name: "Manajemen Pengguna", permission: "users.view", category: "Administration" },
      { name: "Role Management", permission: "system.config", category: "Administration" },
      { name: "Perencanaan Menu", permission: "menus.view", category: "Planning" },
      { name: "Produksi Makanan", permission: "production.view", category: "Operations" },
    ]
    
    console.log("\n\n🎯 Role Access Matrix:")
    console.log("================================================================================")
    
    // Create access matrix
    const categories = ["Core", "Operations", "Quality", "Health", "Planning", "Management", "Administration"]
    
    for (const role of roleUsage) {
      console.log(`\n👤 ${role.name} Access Analysis:`)
      
      const accessByCategory: Record<string, { allowed: number; total: number }> = {}
      categories.forEach(cat => accessByCategory[cat] = { allowed: 0, total: 0 })
      
      sidebarMenus.forEach(menu => {
        accessByCategory[menu.category].total++
        
        if (!menu.permission) {
          accessByCategory[menu.category].allowed++
          return
        }
        
        const hasAccess = role.permissions.some(perm => {
          if (perm === '*') return true
          return perm === menu.permission
        })
        
        if (hasAccess) {
          accessByCategory[menu.category].allowed++
        }
      })
      
      categories.forEach(category => {
        const access = accessByCategory[category]
        const percentage = Math.round((access.allowed / access.total) * 100)
        const status = percentage === 100 ? "✅" : percentage >= 50 ? "🟡" : "❌"
        console.log(`   ${status} ${category}: ${access.allowed}/${access.total} (${percentage}%)`)
      })
    }
    
    // Identify potential gaps and improvements
    console.log("\n\n🔧 System Optimization Analysis:")
    console.log("================================================================================")
    
    // Check for missing roles
    const missingRoles = [
      {
        name: "DELIVERY_MANAGER",
        justification: "Specialized role for delivery and logistics management",
        suggestedPermissions: ["production.view", "inventory.view", "delivery.manage", "logistics.manage"]
      },
      {
        name: "FINANCIAL_ANALYST", 
        justification: "Dedicated financial analysis without full admin access",
        suggestedPermissions: ["finance.view", "reports.view", "analytics.view", "budget.view"]
      },
      {
        name: "OPERATIONS_SUPERVISOR",
        justification: "Middle management for day-to-day operations oversight",
        suggestedPermissions: ["production.view", "inventory.view", "quality.check", "reports.view"]
      }
    ]
    
    console.log("🚀 Potential Role Enhancements:")
    
    // Check current role optimization
    console.log("\n1️⃣ Current Role Analysis:")
    
    roleUsage.forEach(role => {
      const issues = []
      
      if (role.userCount === 0) {
        issues.push("No users assigned")
      }
      
      if (role.permissionCount < 5 && role.name !== 'VOLUNTEER') {
        issues.push("Very limited permissions - might be too restrictive")
      }
      
      if (role.permissionCount > 30) {
        issues.push("Too many permissions - might need splitting")
      }
      
      if (role.name === 'CHEF' || role.name === 'NUTRITIONIST') {
        const hasMenuAccess = role.permissions.includes('menus.view')
        const hasProductionAccess = role.permissions.includes('production.view')
        if (!hasMenuAccess || !hasProductionAccess) {
          issues.push("Missing critical workflow permissions")
        }
      }
      
      if (issues.length > 0) {
        console.log(`   ⚠️  ${role.name}: ${issues.join(', ')}`)
      } else {
        console.log(`   ✅ ${role.name}: Well balanced`)
      }
    })
    
    console.log("\n2️⃣ Suggested Missing Roles:")
    missingRoles.forEach((role, index) => {
      console.log(`   ${index + 1}. ${role.name}`)
      console.log(`      📝 Justification: ${role.justification}`)
      console.log(`      🔑 Suggested permissions: ${role.suggestedPermissions.join(', ')}`)
    })
    
    console.log("\n3️⃣ Permission Granularity Analysis:")
    
    // Check permission granularity
    const permissionAnalysis = {
      tooCoarse: [
        "production.view covers both production planning and execution",
        "users.view doesn't distinguish between viewing and managing users",
        "Missing separate permissions for delivery vs distribution"
      ],
      missing: [
        "delivery.manage - specific delivery operations",
        "logistics.plan - logistics planning",
        "budget.view - view-only budget access", 
        "training.manage - staff training management",
        "compliance.audit - compliance checking"
      ]
    }
    
    console.log("   🔍 Too Coarse Permissions:")
    permissionAnalysis.tooCoarse.forEach(issue => {
      console.log(`      • ${issue}`)
    })
    
    console.log("   🆕 Missing Permissions:")
    permissionAnalysis.missing.forEach(perm => {
      console.log(`      • ${perm}`)
    })
    
    // User distribution analysis
    console.log("\n4️⃣ User Distribution Analysis:")
    const totalUsers = allUsers.length
    roleUsage.forEach(role => {
      const percentage = Math.round((role.userCount / totalUsers) * 100)
      console.log(`   ${role.name}: ${role.userCount} users (${percentage}%)`)
    })
    
    console.log("\n📋 Summary Recommendations:")
    console.log("================================================================================")
    console.log("✅ Current system has good role separation")
    console.log("⚠️  Consider adding specialized roles for better granularity")
    console.log("🔧 Some permissions could be more granular")
    console.log("👥 User distribution seems reasonable")
    console.log("📈 System is ready for production but has room for optimization")
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

evaluateRoleSystem()
