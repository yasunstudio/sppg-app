import { PrismaClient, PurchaseOrderStatus } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedPurchaseOrders() {
  console.log('📋 Seeding purchase orders...')

  // Get reference data
  const suppliers = await prisma.supplier.findMany()
  const rawMaterials = await prisma.rawMaterial.findMany()
  const users = await prisma.user.findMany()

  if (suppliers.length === 0 || rawMaterials.length === 0 || users.length === 0) {
    console.log('⚠️  Suppliers, raw materials, or users not found. Please seed them first.')
    return
  }

  // Find relevant users
  const warehouseUser = users.find(u => u.email.includes('warehouse')) || users[0]
  const adminUser = users.find(u => u.email.includes('admin')) || users[1]

  const purchaseOrders = [
    // PO 1 - Weekly rice order (Completed)
    {
      poNumber: 'PO-PWK-001-082025',
      supplierId: suppliers[0].id, // PT Beras Nusantara
      orderDate: new Date('2025-08-01T09:00:00Z'),
      expectedDelivery: new Date('2025-08-03T10:00:00Z'),
      actualDelivery: new Date('2025-08-03T09:30:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 22500000, // 22.5 million IDR
      notes: 'Pemesanan beras mingguan untuk produksi week 1',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-03T09:30:00Z')
    },
    
    // PO 2 - Protein mix order (Completed)
    {
      poNumber: 'PO-PWK-002-082025',
      supplierId: suppliers[1].id, // CV Ayam Segar Purwakarta
      orderDate: new Date('2025-08-02T14:00:00Z'),
      expectedDelivery: new Date('2025-08-04T08:00:00Z'),
      actualDelivery: new Date('2025-08-04T08:15:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 15750000, // 15.75 million IDR
      notes: 'Pasokan protein ayam dan ikan untuk week 1-2',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-04T08:15:00Z')
    },

    // PO 3 - Fresh vegetables (Completed)
    {
      poNumber: 'PO-PWK-003-082025',
      supplierId: suppliers[2].id, // Koperasi Petani Sayur

      orderDate: new Date('2025-08-05T07:00:00Z'),
      expectedDelivery: new Date('2025-08-06T06:00:00Z'),
      actualDelivery: new Date('2025-08-06T06:00:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 3200000, // 3.2 million IDR
      notes: 'Sayuran segar untuk menu week 1',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-06T06:00:00Z')
    },

    // PO 4 - Mid-week restock (Delivered)
    {
      poNumber: 'PO-PWK-004-082025',
      supplierId: suppliers[4].id, // Peternakan Telur Mandiri
      orderDate: new Date('2025-08-07T16:00:00Z'),
      expectedDelivery: new Date('2025-08-09T07:00:00Z'),
      actualDelivery: new Date('2025-08-09T07:00:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 6800000, // 6.8 million IDR
      notes: 'Restock telur dan protein tambahan',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-09T07:00:00Z')
    },

    // PO 5 - Week 2 main order (Delivered)
    {
      poNumber: 'PO-PWK-005-082025',
      supplierId: suppliers[0].id, // PT Beras Nusantara again
      orderDate: new Date('2025-08-08T10:00:00Z'),
      expectedDelivery: new Date('2025-08-11T10:00:00Z'),
      actualDelivery: new Date('2025-08-11T10:30:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 24000000, // 24 million IDR
      notes: 'Pemesanan beras dan bahan pokok week 2',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-11T10:30:00Z')
    },

    // PO 6 - Current week preparation (Shipped)
    {
      poNumber: 'PO-PWK-006-082025',
      supplierId: suppliers[3].id, // Pasar Ikan Segar
      orderDate: new Date('2025-08-16T13:00:00Z'),
      expectedDelivery: new Date('2025-08-19T07:00:00Z'),
      actualDelivery: new Date('2025-08-19T07:15:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 8500000, // 8.5 million IDR
      notes: 'Ikan segar untuk produksi week 3',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-19T07:15:00Z')
    },

    // PO 7 - Emergency order (Partially received)
    {
      poNumber: 'PO-PWK-007-082025',
      supplierId: suppliers[6].id, // Pasar Tradisional
      orderDate: new Date('2025-08-17T11:00:00Z'),
      expectedDelivery: new Date('2025-08-18T14:00:00Z'),
      actualDelivery: new Date('2025-08-18T15:30:00Z'),
      status: PurchaseOrderStatus.PARTIALLY_RECEIVED,
      totalAmount: 2100000, // 2.1 million IDR
      notes: 'Pemesanan emergency bumbu dan sayuran, sebagian item belum tersedia',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-18T15:30:00Z')
    },

    // PO 8 - Future week planning (Confirmed)
    {
      poNumber: 'PO-PWK-008-082025',
      supplierId: suppliers[1].id, // CV Ayam Segar
      orderDate: new Date('2025-08-19T09:00:00Z'),
      expectedDelivery: new Date('2025-08-22T08:00:00Z'),
      actualDelivery: null,
      status: PurchaseOrderStatus.CONFIRMED,
      totalAmount: 18200000, // 18.2 million IDR
      notes: 'Pre-order protein untuk week 4 production',
      orderedBy: adminUser.id,
      receivedBy: null,
      deliveredAt: null
    },

    // PO 9 - Month-end bulk order (Pending)
    {
      poNumber: 'PO-PWK-009-082025',
      supplierId: suppliers[0].id, // PT Beras Nusantara
      orderDate: new Date('2025-08-20T14:00:00Z'),
      expectedDelivery: new Date('2025-08-26T10:00:00Z'),
      actualDelivery: null,
      status: PurchaseOrderStatus.PENDING,
      totalAmount: 45000000, // 45 million IDR
      notes: 'Bulk order beras untuk September, menunggu konfirmasi budget',
      orderedBy: adminUser.id,
      receivedBy: null,
      deliveredAt: null
    }
  ]

  // Create purchase orders
  for (const poData of purchaseOrders) {
    await prisma.purchaseOrder.upsert({
      where: { poNumber: poData.poNumber },
      update: poData,
      create: poData
    })
  }

  // Now create purchase order items
  const createdPOs = await prisma.purchaseOrder.findMany()
  
  const purchaseOrderItems = [
    // PO 1 items - Rice order
    {
      purchaseOrderId: createdPOs[0].id,
      rawMaterialId: rawMaterials.find(rm => rm.name.includes('Beras'))?.id || rawMaterials[0].id,
      quantity: 1500,
      unit: 'kg',
      unitPrice: 15000,
      totalPrice: 22500000,
      notes: 'Beras premium grade A untuk produksi'
    },

    // PO 2 items - Protein mix
    {
      purchaseOrderId: createdPOs[1].id,
      rawMaterialId: rawMaterials.find(rm => rm.name.includes('Ayam'))?.id || rawMaterials[1].id,
      quantity: 300,
      unit: 'kg',
      unitPrice: 32000,
      totalPrice: 9600000,
      notes: 'Ayam fillet segar, kualitas export'
    },
    {
      purchaseOrderId: createdPOs[1].id,
      rawMaterialId: rawMaterials.find(rm => rm.name.includes('Ikan'))?.id || rawMaterials[2].id,
      quantity: 200,
      unit: 'kg',
      unitPrice: 18000,
      totalPrice: 3600000,
      notes: 'Ikan bandeng segar dari tambak'
    },
    {
      purchaseOrderId: createdPOs[1].id,
      rawMaterialId: rawMaterials.find(rm => rm.name.includes('Telur'))?.id || rawMaterials[3].id,
      quantity: 100,
      unit: 'kg',
      unitPrice: 25500,
      totalPrice: 2550000,
      notes: 'Telur grade A, ukuran medium'
    },

    // PO 3 items - Vegetables
    {
      purchaseOrderId: createdPOs[2].id,
      rawMaterialId: rawMaterials.find(rm => rm.name.includes('Bayam'))?.id || rawMaterials[4].id,
      quantity: 150,
      unit: 'kg',
      unitPrice: 8000,
      totalPrice: 1200000,
      notes: 'Bayam hijau organik, segar pagi'
    },
    {
      purchaseOrderId: createdPOs[2].id,
      rawMaterialId: rawMaterials.find(rm => rm.name.includes('Wortel'))?.id || rawMaterials[5].id,
      quantity: 100,
      unit: 'kg',
      unitPrice: 12000,
      totalPrice: 1200000,
      notes: 'Wortel baby, grade premium'
    },
    {
      purchaseOrderId: createdPOs[2].id,
      rawMaterialId: rawMaterials.find(rm => rm.name.includes('Buncis'))?.id || rawMaterials[6].id,
      quantity: 80,
      unit: 'kg',
      unitPrice: 10000,
      totalPrice: 800000,
      notes: 'Buncis muda, dipetik pagi'
    },

    // PO 4 items - Mid-week restock
    {
      purchaseOrderId: createdPOs[3].id,
      rawMaterialId: rawMaterials.find(rm => rm.name.includes('Telur'))?.id || rawMaterials[3].id,
      quantity: 150,
      unit: 'kg',
      unitPrice: 26000,
      totalPrice: 3900000,
      notes: 'Restock telur untuk minggu kedua'
    },
    {
      purchaseOrderId: createdPOs[3].id,
      rawMaterialId: rawMaterials.find(rm => rm.name.includes('Tempe'))?.id || rawMaterials[7].id,
      quantity: 120,
      unit: 'kg',
      unitPrice: 12000,
      totalPrice: 1440000,
      notes: 'Tempe segar produksi lokal'
    },
    {
      purchaseOrderId: createdPOs[3].id,
      rawMaterialId: rawMaterials.find(rm => rm.name.includes('Tahu'))?.id || rawMaterials[8].id,
      quantity: 100,
      unit: 'kg',
      unitPrice: 14600,
      totalPrice: 1460000,
      notes: 'Tahu putih premium, tidak mudah hancur'
    },

    // PO 5 items - Week 2 main order
    {
      purchaseOrderId: createdPOs[4].id,
      rawMaterialId: rawMaterials.find(rm => rm.name.includes('Beras'))?.id || rawMaterials[0].id,
      quantity: 1600,
      unit: 'kg',
      unitPrice: 15000,
      totalPrice: 24000000,
      notes: 'Beras untuk produksi week 2, stok extended'
    }
  ]

  for (const itemData of purchaseOrderItems) {
    await prisma.purchaseOrderItem.create({
      data: itemData
    })
  }

  const poCount = await prisma.purchaseOrder.count()
  const poItemCount = await prisma.purchaseOrderItem.count()
  console.log(`✅ Purchase orders seeded: ${poCount} orders, ${poItemCount} items`)
}
