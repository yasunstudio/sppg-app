import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedResourceUsage() {
  console.log('⚙️ Seeding resource usage...')
  
  // Get production batches and resources for reference
  const productionBatches = await prisma.productionBatch.findMany({
    select: { id: true, batchNumber: true },
    take: 10
  })

  const resources = await prisma.productionResource.findMany({
    select: { id: true, name: true, type: true }
  })

  if (productionBatches.length === 0 || resources.length === 0) {
    console.log('⚠️ No production batches or resources found, skipping resource usage seeding')
    return
  }

  const resourceUsages = []

  // Generate resource usage for August 2025 production
  for (let day = 1; day <= 31; day++) {
    const usageDate = new Date(2025, 7, day) // August 2025
    
    // Skip Sundays (day 0) and Saturdays (day 6) - weekend
    if (usageDate.getDay() === 0 || usageDate.getDay() === 6) continue

    // Generate 3-5 resource usages per production day
    const usageCount = Math.floor(Math.random() * 3) + 3
    
    for (let i = 0; i < usageCount; i++) {
      const batch = productionBatches[Math.floor(Math.random() * productionBatches.length)]
      const resource = resources[Math.floor(Math.random() * resources.length)]
      
      // Calculate usage based on resource type
      let plannedMinutes: number
      let actualMinutes: number
      let efficiency: number
      
      switch (resource.type) {
        case 'EQUIPMENT':
          plannedMinutes = Math.floor(Math.random() * 240) + 120 // 2-6 hours
          actualMinutes = plannedMinutes + Math.floor(Math.random() * 60) - 30 // ±30 minutes
          efficiency = 85 + Math.random() * 10 // 85-95%
          break
        case 'VEHICLE':
          plannedMinutes = Math.floor(Math.random() * 180) + 60 // 1-4 hours
          actualMinutes = plannedMinutes + Math.floor(Math.random() * 40) - 20 // ±20 minutes
          efficiency = 80 + Math.random() * 15 // 80-95%
          break
        case 'STORAGE':
          plannedMinutes = Math.floor(Math.random() * 120) + 30 // 30 minutes - 2.5 hours
          actualMinutes = plannedMinutes + Math.floor(Math.random() * 20) - 10 // ±10 minutes
          efficiency = 90 + Math.random() * 8 // 90-98%
          break
        case 'KITCHEN_AREA':
          plannedMinutes = Math.floor(Math.random() * 300) + 180 // 3-8 hours
          actualMinutes = plannedMinutes + Math.floor(Math.random() * 60) - 30 // ±30 minutes
          efficiency = 88 + Math.random() * 10 // 88-98%
          break
        default: // STAFF
          plannedMinutes = Math.floor(Math.random() * 480) + 240 // 4-12 hours
          actualMinutes = plannedMinutes + Math.floor(Math.random() * 30) - 15 // ±15 minutes
          efficiency = 85 + Math.random() * 12 // 85-97%
      }

      const startTime = new Date(usageDate.getTime() + (6 + Math.random() * 2) * 60 * 60 * 1000) // 6-8 AM
      const endTime = new Date(startTime.getTime() + actualMinutes * 60 * 1000)

      resourceUsages.push({
        id: `ru-${day}-${i + 1}-${resource.id.slice(-6)}`,
        batchId: batch.id,
        resourceId: resource.id,
        startTime: startTime,
        endTime: endTime,
        plannedDuration: plannedMinutes,
        actualDuration: actualMinutes,
        efficiency: Math.round(efficiency * 100) / 100,
        notes: `Penggunaan ${resource.name} untuk produksi batch ${batch.batchNumber} tanggal ${usageDate.toLocaleDateString('id-ID')}`
      })
    }
  }

  // Add some specific resource usage scenarios
  const specificUsages = [
    {
      id: 'ru-mixer-gudeg-aug01',
      batchId: productionBatches[0].id,
      resourceId: resources.find(r => r.name.includes('Mixer'))?.id || resources[0].id,
      startTime: new Date(2025, 7, 1, 6, 0),
      endTime: new Date(2025, 7, 1, 10, 0),
      plannedDuration: 240, // 4 hours
      actualDuration: 245, // 4 hours 5 minutes
      efficiency: 92.5,
      notes: 'Penggunaan mixer untuk produksi gudeg batch pertama Agustus - efisiensi tinggi'
    },
    {
      id: 'ru-steamer-soto-aug01',
      batchId: productionBatches[1]?.id || productionBatches[0].id,
      resourceId: resources.find(r => r.name.includes('Steam'))?.id || resources[1]?.id || resources[0].id,
      startTime: new Date(2025, 7, 1, 7, 0),
      endTime: new Date(2025, 7, 1, 11, 30),
      plannedDuration: 270, // 4.5 hours
      actualDuration: 275, // 4 hours 35 minutes
      efficiency: 88.2,
      notes: 'Steam cooker untuk produksi soto ayam - perlu sedikit waktu tambahan'
    },
    {
      id: 'ru-vehicle-delivery-aug01',
      batchId: productionBatches[0].id,
      resourceId: resources.find(r => r.type === 'VEHICLE')?.id || resources[0].id,
      startTime: new Date(2025, 7, 1, 10, 0),
      endTime: new Date(2025, 7, 1, 14, 0),
      plannedDuration: 240, // 4 hours
      actualDuration: 235, // 3 hours 55 minutes
      efficiency: 85.0,
      notes: 'Kendaraan pengiriman makanan ke sekolah-sekolah - rute efisien'
    }
  ]

  // Combine all resource usages
  const allResourceUsages = [...resourceUsages, ...specificUsages]

  for (const usage of allResourceUsages) {
    await prisma.resourceUsage.upsert({
      where: { id: usage.id },
      update: usage,
      create: usage
    })
  }

  console.log(`✅ Created ${allResourceUsages.length} resource usage records`)
}

export default seedResourceUsage
