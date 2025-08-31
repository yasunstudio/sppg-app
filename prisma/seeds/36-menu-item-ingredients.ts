import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedMenuItemIngredients() {
  console.log('🥘 Seeding menu item ingredients...')
  
  // Get menu items and raw materials for reference
  const menuItems = await prisma.menuItem.findMany({
    select: { id: true, name: true }
  })

  const rawMaterials = await prisma.rawMaterial.findMany({
    select: { id: true, name: true, unit: true }
  })

  if (menuItems.length === 0 || rawMaterials.length === 0) {
    console.log('⚠️ No menu items or raw materials found, skipping menu item ingredients seeding')
    return
  }

  const menuItemIngredients = [
    // Nasi Gudeg Ayam
    {
      id: 'mii-gudeg-1',
      menuItemId: menuItems.find(m => m.name.includes('Gudeg'))?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Beras'))?.id || rawMaterials[0].id,
      quantity: 150
    },
    {
      id: 'mii-gudeg-2',
      menuItemId: menuItems.find(m => m.name.includes('Gudeg'))?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Ayam'))?.id || rawMaterials[1]?.id || rawMaterials[0].id,
      quantity: 100
    },
    {
      id: 'mii-gudeg-3',
      menuItemId: menuItems.find(m => m.name.includes('Gudeg'))?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Wortel'))?.id || rawMaterials[2]?.id || rawMaterials[0].id,
      quantity: 80
    },

    // Soto Ayam
    {
      id: 'mii-soto-1',
      menuItemId: menuItems.find(m => m.name.includes('Soto'))?.id || menuItems[1]?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Beras'))?.id || rawMaterials[0].id,
      quantity: 120
    },
    {
      id: 'mii-soto-2',
      menuItemId: menuItems.find(m => m.name.includes('Soto'))?.id || menuItems[1]?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Ayam'))?.id || rawMaterials[1]?.id || rawMaterials[0].id,
      quantity: 120
    },
    {
      id: 'mii-soto-3',
      menuItemId: menuItems.find(m => m.name.includes('Soto'))?.id || menuItems[1]?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Tahu'))?.id || rawMaterials[3]?.id || rawMaterials[0].id,
      quantity: 50
    },

    // Gado-Gado
    {
      id: 'mii-gado-1',
      menuItemId: menuItems.find(m => m.name.includes('Gado'))?.id || menuItems[2]?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Bayam'))?.id || rawMaterials[4]?.id || rawMaterials[0].id,
      quantity: 100
    },
    {
      id: 'mii-gado-2',
      menuItemId: menuItems.find(m => m.name.includes('Gado'))?.id || menuItems[2]?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Tahu'))?.id || rawMaterials[3]?.id || rawMaterials[0].id,
      quantity: 75
    },
    {
      id: 'mii-gado-3',
      menuItemId: menuItems.find(m => m.name.includes('Gado'))?.id || menuItems[2]?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Telur'))?.id || rawMaterials[5]?.id || rawMaterials[0].id,
      quantity: 1
    },

    // Nasi Liwet
    {
      id: 'mii-liwet-1',
      menuItemId: menuItems.find(m => m.name.includes('Liwet'))?.id || menuItems[3]?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Beras'))?.id || rawMaterials[0].id,
      quantity: 160
    },
    {
      id: 'mii-liwet-2',
      menuItemId: menuItems.find(m => m.name.includes('Liwet'))?.id || menuItems[3]?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Ayam'))?.id || rawMaterials[1]?.id || rawMaterials[0].id,
      quantity: 90
    },
    {
      id: 'mii-liwet-3',
      menuItemId: menuItems.find(m => m.name.includes('Liwet'))?.id || menuItems[3]?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Wortel'))?.id || rawMaterials[6]?.id || rawMaterials[0].id,
      quantity: 60
    },

    // Additional ingredients for variety
    {
      id: 'mii-nasi-1',
      menuItemId: menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Beras'))?.id || rawMaterials[0].id,
      quantity: 140
    },
    {
      id: 'mii-nasi-2',
      menuItemId: menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Tempe'))?.id || rawMaterials[7]?.id || rawMaterials[0].id,
      quantity: 80
    },
    
    {
      id: 'mii-sup-1',
      menuItemId: menuItems[1]?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Kentang'))?.id || rawMaterials[8]?.id || rawMaterials[0].id,
      quantity: 120
    },
    {
      id: 'mii-sup-2',
      menuItemId: menuItems[1]?.id || menuItems[0].id,
      rawMaterialId: rawMaterials.find(r => r.name.includes('Wortel'))?.id || rawMaterials[9]?.id || rawMaterials[0].id,
      quantity: 90
    }
  ]

  for (const ingredient of menuItemIngredients) {
    const { id, ...ingredientData } = ingredient
    await prisma.menuItemIngredient.upsert({
      where: { 
        menuItemId_rawMaterialId: {
          menuItemId: ingredient.menuItemId,
          rawMaterialId: ingredient.rawMaterialId
        }
      },
      update: { quantity: ingredient.quantity },
      create: ingredientData
    })
  }

  console.log(`✅ Created ${menuItemIngredients.length} menu item ingredients`)
}

export default seedMenuItemIngredients
