/**
 * Check actual role data from database
 */

import { prisma } from '@/lib/prisma'

async function checkRoleData() {
  console.log('🔍 CHECKING Role Data from Database\n');
  
  try {
    // Get all roles with permissions
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
        },
        users: {
          include: {
            user: {
              select: {
                email: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    console.log(`Found ${roles.length} roles:\n`);
    
    roles.forEach((role, index) => {
      console.log(`${index + 1}. Role: ${role.name}`);
      console.log(`   Description: ${role.description || 'No description'}`);
      console.log(`   Permissions: [${role.permissions.slice(0, 5).join(', ')}${role.permissions.length > 5 ? '...' : ''}] (${role.permissions.length} total)`);
      console.log(`   Users: ${role._count.users} assigned`);
      if (role._count.users > 0) {
        console.log(`     - ${role.users.map(userRole => userRole.user.email + ' (' + userRole.user.name + ')').join('\n     - ')}`);
      }
      console.log();
    });
    
    // Check specific permissions that determine dashboard routing
    console.log('� Dashboard Routing Analysis:');
    console.log();
    
    // Admin dashboard permissions
    const adminRoles = roles.filter(role => 
      role.permissions.includes('users.create') || 
      role.permissions.includes('users.edit')
    );
    console.log('🔑 Admin Dashboard Roles (users.create OR users.edit):');
    adminRoles.forEach(role => {
      console.log(`   - ${role.name} (${role._count.users} users)`);
    });
    console.log();
    
    // Financial dashboard permissions  
    const financialRoles = roles.filter(role =>
      role.permissions.includes('budget.view') ||
      role.permissions.includes('budget.create') ||
      role.permissions.includes('finance.view')
    );
    console.log('💰 Financial Dashboard Roles (budget.view OR budget.create OR finance.view):');
    financialRoles.forEach(role => {
      console.log(`   - ${role.name} (${role._count.users} users)`);
    });
    console.log();
    
    // Basic dashboard (all others)
    const basicRoles = roles.filter(role =>
      !role.permissions.includes('users.create') &&
      !role.permissions.includes('users.edit') &&
      !role.permissions.includes('budget.view') &&
      !role.permissions.includes('budget.create') &&
      !role.permissions.includes('finance.view')
    );
    console.log('👥 Basic Dashboard Roles (others):');
    basicRoles.forEach(role => {
      console.log(`   - ${role.name} (${role._count.users} users)`);
    });
    
  } catch (error) {
    console.error('Error checking role data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  checkRoleData();
}

export { checkRoleData };
