import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function checkBatchData() {
  try {
    console.log('🔍 Checking batch-1 data...');

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

    console.log('📊 Batch Data:');
    console.log(`  - ID: ${batch.id}`);
    console.log(`  - Status: ${batch.status}`);
    console.log(`  - Planned Quantity: ${batch.plannedQuantity}`);
    console.log(`  - Actual Quantity: ${batch.actualQuantity}`);
    console.log(`  - Started At: ${batch.startedAt}`);
    console.log(`  - Completed At: ${batch.completedAt}`);
    console.log(`  - Quality Score: ${batch.qualityScore}`);

    if (batch.recipe) {
      console.log('\n🥘 Recipe Data:');
      console.log(`  - Recipe: ${batch.recipe.name}`);
      console.log(`  - Serving Size: ${batch.recipe.servingSize}`);
      console.log(`  - Prep Time: ${batch.recipe.prepTime} min`);
      console.log(`  - Cook Time: ${batch.recipe.cookTime} min`);
      
      if (batch.recipe.ingredients.length > 0) {
        console.log('\n🥕 Ingredients:');
        for (const ingredient of batch.recipe.ingredients) {
          console.log(`  - ${ingredient.item?.name || 'Unknown'}: ${ingredient.quantity} ${ingredient.unit} @ ${ingredient.item?.unitPrice || 0} IDR/${ingredient.item?.unit || 'unit'}`);
        }
      } else {
        console.log('  ❌ No ingredients found for this recipe');
      }
    } else {
      console.log('❌ No recipe found for this batch');
    }

    // Calculate what the metrics should be
    if (batch.actualQuantity && batch.plannedQuantity) {
      const efficiency = (batch.actualQuantity / batch.plannedQuantity) * 100;
      console.log(`\n📈 Calculated Efficiency: ${efficiency.toFixed(1)}%`);
    }

    if (batch.startedAt && batch.completedAt) {
      const duration = Math.round((new Date(batch.completedAt).getTime() - new Date(batch.startedAt).getTime()) / (1000 * 60));
      console.log(`⏱️ Duration: ${duration} minutes`);
      
      if (batch.recipe) {
        const expectedDuration = batch.recipe.prepTime + batch.recipe.cookTime;
        const isOnTime = duration <= expectedDuration;
        console.log(`⏰ Expected Duration: ${expectedDuration} min, On Time: ${isOnTime}`);
      }
    }

    if (batch.recipe && batch.recipe.ingredients.length > 0) {
      const scalingFactor = batch.plannedQuantity / batch.recipe.servingSize;
      let totalCost = 0;
      
      console.log(`\n💰 Cost Calculation (Scaling Factor: ${scalingFactor.toFixed(2)}):`);
      for (const ingredient of batch.recipe.ingredients) {
        const scaledQuantity = ingredient.quantity * scalingFactor;
        const unitPrice = ingredient.item?.unitPrice || 0;
        const cost = unitPrice * scaledQuantity;
        totalCost += cost;
        console.log(`  - ${ingredient.item?.name}: ${scaledQuantity.toFixed(2)} ${ingredient.unit} × ${unitPrice} = ${cost.toLocaleString('id-ID')} IDR`);
      }
      
      const costPerPortion = totalCost / batch.plannedQuantity;
      console.log(`\n💵 Total Estimated Cost: ${totalCost.toLocaleString('id-ID')} IDR`);
      console.log(`💵 Cost per Portion: ${costPerPortion.toLocaleString('id-ID')} IDR`);
    }

  } catch (error) {
    console.error('❌ Error checking batch data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBatchData();
