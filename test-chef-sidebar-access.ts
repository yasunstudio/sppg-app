import { PrismaClient } from './src/generated/prisma'
import { hasPermission, PERMISSIONS, type Permission } from './src/lib/permissions'

const prisma = new PrismaClient()

async function testChefSidebarAccess() {
  try {
    console.log("🧪 Testing Chef sidebar access after permission fixes...")
    
    const chef = await prisma.user.findUnique({
      where: { email: 'chef@sppg.com' },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })
    
    if (!chef) {
      console.log("❌ Chef user not found")
      return
    }
    
    const userRoles = chef.roles.map(ur => ur.role.name)
    console.log("👨‍🍳 Chef roles:", userRoles)
    
    // Test sidebar menu permissions
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
    
    console.log("\n🎯 Sidebar Menu Access Test:")
    menuPermissions.forEach(item => {
      if (!item.permission) {
        console.log(`✅ ${item.menu}: Public access`)
        return
      }
      
      const hasAccess = hasPermission(userRoles, item.permission as Permission)
      const status = hasAccess ? "✅" : "❌"
      console.log(`${status} ${item.menu}: ${item.permission} ${hasAccess ? "(ALLOWED)" : "(DENIED)"}`)
    })
    
    console.log("\n📊 Chef's Actual Permissions:")
    chef.roles.forEach(userRole => {
      console.log(`\nRole: ${userRole.role.name}`)
      userRole.role.permissions.forEach(perm => {
        console.log(`  ✓ ${perm}`)
      })
    })
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

testChefSidebarAccess()
