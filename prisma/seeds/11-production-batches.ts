import { PrismaClient, ProductionBatchStatus, ProductionPlanStatus } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedProductionBatches() {
  console.log('🏭 Seeding production plans and batches for SPPG Purwakarta August 2025...')
  
  // Get recipes to link production batches
  const recipes = await prisma.recipe.findMany({
    select: { id: true, name: true }
  })
  
  // Get menus
  const menus = await prisma.menu.findMany({
    select: { id: true, name: true }
  })
  
  // Get users for production staff assignments  
  const productionUsers = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            name: {
              in: ['CHEF', 'PRODUCTION_STAFF']
            }
          }
        }
      }
    },
    select: { id: true, name: true }
  })
  
  // First create production plans
  const productionPlans = [
    {
      id: 'plan-week1-082025',
      planDate: new Date('2025-08-05T00:00:00Z'),
      targetPortions: 2400,
      menuId: menus[0]?.id || null,
      status: ProductionPlanStatus.COMPLETED,
      plannedStartTime: new Date('2025-08-05T06:00:00Z'),
      plannedEndTime: new Date('2025-08-09T12:00:00Z'),
      actualStartTime: new Date('2025-08-05T06:00:00Z'),
      actualEndTime: new Date('2025-08-09T11:45:00Z'),
      notes: 'Minggu pertama Agustus 2025 - produksi berjalan lancar'
    },
    {
      id: 'plan-week2-082025',
      planDate: new Date('2025-08-12T00:00:00Z'),
      targetPortions: 2500,
      menuId: menus[1]?.id || null,
      status: ProductionPlanStatus.COMPLETED,
      plannedStartTime: new Date('2025-08-12T06:00:00Z'),
      plannedEndTime: new Date('2025-08-16T12:00:00Z'),
      actualStartTime: new Date('2025-08-12T06:00:00Z'),
      actualEndTime: new Date('2025-08-16T11:50:00Z'),
      notes: 'Minggu kedua Agustus 2025 - target tercapai'
    },
    {
      id: 'plan-week3-082025',
      planDate: new Date('2025-08-19T00:00:00Z'),
      targetPortions: 2600,
      menuId: menus[2]?.id || null,
      status: ProductionPlanStatus.IN_PROGRESS,
      plannedStartTime: new Date('2025-08-19T06:00:00Z'),
      plannedEndTime: new Date('2025-08-23T12:00:00Z'),
      actualStartTime: new Date('2025-08-19T06:00:00Z'),
      actualEndTime: null,
      notes: 'Minggu ketiga Agustus 2025 - sedang berjalan'
    }
  ]
  
  // Create production plans first
  for (const plan of productionPlans) {
    await prisma.productionPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan
    })
  }
  
  const productionBatches = [
    // Week 1 August 2025 (5-9 August)
    {
      id: 'batch-001-20250805',
      productionPlanId: 'plan-week1-082025',
      batchNumber: 'PB-PWK-001-082025',
      recipeId: recipes.find(r => r.name.includes('Nasi Ayam'))?.id || recipes[0]?.id,
      plannedQuantity: 500,
      actualQuantity: 495,
      status: ProductionBatchStatus.COMPLETED,
      startedAt: new Date('2025-08-05T06:00:00Z'),
      completedAt: new Date('2025-08-05T09:30:00Z'),
      qualityScore: 95,
      notes: 'Produksi lancar, kualitas sangat baik. Ayam segar dari supplier lokal.'
    },
    {
      id: 'batch-002-20250806',
      productionPlanId: 'plan-week1-082025',
      batchNumber: 'PB-PWK-002-082025',
      recipeId: recipes.find(r => r.name.includes('Nasi Ikan'))?.id || recipes[1]?.id,
      plannedQuantity: 480,
      actualQuantity: 478,
      status: ProductionBatchStatus.COMPLETED,
      startedAt: new Date('2025-08-06T06:00:00Z'),
      completedAt: new Date('2025-08-06T09:45:00Z'),
      qualityScore: 92,
      notes: 'Ikan bandeng berkualitas baik, proses berjalan sesuai SOP.'
    },
    {
      id: 'batch-003-20250807',
      productionPlanId: 'plan-week1-082025',
      batchNumber: 'PB-PWK-003-082025',
      recipeId: recipes.find(r => r.name.includes('Nasi Telur'))?.id || recipes[2]?.id,
      plannedQuantity: 520,
      actualQuantity: 520,
      status: ProductionBatchStatus.COMPLETED,
      startedAt: new Date('2025-08-07T06:00:00Z'),
      completedAt: new Date('2025-08-07T09:15:00Z'),
      qualityScore: 98,
      notes: 'Telur segar, hasil produksi sempurna sesuai target.'
    },
    {
      id: 'batch-004-20250808',
      productionPlanId: 'plan-week1-082025',
      batchNumber: 'PB-PWK-004-082025',
      recipeId: recipes.find(r => r.name.includes('Nasi Tempe'))?.id || recipes[3]?.id,
      plannedQuantity: 450,
      actualQuantity: 450,
      status: ProductionBatchStatus.COMPLETED,
      startedAt: new Date('2025-08-08T06:00:00Z'),
      completedAt: new Date('2025-08-08T09:00:00Z'),
      qualityScore: 94,
      notes: 'Tempe berkualitas tinggi, tekstur dan rasa sesuai standar.'
    },
    {
      id: 'batch-005-20250809',
      productionPlanId: 'plan-week1-082025',
      batchNumber: 'PB-PWK-005-082025',
      recipeId: recipes.find(r => r.name.includes('Nasi Tahu'))?.id || recipes[4]?.id,
      plannedQuantity: 460,
      actualQuantity: 458,
      status: ProductionBatchStatus.COMPLETED,
      startedAt: new Date('2025-08-09T06:00:00Z'),
      completedAt: new Date('2025-08-09T09:20:00Z'),
      qualityScore: 96,
      notes: 'Tahu segar, proses penggorengan optimal.'
    },
    
    // Week 2 August 2025 (12-16 August)
    {
      id: 'batch-006-20250812',
      productionPlanId: 'plan-week2-082025',
      batchNumber: 'PB-PWK-006-082025',
      recipeId: recipes.find(r => r.name.includes('Nasi Ayam'))?.id || recipes[0]?.id,
      plannedQuantity: 520,
      actualQuantity: 515,
      status: ProductionBatchStatus.COMPLETED,
      startedAt: new Date('2025-08-12T06:00:00Z'),
      completedAt: new Date('2025-08-12T09:35:00Z'),
      qualityScore: 93,
      notes: 'Produksi minggu kedua, konsistensi kualitas terjaga.'
    },
    {
      id: 'batch-007-20250813',
      productionPlanId: 'plan-week2-082025',
      batchNumber: 'PB-PWK-007-082025',
      recipeId: recipes.find(r => r.name.includes('Nasi Ikan'))?.id || recipes[1]?.id,
      plannedQuantity: 500,
      actualQuantity: 497,
      status: ProductionBatchStatus.COMPLETED,
      startedAt: new Date('2025-08-13T06:00:00Z'),
      completedAt: new Date('2025-08-13T09:50:00Z'),
      qualityScore: 91,
      notes: 'Supplier ikan memberikan kualitas yang konsisten.'
    },
    
    // Week 3 August 2025 (19-23 August) - Some in progress
    {
      id: 'batch-008-20250819',
      productionPlanId: 'plan-week3-082025',
      batchNumber: 'PB-PWK-008-082025',
      recipeId: recipes.find(r => r.name.includes('Nasi Telur'))?.id || recipes[2]?.id,
      plannedQuantity: 540,
      actualQuantity: null,
      status: ProductionBatchStatus.IN_PROGRESS,
      startedAt: new Date('2025-08-19T06:00:00Z'),
      completedAt: null,
      qualityScore: null,
      notes: 'Produksi dimulai pagi ini, estimasi selesai 09:30'
    },
    {
      id: 'batch-009-20250820',
      productionPlanId: 'plan-week3-082025',
      batchNumber: 'PB-PWK-009-082025',
      recipeId: recipes.find(r => r.name.includes('Nasi Tempe'))?.id || recipes[3]?.id,
      plannedQuantity: 470,
      actualQuantity: null,
      status: ProductionBatchStatus.PENDING,
      startedAt: null,
      completedAt: null,
      qualityScore: null,
      notes: 'Scheduled untuk besok, bahan baku sudah disiapkan.'
    },
    {
      id: 'batch-010-20250821',
      productionPlanId: 'plan-week3-082025',
      batchNumber: 'PB-PWK-010-082025',
      recipeId: recipes.find(r => r.name.includes('Nasi Tahu'))?.id || recipes[4]?.id,
      plannedQuantity: 480,
      actualQuantity: null,
      status: ProductionBatchStatus.PENDING,
      startedAt: null,
      completedAt: null,
      qualityScore: null,
      notes: 'Planning untuk Rabu, koordinasi dengan supplier tahu.'
    }
  ]
  
  try {
    for (const batch of productionBatches) {
      const createdBatch = await prisma.productionBatch.upsert({
        where: { id: batch.id },
        update: {
          productionPlanId: batch.productionPlanId,
          batchNumber: batch.batchNumber,
          recipeId: batch.recipeId,
          plannedQuantity: batch.plannedQuantity,
          actualQuantity: batch.actualQuantity,
          status: batch.status,
          startedAt: batch.startedAt,
          completedAt: batch.completedAt,
          qualityScore: batch.qualityScore,
          notes: batch.notes
        },
        create: batch
      })
      
      const statusIcon = batch.status === ProductionBatchStatus.COMPLETED ? '✅' : 
                        batch.status === ProductionBatchStatus.IN_PROGRESS ? '🔄' : '📅'
      console.log(`${statusIcon} Production batch seeded: ${batch.batchNumber} (${batch.status}, Qty: ${batch.plannedQuantity})`)
    }
    
    console.log(`🏭 Production batches seeding completed! Total: ${productionBatches.length} batches`)
  } catch (error) {
    console.error('❌ Error seeding production batches:', error)
    throw error
  }
}

export default seedProductionBatches
