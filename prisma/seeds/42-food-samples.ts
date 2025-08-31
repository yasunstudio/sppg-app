import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedFoodSamples() {
  console.log('🧪 Seeding food samples...')
  
  // Get production batches for reference
  const productionBatches = await prisma.productionBatch.findMany({
    select: { id: true, batchNumber: true }
  })

  // Get menu items for additional samples
  const menuItems = await prisma.menuItem.findMany({
    select: { id: true, name: true }
  })

  if (productionBatches.length === 0 && menuItems.length === 0) {
    console.log('⚠️ No production batches or menu items found, skipping food samples seeding')
    return
  }

  type FoodSampleData = {
    id: string;
    sampleDate: Date;
    menuName: string;
    batchNumber: string;
    sampleType: 'RAW_MATERIAL' | 'COOKED_FOOD' | 'PACKAGED_MEAL';
    storageDays: number;
    status: 'STORED' | 'TESTED' | 'DISPOSED';
    notes?: string;
    disposedAt?: Date;
  }

  const foodSamples: FoodSampleData[] = [
    // Raw material samples for August 2025
    {
      id: 'fs-raw-beras-aug01',
      sampleDate: new Date(2025, 7, 1, 7, 0), // Aug 1, 2025
      menuName: 'Beras Putih Premium',
      batchNumber: 'RM-BERAS-082025-001',
      sampleType: 'RAW_MATERIAL',
      storageDays: 3,
      status: 'TESTED',
      notes: 'Sample beras untuk uji kualitas rutin - hasil baik'
    },
    {
      id: 'fs-raw-ayam-aug02',
      sampleDate: new Date(2025, 7, 2, 6, 30), // Aug 2, 2025
      menuName: 'Ayam Fillet Segar',
      batchNumber: 'RM-AYAM-082025-001',
      sampleType: 'RAW_MATERIAL',
      storageDays: 1,
      status: 'TESTED',
      notes: 'Sample daging ayam segar - mikrobiologi normal'
    },
    {
      id: 'fs-raw-sayur-aug03',
      sampleDate: new Date(2025, 7, 3, 7, 15), // Aug 3, 2025
      menuName: 'Bayam Hijau Segar',
      batchNumber: 'RM-SAYUR-082025-001',
      sampleType: 'RAW_MATERIAL',
      storageDays: 1,
      status: 'DISPOSED',
      notes: 'Sample sayuran segar - sudah dibuang setelah pengujian',
      disposedAt: new Date(2025, 7, 4, 16, 0)
    }
  ]

  // Add cooked food samples from production batches
  productionBatches.slice(0, 8).forEach((batch, index) => {
    const sampleDate = new Date(2025, 7, 5 + index, 11, 30) // Starting Aug 5
    
    foodSamples.push({
      id: `fs-cooked-${batch.batchNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      sampleDate,
      menuName: `Makanan Matang Batch ${batch.batchNumber}`,
      batchNumber: batch.batchNumber,
      sampleType: 'COOKED_FOOD',
      storageDays: 3,
      status: index < 5 ? 'TESTED' : 'STORED',
      notes: index < 5 
        ? `Sample makanan matang dari ${batch.batchNumber} - hasil pengujian sesuai standar`
        : `Sample makanan matang dari ${batch.batchNumber} - sedang dalam penyimpanan`
    })
  })

  // Add packaged meal samples
  const packagedSamples: FoodSampleData[] = [
    {
      id: 'fs-pack-monday-aug05',
      sampleDate: new Date(2025, 7, 5, 12, 0),
      menuName: 'Paket Lengkap Senin',
      batchNumber: 'PKG-MON-082025-001',
      sampleType: 'PACKAGED_MEAL',
      storageDays: 2,
      status: 'TESTED',
      notes: 'Sample paket lengkap untuk kontrol kualitas packaging'
    },
    {
      id: 'fs-pack-tuesday-aug06',
      sampleDate: new Date(2025, 7, 6, 12, 0),
      menuName: 'Paket Lengkap Selasa',
      batchNumber: 'PKG-TUE-082025-001',
      sampleType: 'PACKAGED_MEAL',
      storageDays: 2,
      status: 'TESTED',
      notes: 'Sample paket lengkap - semua komponen sesuai porsi'
    },
    {
      id: 'fs-pack-wednesday-aug07',
      sampleDate: new Date(2025, 7, 7, 12, 0),
      menuName: 'Paket Lengkap Rabu',
      batchNumber: 'PKG-WED-082025-001',
      sampleType: 'PACKAGED_MEAL',
      storageDays: 2,
      status: 'DISPOSED',
      notes: 'Sample paket lengkap - sudah dibuang setelah uji organoleptik',
      disposedAt: new Date(2025, 7, 9, 15, 30)
    },
    {
      id: 'fs-pack-thursday-aug08',
      sampleDate: new Date(2025, 7, 8, 12, 0),
      menuName: 'Paket Lengkap Kamis',
      batchNumber: 'PKG-THU-082025-001',
      sampleType: 'PACKAGED_MEAL',
      storageDays: 2,
      status: 'STORED',
      notes: 'Sample paket lengkap - sedang dalam masa penyimpanan kontrol'
    },
    {
      id: 'fs-pack-friday-aug09',
      sampleDate: new Date(2025, 7, 9, 12, 0),
      menuName: 'Paket Lengkap Jumat',
      batchNumber: 'PKG-FRI-082025-001',
      sampleType: 'PACKAGED_MEAL',
      storageDays: 2,
      status: 'STORED',
      notes: 'Sample paket lengkap - menunggu jadwal pengujian mikrobiologi'
    }
  ]

  foodSamples.push(...packagedSamples)

  // Add some recent samples for end of August
  const recentSamples: FoodSampleData[] = [
    {
      id: 'fs-emergency-aug28',
      sampleDate: new Date(2025, 7, 28, 14, 30),
      menuName: 'Emergency Quality Check',
      batchNumber: 'EMG-082025-001',
      sampleType: 'COOKED_FOOD',
      storageDays: 1,
      status: 'TESTED',
      notes: 'Sample darurat karena keluhan konsumen - hasil normal'
    },
    {
      id: 'fs-month-end-aug30',
      sampleDate: new Date(2025, 7, 30, 16, 0),
      menuName: 'Monthly Review Sample',
      batchNumber: 'REV-082025-001',
      sampleType: 'PACKAGED_MEAL',
      storageDays: 7,
      status: 'STORED',
      notes: 'Sample untuk review kualitas akhir bulan - extended storage test'
    }
  ]

  foodSamples.push(...recentSamples)

  console.log(`Akan membuat ${foodSamples.length} food samples...`)

  // Create food samples with upsert
  for (const sample of foodSamples) {
    await prisma.foodSample.upsert({
      where: { id: sample.id },
      update: {
        sampleDate: sample.sampleDate,
        menuName: sample.menuName,
        batchNumber: sample.batchNumber,
        sampleType: sample.sampleType,
        storageDays: sample.storageDays,
        status: sample.status,
        notes: sample.notes,
        disposedAt: sample.disposedAt || null
      },
      create: sample
    })
  }

  console.log(`✅ Created ${foodSamples.length} food sample records`)
}

export default seedFoodSamples
