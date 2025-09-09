import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function updateDriverStats() {
  console.log('📊 Updating driver statistics...')

  try {
    // Get all drivers
    const drivers = await prisma.driver.findMany()

    for (const driver of drivers) {
      // Count completed deliveries for this driver
      const completedDeliveries = await prisma.delivery.count({
        where: {
          driverId: driver.id,
          status: 'DELIVERED'
        }
      })

      // Update driver's totalDeliveries
      await prisma.driver.update({
        where: { id: driver.id },
        data: { totalDeliveries: completedDeliveries }
      })

      console.log(`🚛 Updated ${driver.name}: ${completedDeliveries} deliveries`)
    }

    console.log('✅ Driver statistics updated successfully')
  } catch (error) {
    console.error('❌ Error updating driver statistics:', error)
    throw error
  }
}

if (require.main === module) {
  updateDriverStats()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
