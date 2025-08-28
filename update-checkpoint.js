const { PrismaClient } = require('./src/generated/prisma')

const prisma = new PrismaClient()

async function updateCheckpointWithProductionPlan() {
  try {
    // First, let's see what production plans exist
    const productionPlans = await prisma.productionPlan.findMany({
      include: {
        menu: true
      }
    })
    
    console.log('Available Production Plans:')
    productionPlans.forEach(plan => {
      console.log(`- ID: ${plan.id}, Menu: ${plan.menu.name}, Date: ${plan.planDate}`)
    })
    
    // Use the first available production plan for qc-3
    if (productionPlans.length > 0) {
      const updated = await prisma.qualityCheckpoint.update({
        where: { id: 'qc-3' },
        data: {
          productionPlanId: productionPlans[0].id
        }
      })
      
      console.log(`Updated qc-3 with productionPlanId: ${productionPlans[0].id}`)
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCheckpointWithProductionPlan()
