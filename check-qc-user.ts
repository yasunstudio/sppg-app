import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function checkQCUser() {
  try {
    console.log("🔍 Checking QC user...")
    
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
      
      // Let's check what users exist
      console.log("\n📋 Available users:")
      const users = await prisma.user.findMany({
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
      
      users.forEach(user => {
        const roleNames = user.roles.map(ur => ur.role.name).join(', ')
        console.log(`  📧 ${user.email} (${user.name}) - Roles: ${roleNames}`)
      })
      
      return
    }
    
    console.log("👤 QC User found:")
    console.log("  Name:", qcUser.name)
    console.log("  Email:", qcUser.email)
    console.log("  Status:", qcUser.isActive ? "Active" : "Inactive")
    
    console.log("\n🔐 Roles:")
    qcUser.roles.forEach(userRole => {
      console.log(`  📋 Role: ${userRole.role.name}`)
      console.log(`     Description: ${userRole.role.description}`)
      console.log(`     Permissions: ${userRole.role.permissions.length}`)
      userRole.role.permissions.slice(0, 5).forEach(perm => {
        console.log(`       - ${perm}`)
      })
      if (userRole.role.permissions.length > 5) {
        console.log(`       ... and ${userRole.role.permissions.length - 5} more`)
      }
    })
    
    // Check password
    console.log("\n🔑 Testing password...")
    const bcrypt = await import('bcryptjs')
    const isPasswordValid = await bcrypt.compare('password123', qcUser.password)
    console.log(`Password 'password123': ${isPasswordValid ? "✅ Valid" : "❌ Invalid"}`)
    
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkQCUser()
