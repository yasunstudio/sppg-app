/**
 * Simple role data check
 */

const { PrismaClient } = require('./src/generated/prisma')
const prisma = new PrismaClient()

async function checkRoles() {
  console.log('🔍 Checking Role Data from Database\n')
  
  try {
    const roles = await prisma.role.findMany()
    
    console.log(`Found ${roles.length} roles:\n`)
    
    roles.forEach((role, index) => {
      console.log(`${index + 1}. ${role.name}`)
      console.log(`   Permissions: ${role.permissions.length} total`)
      console.log(`   Sample permissions: ${role.permissions.slice(0, 3).join(', ')}`)
      console.log()
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkRoles()
