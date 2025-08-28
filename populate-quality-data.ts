#!/usr/bin/env tsx

import { PrismaClient, QualityStandardCategory, QualityCheckStatus } from './src/generated/prisma';

const prisma = new PrismaClient();

async function populateQualityData() {
  console.log('Starting to populate quality data...');

  try {
    // First, let's check if we have users and production plans for relations
    const users = await prisma.user.findMany({ take: 5 });
    const productionPlans = await prisma.productionPlan.findMany({ take: 5 });
    const batches = await prisma.productionBatch.findMany({ take: 5 });

    console.log(`Found ${users.length} users, ${productionPlans.length} production plans, ${batches.length} batches`);

    if (users.length === 0) {
      console.log('No users found. Need users for quality checkpoints.');
      return;
    }

    // 1. Populate QualityStandard table
    console.log('\n1. Populating QualityStandard table...');
    
    const qualityStandards = [
      {
        name: 'Suhu Penyimpanan Makanan',
        description: 'Standar suhu untuk penyimpanan makanan yang aman',
        targetValue: 4.0,
        currentValue: 3.8,
        unit: '°C',
        category: QualityStandardCategory.TEMPERATURE_CONTROL,
        isActive: true,
      },
      {
        name: 'Suhu Penyajian Makanan Panas',
        description: 'Standar suhu minimum untuk penyajian makanan panas',
        targetValue: 65.0,
        currentValue: 67.2,
        unit: '°C',
        category: QualityStandardCategory.TEMPERATURE_CONTROL,
        isActive: true,
      },
      {
        name: 'Kebersihan Visual Makanan',
        description: 'Standar penampilan visual dan kebersihan makanan',
        targetValue: 95.0,
        currentValue: 92.5,
        unit: '%',
        category: QualityStandardCategory.VISUAL_APPEARANCE,
        isActive: true,
      },
      {
        name: 'Standar Kebersihan Dapur',
        description: 'Standar kebersihan area persiapan dan pengolahan makanan',
        targetValue: 98.0,
        currentValue: 96.8,
        unit: '%',
        category: QualityStandardCategory.HYGIENE_STANDARDS,
        isActive: true,
      },
      {
        name: 'Kontrol Porsi Makanan',
        description: 'Standar berat porsi makanan per siswa',
        targetValue: 250.0,
        currentValue: 248.5,
        unit: 'gram',
        category: QualityStandardCategory.PORTION_CONTROL,
        isActive: true,
      },
      {
        name: 'Nilai Gizi Protein',
        description: 'Standar kandungan protein dalam makanan per porsi',
        targetValue: 15.0,
        currentValue: 14.8,
        unit: 'gram',
        category: QualityStandardCategory.NUTRITION_VALUE,
        isActive: true,
      },
      {
        name: 'Standar Keamanan Pangan',
        description: 'Skor keamanan pangan berdasarkan protokol HACCP',
        targetValue: 100.0,
        currentValue: 98.5,
        unit: 'skor',
        category: QualityStandardCategory.SAFETY_STANDARDS,
        isActive: true,
      },
      {
        name: 'Kontrol Kontaminasi Silang',
        description: 'Protokol pencegahan kontaminasi silang dalam pengolahan',
        targetValue: 100.0,
        currentValue: 99.2,
        unit: '%',
        category: QualityStandardCategory.SAFETY_STANDARDS,
        isActive: true,
      },
      {
        name: 'Kualitas Visual Sayuran',
        description: 'Standar kesegaran dan penampilan sayuran',
        targetValue: 90.0,
        currentValue: 88.5,
        unit: '%',
        category: QualityStandardCategory.VISUAL_APPEARANCE,
        isActive: true,
      },
      {
        name: 'Sanitasi Peralatan Masak',
        description: 'Standar kebersihan peralatan masak dan saji',
        targetValue: 99.0,
        currentValue: 97.8,
        unit: '%',
        category: QualityStandardCategory.HYGIENE_STANDARDS,
        isActive: true,
      },
    ];

    const createdStandards = [];
    for (const standard of qualityStandards) {
      const created = await prisma.qualityStandard.create({
        data: standard,
      });
      createdStandards.push(created);
      console.log(`✓ Created standard: ${created.name}`);
    }

    // 2. Populate QualityCheckpoint table
    console.log('\n2. Populating QualityCheckpoint table...');
    
    const checkpointTypes = [
      'Inspeksi Bahan Baku',
      'Kontrol Suhu Memasak',
      'Pemeriksaan Visual',
      'Test Rasa',
      'Evaluasi Tekstur',
      'Inspeksi Kebersihan',
      'Kontrol Porsi',
      'Pemeriksaan Akhir'
    ];

    const qualityStatuses = [QualityCheckStatus.PASS, QualityCheckStatus.FAIL, QualityCheckStatus.CONDITIONAL];
    
    const visualInspections = [
      'Warna makanan sesuai standar, tidak ada noda atau kontaminasi',
      'Penampilan menarik dengan garnish segar',
      'Makanan tertata rapi dan bersih',
      'Sayuran tampak segar dan tidak layu',
      'Protein matang sempurna dengan warna yang baik'
    ];

    const tasteTests = [
      'Rasa seimbang, tidak terlalu asin atau hambar',
      'Bumbu meresap dengan baik',
      'Rasa segar dan gurih',
      'Tingkat kematangan tepat',
      'Kombinasi rasa harmonis'
    ];

    const textureEvaluations = [
      'Tekstur lembut dan mudah dikunyah',
      'Sayuran renyah dan tidak overcooked',
      'Protein tender dan juicy',
      'Nasi pulen dan tidak keras',
      'Konsistensi kuah sesuai standar'
    ];

    const createdCheckpoints = [];
    for (let i = 0; i < 15; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPlan = productionPlans.length > 0 ? productionPlans[Math.floor(Math.random() * productionPlans.length)] : null;
      const randomBatch = batches.length > 0 ? batches[Math.floor(Math.random() * batches.length)] : null;
      const randomCheckpointType = checkpointTypes[Math.floor(Math.random() * checkpointTypes.length)];
      const randomStatus = qualityStatuses[Math.floor(Math.random() * qualityStatuses.length)];
      
      const checkpoint = await prisma.qualityCheckpoint.create({
        data: {
          productionPlanId: randomPlan?.id || null,
          batchId: randomBatch?.id || null,
          checkpointType: randomCheckpointType,
          checkedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
          checkedBy: randomUser.id,
          status: randomStatus,
          temperature: randomCheckpointType.includes('Suhu') ? 60 + Math.random() * 15 : null,
          visualInspection: visualInspections[Math.floor(Math.random() * visualInspections.length)],
          tasteTest: tasteTests[Math.floor(Math.random() * tasteTests.length)],
          textureEvaluation: textureEvaluations[Math.floor(Math.random() * textureEvaluations.length)],
          correctiveAction: randomStatus === QualityCheckStatus.FAIL ? 'Diperlukan perbaikan dan pemeriksaan ulang' : null,
          photos: [],
          metrics: {
            score: Math.floor(Math.random() * 20) + 80, // 80-100 score
            checkDuration: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
            inspector: randomUser.name || 'Quality Inspector'
          },
          notes: `Pemeriksaan ${randomCheckpointType.toLowerCase()} dilakukan sesuai protokol standar`,
        },
      });
      
      createdCheckpoints.push(checkpoint);
      console.log(`✓ Created checkpoint: ${checkpoint.checkpointType} - ${checkpoint.status}`);
    }

    console.log('\n✅ Quality data population completed!');
    console.log(`📊 Summary:`);
    console.log(`   - QualityStandard records: ${createdStandards.length}`);
    console.log(`   - QualityCheckpoint records: ${createdCheckpoints.length}`);

    // Verify the data
    const standardCount = await prisma.qualityStandard.count();
    const checkpointCount = await prisma.qualityCheckpoint.count();
    
    console.log(`\n🔍 Verification:`);
    console.log(`   - Total QualityStandard in DB: ${standardCount}`);
    console.log(`   - Total QualityCheckpoint in DB: ${checkpointCount}`);

  } catch (error) {
    console.error('❌ Error populating quality data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populateQualityData().catch(console.error);
