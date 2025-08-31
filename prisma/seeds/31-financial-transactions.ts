// ===============================
// 31. FINANCIAL TRANSACTIONS
// ===============================
import { PrismaClient, TransactionType, TransactionCategory } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedFinancialTransactions() {
  console.log('💰 Seeding financial transactions...')

  const transactions = [
    // Raw Materials Expenses - August 2025
    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.RAW_MATERIALS,
      amount: 15000000,
      description: 'Pembelian beras putih premium 3 ton untuk minggu pertama Agustus',
      referenceId: 'PO-PWK-001-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-05T09:00:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.RAW_MATERIALS,
      amount: 8500000,
      description: 'Pembelian ayam potong segar 500 ekor untuk produksi minggu ke-2',
      referenceId: 'PO-PWK-002-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-12T07:30:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.RAW_MATERIALS,
      amount: 3200000,
      description: 'Pembelian sayuran segar (wortel, buncis, kol) dari Tani Makmur',
      referenceId: 'PO-PWK-003-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-06T08:15:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.RAW_MATERIALS,
      amount: 2800000,
      description: 'Pembelian minyak goreng curah 100L dan bumbu masak',
      referenceId: 'PO-PWK-004-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-08T10:00:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.RAW_MATERIALS,
      amount: 4500000,
      description: 'Pembelian ikan bandeng segar 300kg untuk menu minggu ke-3',
      referenceId: 'PO-PWK-005-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-19T06:45:00Z')
    },

    // Transportation Expenses
    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.TRANSPORTATION,
      amount: 2500000,
      description: 'BBM kendaraan distribusi bulan Agustus - 3 unit truk',
      referenceId: 'FUEL-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-01T14:00:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.TRANSPORTATION,
      amount: 800000,
      description: 'Service rutin kendaraan B 1234 XYZ - ganti oli dan filter',
      referenceId: 'SVC-001-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-15T11:30:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.TRANSPORTATION,
      amount: 1200000,
      description: 'Pajak tahunan kendaraan distribusi B 5678 ABC',
      referenceId: 'TAX-VEH-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-20T09:00:00Z')
    },

    // Utilities Expenses
    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.UTILITIES,
      amount: 1800000,
      description: 'Tagihan listrik dapur produksi bulan Juli 2025',
      referenceId: 'PLN-072025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-02T10:15:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.UTILITIES,
      amount: 450000,
      description: 'Tagihan air PDAM fasilitas produksi bulan Juli',
      referenceId: 'PDAM-072025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-03T08:30:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.UTILITIES,
      amount: 300000,
      description: 'Tagihan gas LPG untuk kompor produksi - 12 tabung',
      referenceId: 'GAS-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-07T12:00:00Z')
    },

    // Salaries
    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.SALARIES,
      amount: 25000000,
      description: 'Gaji bulanan staf SPPG Purwakarta bulan Agustus 2025',
      referenceId: 'PAY-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-25T15:00:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.SALARIES,
      amount: 3500000,
      description: 'Tunjangan lembur staf produksi dan distribusi',
      referenceId: 'OT-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-26T16:30:00Z')
    },

    // Equipment
    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.EQUIPMENT,
      amount: 5200000,
      description: 'Pembelian kontainer makanan baru 200 unit untuk distribusi',
      referenceId: 'EQ-001-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-10T13:45:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.EQUIPMENT,
      amount: 1800000,
      description: 'Pembelian termometer digital dan timbangan precision',
      referenceId: 'EQ-002-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-18T09:20:00Z')
    },

    // Maintenance
    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.MAINTENANCE,
      amount: 2200000,
      description: 'Maintenance AC dapur produksi dan area penyimpanan',
      referenceId: 'MNT-001-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-14T14:15:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.MAINTENANCE,
      amount: 1500000,
      description: 'Perbaikan sistem refrigerasi cold storage',
      referenceId: 'MNT-002-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-22T11:00:00Z')
    },

    // Income Sources
    {
      type: TransactionType.INCOME,
      category: TransactionCategory.OTHER,
      amount: 75000000,
      description: 'Dana APBD Program SPPG Purwakarta bulan Agustus 2025',
      referenceId: 'APBD-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-01T08:00:00Z')
    },

    {
      type: TransactionType.INCOME,
      category: TransactionCategory.OTHER,
      amount: 15000000,
      description: 'Bantuan CSR PT Indofood untuk program nutrisi sekolah',
      referenceId: 'CSR-IND-082025',
      budgetPeriod: '2025-08',
      createdAt: new Date('2025-08-05T14:30:00Z')
    },

    // Recent September transactions
    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.RAW_MATERIALS,
      amount: 12000000,
      description: 'Pembelian beras premium dan telur ayam untuk minggu pertama September',
      referenceId: 'PO-PWK-006-092025',
      budgetPeriod: '2025-09',
      createdAt: new Date('2025-08-30T16:00:00Z')
    },

    {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.TRANSPORTATION,
      amount: 2800000,
      description: 'BBM kendaraan distribusi minggu pertama September',
      referenceId: 'FUEL-092025-W1',
      budgetPeriod: '2025-09',
      createdAt: new Date('2025-08-31T07:00:00Z')
    }
  ]

  for (const transactionData of transactions) {
    const existing = await prisma.financialTransaction.findFirst({
      where: {
        referenceId: transactionData.referenceId,
        budgetPeriod: transactionData.budgetPeriod
      }
    })

    if (!existing) {
      await prisma.financialTransaction.create({
        data: transactionData
      })
    }
  }

  const transactionCount = await prisma.financialTransaction.count()
  console.log(`✅ Financial transactions seeded: ${transactionCount} transactions`)
}
