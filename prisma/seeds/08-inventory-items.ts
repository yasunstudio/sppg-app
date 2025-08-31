import { PrismaClient, QualityStatus } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedInventoryItems() {
  console.log('📦 Seeding inventory items for SPPG Purwakarta...')
  
  // Data inventory untuk bahan-bahan yang sudah ada
  const inventoryItems = [
    // Beras Putih Premium
    {
      id: 'inv-beras-batch-001',
      rawMaterialId: 'rm-beras-putih',
      quantity: 1500,
      unitPrice: 12000.00,
      totalPrice: 18000000.00,
      expiryDate: new Date('2025-12-31'),
      batchNumber: 'BR-PUR-001-2025',
      supplierId: 'supplier-beras-nusantara',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Ayam Fillet
    {
      id: 'inv-ayam-batch-001',
      rawMaterialId: 'rm-ayam-fillet',
      quantity: 250,
      unitPrice: 35000.00,
      totalPrice: 8750000.00,
      expiryDate: new Date('2025-09-05'),
      batchNumber: 'AF-PUR-001-2025',
      supplierId: 'supplier-ayam-segar',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Ikan Bandeng
    {
      id: 'inv-ikan-batch-001',
      rawMaterialId: 'rm-ikan-bandeng',
      quantity: 180,
      unitPrice: 28000.00,
      totalPrice: 5040000.00,
      expiryDate: new Date('2025-09-03'),
      batchNumber: 'IB-PUR-001-2025',
      supplierId: 'supplier-pasar-ikan',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Telur Ayam
    {
      id: 'inv-telur-batch-001',
      rawMaterialId: 'rm-telur-ayam',
      quantity: 320,
      unitPrice: 25000.00,
      totalPrice: 8000000.00,
      expiryDate: new Date('2025-09-15'),
      batchNumber: 'TA-PUR-001-2025',
      supplierId: 'supplier-peternakan-telur',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Tempe
    {
      id: 'inv-tempe-batch-001',
      rawMaterialId: 'rm-tempe',
      quantity: 200,
      unitPrice: 15000.00,
      totalPrice: 3000000.00,
      expiryDate: new Date('2025-09-07'),
      batchNumber: 'TP-PUR-001-2025',
      supplierId: 'supplier-industri-tempe',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Tahu
    {
      id: 'inv-tahu-batch-001',
      rawMaterialId: 'rm-tahu',
      quantity: 150,
      unitPrice: 12000.00,
      totalPrice: 1800000.00,
      expiryDate: new Date('2025-09-05'),
      batchNumber: 'TH-PUR-001-2025',
      supplierId: 'supplier-industri-tempe',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Bayam
    {
      id: 'inv-bayam-batch-001',
      rawMaterialId: 'rm-bayam',
      quantity: 120,
      unitPrice: 8000.00,
      totalPrice: 960000.00,
      expiryDate: new Date('2025-09-02'),
      batchNumber: 'BY-PUR-001-2025',
      supplierId: 'supplier-petani-sayur',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Wortel
    {
      id: 'inv-wortel-batch-001',
      rawMaterialId: 'rm-wortel',
      quantity: 140,
      unitPrice: 10000.00,
      totalPrice: 1400000.00,
      expiryDate: new Date('2025-09-10'),
      batchNumber: 'WT-PUR-001-2025',
      supplierId: 'supplier-petani-sayur',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Buncis
    {
      id: 'inv-buncis-batch-001',
      rawMaterialId: 'rm-buncis',
      quantity: 90,
      unitPrice: 12000.00,
      totalPrice: 1080000.00,
      expiryDate: new Date('2025-09-04'),
      batchNumber: 'BC-PUR-001-2025',
      supplierId: 'supplier-petani-sayur',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Kentang
    {
      id: 'inv-kentang-batch-001',
      rawMaterialId: 'rm-kentang',
      quantity: 450,
      unitPrice: 8500.00,
      totalPrice: 3825000.00,
      expiryDate: new Date('2025-10-15'),
      batchNumber: 'KT-PUR-001-2025',
      supplierId: 'supplier-petani-sayur',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Bawang Merah
    {
      id: 'inv-bawang-merah-batch-001',
      rawMaterialId: 'rm-bawang-merah',
      quantity: 65,
      unitPrice: 18000.00,
      totalPrice: 1170000.00,
      expiryDate: new Date('2025-11-30'),
      batchNumber: 'BM-PUR-001-2025',
      supplierId: 'supplier-pasar-tradisional',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Bawang Putih
    {
      id: 'inv-bawang-putih-batch-001',
      rawMaterialId: 'rm-bawang-putih',
      quantity: 45,
      unitPrice: 22000.00,
      totalPrice: 990000.00,
      expiryDate: new Date('2025-12-31'),
      batchNumber: 'BP-PUR-001-2025',
      supplierId: 'supplier-pasar-tradisional',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Garam
    {
      id: 'inv-garam-batch-001',
      rawMaterialId: 'rm-garam',
      quantity: 60,
      unitPrice: 3000.00,
      totalPrice: 180000.00,
      batchNumber: 'GR-PUR-001-2025',
      supplierId: 'supplier-toko-bumbu',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Minyak Goreng
    {
      id: 'inv-minyak-batch-001',
      rawMaterialId: 'rm-minyak-goreng',
      quantity: 125,
      unitPrice: 16000.00,
      totalPrice: 2000000.00,
      expiryDate: new Date('2026-08-31'),
      batchNumber: 'MG-PUR-001-2025',
      supplierId: 'supplier-distributor-minyak',
      qualityStatus: QualityStatus.GOOD
    },
    
    // Gula Pasir
    {
      id: 'inv-gula-batch-001',
      rawMaterialId: 'rm-gula-pasir',
      quantity: 80,
      unitPrice: 14000.00,
      totalPrice: 1120000.00,
      expiryDate: new Date('2026-08-31'),
      batchNumber: 'GP-PUR-001-2025',
      supplierId: 'supplier-toko-bumbu',
      qualityStatus: QualityStatus.GOOD
    }
  ]

  try {
    for (const item of inventoryItems) {
      const inventoryItem = await prisma.inventoryItem.upsert({
        where: { id: item.id },
        update: {
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          expiryDate: item.expiryDate,
          batchNumber: item.batchNumber,
          qualityStatus: item.qualityStatus
        },
        create: item
      })
      
      console.log(`✓ Inventory item seeded: ${item.batchNumber} (Qty: ${inventoryItem.quantity})`)
    }
    
    console.log(`📦 Inventory items seeding completed! Total: ${inventoryItems.length} items`)
  } catch (error) {
    console.error('❌ Error seeding inventory items:', error)
    throw error
  }
}

export default seedInventoryItems
