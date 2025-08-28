import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function checkProductionPlans() {
  try {
    console.log('🔍 Checking production plans...');

    const plans = await prisma.productionPlan.findMany({
      include: {
        batches: {
          include: {
            recipe: true
          }
        },
        menu: true
      }
    });

    console.log(`📊 Found ${plans.length} production plans:`);
    
    plans.forEach((plan, index) => {
      console.log(`\n${index + 1}. Plan ID: ${plan.id}`);
      console.log(`   - Plan Date: ${plan.planDate.toLocaleDateString()}`);
      console.log(`   - Target Portions: ${plan.targetPortions}`);
      console.log(`   - Status: ${plan.status}`);
      console.log(`   - Menu: ${plan.menu?.name || 'No menu'}`);
      console.log(`   - Batches: ${plan.batches.length}`);
    });

    // Check if plan-2 exists
    const plan2 = await prisma.productionPlan.findUnique({
      where: { id: 'plan-2' },
      include: {
        batches: true,
        menu: true
      }
    });

    if (plan2) {
      console.log('\n✅ Plan-2 exists:');
      console.log(`   - Date: ${plan2.planDate.toLocaleDateString()}`);
      console.log(`   - Target: ${plan2.targetPortions} portions`);
      console.log(`   - Status: ${plan2.status}`);
      console.log(`   - Batches: ${plan2.batches.length}`);
    } else {
      console.log('\n❌ Plan-2 does not exist');
    }

  } catch (error) {
    console.error('❌ Error checking production plans:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductionPlans();
