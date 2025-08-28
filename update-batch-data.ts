import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function updateBatchData() {
  try {
    console.log('🔄 Updating batch data with realistic values...');

    // First, let's check current batch data
    const batch = await prisma.productionBatch.findUnique({
      where: { id: 'batch-1' },
      include: {
        recipe: {
          include: {
            ingredients: {
              include: {
                item: true
              }
            }
          }
        }
      }
    });

    if (!batch) {
      console.log('❌ Batch batch-1 not found');
      return;
    }

    console.log('📊 Current batch data:', {
      id: batch.id,
      plannedQuantity: batch.plannedQuantity,
      actualQuantity: batch.actualQuantity,
      startedAt: batch.startedAt,
      completedAt: batch.completedAt,
      status: batch.status
    });

    // Update batch with realistic completion data
    const now = new Date();
    const startTime = new Date(now.getTime() - (2 * 60 * 60 * 1000)); // Started 2 hours ago
    const endTime = new Date(now.getTime() - (30 * 60 * 1000)); // Completed 30 minutes ago
    
    const updatedBatch = await prisma.productionBatch.update({
      where: { id: 'batch-1' },
      data: {
        status: 'COMPLETED',
        actualQuantity: Math.round(batch.plannedQuantity * 0.95), // 95% efficiency
        startedAt: startTime,
        completedAt: endTime,
        qualityScore: 85.5,
        temperatureLog: JSON.stringify([
          { time: startTime.toISOString(), temp: 65 },
          { time: new Date(startTime.getTime() + 30*60*1000).toISOString(), temp: 70 },
          { time: new Date(startTime.getTime() + 60*60*1000).toISOString(), temp: 75 },
          { time: endTime.toISOString(), temp: 72 }
        ]),
        notes: 'Produksi berjalan lancar. Suhu terkontrol dengan baik. Hasil akhir sesuai standar kualitas.'
      }
    });

    console.log('✅ Updated batch data:', {
      id: updatedBatch.id,
      plannedQuantity: updatedBatch.plannedQuantity,
      actualQuantity: updatedBatch.actualQuantity,
      status: updatedBatch.status,
      qualityScore: updatedBatch.qualityScore
    });

    // Ensure recipe has ingredients with proper unit prices
    if (batch.recipe) {
      console.log('🥘 Updating recipe ingredient prices...');
      
      // Update ingredient item prices if they are null or 0
      const ingredients = batch.recipe.ingredients;
      for (const ingredient of ingredients) {
        if (ingredient.item && (!ingredient.item.unitPrice || ingredient.item.unitPrice === 0)) {
          // Set realistic prices based on item category
          let unitPrice = 0;
          const itemName = ingredient.item.name.toLowerCase();
          
          if (itemName.includes('beras') || itemName.includes('rice')) {
            unitPrice = 12000; // IDR per kg
          } else if (itemName.includes('ayam') || itemName.includes('chicken')) {
            unitPrice = 35000; // IDR per kg
          } else if (itemName.includes('sayur') || itemName.includes('vegetable')) {
            unitPrice = 8000; // IDR per kg
          } else if (itemName.includes('minyak') || itemName.includes('oil')) {
            unitPrice = 25000; // IDR per liter
          } else if (itemName.includes('garam') || itemName.includes('salt')) {
            unitPrice = 5000; // IDR per kg
          } else if (itemName.includes('gula') || itemName.includes('sugar')) {
            unitPrice = 15000; // IDR per kg
          } else {
            unitPrice = 10000; // Default price
          }

          await prisma.item.update({
            where: { id: ingredient.item.id },
            data: { unitPrice }
          });

          console.log(`  - Updated ${ingredient.item.name}: ${unitPrice} IDR per ${ingredient.item.unit}`);
        }
      }
    }

    console.log('🎉 Batch data update completed successfully!');

  } catch (error) {
    console.error('❌ Error updating batch data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBatchData();
