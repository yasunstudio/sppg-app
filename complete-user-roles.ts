import { PrismaClient } from './src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function completeUserRoles() {
  console.log('🚀 Starting user role completion...\n');

  try {
    // 1. Check existing roles
    const allRoles = await prisma.role.findMany({
      select: { name: true, permissions: true }
    });
    
    console.log('📋 Available Roles:');
    allRoles.forEach((role: { name: string; permissions: string[] }) => {
      console.log(`   ${role.name}: ${role.permissions.length} permissions`);
    });
    console.log('');

    // 2. Get role IDs we need
    const deliveryRole = await prisma.role.findUnique({ where: { name: 'DELIVERY_MANAGER' } });
    const financialRole = await prisma.role.findUnique({ where: { name: 'FINANCIAL_ANALYST' } });
    const operationsRole = await prisma.role.findUnique({ where: { name: 'OPERATIONS_SUPERVISOR' } });

    if (!deliveryRole || !financialRole || !operationsRole) {
      throw new Error('Some roles are missing. Please run optimize-role-system.ts first.');
    }

    // 3. Create users for missing roles
    const hashedPassword = await bcrypt.hash('password123', 12);

    console.log('👥 Creating users for empty roles...\n');

    // Create Delivery Manager users
    const deliveryUsers = [
      {
        name: 'Budi Santoso',
        email: 'delivery1@sppg.com',
        password: hashedPassword,
        phone: '+62812-3456-7890',
        address: 'Jl. Logistik No. 15, Jakarta Timur',
        isActive: true,
        emailVerified: new Date(),
      },
      {
        name: 'Sari Wijaya',
        email: 'delivery2@sppg.com',
        password: hashedPassword,
        phone: '+62813-4567-8901',
        address: 'Jl. Pengiriman No. 22, Jakarta Selatan',
        isActive: true,
        emailVerified: new Date(),
      }
    ];

    // Create Financial Analyst users
    const financialUsers = [
      {
        name: 'Drs. Ahmad Finansial',
        email: 'finance1@sppg.com',
        password: hashedPassword,
        phone: '+62814-5678-9012',
        address: 'Jl. Ekonomi No. 88, Jakarta Pusat',
        isActive: true,
        emailVerified: new Date(),
      },
      {
        name: 'Ratna Budgeting, S.E.',
        email: 'finance2@sppg.com',
        password: hashedPassword,
        phone: '+62815-6789-0123',
        address: 'Jl. Keuangan No. 45, Jakarta Barat',
        isActive: true,
        emailVerified: new Date(),
      }
    ];

    // Create Operations Supervisor users
    const operationsUsers = [
      {
        name: 'Pak Hendra Supervisor',
        email: 'ops1@sppg.com',
        password: hashedPassword,
        phone: '+62816-7890-1234',
        address: 'Jl. Operasional No. 77, Jakarta Utara',
        isActive: true,
        emailVerified: new Date(),
      },
      {
        name: 'Ibu Maya Koordinator',
        email: 'ops2@sppg.com',
        password: hashedPassword,
        phone: '+62817-8901-2345',
        address: 'Jl. Manajemen No. 33, Bekasi',
        isActive: true,
        emailVerified: new Date(),
      }
    ];

    // Insert all users and assign roles
    console.log('📝 Creating DELIVERY_MANAGER users...');
    for (const userData of deliveryUsers) {
      const user = await prisma.user.create({ data: userData });
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: deliveryRole.id
        }
      });
      console.log(`   ✅ Created: ${user.name} (${user.email})`);
    }

    console.log('\n💰 Creating FINANCIAL_ANALYST users...');
    for (const userData of financialUsers) {
      const user = await prisma.user.create({ data: userData });
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: financialRole.id
        }
      });
      console.log(`   ✅ Created: ${user.name} (${user.email})`);
    }

    console.log('\n⚙️ Creating OPERATIONS_SUPERVISOR users...');
    for (const userData of operationsUsers) {
      const user = await prisma.user.create({ data: userData });
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: operationsRole.id
        }
      });
      console.log(`   ✅ Created: ${user.name} (${user.email})`);
    }

    // 4. Show updated user distribution
    console.log('\n📊 Updated User Distribution Analysis:');
    
    const userCounts = await prisma.role.findMany({
      include: {
        users: {
          include: {
            user: {
              select: { name: true, email: true, isActive: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const totalUsers = await prisma.user.count();
    
    userCounts.forEach((role: any) => {
      const activeUsers = role.users.filter((ur: any) => ur.user.isActive).length;
      const percentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
      console.log(`   ${role.name}: ${activeUsers} users (${percentage}%)`);
    });

    console.log(`\n📈 Total Active Users: ${totalUsers}`);

    // 5. Show sample login credentials
    console.log('\n🔐 Sample Login Credentials for Testing:');
    console.log('   Delivery Manager: delivery1@sppg.com / password123');
    console.log('   Financial Analyst: finance1@sppg.com / password123');
    console.log('   Operations Supervisor: ops1@sppg.com / password123');
    console.log('   Quality Controller: qc@sppg.com / password123');
    console.log('   Chef: chef@sppg.com / password123');
    console.log('   Admin: admin@sppg.com / password123');

    console.log('\n✅ User role completion successful!');

  } catch (error) {
    console.error('❌ Error completing user roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

completeUserRoles();
