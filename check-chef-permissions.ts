import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function checkChefPermissions() {
  try {
    console.log("🔍 Checking chef permissions...")
    
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
    
    console.log("👨‍🍳 Chef User Info:")
    console.log("  Name:", chef.name)
    console.log("  Email:", chef.email)
    console.log("  Status:", chef.isActive ? "Active" : "Inactive")
    console.log("  Created:", chef.createdAt)
    
    console.log("\n🔐 Roles and Permissions:")
    
    if (chef.roles.length === 0) {
      console.log("  ⚠️ No roles assigned")
    } else {
      for (const userRole of chef.roles) {
        console.log(`  📋 Role: ${userRole.role.name}`)
        console.log(`     Description: ${userRole.role.description}`)
        console.log(`     Permissions: ${JSON.stringify(userRole.role.permissions, null, 6)}`)
        console.log(`     Assigned At: ${userRole.assignedAt}`)
        console.log()
      }
    }
    
  } catch (error) {
    console.error("❌ Error checking permissions:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkChefPermissions()
