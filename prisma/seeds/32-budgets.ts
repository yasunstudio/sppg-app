// ===============================
// 32. BUDGETS
// ===============================
import { PrismaClient, TransactionCategory } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedBudgets() {
  console.log('📊 Seeding budgets...')

  const budgets = [
    // August 2025 Budget
    {
      period: '2025-08',
      category: TransactionCategory.RAW_MATERIALS,
      allocated: 50000000, // 50 juta untuk bahan baku
      spent: 34000000, // sudah terpakai berdasarkan transaksi
      remaining: 16000000,
      notes: 'Budget bahan baku untuk melayani 16 sekolah selama bulan Agustus'
    },

    {
      period: '2025-08',
      category: TransactionCategory.TRANSPORTATION,
      allocated: 8000000, // 8 juta untuk transportasi
      spent: 4500000,
      remaining: 3500000,
      notes: 'Termasuk BBM, maintenance, dan pajak kendaraan distribusi'
    },

    {
      period: '2025-08',
      category: TransactionCategory.UTILITIES,
      allocated: 3500000, // 3.5 juta untuk utilitas
      spent: 2550000,
      remaining: 950000,
      notes: 'Listrik, air, gas untuk fasilitas produksi dan penyimpanan'
    },

    {
      period: '2025-08',
      category: TransactionCategory.SALARIES,
      allocated: 30000000, // 30 juta untuk gaji
      spent: 28500000,
      remaining: 1500000,
      notes: 'Gaji bulanan dan tunjangan staf SPPG Purwakarta'
    },

    {
      period: '2025-08',
      category: TransactionCategory.EQUIPMENT,
      allocated: 10000000, // 10 juta untuk peralatan
      spent: 7000000,
      remaining: 3000000,
      notes: 'Kontainer makanan, termometer, timbangan, dan peralatan QC'
    },

    {
      period: '2025-08',
      category: TransactionCategory.MAINTENANCE,
      allocated: 5000000, // 5 juta untuk maintenance
      spent: 3700000,
      remaining: 1300000,
      notes: 'Maintenance rutin AC, refrigerasi, dan peralatan produksi'
    },

    {
      period: '2025-08',
      category: TransactionCategory.OTHER,
      allocated: 3000000, // 3 juta untuk lain-lain
      spent: 500000,
      remaining: 2500000,
      notes: 'Emergency fund dan keperluan operasional lainnya'
    },

    // September 2025 Budget (Baru dibuat)
    {
      period: '2025-09',
      category: TransactionCategory.RAW_MATERIALS,
      allocated: 52000000, // Naik sedikit karena back to school
      spent: 12000000, // sudah ada transaksi minggu pertama
      remaining: 40000000,
      notes: 'Budget bahan baku September - peningkatan karena awal semester'
    },

    {
      period: '2025-09',
      category: TransactionCategory.TRANSPORTATION,
      allocated: 8500000,
      spent: 2800000,
      remaining: 5700000,
      notes: 'Budget transportasi September dengan penyesuaian harga BBM'
    },

    {
      period: '2025-09',
      category: TransactionCategory.UTILITIES,
      allocated: 3800000,
      spent: 0,
      remaining: 3800000,
      notes: 'Budget utilitas September dengan antisipasi kenaikan tarif'
    },

    {
      period: '2025-09',
      category: TransactionCategory.SALARIES,
      allocated: 31000000, // Naik karena ada kenaikan gaji
      spent: 0,
      remaining: 31000000,
      notes: 'Budget gaji September dengan penyesuaian UMK terbaru'
    },

    {
      period: '2025-09',
      category: TransactionCategory.EQUIPMENT,
      allocated: 7500000, // Turun karena sudah ada pembelian besar bulan lalu
      spent: 0,
      remaining: 7500000,
      notes: 'Budget peralatan September - maintenance dan replacement'
    },

    {
      period: '2025-09',
      category: TransactionCategory.MAINTENANCE,
      allocated: 5500000,
      spent: 0,
      remaining: 5500000,
      notes: 'Budget maintenance September termasuk persiapan semester baru'
    },

    {
      period: '2025-09',
      category: TransactionCategory.OTHER,
      allocated: 3200000,
      spent: 0,
      remaining: 3200000,
      notes: 'Emergency fund dan biaya operasional tak terduga'
    },

    // October 2025 Budget (Preview)
    {
      period: '2025-10',
      category: TransactionCategory.RAW_MATERIALS,
      allocated: 48000000,
      spent: 0,
      remaining: 48000000,
      notes: 'Budget bahan baku Oktober - normalisasi setelah periode back to school'
    },

    {
      period: '2025-10',
      category: TransactionCategory.TRANSPORTATION,
      allocated: 8200000,
      spent: 0,
      remaining: 8200000,
      notes: 'Budget transportasi Oktober dengan efisiensi rute'
    },

    {
      period: '2025-10',
      category: TransactionCategory.UTILITIES,
      allocated: 3600000,
      spent: 0,
      remaining: 3600000,
      notes: 'Budget utilitas Oktober dengan optimisasi penggunaan'
    },

    {
      period: '2025-10',
      category: TransactionCategory.SALARIES,
      allocated: 31000000,
      spent: 0,
      remaining: 31000000,
      notes: 'Budget gaji Oktober sesuai struktur gaji terbaru'
    }
  ]

  for (const budgetData of budgets) {
    const existing = await prisma.budget.findUnique({
      where: {
        period_category: {
          period: budgetData.period,
          category: budgetData.category
        }
      }
    })

    if (!existing) {
      await prisma.budget.create({
        data: budgetData
      })
    }
  }

  const budgetCount = await prisma.budget.count()
  console.log(`✅ Budgets seeded: ${budgetCount} budget entries`)
}
