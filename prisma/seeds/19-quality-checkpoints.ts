import { PrismaClient, QualityCheckStatus } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedQualityCheckpoints() {
  console.log('🔍 Seeding quality checkpoints...')

  // Get reference data
  const productionPlans = await prisma.productionPlan.findMany()
  const productionBatches = await prisma.productionBatch.findMany()
  const users = await prisma.user.findMany()

  if (productionPlans.length === 0 || productionBatches.length === 0 || users.length === 0) {
    console.log('⚠️  Production plans, batches, or users not found. Please seed them first.')
    return
  }

  // Find QC users
  const qcUser = users.find(u => u.email.includes('qc')) || users[0]

  const qualityCheckpoints = [
    // Production Plan Level Checkpoints
    {
      productionPlanId: productionPlans[0].id,
      batchId: null,
      checkpointType: 'Pre-Production Setup',
      checkedAt: new Date('2025-08-05T04:30:00Z'),
      checkedBy: qcUser.id,
      status: QualityCheckStatus.PASS,
      temperature: 22.5,
      visualInspection: 'Kitchen area bersih, equipment dalam kondisi baik, semua bahan tersedia',
      tasteTest: null,
      textureEvaluation: null,
      correctiveAction: null,
      photos: ['/uploads/qc/pre-production-20250805.jpg'],
      metrics: {
        cleanliness: 'Excellent',
        equipmentStatus: 'All operational',
        ingredientQuality: 'Fresh and good',
        temperatureCompliance: 'Within range'
      },
      notes: 'Semua persiapan sesuai standar, siap untuk produksi'
    },

    // Batch Level Checkpoints - Week 1
    {
      productionPlanId: null,
      batchId: productionBatches[0].id, // Nasi Ayam Gurih batch
      checkpointType: 'Mid-Production Check',
      checkedAt: new Date('2025-08-05T07:00:00Z'),
      checkedBy: qcUser.id,
      status: QualityCheckStatus.PASS,
      temperature: 75.8,
      visualInspection: 'Nasi pulen, warna ayam golden brown, porsi seragam',
      tasteTest: 'Rasa gurih balance, tidak terlalu asin, tekstur ayam tender',
      textureEvaluation: 'Nasi tidak lembek, ayam empuk, bumbu meresap baik',
      correctiveAction: null,
      photos: ['/uploads/qc/batch-001-mid-20250805.jpg'],
      metrics: {
        portionWeight: '295-305g (target: 300g)',
        temperature: '75.8°C (target: >75°C)',
        visualAppearance: 'Excellent',
        tasteProfile: 'Good',
        textureQuality: 'Good'
      },
      notes: 'Batch berjalan sesuai standar, kualitas konsisten'
    },
    {
      productionPlanId: null,
      batchId: productionBatches[0].id,
      checkpointType: 'Final Quality Check',
      checkedAt: new Date('2025-08-05T08:30:00Z'),
      checkedBy: qcUser.id,
      status: QualityCheckStatus.PASS,
      temperature: 68.5,
      visualInspection: 'Packaging rapi, label lengkap, tidak ada kontaminasi',
      tasteTest: 'Final taste test passed, rasa konsisten',
      textureEvaluation: 'Texture maintained, masih hangat saat packaging',
      correctiveAction: null,
      photos: ['/uploads/qc/batch-001-final-20250805.jpg'],
      metrics: {
        packagingQuality: 'Excellent',
        labelAccuracy: '100%',
        finalTemperature: '68.5°C',
        totalPortions: '500',
        rejectedPortions: '0'
      },
      notes: 'Batch 001 lolos QC final, siap distribusi'
    },

    // Batch 2 - Minor Issue Example
    {
      productionPlanId: null,
      batchId: productionBatches[1].id, // Nasi Ikan Bandeng batch
      checkpointType: 'Mid-Production Check',
      checkedAt: new Date('2025-08-06T07:30:00Z'),
      checkedBy: qcUser.id,
      status: QualityCheckStatus.CONDITIONAL,
      temperature: 74.2,
      visualInspection: 'Ikan sedikit overcooked pada beberapa porsi, warna terlalu gelap',
      tasteTest: 'Rasa masih acceptable, tapi texture ikan agak keras',
      textureEvaluation: 'Nasi baik, ikan perlu penyesuaian waktu goreng',
      correctiveAction: 'Kurangi waktu penggorengan 2 menit untuk batch selanjutnya',
      photos: ['/uploads/qc/batch-002-conditional-20250806.jpg'],
      metrics: {
        portionWeight: '290-310g',
        temperature: '74.2°C (slightly below target)',
        visualAppearance: 'Fair',
        tasteProfile: 'Acceptable',
        textureQuality: 'Fair'
      },
      notes: 'Perlu penyesuaian proses, masih dalam batas acceptable'
    },
    {
      productionPlanId: null,
      batchId: productionBatches[1].id,
      checkpointType: 'Final Quality Check',
      checkedAt: new Date('2025-08-06T09:00:00Z'),
      checkedBy: qcUser.id,
      status: QualityCheckStatus.PASS,
      temperature: 67.8,
      visualInspection: 'Setelah adjustment, kualitas packaging baik',
      tasteTest: 'Final taste acceptable untuk distribusi',
      textureEvaluation: 'Dalam batas standar untuk distribusi',
      correctiveAction: null,
      photos: ['/uploads/qc/batch-002-final-20250806.jpg'],
      metrics: {
        packagingQuality: 'Good',
        labelAccuracy: '100%',
        finalTemperature: '67.8°C',
        totalPortions: '480',
        rejectedPortions: '12'
      },
      notes: 'Lolos QC dengan catatan improvement untuk batch berikutnya'
    },

    // Excellent Quality Example - Batch 3
    {
      productionPlanId: null,
      batchId: productionBatches[2].id, // High efficiency batch
      checkpointType: 'Mid-Production Check',
      checkedAt: new Date('2025-08-07T06:30:00Z'),
      checkedBy: qcUser.id,
      status: QualityCheckStatus.PASS,
      temperature: 78.2,
      visualInspection: 'Kualitas excellent, warna telur golden, nasi perfect texture',
      tasteTest: 'Rasa optimal, seasoning balance, sangat baik',
      textureEvaluation: 'Texture nasi dan telur excellent, sesuai standar premium',
      correctiveAction: null,
      photos: ['/uploads/qc/batch-003-excellent-20250807.jpg'],
      metrics: {
        portionWeight: '298-302g (very consistent)',
        temperature: '78.2°C (optimal)',
        visualAppearance: 'Excellent',
        tasteProfile: 'Excellent',
        textureQuality: 'Excellent'
      },
      notes: 'Batch terbaik minggu ini, standar untuk dikontinuasi'
    },

    // Problem Example - Batch 4
    {
      productionPlanId: null,
      batchId: productionBatches[3].id, // Batch with equipment issues
      checkpointType: 'Mid-Production Check',
      checkedAt: new Date('2025-08-08T08:00:00Z'),
      checkedBy: qcUser.id,
      status: QualityCheckStatus.FAIL,
      temperature: 65.8,
      visualInspection: 'Temperature tidak mencapai target, warna pucat pada beberapa porsi',
      tasteTest: 'Under-seasoned, texture tidak optimal',
      textureEvaluation: 'Tempe tidak crispy karena temperature rendah',
      correctiveAction: 'Stop produksi, service equipment, re-cook affected portions',
      photos: ['/uploads/qc/batch-004-fail-20250808.jpg'],
      metrics: {
        portionWeight: '285-315g (inconsistent)',
        temperature: '65.8°C (below minimum)',
        visualAppearance: 'Poor',
        tasteProfile: 'Below standard',
        textureQuality: 'Poor'
      },
      notes: 'Equipment failure detected, batch direject untuk rework'
    },
    {
      productionPlanId: null,
      batchId: productionBatches[3].id,
      checkpointType: 'Rework Quality Check',
      checkedAt: new Date('2025-08-08T11:00:00Z'),
      checkedBy: qcUser.id,
      status: QualityCheckStatus.PASS,
      temperature: 76.4,
      visualInspection: 'Setelah rework, kualitas membaik signifikan',
      tasteTest: 'Rasa sudah sesuai standar, improvement significant',
      textureEvaluation: 'Texture tempe crispy, nasi dalam kondisi baik',
      correctiveAction: null,
      photos: ['/uploads/qc/batch-004-rework-20250808.jpg'],
      metrics: {
        portionWeight: '295-305g (corrected)',
        temperature: '76.4°C (target achieved)',
        visualAppearance: 'Good',
        tasteProfile: 'Good',
        textureQuality: 'Good'
      },
      notes: 'Rework berhasil, batch lolos QC untuk distribusi'
    },

    // Current week checkpoint (in progress)
    {
      productionPlanId: productionPlans[2].id, // Week 3 plan
      batchId: null,
      checkpointType: 'Pre-Production Setup',
      checkedAt: new Date('2025-08-19T04:30:00Z'),
      checkedBy: qcUser.id,
      status: QualityCheckStatus.PASS,
      temperature: 21.8,
      visualInspection: 'Equipment dalam kondisi prima setelah maintenance weekend',
      tasteTest: null,
      textureEvaluation: null,
      correctiveAction: null,
      photos: ['/uploads/qc/pre-production-20250819.jpg'],
      metrics: {
        cleanliness: 'Excellent',
        equipmentStatus: 'All operational',
        ingredientQuality: 'Fresh delivery',
        readinessLevel: '100%'
      },
      notes: 'Siap untuk produksi minggu ketiga dengan target 540 porsi'
    }
  ]

  for (const checkpointData of qualityCheckpoints) {
    await prisma.qualityCheckpoint.create({
      data: checkpointData
    })
  }

  const checkpointCount = await prisma.qualityCheckpoint.count()
  console.log(`✅ Quality checkpoints seeded: ${checkpointCount} checkpoints with comprehensive QC data`)
}
