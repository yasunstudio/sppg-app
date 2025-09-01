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

  // Generate comprehensive purchase orders for the last 6 months
  const purchaseOrders = []

  // March 2025 - Early operations
  purchaseOrders.push(
    {
      poNumber: 'PO-PWK-001-032025',
      supplierId: suppliers[0].id,
      orderDate: new Date('2025-03-01T08:00:00Z'),
      expectedDelivery: new Date('2025-03-03T09:00:00Z'),
      actualDelivery: new Date('2025-03-03T09:30:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 18500000,
      notes: 'Pemesanan awal bulan Maret - beras dan bahan pokok',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-03-03T09:30:00Z')
    },
    {
      poNumber: 'PO-PWK-002-032025',
      supplierId: suppliers[1].id,
      orderDate: new Date('2025-03-05T10:00:00Z'),
      expectedDelivery: new Date('2025-03-07T08:00:00Z'),
      actualDelivery: new Date('2025-03-07T08:15:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 12300000,
      notes: 'Protein ayam untuk minggu pertama produksi',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-03-07T08:15:00Z')
    },
    {
      poNumber: 'PO-PWK-003-032025',
      supplierId: suppliers[2].id,
      orderDate: new Date('2025-03-12T07:00:00Z'),
      expectedDelivery: new Date('2025-03-14T06:00:00Z'),
      actualDelivery: new Date('2025-03-14T06:30:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 5600000,
      notes: 'Sayuran segar minggu kedua',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-03-14T06:30:00Z')
    },
    {
      poNumber: 'PO-PWK-004-032025',
      supplierId: suppliers[3].id,
      orderDate: new Date('2025-03-20T11:00:00Z'),
      expectedDelivery: new Date('2025-03-22T07:00:00Z'),
      actualDelivery: new Date('2025-03-22T07:45:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 8900000,
      notes: 'Ikan segar dan seafood untuk menu spesial',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-03-22T07:45:00Z')
    }
  )

  // April 2025 - Expansion phase
  purchaseOrders.push(
    {
      poNumber: 'PO-PWK-005-042025',
      supplierId: suppliers[0].id,
      orderDate: new Date('2025-04-02T09:00:00Z'),
      expectedDelivery: new Date('2025-04-04T10:00:00Z'),
      actualDelivery: new Date('2025-04-04T09:45:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 25000000,
      notes: 'Stok beras bulanan April - peningkatan kapasitas',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-04-04T09:45:00Z')
    },
    {
      poNumber: 'PO-PWK-006-042025',
      supplierId: suppliers[4].id,
      orderDate: new Date('2025-04-08T14:00:00Z'),
      expectedDelivery: new Date('2025-04-10T08:00:00Z'),
      actualDelivery: new Date('2025-04-10T08:30:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 7800000,
      notes: 'Telur grade A untuk peningkatan produksi',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-04-10T08:30:00Z')
    },
    {
      poNumber: 'PO-PWK-007-042025',
      supplierId: suppliers[1].id,
      orderDate: new Date('2025-04-15T10:30:00Z'),
      expectedDelivery: new Date('2025-04-17T09:00:00Z'),
      actualDelivery: new Date('2025-04-17T09:15:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 16500000,
      notes: 'Ayam fillet premium untuk menu spesial',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-04-17T09:15:00Z')
    },
    {
      poNumber: 'PO-PWK-008-042025',
      supplierId: suppliers[6].id,
      orderDate: new Date('2025-04-22T16:00:00Z'),
      expectedDelivery: new Date('2025-04-24T08:00:00Z'),
      actualDelivery: null,
      status: PurchaseOrderStatus.CANCELLED,
      totalAmount: 4200000,
      notes: 'Dibatalkan karena kualitas tidak sesuai standar',
      orderedBy: adminUser.id,
      receivedBy: null,
      deliveredAt: null
    }
  )

  // May 2025 - Steady operations
  purchaseOrders.push(
    {
      poNumber: 'PO-PWK-009-052025',
      supplierId: suppliers[2].id,
      orderDate: new Date('2025-05-03T07:30:00Z'),
      expectedDelivery: new Date('2025-05-05T06:00:00Z'),
      actualDelivery: new Date('2025-05-05T06:15:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 6700000,
      notes: 'Sayuran organik untuk menu sehat',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-05-05T06:15:00Z')
    },
    {
      poNumber: 'PO-PWK-010-052025',
      supplierId: suppliers[5].id,
      orderDate: new Date('2025-05-10T13:00:00Z'),
      expectedDelivery: new Date('2025-05-12T10:00:00Z'),
      actualDelivery: new Date('2025-05-12T11:30:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 3800000,
      notes: 'Bumbu dan rempah berkualitas tinggi',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-05-12T11:30:00Z')
    },
    {
      poNumber: 'PO-PWK-011-052025',
      supplierId: suppliers[0].id,
      orderDate: new Date('2025-05-16T09:00:00Z'),
      expectedDelivery: new Date('2025-05-18T10:00:00Z'),
      actualDelivery: new Date('2025-05-18T14:00:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 22000000,
      notes: 'Beras premium untuk minggu ketiga',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-05-18T14:00:00Z')
    }
  )

  // June 2025 - Quality focus
  purchaseOrders.push(
    {
      poNumber: 'PO-PWK-012-062025',
      supplierId: suppliers[3].id,
      orderDate: new Date('2025-06-02T08:00:00Z'),
      expectedDelivery: new Date('2025-06-04T07:00:00Z'),
      actualDelivery: new Date('2025-06-04T07:30:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 11200000,
      notes: 'Ikan bandeng segar dari tambak organik',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-06-04T07:30:00Z')
    },
    {
      poNumber: 'PO-PWK-013-062025',
      supplierId: suppliers[1].id,
      orderDate: new Date('2025-06-08T11:00:00Z'),
      expectedDelivery: new Date('2025-06-10T09:00:00Z'),
      actualDelivery: new Date('2025-06-10T09:45:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 18900000,
      notes: 'Daging ayam kampung untuk menu premium',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-06-10T09:45:00Z')
    },
    {
      poNumber: 'PO-PWK-014-062025',
      supplierId: suppliers[4].id,
      orderDate: new Date('2025-06-15T15:00:00Z'),
      expectedDelivery: new Date('2025-06-17T08:00:00Z'),
      actualDelivery: new Date('2025-06-17T08:00:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 9300000,
      notes: 'Telur organik dari peternakan terpercaya',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-06-17T08:00:00Z')
    }
  )

  // July 2025 - Summer operations
  purchaseOrders.push(
    {
      poNumber: 'PO-PWK-015-072025',
      supplierId: suppliers[2].id,
      orderDate: new Date('2025-07-01T07:00:00Z'),
      expectedDelivery: new Date('2025-07-03T06:00:00Z'),
      actualDelivery: new Date('2025-07-03T06:30:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 8100000,
      notes: 'Sayuran musim panas segar',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-07-03T06:30:00Z')
    },
    {
      poNumber: 'PO-PWK-016-072025',
      supplierId: suppliers[0].id,
      orderDate: new Date('2025-07-08T10:00:00Z'),
      expectedDelivery: new Date('2025-07-10T09:00:00Z'),
      actualDelivery: new Date('2025-07-10T10:15:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 27500000,
      notes: 'Bulk order beras untuk paruh pertama Juli',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-07-10T10:15:00Z')
    },
    {
      poNumber: 'PO-PWK-017-072025',
      supplierId: suppliers[5].id,
      orderDate: new Date('2025-07-14T12:00:00Z'),
      expectedDelivery: new Date('2025-07-16T10:00:00Z'),
      actualDelivery: new Date('2025-07-16T15:00:00Z'),
      status: PurchaseOrderStatus.PARTIALLY_RECEIVED,
      totalAmount: 5200000,
      notes: 'Sebagian bumbu terlambat karena masalah transportasi',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-07-16T15:00:00Z')
    },
    {
      poNumber: 'PO-PWK-018-072025',
      supplierId: suppliers[3].id,
      orderDate: new Date('2025-07-22T09:30:00Z'),
      expectedDelivery: new Date('2025-07-24T07:00:00Z'),
      actualDelivery: new Date('2025-07-24T07:45:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 13400000,
      notes: 'Ikan laut segar untuk menu spesial akhir bulan',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-07-24T07:45:00Z')
    }
  )

  // August 2025 - Current month operations
  purchaseOrders.push(
    {
      poNumber: 'PO-PWK-019-082025',
      supplierId: suppliers[0].id,
      orderDate: new Date('2025-08-01T09:00:00Z'),
      expectedDelivery: new Date('2025-08-03T10:00:00Z'),
      actualDelivery: new Date('2025-08-03T09:30:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 22500000,
      notes: 'Pemesanan beras mingguan untuk produksi week 1',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-03T09:30:00Z')
    },
    {
      poNumber: 'PO-PWK-020-082025',
      supplierId: suppliers[1].id,
      orderDate: new Date('2025-08-02T14:00:00Z'),
      expectedDelivery: new Date('2025-08-04T08:00:00Z'),
      actualDelivery: new Date('2025-08-04T08:15:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 15750000,
      notes: 'Pasokan protein ayam dan ikan untuk week 1-2',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-04T08:15:00Z')
    },
    {
      poNumber: 'PO-PWK-021-082025',
      supplierId: suppliers[2].id,
      orderDate: new Date('2025-08-05T07:00:00Z'),
      expectedDelivery: new Date('2025-08-06T06:00:00Z'),
      actualDelivery: new Date('2025-08-06T06:00:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 3200000,
      notes: 'Sayuran segar untuk menu week 1',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-06T06:00:00Z')
    },
    {
      poNumber: 'PO-PWK-022-082025',
      supplierId: suppliers[4].id,
      orderDate: new Date('2025-08-07T16:00:00Z'),
      expectedDelivery: new Date('2025-08-09T07:00:00Z'),
      actualDelivery: new Date('2025-08-09T07:00:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 6800000,
      notes: 'Restock telur dan protein tambahan',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-09T07:00:00Z')
    },
    {
      poNumber: 'PO-PWK-023-082025',
      supplierId: suppliers[0].id,
      orderDate: new Date('2025-08-08T10:00:00Z'),
      expectedDelivery: new Date('2025-08-11T10:00:00Z'),
      actualDelivery: new Date('2025-08-11T10:30:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 24000000,
      notes: 'Pemesanan beras dan bahan pokok week 2',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-11T10:30:00Z')
    },
    {
      poNumber: 'PO-PWK-024-082025',
      supplierId: suppliers[3].id,
      orderDate: new Date('2025-08-16T13:00:00Z'),
      expectedDelivery: new Date('2025-08-19T07:00:00Z'),
      actualDelivery: new Date('2025-08-19T07:15:00Z'),
      status: PurchaseOrderStatus.DELIVERED,
      totalAmount: 8500000,
      notes: 'Ikan segar untuk produksi week 3',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-19T07:15:00Z')
    },
    {
      poNumber: 'PO-PWK-025-082025',
      supplierId: suppliers[6].id,
      orderDate: new Date('2025-08-17T11:00:00Z'),
      expectedDelivery: new Date('2025-08-18T14:00:00Z'),
      actualDelivery: new Date('2025-08-18T15:30:00Z'),
      status: PurchaseOrderStatus.PARTIALLY_RECEIVED,
      totalAmount: 2100000,
      notes: 'Pemesanan emergency bumbu dan sayuran, sebagian item belum tersedia',
      orderedBy: adminUser.id,
      receivedBy: warehouseUser.id,
      deliveredAt: new Date('2025-08-18T15:30:00Z')
    },
    {
      poNumber: 'PO-PWK-026-082025',
      supplierId: suppliers[1].id,
      orderDate: new Date('2025-08-19T09:00:00Z'),
      expectedDelivery: new Date('2025-08-22T08:00:00Z'),
      actualDelivery: null,
      status: PurchaseOrderStatus.CONFIRMED,
      totalAmount: 18200000,
      notes: 'Pre-order protein untuk week 4 production',
      orderedBy: adminUser.id,
      receivedBy: null,
      deliveredAt: null
    },
    {
      poNumber: 'PO-PWK-027-082025',
      supplierId: suppliers[5].id,
      orderDate: new Date('2025-08-20T11:30:00Z'),
      expectedDelivery: new Date('2025-08-23T09:00:00Z'),
      actualDelivery: null,
      status: PurchaseOrderStatus.PENDING,
      totalAmount: 4900000,
      notes: 'Bumbu khusus untuk menu Ramadan, menunggu approval',
      orderedBy: adminUser.id,
      receivedBy: null,
      deliveredAt: null
    },
    {
      poNumber: 'PO-PWK-028-082025',
      supplierId: suppliers[0].id,
      orderDate: new Date('2025-08-25T14:00:00Z'),
      expectedDelivery: new Date('2025-08-29T10:00:00Z'),
      actualDelivery: null,
      status: PurchaseOrderStatus.SHIPPED,
      totalAmount: 35000000,
      notes: 'Bulk order beras untuk September - dalam perjalanan',
      orderedBy: adminUser.id,
      receivedBy: null,
      deliveredAt: null
    },
    {
      poNumber: 'PO-PWK-029-082025',
      supplierId: suppliers[2].id,
      orderDate: new Date('2025-08-28T08:00:00Z'),
      expectedDelivery: new Date('2025-08-30T06:00:00Z'),
      actualDelivery: null,
      status: PurchaseOrderStatus.PENDING,
      totalAmount: 7200000,
      notes: 'Sayuran organik untuk akhir bulan, menunggu konfirmasi supplier',
      orderedBy: adminUser.id,
      receivedBy: null,
      deliveredAt: null
    }
  )

  // Create purchase orders
  for (const poData of purchaseOrders) {
    await prisma.purchaseOrder.upsert({
      where: { poNumber: poData.poNumber },
      update: poData,
      create: poData
    })
  }

  // Now create purchase order items with comprehensive data
  const createdPOs = await prisma.purchaseOrder.findMany({
    orderBy: { orderDate: 'asc' }
  })
  
  const purchaseOrderItems: Array<{
    purchaseOrderId: string
    rawMaterialId: string
    quantity: number
    unit: string
    unitPrice: number
    totalPrice: number
    notes: string
  }> = []

  // Helper function to get random raw material
  const getRawMaterial = (type?: string) => {
    if (type === 'rice') return rawMaterials.find(rm => rm.name.toLowerCase().includes('beras')) || rawMaterials[0]
    if (type === 'chicken') return rawMaterials.find(rm => rm.name.toLowerCase().includes('ayam')) || rawMaterials[1]
    if (type === 'fish') return rawMaterials.find(rm => rm.name.toLowerCase().includes('ikan')) || rawMaterials[2]
    if (type === 'egg') return rawMaterials.find(rm => rm.name.toLowerCase().includes('telur')) || rawMaterials[3]
    if (type === 'vegetable') return rawMaterials.find(rm => rm.name.toLowerCase().includes('sayur') || rm.name.toLowerCase().includes('bayam') || rm.name.toLowerCase().includes('wortel')) || rawMaterials[4]
    return rawMaterials[Math.floor(Math.random() * rawMaterials.length)]
  }

  // Generate items for each PO
  createdPOs.forEach((po, index) => {
    const poAmount = po.totalAmount
    
    if (po.poNumber.includes('PO-PWK-001-032025')) {
      // March PO 1 - Basic rice order
      purchaseOrderItems.push(
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial('rice').id,
          quantity: 1200,
          unit: 'kg',
          unitPrice: 15000,
          totalPrice: 18000000,
          notes: 'Beras premium grade A'
        },
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial('vegetable').id,
          quantity: 50,
          unit: 'kg',
          unitPrice: 10000,
          totalPrice: 500000,
          notes: 'Sayuran pelengkap'
        }
      )
    } else if (po.poNumber.includes('PO-PWK-002-032025')) {
      // March PO 2 - Protein
      purchaseOrderItems.push(
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial('chicken').id,
          quantity: 250,
          unit: 'kg',
          unitPrice: 35000,
          totalPrice: 8750000,
          notes: 'Ayam fillet segar'
        },
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial('egg').id,
          quantity: 150,
          unit: 'kg',
          unitPrice: 23000,
          totalPrice: 3450000,
          notes: 'Telur grade A'
        }
      )
    } else if (po.poNumber.includes('PO-PWK-003-032025')) {
      // March PO 3 - Vegetables
      purchaseOrderItems.push(
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial('vegetable').id,
          quantity: 200,
          unit: 'kg',
          unitPrice: 12000,
          totalPrice: 2400000,
          notes: 'Sayuran segar campuran'
        },
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial().id,
          quantity: 100,
          unit: 'kg',
          unitPrice: 32000,
          totalPrice: 3200000,
          notes: 'Bahan tambahan berkualitas'
        }
      )
    } else if (po.poNumber.includes('PO-PWK-004-032025')) {
      // March PO 4 - Fish & seafood
      purchaseOrderItems.push(
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial('fish').id,
          quantity: 300,
          unit: 'kg',
          unitPrice: 25000,
          totalPrice: 7500000,
          notes: 'Ikan bandeng segar'
        },
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial().id,
          quantity: 70,
          unit: 'kg',
          unitPrice: 20000,
          totalPrice: 1400000,
          notes: 'Seafood pelengkap'
        }
      )
    } else if (po.poNumber.includes('PO-PWK-005-042025')) {
      // April PO 1 - Bulk rice
      purchaseOrderItems.push(
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial('rice').id,
          quantity: 1600,
          unit: 'kg',
          unitPrice: 15500,
          totalPrice: 24800000,
          notes: 'Beras premium bulk order'
        }
      )
    } else if (po.poNumber.includes('PO-PWK-019-082025')) {
      // Current August orders
      purchaseOrderItems.push(
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial('rice').id,
          quantity: 1500,
          unit: 'kg',
          unitPrice: 15000,
          totalPrice: 22500000,
          notes: 'Beras premium untuk produksi August'
        }
      )
    } else if (po.poNumber.includes('PO-PWK-020-082025')) {
      purchaseOrderItems.push(
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial('chicken').id,
          quantity: 300,
          unit: 'kg',
          unitPrice: 32000,
          totalPrice: 9600000,
          notes: 'Ayam fillet premium'
        },
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial('fish').id,
          quantity: 200,
          unit: 'kg',
          unitPrice: 18000,
          totalPrice: 3600000,
          notes: 'Ikan bandeng segar'
        },
        {
          purchaseOrderId: po.id,
          rawMaterialId: getRawMaterial('egg').id,
          quantity: 100,
          unit: 'kg',
          unitPrice: 25500,
          totalPrice: 2550000,
          notes: 'Telur grade A medium'
        }
      )
    } else {
      // Generate default items for other POs based on amount
      const poAmountValue = poAmount || 0
      const itemCount = Math.floor(poAmountValue / 5000000) + 1 // More expensive POs get more items
      
      for (let i = 0; i < Math.min(itemCount, 4); i++) {
        const material = getRawMaterial()
        const basePrice = Math.floor(poAmountValue / itemCount)
        const variance = basePrice * 0.2 // 20% variance
        const itemPrice = basePrice + (Math.random() - 0.5) * variance
        
        const unitPrice = Math.floor(Math.random() * 40000) + 10000 // 10k - 50k
        const quantity = Math.floor(itemPrice / unitPrice)
        
        if (quantity > 0) {
          purchaseOrderItems.push({
            purchaseOrderId: po.id,
            rawMaterialId: material.id,
            quantity: quantity,
            unit: ['kg', 'pcs', 'liter', 'pack'][Math.floor(Math.random() * 4)],
            unitPrice: unitPrice,
            totalPrice: Math.floor(quantity * unitPrice),
            notes: `${material.name} berkualitas tinggi untuk produksi`
          })
        }
      }
    }
  })

  for (const itemData of purchaseOrderItems) {
    await prisma.purchaseOrderItem.create({
      data: itemData
    })
  }

  const poCount = await prisma.purchaseOrder.count()
  const poItemCount = await prisma.purchaseOrderItem.count()
  console.log(`✅ Purchase orders seeded: ${poCount} orders, ${poItemCount} items`)
}
