// ===============================
// 33. WASTE RECORDS
// ===============================
import { PrismaClient, WasteType, WasteSource } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedWasteRecords() {
  console.log('🗑️ Seeding waste records...')

  // Get reference data
  const schools = await prisma.school.findMany({
    orderBy: { name: 'asc' }
  })

  if (schools.length === 0) {
    console.log('⚠️  No schools found. Please seed schools first.')
    return
  }

  const wasteRecords = [
    // Production waste - daily records
    {
      recordDate: new Date('2025-08-05T10:30:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.PREPARATION,
      weight: 8.5,
      notes: 'Kulit bawang, ujung sayuran, dan sisa preparasi bahan',
      schoolId: null // Production waste
    },

    {
      recordDate: new Date('2025-08-05T14:15:00Z'),
      wasteType: WasteType.INORGANIC,
      source: WasteSource.PACKAGING,
      weight: 2.3,
      notes: 'Kemasan plastik beras dan kardus kemasan bahan baku',
      schoolId: null
    },

    {
      recordDate: new Date('2025-08-06T11:00:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.PREPARATION,
      weight: 12.2,
      notes: 'Sisa ayam (tulang, kulit tidak terpakai) dan sayuran rusak',
      schoolId: null
    },

    {
      recordDate: new Date('2025-08-06T16:30:00Z'),
      wasteType: WasteType.PACKAGING,
      source: WasteSource.PACKAGING,
      weight: 4.1,
      notes: 'Wadah aluminium bekas dan plastik wrap',
      schoolId: null
    },

    {
      recordDate: new Date('2025-08-07T09:45:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.EXPIRED_MATERIAL,
      weight: 3.8,
      notes: 'Sayuran layu yang tidak memenuhi standar kualitas',
      schoolId: null
    },

    // School waste - leftover food
    {
      recordDate: new Date('2025-08-05T13:30:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.SCHOOL_LEFTOVER,
      weight: 5.2,
      notes: 'Sisa makanan siswa - nasi dan lauk tidak habis',
      schoolId: schools[0]?.id
    },

    {
      recordDate: new Date('2025-08-05T13:30:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.SCHOOL_LEFTOVER,
      weight: 3.8,
      notes: 'Makanan tidak tersentuh karena siswa sakit',
      schoolId: schools[1]?.id
    },

    {
      recordDate: new Date('2025-08-06T13:45:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.SCHOOL_LEFTOVER,
      weight: 6.1,
      notes: 'Sisa nasi dan sayur - porsi terlalu besar untuk anak kelas 1',
      schoolId: schools[2]?.id
    },

    {
      recordDate: new Date('2025-08-06T14:00:00Z'),
      wasteType: WasteType.PACKAGING,
      source: WasteSource.SCHOOL_LEFTOVER,
      weight: 1.5,
      notes: 'Wadah makanan rusak dan tidak bisa dicuci ulang',
      schoolId: schools[0]?.id
    },

    {
      recordDate: new Date('2025-08-07T13:20:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.SCHOOL_LEFTOVER,
      weight: 4.3,
      notes: 'Siswa tidak menyukai menu ikan - banyak tersisa',
      schoolId: schools[3]?.id
    },

    // Weekly production waste patterns
    {
      recordDate: new Date('2025-08-12T10:00:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.PREPARATION,
      weight: 9.2,
      notes: 'Preparasi batch besar - normal waste dari cleaning',
      schoolId: null
    },

    {
      recordDate: new Date('2025-08-12T15:30:00Z'),
      wasteType: WasteType.INORGANIC,
      source: WasteSource.PACKAGING,
      weight: 3.4,
      notes: 'Kemasan supplier dan material packaging rusak',
      schoolId: null
    },

    {
      recordDate: new Date('2025-08-13T08:30:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.EXPIRED_MATERIAL,
      weight: 2.1,
      notes: 'Tomat dan cabai yang melewati tanggal kadaluarsa',
      schoolId: null
    },

    {
      recordDate: new Date('2025-08-14T12:15:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.PRODUCTION,
      weight: 1.8,
      notes: 'Makanan burnt/gosong yang tidak memenuhi QC',
      schoolId: null
    },

    // Multiple school waste on same day
    {
      recordDate: new Date('2025-08-13T13:30:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.SCHOOL_LEFTOVER,
      weight: 7.5,
      notes: 'Menu baru belum familiar dengan siswa',
      schoolId: schools[4]?.id
    },

    {
      recordDate: new Date('2025-08-13T13:35:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.SCHOOL_LEFTOVER,
      weight: 4.2,
      notes: 'Beberapa siswa absen karena sakit',
      schoolId: schools[5]?.id
    },

    {
      recordDate: new Date('2025-08-14T13:40:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.SCHOOL_LEFTOVER,
      weight: 3.9,
      notes: 'Siswa kelas 6 sedang UTS - nafsu makan menurun',
      schoolId: schools[6]?.id
    },

    // Recent waste records
    {
      recordDate: new Date('2025-08-19T11:30:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.PREPARATION,
      weight: 10.8,
      notes: 'Persiapan menu ikan bandeng - banyak tulang dan sisik',
      schoolId: null
    },

    {
      recordDate: new Date('2025-08-19T14:45:00Z'),
      wasteType: WasteType.PACKAGING,
      source: WasteSource.PACKAGING,
      weight: 2.7,
      notes: 'Plastik pembungkus ikan dan styrofoam packaging',
      schoolId: null
    },

    {
      recordDate: new Date('2025-08-20T13:30:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.SCHOOL_LEFTOVER,
      weight: 6.8,
      notes: 'Menu ikan kurang populer di beberapa sekolah',
      schoolId: schools[7]?.id
    },

    // Quality control waste
    {
      recordDate: new Date('2025-08-21T09:00:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.PRODUCTION,
      weight: 4.5,
      notes: 'Batch tidak memenuhi standar suhu - harus dibuang',
      schoolId: null
    },

    // Latest records (August end)
    {
      recordDate: new Date('2025-08-26T10:15:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.PREPARATION,
      weight: 8.9,
      notes: 'Preparasi mingguan normal - kulit dan sisa sayuran',
      schoolId: null
    },

    {
      recordDate: new Date('2025-08-27T13:45:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.SCHOOL_LEFTOVER,
      weight: 5.1,
      notes: 'Beberapa siswa pulang lebih awal - aktivitas sekolah',
      schoolId: schools[8]?.id
    },

    {
      recordDate: new Date('2025-08-28T11:00:00Z'),
      wasteType: WasteType.INORGANIC,
      source: WasteSource.PACKAGING,
      weight: 3.8,
      notes: 'Kemasan end-of-month dan persiapan bulan baru',
      schoolId: null
    },

    // Future projections (early September)
    {
      recordDate: new Date('2025-08-30T09:30:00Z'),
      wasteType: WasteType.ORGANIC,
      source: WasteSource.PREPARATION,
      weight: 7.6,
      notes: 'Persiapan menu September - testing porsi baru',
      schoolId: null
    }
  ]

  for (const wasteData of wasteRecords) {
    const existing = await prisma.wasteRecord.findFirst({
      where: {
        recordDate: wasteData.recordDate,
        wasteType: wasteData.wasteType,
        source: wasteData.source,
        weight: wasteData.weight,
        schoolId: wasteData.schoolId
      }
    })

    if (!existing) {
      await prisma.wasteRecord.create({
        data: wasteData
      })
    }
  }

  const wasteCount = await prisma.wasteRecord.count()
  console.log(`✅ Waste records seeded: ${wasteCount} waste records`)
}
