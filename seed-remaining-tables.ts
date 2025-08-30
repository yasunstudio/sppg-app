import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function seedRemainingTables() {
  console.log('🌱 Seeding remaining empty tables...\n');

  try {
    // Get existing data
    const menus = await prisma.menu.findMany();
    const distributions = await prisma.distribution.findMany();
    const drivers = await prisma.driver.findMany();
    const vehicles = await prisma.vehicle.findMany();
    const schools = await prisma.school.findMany();
    const users = await prisma.user.findMany();
    const productionBatches = await prisma.productionBatch.findMany({ take: 10 });

    // 1. MENU ITEMS & INGREDIENTS
    console.log('📝 Seeding Menu Items & Ingredients...');
    
    for (const menu of menus) {
      // Create menu items for each menu
      const menuItems = await Promise.all([
        prisma.menuItem.create({
          data: {
            name: `${menu.name} - Nasi`,
            description: `Nasi putih sebagai makanan pokok untuk ${menu.name}`,
            category: 'RICE',
            servingSize: 100,
            menuId: menu.id
          }
        }),
        prisma.menuItem.create({
          data: {
            name: `${menu.name} - Lauk Protein`,
            description: `Sumber protein untuk ${menu.name}`,
            category: 'MAIN_DISH',
            servingSize: 75,
            menuId: menu.id
          }
        }),
        prisma.menuItem.create({
          data: {
            name: `${menu.name} - Sayuran`,
            description: `Sayuran bergizi untuk ${menu.name}`,
            category: 'VEGETABLE',
            servingSize: 50,
            menuId: menu.id
          }
        })
      ]);

      // Create menu item ingredients
      for (const menuItem of menuItems) {
        const ingredients = await prisma.rawMaterial.findMany({ take: 2 });
        for (const ingredient of ingredients) {
          await prisma.menuItemIngredient.create({
            data: {
              menuItemId: menuItem.id,
              rawMaterialId: ingredient.id,
              quantity: Math.floor(Math.random() * 50) + 10
            }
          });
        }
      }
    }

    // 2. DELIVERY RECORDS
    console.log('🚚 Seeding Delivery Records...');
    
    for (const distribution of distributions) {
      await prisma.delivery.create({
        data: {
          distributionId: distribution.id,
          schoolId: schools[Math.floor(Math.random() * schools.length)].id,
          driverId: drivers[Math.floor(Math.random() * drivers.length)].id,
          vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)].id,
          deliveryOrder: Math.floor(Math.random() * 10) + 1,
          plannedTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
          departureTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          arrivalTime: new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000),
          portionsDelivered: Math.floor(Math.random() * 500) + 100,
          status: (['DELIVERED', 'IN_TRANSIT', 'PENDING'] as const)[Math.floor(Math.random() * 3)],
          notes: `Pengiriman ${distribution.id} berhasil dilakukan`
        }
      });
    }

    // 3. WASTE RECORDS
    console.log('♻️ Seeding Waste Records...');
    
    for (let i = 0; i < 10; i++) {
      await prisma.wasteRecord.create({
        data: {
          recordDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          wasteType: (['ORGANIC', 'INORGANIC', 'PACKAGING'] as const)[Math.floor(Math.random() * 3)],
          source: (['PREPARATION', 'PRODUCTION', 'PACKAGING', 'SCHOOL_LEFTOVER'] as const)[Math.floor(Math.random() * 4)],
          weight: Math.floor(Math.random() * 50) + 5,
          schoolId: schools[Math.floor(Math.random() * schools.length)].id,
          notes: `Catatan pengelolaan limbah untuk record ${i + 1}`
        }
      });
    }

    // 4. FEEDBACK RECORDS
    console.log('💬 Seeding Feedback Records...');
    
    const feedbackTypes = ['FOOD_QUALITY', 'DELIVERY_SERVICE', 'PORTION_SIZE', 'VARIETY', 'GENERAL'] as const;
    const feedbackSources = ['STUDENT', 'TEACHER', 'PARENT', 'SCHOOL_ADMIN'] as const;
    const ratings = [3, 4, 5]; // Good ratings for demo
    
    for (let i = 0; i < 15; i++) {
      await prisma.feedback.create({
        data: {
          schoolId: schools[Math.floor(Math.random() * schools.length)].id,
          type: feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)],
          source: feedbackSources[Math.floor(Math.random() * feedbackSources.length)],
          rating: ratings[Math.floor(Math.random() * ratings.length)],
          message: `Feedback detail mengenai program makanan bergizi. Secara keseluruhan program sudah berjalan dengan baik dan anak-anak menyukai menu yang disediakan.`,
          status: (['OPEN', 'IN_PROGRESS', 'RESOLVED'] as const)[Math.floor(Math.random() * 3)],
          response: Math.random() > 0.5 ? 'Terima kasih atas feedback yang diberikan. Kami akan terus meningkatkan kualitas layanan.' : null,
          respondedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000) : null
        }
      });
    }

    // 5. NOTIFICATIONS
    console.log('🔔 Seeding Notifications...');
    
    const notificationTypes = ['SYSTEM', 'PRODUCTION', 'DISTRIBUTION', 'QUALITY_ALERT', 'INVENTORY_LOW'] as const;
    const priorities = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'] as const;
    
    for (let i = 0; i < 20; i++) {
      await prisma.notification.create({
        data: {
          userId: users[Math.floor(Math.random() * users.length)].id,
          type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          title: `Notifikasi ${i + 1}`,
          message: `Pesan notifikasi sistem mengenai status operasional program makanan bergizi.`,
          isRead: Math.random() > 0.3,
          actionUrl: Math.random() > 0.5 ? '/dashboard/monitoring' : null
        }
      });
    }

    // 6. AUDIT LOGS
    console.log('📋 Seeding Audit Logs...');
    
    const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT'];
    const entities = ['User', 'Menu', 'ProductionBatch', 'Distribution', 'QualityCheck'];
    
    for (let i = 0; i < 50; i++) {
      await prisma.auditLog.create({
        data: {
          userId: users[Math.floor(Math.random() * users.length)].id,
          action: actions[Math.floor(Math.random() * actions.length)],
          entity: entities[Math.floor(Math.random() * entities.length)],
          entityId: `entity_${Math.floor(Math.random() * 1000)}`,
          oldValues: Math.random() > 0.5 ? { status: 'old_value' } : undefined,
          newValues: { status: 'new_value', updatedBy: 'system' },
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });
    }

    // 7. SYSTEM CONFIG
    console.log('⚙️ Seeding System Configuration...');
    
    const systemConfigs = [
      {
        key: 'app.name',
        value: 'SPPG - Sistem Pengelolaan Program Gizi',
        description: 'Nama aplikasi sistem',
        dataType: 'string'
      },
      {
        key: 'app.version',
        value: '1.0.0',
        description: 'Versi aplikasi saat ini',
        dataType: 'string'
      },
      {
        key: 'notification.email.enabled',
        value: 'true',
        description: 'Mengaktifkan notifikasi email',
        dataType: 'boolean'
      },
      {
        key: 'production.max_batch_size',
        value: '1000',
        description: 'Maksimal ukuran batch produksi (porsi)',
        dataType: 'number'
      },
      {
        key: 'quality.min_score',
        value: '80',
        description: 'Minimum skor kualitas yang diterima',
        dataType: 'number'
      },
      {
        key: 'distribution.max_radius',
        value: '50',
        description: 'Maksimal radius distribusi (km)',
        dataType: 'number'
      },
      {
        key: 'financial.currency',
        value: 'IDR',
        description: 'Mata uang sistem',
        dataType: 'string'
      },
      {
        key: 'backup.retention_days',
        value: '30',
        description: 'Lama penyimpanan backup (hari)',
        dataType: 'number'
      }
    ];

    for (const config of systemConfigs) {
      await prisma.systemConfig.create({
        data: config
      });
    }

    console.log('\n✅ Successfully seeded all remaining tables!');
    console.log('📊 Summary of seeded data:');
    console.log(`   📝 Menu Items: ${menus.length * 3} items`);
    console.log(`   🔗 Menu Item Ingredients: ${menus.length * 6} relationships`);
    console.log(`   🚚 Deliveries: ${distributions.length} records`);
    console.log(`   ♻️  Waste Records: 10 records`);
    console.log(`   💬 Feedback: 15 records`);
    console.log(`   🔔 Notifications: 20 records`);
    console.log(`   📋 Audit Logs: 50 records`);
    console.log(`   ⚙️  System Configs: 8 configurations`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRemainingTables();
