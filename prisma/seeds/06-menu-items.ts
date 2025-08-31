import { PrismaClient, MealType, TargetGroup, FoodCategory } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedMenus() {
  console.log('🍽️ Seeding menus for SPPG Purwakarta August 2025...')
  
  // First create base menus
  const menus = [
    {
      id: 'menu-week-1-monday',
      name: 'Menu Senin Minggu ke-1 Agustus',
      description: 'Menu sehat untuk hari Senin minggu pertama Agustus 2025',
      menuDate: new Date('2025-08-04'), // Monday first week
      mealType: MealType.LUNCH,
      targetGroup: TargetGroup.STUDENT,
      createdById: 'user-nutritionist-1',
      totalCalories: 850.0,
      isActive: true
    },
    {
      id: 'menu-week-1-tuesday', 
      name: 'Menu Selasa Minggu ke-1 Agustus',
      description: 'Menu sehat untuk hari Selasa minggu pertama Agustus 2025',
      menuDate: new Date('2025-08-05'), // Tuesday first week
      mealType: MealType.LUNCH,
      targetGroup: TargetGroup.STUDENT,
      createdById: 'user-nutritionist-1',
      totalCalories: 850.0,
      isActive: true
    },
    {
      id: 'menu-week-1-wednesday',
      name: 'Menu Rabu Minggu ke-1 Agustus',
      description: 'Menu sehat untuk hari Rabu minggu pertama Agustus 2025',
      menuDate: new Date('2025-08-06'), // Wednesday first week
      mealType: MealType.LUNCH,
      targetGroup: TargetGroup.STUDENT,
      createdById: 'user-nutritionist-1',
      totalCalories: 850.0,
      isActive: true
    },
    {
      id: 'menu-week-1-thursday',
      name: 'Menu Kamis Minggu ke-1 Agustus',
      description: 'Menu sehat untuk hari Kamis minggu pertama Agustus 2025',
      menuDate: new Date('2025-08-07'), // Thursday first week
      mealType: MealType.LUNCH,
      targetGroup: TargetGroup.STUDENT,
      createdById: 'user-nutritionist-1',
      totalCalories: 850.0,
      isActive: true
    },
    {
      id: 'menu-week-1-friday',
      name: 'Menu Jumat Minggu ke-1 Agustus',
      description: 'Menu sehat untuk hari Jumat minggu pertama Agustus 2025',
      menuDate: new Date('2025-08-08'), // Friday first week
      mealType: MealType.LUNCH,
      targetGroup: TargetGroup.STUDENT,
      createdById: 'user-nutritionist-1',
      totalCalories: 850.0,
      isActive: true
    }
  ]

  for (const menu of menus) {
    await prisma.menu.upsert({
      where: { id: menu.id },
      update: menu,
      create: menu
    })
  }

  console.log(`✅ Created ${menus.length} weekly menus`)

  // Now create menu items for each menu
  const menuItems = [
    // Monday menu items
    {
      id: 'mi-monday-nasi',
      menuId: 'menu-week-1-monday',
      name: 'Nasi Putih',
      category: FoodCategory.RICE,
      servingSize: 150.0,
      description: 'Nasi putih premium sebagai sumber karbohidrat utama'
    },
    {
      id: 'mi-monday-ayam',
      menuId: 'menu-week-1-monday',
      name: 'Ayam Bumbu Kuning',
      category: FoodCategory.MAIN_DISH,
      servingSize: 80.0,
      description: 'Potongan ayam dengan bumbu kuning khas Indonesia'
    },
    {
      id: 'mi-monday-sayur',
      menuId: 'menu-week-1-monday',
      name: 'Sayur Bayam Bening',
      category: FoodCategory.VEGETABLE,
      servingSize: 100.0,
      description: 'Sayur bayam bening dengan wortel dan jagung'
    },
    {
      id: 'mi-monday-buah',
      menuId: 'menu-week-1-monday',
      name: 'Pisang Ambon',
      category: FoodCategory.FRUIT,
      servingSize: 100.0,
      description: 'Pisang ambon segar sebagai penutup'
    },
    {
      id: 'mi-monday-minum',
      menuId: 'menu-week-1-monday',
      name: 'Air Putih',
      category: FoodCategory.BEVERAGE,
      servingSize: 200.0,
      description: 'Air putih segar untuk hidrasi'
    },

    // Tuesday menu items
    {
      id: 'mi-tuesday-nasi',
      menuId: 'menu-week-1-tuesday',
      name: 'Nasi Putih',
      category: FoodCategory.RICE,
      servingSize: 150.0,
      description: 'Nasi putih premium sebagai sumber karbohidrat utama'
    },
    {
      id: 'mi-tuesday-ikan',
      menuId: 'menu-week-1-tuesday',
      name: 'Ikan Bandeng Bumbu',
      category: FoodCategory.MAIN_DISH,
      servingSize: 80.0,
      description: 'Ikan bandeng segar dengan bumbu tradisional'
    },
    {
      id: 'mi-tuesday-sayur',
      menuId: 'menu-week-1-tuesday',
      name: 'Tumis Wortel Buncis',
      category: FoodCategory.VEGETABLE,
      servingSize: 100.0,
      description: 'Tumisan wortel dan buncis segar'
    },
    {
      id: 'mi-tuesday-buah',
      menuId: 'menu-week-1-tuesday',
      name: 'Jeruk Manis',
      category: FoodCategory.FRUIT,
      servingSize: 100.0,
      description: 'Jeruk manis segar kaya vitamin C'
    },
    {
      id: 'mi-tuesday-snack',
      menuId: 'menu-week-1-tuesday',
      name: 'Susu Coklat',
      category: FoodCategory.BEVERAGE,
      servingSize: 200.0,
      description: 'Susu coklat hangat untuk tambahan protein'
    }
  ]

  for (const menuItem of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: menuItem.id },
      update: menuItem,
      create: menuItem
    })
  }

  console.log(`✅ Created ${menuItems.length} menu items`)
}

export default seedMenus
