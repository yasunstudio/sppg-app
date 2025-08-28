import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function checkMenus() {
  try {
    console.log('🔍 Checking menus...');

    const menus = await prisma.menu.findMany({
      include: {
        menuItems: {
          include: {
            ingredients: {
              include: {
                rawMaterial: true
              }
            }
          }
        },
        productionPlans: true
      }
    });

    console.log(`📊 Found ${menus.length} menus:`);
    
    menus.forEach((menu, index) => {
      console.log(`\n${index + 1}. Menu ID: ${menu.id}`);
      console.log(`   - Name: ${menu.name}`);
      console.log(`   - Date: ${menu.menuDate?.toLocaleDateString() || 'No date'}`);
      console.log(`   - Meal Type: ${menu.mealType}`);
      console.log(`   - Items: ${menu.menuItems.length}`);
      console.log(`   - Production Plans: ${menu.productionPlans.length}`);
      console.log(`   - Status: ${menu.isActive ? 'Active' : 'Inactive'}`);
    });

    // Check if menu-1 exists
    const menu1 = await prisma.menu.findUnique({
      where: { id: 'menu-1' },
      include: {
        menuItems: {
          include: {
            ingredients: {
              include: {
                rawMaterial: true
              }
            }
          }
        },
        productionPlans: true
      }
    });

    if (menu1) {
      console.log('\n✅ Menu-1 exists:');
      console.log(`   - Name: ${menu1.name}`);
      console.log(`   - Date: ${menu1.menuDate?.toLocaleDateString()}`);
      console.log(`   - Type: ${menu1.mealType}`);
      console.log(`   - Items: ${menu1.menuItems.length}`);
    } else {
      console.log('\n❌ Menu-1 does not exist');
    }

  } catch (error) {
    console.error('❌ Error checking menus:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMenus();
