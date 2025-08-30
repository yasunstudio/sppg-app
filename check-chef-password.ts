import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function checkUserPassword() {
  try {
    console.log("🔍 Checking user: chef@sppg.com")
    
    const user = await prisma.user.findUnique({
      where: {
        email: 'chef@sppg.com'
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        isActive: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    })
    
    if (!user) {
      console.log("❌ User not found")
      return
    }
    
    console.log("✅ User found:")
    console.log(`Name: ${user.name}`)
    console.log(`Email: ${user.email}`)
    console.log(`Active: ${user.isActive}`)
    console.log(`Roles: ${user.roles.map(r => r.role.name).join(', ')}`)
    console.log(`Password Hash: ${user.password}`)
    
    // Note: Passwords are hashed, so we can't see the plain text
    // The actual password would have been set during seeding
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
  }
}

checkUserPassword()
