import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedRoles() {
  console.log('📋 Checking existing role data...')
  
  // Check if permission-based roles already exist
  const existingSystemRoles = await prisma.role.count({
    where: { isSystemRole: true }
  })
  
  if (existingSystemRoles > 0) {
    console.log('✅ Permission-based roles already exist, skipping role creation')
    return {
      message: 'Permission-based roles already exist',
      systemRoles: existingSystemRoles
    }
  }

  // If no permission-based roles exist, we should not create roles here
  // The permission system (00-permissions.ts) should handle role creation
  console.log('⚠️ No permission-based roles found - permission system should be initialized first')
  
  return {
    message: 'Roles will be created by permission system',
    systemRoles: 0
  }
}
