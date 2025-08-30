import { PrismaClient } from './src/generated/prisma'
import { hasPermission, PERMISSIONS, type Permission } from './src/lib/permissions'

const prisma = new PrismaClient()

async function testQCAccess() {
  try {
    console.log("🧪 Testing QUALITY_CONTROLLER sidebar access...")
    
    const qcUser = await prisma.user.findUnique({
      where: { email: 'qc@sppg.com' },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })
    
    if (!qcUser) {
      console.log("❌ QC user not found")
      return
    }
    
    const userRoles = qcUser.roles.map(ur => ur.role.name)
    console.log("👤 QC User roles:", userRoles)
    
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
    
    console.log("\n🎯 Sidebar Menu Access Test for QUALITY_CONTROLLER:")
    let allowedCount = 0
    
    menuPermissions.forEach(item => {
      if (!item.permission) {
        console.log(`✅ ${item.menu}: Public access`)
        allowedCount++
        return
      }
      
      const hasAccess = hasPermission(userRoles, item.permission as Permission)
      const status = hasAccess ? "✅" : "❌"
      if (hasAccess) allowedCount++
      console.log(`${status} ${item.menu}: ${item.permission} ${hasAccess ? "(ALLOWED)" : "(DENIED)"}`)
    })
    
    console.log(`\n📊 Total Access: ${allowedCount}/${menuPermissions.length} menu items`)
    
    console.log("\n📋 QC's Actual Permissions:")
    qcUser.roles.forEach(userRole => {
      console.log(`\nRole: ${userRole.role.name}`)
      userRole.role.permissions.forEach(perm => {
        console.log(`  ✓ ${perm}`)
      })
    })
    
    // Compare with CHEF access
    console.log("\n⚖️  Comparison with CHEF role:")
    const chefUser = await prisma.user.findFirst({
      where: { 
        roles: {
          some: {
            role: { name: 'CHEF' }
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
    
    if (chefUser) {
      const chefRoles = chefUser.roles.map(ur => ur.role.name)
      let chefAllowedCount = 0
      
      menuPermissions.forEach(item => {
        if (!item.permission) {
          chefAllowedCount++
          return
        }
        
        const hasAccess = hasPermission(chefRoles, item.permission as Permission)
        if (hasAccess) chefAllowedCount++
      })
      
      console.log(`CHEF access: ${chefAllowedCount}/${menuPermissions.length} menu items`)
      console.log(`QC access: ${allowedCount}/${menuPermissions.length} menu items`)
      console.log(`Difference: ${Math.abs(allowedCount - chefAllowedCount)} menu items`)
    }
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

testQCAccess()
