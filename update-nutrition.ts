import { PrismaClient, ItemCategory, ItemUnit } from "./src/generated/prisma"

const prisma = new PrismaClient()

async function updateNutritionalData() {
  console.log("🥗 Updating and adding nutritional data for items...")

  // First, update existing items
  const existingUpdates = [
    {
      name: 'Beras Premium',
      nutritionPer100g: {
        calories: 365,
        protein: 7.1,
        fat: 0.7,
        carbohydrates: 80.4,
        fiber: 0.4,
        calcium: 6,
        iron: 0.8,
        vitaminA: 0,
        vitaminC: 0
      }
    },
    {
      name: 'Ayam Fillet',
      nutritionPer100g: {
        calories: 239,
        protein: 27.3,
        fat: 13.6,
        carbohydrates: 0,
        fiber: 0,
        calcium: 15,
        iron: 1.3,
        vitaminA: 16,
        vitaminC: 0
      }
    },
    {
      name: 'Wortel',
      nutritionPer100g: {
        calories: 41,
        protein: 0.9,
        fat: 0.2,
        carbohydrates: 9.6,
        fiber: 2.8,
        calcium: 33,
        iron: 0.3,
        vitaminA: 835,
        vitaminC: 5.9
      }
    }
  ]

  // Update existing items
  for (const update of existingUpdates) {
    const item = await prisma.item.findFirst({
      where: { 
        name: { contains: update.name, mode: 'insensitive' }
      }
    })

    if (item) {
      await prisma.item.update({
        where: { id: item.id },
        data: {
          nutritionPer100g: update.nutritionPer100g
        }
      })
      console.log(`✅ Updated nutritional data for: ${item.name}`)
    }
  }

  // Add missing items that are referenced in recipes
  const suppliers = await prisma.supplier.findMany()
  const supplier = suppliers[0] // Use first available supplier

  const newItems = [
    {
      id: 'item-beef',
      name: 'Daging Sapi Segar',
      category: ItemCategory.PROTEIN,
      unit: ItemUnit.KG,
      unitPrice: 120000,
      nutritionPer100g: {
        calories: 207,
        protein: 26.1,
        fat: 11.0,
        carbohydrates: 0,
        fiber: 0,
        calcium: 11,
        iron: 2.9,
        vitaminA: 0,
        vitaminC: 0
      }
    },
    {
      id: 'item-fish',
      name: 'Ikan Nila Segar',
      category: ItemCategory.PROTEIN,
      unit: ItemUnit.KG, 
      unitPrice: 35000,
      nutritionPer100g: {
        calories: 112,
        protein: 20.1,
        fat: 2.7,
        carbohydrates: 0,
        fiber: 0,
        calcium: 20,
        iron: 0.5,
        vitaminA: 20,
        vitaminC: 0
      }
    },
    {
      id: 'item-tofu',
      name: 'Tahu Putih',
      category: ItemCategory.PROTEIN,
      unit: ItemUnit.KG,
      unitPrice: 12000,
      nutritionPer100g: {
        calories: 70,
        protein: 8.1,
        fat: 4.2,
        carbohydrates: 1.6,
        fiber: 0.4,
        calcium: 124,
        iron: 0.7,
        vitaminA: 0,
        vitaminC: 0
      }
    },
    {
      id: 'item-tempe',
      name: 'Tempe Kedelai',
      category: ItemCategory.PROTEIN,
      unit: ItemUnit.KG,
      unitPrice: 15000,
      nutritionPer100g: {
        calories: 193,
        protein: 20.8,
        fat: 8.8,
        carbohydrates: 9.4,
        fiber: 1.4,
        calcium: 155,
        iron: 4.0,
        vitaminA: 0,
        vitaminC: 0
      }
    },
    {
      id: 'item-spinach',
      name: 'Bayam Hijau',
      category: ItemCategory.VEGETABLES,
      unit: ItemUnit.KG,
      unitPrice: 8000,
      nutritionPer100g: {
        calories: 23,
        protein: 2.9,
        fat: 0.4,
        carbohydrates: 3.6,
        fiber: 2.2,
        calcium: 99,
        iron: 2.7,
        vitaminA: 469,
        vitaminC: 28.1
      }
    },
    {
      id: 'item-kangkung',
      name: 'Kangkung Segar',
      category: ItemCategory.VEGETABLES,
      unit: ItemUnit.KG,
      unitPrice: 6000,
      nutritionPer100g: {
        calories: 19,
        protein: 3.0,
        fat: 0.2,
        carbohydrates: 3.1,
        fiber: 2.5,
        calcium: 67,
        iron: 2.3,
        vitaminA: 315,
        vitaminC: 55
      }
    },
    {
      id: 'item-cabbage',
      name: 'Kol/Kubis',
      category: ItemCategory.VEGETABLES,
      unit: ItemUnit.KG,
      unitPrice: 7000,
      nutritionPer100g: {
        calories: 25,
        protein: 1.3,
        fat: 0.1,
        carbohydrates: 5.8,
        fiber: 2.5,
        calcium: 40,
        iron: 0.5,
        vitaminA: 13,
        vitaminC: 36.6
      }
    },
    {
      id: 'item-potato',
      name: 'Kentang',
      category: ItemCategory.STAPLE_FOOD,
      unit: ItemUnit.KG,
      unitPrice: 18000,
      nutritionPer100g: {
        calories: 77,
        protein: 2.0,
        fat: 0.1,
        carbohydrates: 17.5,
        fiber: 2.2,
        calcium: 12,
        iron: 0.8,
        vitaminA: 2,
        vitaminC: 19.7
      }
    },
    {
      id: 'item-egg',
      name: 'Telur Ayam',
      category: ItemCategory.PROTEIN,
      unit: ItemUnit.PCS,
      unitPrice: 2500,
      nutritionPer100g: {
        calories: 155,
        protein: 13.0,
        fat: 11.0,
        carbohydrates: 1.1,
        fiber: 0,
        calcium: 56,
        iron: 1.8,
        vitaminA: 140,
        vitaminC: 0
      }
    }
  ]

  // Create new items
  for (const newItem of newItems) {
    await prisma.item.upsert({
      where: { id: newItem.id },
      update: {},
      create: {
        id: newItem.id,
        name: newItem.name,
        category: newItem.category,
        unit: newItem.unit,
        unitPrice: newItem.unitPrice,
        nutritionPer100g: newItem.nutritionPer100g,
        isActive: true,
        supplierId: supplier?.id || 'supplier-1'
      }
    })
    console.log(`✅ Created item: ${newItem.name}`)
  }

  console.log("🎉 Items and nutritional data update completed!")
}

updateNutritionalData()
  .catch((e) => {
    console.error("❌ Error updating nutritional data:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
