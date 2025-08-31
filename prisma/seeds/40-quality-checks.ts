import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedQualityChecks() {
  console.log('🔬 Seeding quality checks...')
  
  // Get quality checkpoints and production batches for reference
  const qualityCheckpoints = await prisma.qualityCheckpoint.findMany({
    select: { id: true, checkpointType: true, batchId: true }
  })

  const productionBatches = await prisma.productionBatch.findMany({
    select: { id: true, batchNumber: true }
  })

  const rawMaterials = await prisma.rawMaterial.findMany({
    select: { id: true, name: true }
  })

  if (qualityCheckpoints.length === 0 || productionBatches.length === 0) {
    console.log('⚠️ No quality checkpoints or production batches found, skipping quality checks seeding')
    return
  }

  const qualityChecks = []

  // Add some specific quality check scenarios
  const specificChecks = [
    {
      id: 'qc-special-aug01-morning',
      type: 'PRODUCTION' as const,
      referenceType: 'PRODUCTION_BATCH',
      referenceId: productionBatches[0].id,
      checkedBy: 'QC Inspector Maya',
      color: 'Warna emas alami, sangat menarik',
      taste: 'Rasa gurih seimbang, bumbu meresap sempurna',
      aroma: 'Aroma harum menggugah selera',
      texture: 'Tekstur lembut dan tidak keras',
      temperature: 75.5,
      status: 'GOOD' as const,
      notes: 'Batch pertama Agustus - kualitas sangat baik. Semua parameter dalam rentang optimal.'
    },
    {
      id: 'qc-special-aug15-review',
      type: 'PRODUCTION' as const,
      referenceType: 'PRODUCTION_BATCH',
      referenceId: productionBatches[1]?.id || productionBatches[0].id,
      checkedBy: 'Senior QC Supervisor',
      color: 'Warna agak pucat dari standar',
      taste: 'Rasa kurang gurih, bumbu kurang meresap',
      aroma: 'Aroma normal tapi tidak kuat',
      texture: 'Tekstur sedikit keras',
      temperature: 68.2,
      status: 'FAIR' as const,
      notes: 'Review pertengahan bulan - kualitas dapat diterima tapi perlu peningkatan teknik memasak.'
    }
  ]

  // Generate quality checks for all production days in August 2025
  const allQualityChecks = []
  
  // Add specific checks first
  allQualityChecks.push(...specificChecks)

  // Keep track of used references to ensure uniqueness
  const usedReferences = new Set()
  specificChecks.forEach(check => {
    usedReferences.add(`${check.referenceType}:${check.referenceId}`)
  })

  // Generate regular checks for each production day
  const startDate = new Date(2025, 7, 1) // August 1, 2025
  const endDate = new Date(2025, 7, 31) // August 31, 2025
  let checkCounter = 1

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay()
    
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (dayOfWeek === 0 || dayOfWeek === 6) continue

    // Morning quality check (raw materials) - use unique raw materials
    const rawMaterialIndex = checkCounter % rawMaterials.length
    const rawMaterialRef = `RAW_MATERIAL:${rawMaterials[rawMaterialIndex].id}`
    
    if (!usedReferences.has(rawMaterialRef)) {
      const morningStatus = ['GOOD', 'GOOD', 'GOOD', 'FAIR'][Math.floor(Math.random() * 4)]
      allQualityChecks.push({
        id: `qc-${String(date.getDate()).padStart(2, '0')}-morning-${checkCounter}`,
        type: 'RAW_MATERIAL' as const,
        referenceType: 'RAW_MATERIAL',
        referenceId: rawMaterials[rawMaterialIndex].id,
        checkedBy: `QC Inspector ${['Maya', 'Andi', 'Sari', 'Budi'][checkCounter % 4]}`,
        color: ['Segar dan cerah', 'Warna alami baik', 'Tampak segar', 'Kondisi visual baik'][Math.floor(Math.random() * 4)],
        taste: 'Belum dicicip - pemeriksaan visual',
        aroma: ['Aroma segar', 'Tidak berbau menyengat', 'Aroma alami', 'Bau normal'][Math.floor(Math.random() * 4)],
        texture: ['Tekstur padat', 'Kondisi baik', 'Tidak lembek', 'Tekstur normal'][Math.floor(Math.random() * 4)],
        temperature: Math.round((Math.random() * 10 + 25) * 10) / 10, // 25-35°C
        status: morningStatus as 'GOOD' | 'FAIR',
        notes: `Pemeriksaan bahan baku pagi hari - ${date.toISOString().split('T')[0]}`
      })
      usedReferences.add(rawMaterialRef)
    }

    // Production quality check - use unique production batches
    const batchIndex = (checkCounter - 1) % productionBatches.length
    if (productionBatches[batchIndex]) {
      const batchRef = `PRODUCTION_BATCH:${productionBatches[batchIndex].id}`
      
      if (!usedReferences.has(batchRef)) {
        const productionStatus = ['GOOD', 'GOOD', 'FAIR'][Math.floor(Math.random() * 3)]
        allQualityChecks.push({
          id: `qc-${String(date.getDate()).padStart(2, '0')}-production-${checkCounter}`,
          type: 'PRODUCTION' as const,
          referenceType: 'PRODUCTION_BATCH',
          referenceId: productionBatches[batchIndex].id,
          checkedBy: `QC Supervisor ${['Rahman', 'Dewi', 'Agus'][checkCounter % 3]}`,
          color: ['Warna emas menarik', 'Warna coklat alami', 'Tampilan menggugah selera'][Math.floor(Math.random() * 3)],
          taste: ['Rasa gurih seimbang', 'Rasa lezat pas', 'Bumbu meresap sempurna'][Math.floor(Math.random() * 3)],
          aroma: ['Aroma harum menggugah', 'Bau sedap', 'Aroma khas masakan'][Math.floor(Math.random() * 3)],
          texture: ['Tekstur lembut ideal', 'Tidak keras berlebihan', 'Tekstur sesuai standar'][Math.floor(Math.random() * 3)],
          temperature: Math.round((Math.random() * 15 + 65) * 10) / 10, // 65-80°C
          status: productionStatus as 'GOOD' | 'FAIR',
          notes: `Pemeriksaan produksi rutin - Batch ${checkCounter}`
        })
        usedReferences.add(batchRef)
      }
    }

    checkCounter++
  }

  console.log(`Akan membuat ${allQualityChecks.length} quality checks...`)

  // Create quality checks with upsert
  for (const check of allQualityChecks) {
    const { id, ...checkData } = check
    await prisma.qualityCheck.upsert({
      where: {
        referenceType_referenceId: {
          referenceType: check.referenceType,
          referenceId: check.referenceId
        }
      },
      update: {
        checkedBy: check.checkedBy,
        color: check.color,
        taste: check.taste,
        aroma: check.aroma,
        texture: check.texture,
        temperature: check.temperature,
        status: check.status,
        notes: check.notes
      },
      create: checkData
    })
  }

  console.log(`✅ Created ${allQualityChecks.length} quality check records`)
}

export default seedQualityChecks
