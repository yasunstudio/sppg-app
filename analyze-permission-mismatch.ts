import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function analyzePermissionMismatch() {
  try {
    console.log("🔍 Analyzing permission system mismatch...")
    
    // Get chef user with complete role data
    const chef = await prisma.user.findUnique({
      where: { email: 'chef@sppg.com' },
      include: {
        roles: {
          include: {
            role: {
              select: {
                name: true,
                description: true,
                permissions: true
              }
            }
          }
        }
      }
    })
    
    if (!chef) {
      console.log("❌ Chef user not found")
      return
    }
    
    console.log("👨‍🍳 Chef Roles and Database Permissions:")
    chef.roles.forEach(userRole => {
      console.log(`\n📋 Role: ${userRole.role.name}`)
      console.log(`   Description: ${userRole.role.description}`)
      console.log(`   Database Permissions:`)
      userRole.role.permissions.forEach(perm => {
        console.log(`     - ${perm}`)
      })
    })
    
    // Show what frontend expects vs what database has
    console.log("\n🔄 Permission Mapping Analysis:")
    console.log("Database has: ['READ_PRODUCTION', 'WRITE_PRODUCTION', 'READ_QUALITY']")
    console.log("Frontend expects for sidebar menus:")
    console.log("  - production.view: ['CHEF'] ✅ Should work")
    console.log("  - menus.view: ['NUTRITIONIST', 'CHEF'] ✅ Should work") 
    console.log("  - inventory.view: ['ADMIN', 'CHEF'] ✅ Should work")
    console.log("  - quality.check: ['CHEF', 'NUTRITIONIST'] ✅ Should work")
    console.log("\n❗ Problem: Database uses different permission names than frontend!")
    
    // Check all roles in database
    console.log("\n📊 All Roles in Database:")
    const allRoles = await prisma.role.findMany({
      select: {
        name: true,
        description: true,
        permissions: true
      }
    })
    
    allRoles.forEach(role => {
      console.log(`\n🔖 ${role.name}: ${JSON.stringify(role.permissions)}`)
    })
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

analyzePermissionMismatch()
