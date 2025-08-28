import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function updateIngredientPrices() {
  try {
    console.log('🔄 Updating ingredient prices...');

    // Get all items with null or zero prices
    const items = await prisma.item.findMany({
      where: {
        OR: [
          { unitPrice: null },
          { unitPrice: 0 }
        ]
      }
    });

    console.log(`📊 Found ${items.length} items with missing prices`);

    for (const item of items) {
      let unitPrice = 0;
      const itemName = item.name.toLowerCase();
      
      // Set realistic prices based on item category and name
      if (itemName.includes('beras') || itemName.includes('rice')) {
        unitPrice = 12000; // IDR per kg
      } else if (itemName.includes('ayam') || itemName.includes('chicken') || itemName.includes('daging')) {
        unitPrice = 35000; // IDR per kg
      } else if (itemName.includes('sayur') || itemName.includes('vegetable') || itemName.includes('wortel') || itemName.includes('kubis') || itemName.includes('bayam')) {
        unitPrice = 8000; // IDR per kg
      } else if (itemName.includes('minyak') || itemName.includes('oil')) {
        unitPrice = 25000; // IDR per liter
      } else if (itemName.includes('garam') || itemName.includes('salt')) {
        unitPrice = 5000; // IDR per kg
      } else if (itemName.includes('gula') || itemName.includes('sugar')) {
        unitPrice = 15000; // IDR per kg
      } else if (itemName.includes('bawang') || itemName.includes('onion')) {
        unitPrice = 20000; // IDR per kg
      } else if (itemName.includes('bumbu') || itemName.includes('spice') || itemName.includes('merica') || itemName.includes('kemiri')) {
        unitPrice = 30000; // IDR per kg
      } else if (itemName.includes('tepung') || itemName.includes('flour')) {
        unitPrice = 10000; // IDR per kg
      } else if (itemName.includes('susu') || itemName.includes('milk')) {
        unitPrice = 18000; // IDR per liter
      } else if (itemName.includes('telur') || itemName.includes('egg')) {
        unitPrice = 28000; // IDR per kg
      } else if (itemName.includes('ikan') || itemName.includes('fish')) {
        unitPrice = 40000; // IDR per kg
      } else if (itemName.includes('tomat') || itemName.includes('tomato')) {
        unitPrice = 12000; // IDR per kg
      } else if (itemName.includes('kacang') || itemName.includes('bean')) {
        unitPrice = 15000; // IDR per kg
      } else {
        unitPrice = 10000; // Default price
      }

      await prisma.item.update({
        where: { id: item.id },
        data: { unitPrice }
      });

      console.log(`  ✅ Updated ${item.name}: ${unitPrice.toLocaleString('id-ID')} IDR per ${item.unit}`);
    }

    console.log('🎉 All ingredient prices updated successfully!');

  } catch (error) {
    console.error('❌ Error updating ingredient prices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateIngredientPrices();
