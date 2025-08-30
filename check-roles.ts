import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function checkRoles() {
  try {
    console.log('🔍 Checking roles in database...\n');
    
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        permissions: true,
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    console.log('📋 Found roles:');
    roles.forEach((role, index) => {
      console.log(`${index + 1}. ${role.name}`);
      console.log(`   Description: ${role.description || 'No description'}`);
      console.log(`   Users: ${role._count.users}`);
      console.log(`   Permissions: ${role.permissions.length > 0 ? role.permissions.join(', ') : 'None'}`);
      console.log('');
    });

    // Also check users and their roles
    console.log('👥 Users with roles:');
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        roles: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    users.slice(0, 5).forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Roles: ${user.roles.map(ur => ur.role.name).join(', ')}`);
      console.log('');
    });

    if (users.length > 5) {
      console.log(`... and ${users.length - 5} more users`);
    }

  } catch (error) {
    console.error('❌ Error checking roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRoles();
