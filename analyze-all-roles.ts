import { PrismaClient } from './src/generated/prisma'
import { hasPermission, PERMISSIONS, type Permission } from './src/lib/permissions'

const prisma = new PrismaClient()

async function analyzeAllRoles() {
  try {
    console.log("🔍 Analyzing all roles and their permissions...")
    
    // Get all roles from database
    const allRoles = await prisma.role.findMany({
      select: {
        name: true,
        description: true,
        permissions: true,
        _count: {
          select: {
            users: true
          }
        }
      }
    })
    
    console.log("📊 Database Roles Analysis:")
    console.log("================================================================================")
    
    allRoles.forEach(role => {
      console.log(`\n🏷️  Role: ${role.name}`)
      console.log(`   Description: ${role.description}`)
      console.log(`   Users Count: ${role._count.users}`)
      console.log(`   Database Permissions:`)
      role.permissions.forEach(perm => {
        console.log(`     - ${perm}`)
      })
    })
    
    console.log("\n\n🎯 Frontend Permission System Analysis:")
    console.log("================================================================================")
    
    // Test all roles against sidebar menu requirements
    const menuPermissions = [
      { menu: "Dashboard", permission: null },
      { menu: "Data Sekolah", permission: "posyandu.view" },
      { menu: "Inventaris & Stok", permission: "inventory.view" },
      { menu: "Distribusi & Logistik", permission: "production.view" },
      { menu: "Delivery Tracking", permission: "production.view" },
      { menu: "Kontrol Kualitas", permission: "quality.check" },
      { menu: "Feedback Management", permission: "feedback.view" },
      { menu: "Waste Management", permission: "production.view" },
      { menu: "Posyandu", permission: "posyandu.view" },
      { menu: "Manajemen Keuangan", permission: "finance.view" },
      { menu: "Manajemen Pengguna", permission: "users.view" },
      { menu: "Role Management", permission: "system.config" },
      { menu: "Perencanaan Menu", permission: "menus.view" },
      { menu: "Produksi Makanan", permission: "production.view" },
    ]
    
    // Test each role
    for (const role of allRoles) {
      console.log(`\n👤 ${role.name} - Sidebar Access Test:`)
      
      menuPermissions.forEach(item => {
        if (!item.permission) {
          console.log(`  ✅ ${item.menu}: Public access`)
          return
        }
        
        // Check if role's permissions include the required permission
        const hasAccess = role.permissions.some(perm => {
          // Handle wildcard permissions
          if (perm === '*') return true
          if (perm === 'READ_ALL' && item.permission?.includes('.view')) return true
          if (perm === 'WRITE_ALL' && item.permission?.includes('.edit')) return true
          return perm === item.permission
        })
        
        const status = hasAccess ? "✅" : "❌"
        console.log(`  ${status} ${item.menu}: requires ${item.permission} ${hasAccess ? "(ALLOWED)" : "(DENIED)"}`)
      })
    }
    
    // Show frontend permission mapping
    console.log("\n\n🔧 Frontend Permission Mapping (from lib/permissions.ts):")
    console.log("================================================================================")
    
    Object.entries(PERMISSIONS).forEach(([permission, roles]) => {
      console.log(`${permission}: [${roles.join(', ')}]`)
    })
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

analyzeAllRoles()
