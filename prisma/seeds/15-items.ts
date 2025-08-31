import { PrismaClient, ItemCategory, ItemUnit } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedItems() {
  console.log('📦 Seeding items...')

  // Get suppliers for FK relationships
  const suppliers = await prisma.supplier.findMany()
  
  if (suppliers.length === 0) {
    console.log('⚠️  No suppliers found. Please seed suppliers first.')
    return
  }

  const items = [
    // Staple Foods
    {
      name: 'Beras Premium',
      description: 'Beras premium kualitas terbaik untuk nasi putih',
      category: ItemCategory.STAPLE_FOOD,
      unit: ItemUnit.KG,
      unitPrice: 15000,
      nutritionPer100g: {
        calories: 365,
        protein: 7.1,
        fat: 0.7,
        carbohydrates: 80.4,
        fiber: 1.3,
        sodium: 5
      },
      allergens: [],
      shelfLife: 365, // 1 year
      storageRequirement: 'Simpan di tempat kering, hindari sinar matahari langsung',
      supplierId: suppliers[0].id,
      isActive: true
    },
    {
      name: 'Mie Instan Sehat',
      description: 'Mie instan dengan fortifikasi vitamin dan mineral',
      category: ItemCategory.STAPLE_FOOD,
      unit: ItemUnit.PACK,
      unitPrice: 3500,
      nutritionPer100g: {
        calories: 450,
        protein: 9.4,
        fat: 18.0,
        carbohydrates: 65.2,
        fiber: 3.2,
        sodium: 1800
      },
      allergens: ['gluten', 'msg'],
      shelfLife: 720, // 2 years
      storageRequirement: 'Simpan di tempat kering dan sejuk',
      supplierId: suppliers[1].id,
      isActive: true
    },

    // Proteins
    {
      name: 'Daging Ayam Fillet',
      description: 'Daging ayam fillet segar tanpa tulang',
      category: ItemCategory.PROTEIN,
      unit: ItemUnit.KG,
      unitPrice: 32000,
      nutritionPer100g: {
        calories: 165,
        protein: 31.0,
        fat: 3.6,
        carbohydrates: 0,
        fiber: 0,
        sodium: 74
      },
      allergens: [],
      shelfLife: 3, // 3 days fresh
      storageRequirement: 'Simpan dalam freezer -18°C',
      supplierId: suppliers[2].id,
      isActive: true
    },
    {
      name: 'Ikan Lele Segar',
      description: 'Ikan lele segar kualitas premium',
      category: ItemCategory.PROTEIN,
      unit: ItemUnit.KG,
      unitPrice: 18000,
      nutritionPer100g: {
        calories: 105,
        protein: 18.7,
        fat: 2.7,
        carbohydrates: 0,
        fiber: 0,
        sodium: 59
      },
      allergens: ['fish'],
      shelfLife: 2, // 2 days fresh
      storageRequirement: 'Simpan dalam chiller 0-4°C',
      supplierId: suppliers[3].id,
      isActive: true
    },
    {
      name: 'Telur Ayam Grade A',
      description: 'Telur ayam segar grade A ukuran sedang',
      category: ItemCategory.PROTEIN,
      unit: ItemUnit.KG,
      unitPrice: 25000,
      nutritionPer100g: {
        calories: 155,
        protein: 13.0,
        fat: 11.0,
        carbohydrates: 1.1,
        fiber: 0,
        sodium: 124
      },
      allergens: ['egg'],
      shelfLife: 21, // 3 weeks
      storageRequirement: 'Simpan dalam chiller 0-4°C',
      supplierId: suppliers[4].id,
      isActive: true
    },

    // Vegetables
    {
      name: 'Bayam Hijau Segar',
      description: 'Sayur bayam hijau segar organik',
      category: ItemCategory.VEGETABLES,
      unit: ItemUnit.KG,
      unitPrice: 8000,
      nutritionPer100g: {
        calories: 23,
        protein: 2.9,
        fat: 0.4,
        carbohydrates: 3.6,
        fiber: 2.2,
        sodium: 79
      },
      allergens: [],
      shelfLife: 3, // 3 days fresh
      storageRequirement: 'Simpan dalam chiller 0-4°C, cuci sebelum digunakan',
      supplierId: suppliers[5].id,
      isActive: true
    },
    {
      name: 'Wortel Baby',
      description: 'Wortel baby segar ukuran kecil',
      category: ItemCategory.VEGETABLES,
      unit: ItemUnit.KG,
      unitPrice: 12000,
      nutritionPer100g: {
        calories: 41,
        protein: 0.9,
        fat: 0.2,
        carbohydrates: 9.6,
        fiber: 2.8,
        sodium: 69
      },
      allergens: [],
      shelfLife: 14, // 2 weeks
      storageRequirement: 'Simpan dalam chiller 0-4°C',
      supplierId: suppliers[5].id,
      isActive: true
    },

    // Cooking essentials
    {
      name: 'Minyak Kelapa Sawit',
      description: 'Minyak goreng kelapa sawit untuk memasak',
      category: ItemCategory.COOKING_OIL,
      unit: ItemUnit.LITER,
      unitPrice: 16000,
      nutritionPer100g: {
        calories: 884,
        protein: 0,
        fat: 100,
        carbohydrates: 0,
        fiber: 0,
        sodium: 0
      },
      allergens: [],
      shelfLife: 720, // 2 years
      storageRequirement: 'Simpan di tempat sejuk dan kering',
      supplierId: suppliers[6].id,
      isActive: true
    },
    {
      name: 'Garam Dapur Yodium',
      description: 'Garam dapur beryodium untuk kesehatan',
      category: ItemCategory.SPICES_SEASONING,
      unit: ItemUnit.KG,
      unitPrice: 5000,
      nutritionPer100g: {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        fiber: 0,
        sodium: 38758
      },
      allergens: [],
      shelfLife: 1095, // 3 years
      storageRequirement: 'Simpan dalam wadah kedap udara',
      supplierId: suppliers[7].id,
      isActive: true
    },

    // Beverages
    {
      name: 'Susu UHT Plain',
      description: 'Susu UHT plain untuk minuman sehat',
      category: ItemCategory.BEVERAGES,
      unit: ItemUnit.LITER,
      unitPrice: 18000,
      nutritionPer100g: {
        calories: 42,
        protein: 3.4,
        fat: 1.0,
        carbohydrates: 4.8,
        fiber: 0,
        sodium: 44
      },
      allergens: ['milk', 'lactose'],
      shelfLife: 180, // 6 months
      storageRequirement: 'Simpan pada suhu ruang, hindari sinar matahari langsung',
      supplierId: suppliers[8].id,
      isActive: true
    },

    // Fruits
    {
      name: 'Pisang Cavendish',
      description: 'Pisang cavendish manis dan bergizi',
      category: ItemCategory.FRUITS,
      unit: ItemUnit.KG,
      unitPrice: 15000,
      nutritionPer100g: {
        calories: 89,
        protein: 1.1,
        fat: 0.3,
        carbohydrates: 22.8,
        fiber: 2.6,
        sodium: 1
      },
      allergens: [],
      shelfLife: 7, // 1 week
      storageRequirement: 'Simpan pada suhu ruang, jauhkan dari sinar matahari',
      supplierId: suppliers[9].id,
      isActive: true
    },
    {
      name: 'Jeruk Pontianak',
      description: 'Jeruk pontianak manis kaya vitamin C',
      category: ItemCategory.FRUITS,
      unit: ItemUnit.KG,
      unitPrice: 20000,
      nutritionPer100g: {
        calories: 47,
        protein: 0.9,
        fat: 0.1,
        carbohydrates: 11.8,
        fiber: 2.4,
        sodium: 0
      },
      allergens: [],
      shelfLife: 14, // 2 weeks
      storageRequirement: 'Simpan dalam chiller 0-4°C untuk kesegaran optimal',
      supplierId: suppliers[9].id,
      isActive: true
    }
  ]

  for (const itemData of items) {
    const existingItem = await prisma.item.findFirst({
      where: { name: itemData.name }
    })
    
    if (existingItem) {
      await prisma.item.update({
        where: { id: existingItem.id },
        data: itemData
      })
    } else {
      await prisma.item.create({
        data: itemData
      })
    }
  }

  const itemCount = await prisma.item.count()
  console.log(`✅ Items seeded: ${itemCount} items across multiple categories`)
}
