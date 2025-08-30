import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function fixChefPermissions() {
  try {
    console.log("🔧 Fixing CHEF permissions to match frontend system...")
    
    // Update CHEF role permissions
    const updatedChefRole = await prisma.role.update({
      where: { name: 'CHEF' },
      data: {
        permissions: [
          // Production Management
          'production.create',
          'production.view', 
          'production.manage',
          'quality.check',
          
          // Menu & Nutrition (Chef should be able to view/create menus)
          'menus.create',
          'menus.view',
          'menus.edit',
          'nutrition.read',
          
          // Inventory (Chef needs access to ingredients/raw materials)
          'inventory.create',
          'inventory.view',
          'inventory.edit'
        ]
      }
    })
    
    console.log("✅ CHEF role permissions updated successfully!")
    console.log("New permissions:", JSON.stringify(updatedChefRole.permissions, null, 2))
    
    // Also let's verify the update worked
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
    
    if (chef) {
      console.log("\n✅ Verification - Chef now has permissions:")
      chef.roles.forEach(userRole => {
        console.log(`Role: ${userRole.role.name}`)
        userRole.role.permissions.forEach(perm => {
          console.log(`  - ${perm}`)
        })
      })
    }
    
  } catch (error) {
    console.error("❌ Error updating permissions:", error)
  } finally {
    await prisma.$disconnect()
  }
}

fixChefPermissions()
