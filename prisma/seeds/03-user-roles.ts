import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedUserRoles() {
  console.log('🔐 Seeding user roles...')
  
  // Get existing roles and users first to match IDs
  const existingRoles = await prisma.role.findMany()
  const existingUsers = await prisma.user.findMany()
  const roleMap = new Map(existingRoles.map(role => [role.name, role.id]))
  const userMap = new Map(existingUsers.map(user => [user.email, user.id]))
  
  console.log('Available roles:', Array.from(roleMap.entries()))
  console.log('Available users:', Array.from(userMap.entries()))
  
  const userRoles = [
    {
      id: 'user-role-super-admin',
      userId: userMap.get('super.admin@sppg.com') || 'user-super-admin',
      roleId: roleMap.get('SUPER_ADMIN') || 'role-super-admin'
    },
    {
      id: 'user-role-admin',
      userId: userMap.get('admin@sppg.com') || 'user-admin',
      roleId: roleMap.get('ADMIN') || 'role-admin'
    },
    {
      id: 'user-role-nutritionist-1',
      userId: userMap.get('sari.nutrition@sppg.com') || 'user-nutritionist-1',
      roleId: roleMap.get('NUTRITIONIST') || 'role-nutritionist'
    },
    {
      id: 'user-role-chef-1',
      userId: userMap.get('budi.chef@sppg.com') || 'user-chef-1',
      roleId: roleMap.get('CHEF') || 'role-chef'
    },
    {
      id: 'user-role-production-1',
      userId: userMap.get('andi.production@sppg.com') || 'user-production-1',
      roleId: roleMap.get('PRODUCTION_STAFF') || 'role-production-staff'
    },
    {
      id: 'user-role-qc-1',
      userId: userMap.get('maya.qc@sppg.com') || 'user-qc-1',
      roleId: roleMap.get('QUALITY_CONTROL') || 'role-qc'
    },
    {
      id: 'user-role-warehouse-1',
      userId: userMap.get('dedi.warehouse@sppg.com') || 'user-warehouse-1',
      roleId: roleMap.get('WAREHOUSE_MANAGER') || 'role-warehouse'
    },
    {
      id: 'user-role-distribution-1',
      userId: userMap.get('rina.distribution@sppg.com') || 'user-distribution-1',
      roleId: roleMap.get('DISTRIBUTION_MANAGER') || 'role-distribution'
    },
    {
      id: 'user-role-driver-1',
      userId: userMap.get('asep.driver@sppg.com') || 'user-driver-1',
      roleId: roleMap.get('DRIVER') || 'role-driver'
    },
    {
      id: 'user-role-driver-2',
      userId: userMap.get('ujang.driver@sppg.com') || 'user-driver-2',
      roleId: roleMap.get('DRIVER') || 'role-driver'
    },
    {
      id: 'user-role-financial-analyst',
      userId: userMap.get('nina.finance@sppg.com') || 'user-financial-analyst',
      roleId: roleMap.get('FINANCIAL_ANALYST') || 'role-financial-analyst'
    },
    {
      id: 'user-role-operations-supervisor',
      userId: userMap.get('supervisor.ops@sppg.com') || 'user-operations-supervisor',
      roleId: roleMap.get('OPERATIONS_SUPERVISOR') || 'role-operations-supervisor'
    },
    {
      id: 'user-role-school-admin-1',
      userId: userMap.get('kepsek.sdn1@purwakarta.go.id') || 'user-school-admin-1',
      roleId: roleMap.get('SCHOOL_ADMIN') || 'role-school-admin'
    }
  ]

  for (const userRole of userRoles) {
    console.log(`Trying to create user role: ${userRole.userId} -> ${userRole.roleId}`)
    
    await prisma.userRole.upsert({
      where: { 
        userId_roleId: {
          userId: userRole.userId,
          roleId: userRole.roleId
        }
      },
      update: {},
      create: userRole
    })
  }

  console.log(`✅ Created ${userRoles.length} user roles`)
}

export default seedUserRoles
