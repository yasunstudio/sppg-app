import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function fixAdminSystemConfig() {
  try {
    console.log("🔧 Adding system.config permission to ADMIN role...")
    
    // Get current ADMIN permissions
    const adminRole = await prisma.role.findUnique({
      where: { name: 'ADMIN' }
    })
    
    if (!adminRole) {
      console.log("❌ ADMIN role not found")
      return
    }
    
    // Add system.config to existing permissions
    const updatedPermissions = [...adminRole.permissions, 'system.config']
    
    // Update ADMIN role
    const updatedRole = await prisma.role.update({
      where: { name: 'ADMIN' },
      data: {
        permissions: updatedPermissions
      }
    })
    
    console.log("✅ ADMIN role updated successfully!")
    console.log(`Now has ${updatedRole.permissions.length} permissions including system.config`)
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAdminSystemConfig()
