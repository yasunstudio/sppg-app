import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedResourceUsage() {
  console.log('📊 Seeding resource usage tracking...')

  // Get reference data
  const productionBatches = await prisma.productionBatch.findMany()
  const resources = await prisma.productionResource.findMany()

  if (productionBatches.length === 0 || resources.length === 0) {
    console.log('⚠️  Production batches or resources not found. Please seed them first.')
    return
  }

  // Helper functions to find resources
  const findResource = (name: string) => resources.find(r => r.name.includes(name))

  const resourceUsages = [
    // Batch 1 - Nasi Ayam Gurih (Week 1, Monday)
    {
      batchId: productionBatches[0].id,
      resourceId: findResource('Rice Cooker')?.id || resources[0].id,
      startTime: new Date('2025-08-05T05:00:00Z'),
      endTime: new Date('2025-08-05T07:30:00Z'),
      plannedDuration: 150, // 2.5 hours
      actualDuration: 150,
      efficiency: 100.0, // Perfect efficiency
      notes: 'Memasak nasi untuk 500 porsi, berjalan lancar tanpa kendala'
    },
    {
      batchId: productionBatches[0].id,
      resourceId: findResource('Kompor Gas')?.id || resources[0].id,
      startTime: new Date('2025-08-05T06:00:00Z'),
      endTime: new Date('2025-08-05T08:00:00Z'),
      plannedDuration: 120, // 2 hours
      actualDuration: 120,
      efficiency: 100.0,
      notes: 'Memasak ayam gurih untuk 500 porsi, temperature stabil'
    },
    {
      batchId: productionBatches[0].id,
      resourceId: findResource('Chef Utama')?.id || resources[3].id,
      startTime: new Date('2025-08-05T05:00:00Z'),
      endTime: new Date('2025-08-05T09:00:00Z'),
      plannedDuration: 240, // 4 hours
      actualDuration: 240,
      efficiency: 100.0,
      notes: 'Supervisi produksi batch pertama, koordinasi dengan tim berjalan baik'
    },

    // Batch 2 - Nasi Ikan Bandeng (Week 1, Tuesday)
    {
      batchId: productionBatches[1].id,
      resourceId: findResource('Rice Cooker')?.id || resources[0].id,
      startTime: new Date('2025-08-06T05:00:00Z'),
      endTime: new Date('2025-08-06T07:20:00Z'),
      plannedDuration: 140,
      actualDuration: 140,
      efficiency: 100.0,
      notes: 'Nasi untuk 480 porsi, kualitas konsisten'
    },
    {
      batchId: productionBatches[1].id,
      resourceId: findResource('Deep Fryer')?.id || resources[2].id,
      startTime: new Date('2025-08-06T06:30:00Z'),
      endTime: new Date('2025-08-06T08:30:00Z'),
      plannedDuration: 120,
      actualDuration: 125, // Slight delay
      efficiency: 96.0, // 120/125 * 100
      notes: 'Menggoreng ikan bandeng, sedikit delay karena penyesuaian temperature'
    },
    {
      batchId: productionBatches[1].id,
      resourceId: findResource('Asisten Chef')?.id || resources[4].id,
      startTime: new Date('2025-08-06T05:30:00Z'),
      endTime: new Date('2025-08-06T09:00:00Z'),
      plannedDuration: 210,
      actualDuration: 210,
      efficiency: 100.0,
      notes: 'Prep ikan dan monitoring proses penggorengan'
    },

    // Batch 3 - High efficiency day (Week 1, Wednesday)
    {
      batchId: productionBatches[2].id,
      resourceId: findResource('Rice Cooker')?.id || resources[0].id,
      startTime: new Date('2025-08-07T04:45:00Z'),
      endTime: new Date('2025-08-07T07:00:00Z'),
      plannedDuration: 135,
      actualDuration: 135,
      efficiency: 100.0,
      notes: 'Nasi untuk 520 porsi, start lebih awal untuk efisiensi'
    },
    {
      batchId: productionBatches[2].id,
      resourceId: findResource('Kompor Gas')?.id || resources[0].id,
      startTime: new Date('2025-08-07T06:00:00Z'),
      endTime: new Date('2025-08-07T07:45:00Z'),
      plannedDuration: 105,
      actualDuration: 105,
      efficiency: 100.0,
      notes: 'Efisiensi tinggi dalam memasak telur dadar'
    },
    {
      batchId: productionBatches[2].id,
      resourceId: findResource('Area Persiapan')?.id || resources[5].id,
      startTime: new Date('2025-08-07T04:00:00Z'),
      endTime: new Date('2025-08-07T06:00:00Z'),
      plannedDuration: 120,
      actualDuration: 115, // Early completion
      efficiency: 104.3, // 120/115 * 100
      notes: 'Persiapan bahan sangat efisien, selesai lebih cepat'
    },

    // Batch 4 - Some challenges (Week 1, Thursday)
    {
      batchId: productionBatches[3].id,
      resourceId: findResource('Rice Cooker')?.id || resources[0].id,
      startTime: new Date('2025-08-08T05:00:00Z'),
      endTime: new Date('2025-08-08T07:30:00Z'),
      plannedDuration: 150,
      actualDuration: 150,
      efficiency: 100.0,
      notes: 'Nasi untuk 450 porsi, kualitas baik'
    },
    {
      batchId: productionBatches[3].id,
      resourceId: findResource('Deep Fryer')?.id || resources[2].id,
      startTime: new Date('2025-08-08T06:30:00Z'),
      endTime: new Date('2025-08-08T09:00:00Z'),
      plannedDuration: 120,
      actualDuration: 150, // Significant delay
      efficiency: 80.0, // 120/150 * 100
      notes: 'Kendala pada heating element, memerlukan service minor'
    },
    {
      batchId: productionBatches[3].id,
      resourceId: findResource('Chef Utama')?.id || resources[3].id,
      startTime: new Date('2025-08-08T05:00:00Z'),
      endTime: new Date('2025-08-08T09:30:00Z'),
      plannedDuration: 240,
      actualDuration: 270, // Extended due to equipment issue
      efficiency: 88.9, // 240/270 * 100
      notes: 'Extended time untuk troubleshooting equipment issue'
    },

    // Batch 5 - Weekend prep (Week 1, Friday)
    {
      batchId: productionBatches[4].id,
      resourceId: findResource('Rice Cooker')?.id || resources[0].id,
      startTime: new Date('2025-08-09T05:00:00Z'),
      endTime: new Date('2025-08-09T07:15:00Z'),
      plannedDuration: 135,
      actualDuration: 135,
      efficiency: 100.0,
      notes: 'Produksi akhir pekan pertama, 460 porsi'
    },
    {
      batchId: productionBatches[4].id,
      resourceId: findResource('Kompor Gas')?.id || resources[0].id,
      startTime: new Date('2025-08-09T06:15:00Z'),
      endTime: new Date('2025-08-09T08:00:00Z'),
      plannedDuration: 105,
      actualDuration: 105,
      efficiency: 100.0,
      notes: 'Memasak tahu goreng bumbu, hasil memuaskan'
    },
    {
      batchId: productionBatches[4].id,
      resourceId: findResource('Area Memasak')?.id || resources[6].id,
      startTime: new Date('2025-08-09T05:00:00Z'),
      endTime: new Date('2025-08-09T08:30:00Z'),
      plannedDuration: 210,
      actualDuration: 210,
      efficiency: 100.0,
      notes: 'Penggunaan area memasak optimal untuk close week pertama'
    },

    // Current week batch (in progress)
    {
      batchId: productionBatches[7].id, // IN_PROGRESS batch
      resourceId: findResource('Rice Cooker')?.id || resources[0].id,
      startTime: new Date('2025-08-19T05:00:00Z'),
      endTime: null, // Still in progress
      plannedDuration: 150,
      actualDuration: null,
      efficiency: null,
      notes: 'Sedang berlangsung - nasi untuk 540 porsi'
    },
    {
      batchId: productionBatches[7].id,
      resourceId: findResource('Chef Utama')?.id || resources[3].id,
      startTime: new Date('2025-08-19T05:00:00Z'),
      endTime: null, // Still in progress
      plannedDuration: 240,
      actualDuration: null,
      efficiency: null,
      notes: 'Supervisi batch minggu ketiga, target 540 porsi'
    }
  ]

  // Filter out usages where resources are not found
  const validUsages = resourceUsages.filter(usage => 
    usage.resourceId !== undefined
  )

  for (const usageData of validUsages) {
    await prisma.resourceUsage.create({
      data: usageData
    })
  }

  const usageCount = await prisma.resourceUsage.count()
  console.log(`✅ Resource usage tracking seeded: ${usageCount} usage records`)
}
