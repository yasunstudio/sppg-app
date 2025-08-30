import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function createQualityControllerRole() {
  try {
    console.log("🔧 Creating QUALITY_CONTROLLER role...")
    
    // Create QUALITY_CONTROLLER role
    const qcRole = await prisma.role.create({
      data: {
        name: 'QUALITY_CONTROLLER',
        description: 'Quality Control Manager with inspection and standards oversight',
        permissions: [
          // Quality Control - Primary responsibilities
          'quality.check',
          'quality.create',
          'quality.edit',
          
          // Production oversight
          'production.view',
          
          // Menu quality standards
          'menus.view',
          'nutrition.read',
          
          // Inventory quality
          'inventory.view',
          
          // Reports and feedback
          'reports.view',
          'feedback.view',
          'feedback.respond',
          
          // Audit capabilities
          'audit.view'
        ]
      }
    })
    
    console.log("✅ QUALITY_CONTROLLER role created successfully!")
    console.log("Permissions:", qcRole.permissions)
    
    // Update QC user to use new role
    console.log("\n🔄 Updating QC user role...")
    
    // First, remove existing role assignments
    await prisma.userRole.deleteMany({
      where: { 
        user: { email: 'qc@sppg.com' }
      }
    })
    
    // Get user and role IDs
    const qcUser = await prisma.user.findUnique({
      where: { email: 'qc@sppg.com' }
    })
    
    if (!qcUser) {
      console.log("❌ QC user not found")
      return
    }
    
    // Assign new role
    await prisma.userRole.create({
      data: {
        userId: qcUser.id,
        roleId: qcRole.id
      }
    })
    
    console.log("✅ QC user updated with QUALITY_CONTROLLER role!")
    
    // Verify the change
    const updatedUser = await prisma.user.findUnique({
      where: { email: 'qc@sppg.com' },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })
    
    console.log("\n✅ Verification:")
    console.log("User:", updatedUser?.name)
    console.log("New Role:", updatedUser?.roles[0]?.role.name)
    console.log("Permissions count:", updatedUser?.roles[0]?.role.permissions.length)
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

createQualityControllerRole()
