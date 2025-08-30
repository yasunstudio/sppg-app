/**
 * Script untuk mengisi data realistis ke dalam tabel-tabel yang masih kosong
 * Untuk meningkatkan user experience aplikasi SPPG
 */

import { PrismaClient, Gender, ActivityType, ActivityStatus, PlanStatus, MealTime, ParticipantType, NutritionStatus } from './src/generated/prisma'
import { prisma } from './src/lib/prisma'

async function populateHealthRecords() {
  console.log('🏥 Populating Health Records...')
  
  // Get existing participants
  const participants = await prisma.posyanduParticipant.findMany({
    take: 10
  })

  const healthRecords = []
  
  for (const participant of participants) {
    // Create 3-5 health records per participant over the last 6 months
    const recordCount = Math.floor(Math.random() * 3) + 3
    
    for (let i = 0; i < recordCount; i++) {
      const recordDate = new Date()
      recordDate.setMonth(recordDate.getMonth() - i * 2) // Every 2 months
      
      // Generate realistic health data based on participant type
      const baseWeight = participant.participantType === 'CHILD' ? 12 : 
                        participant.participantType === 'PREGNANT' ? 65 : 55
      const baseHeight = participant.participantType === 'CHILD' ? 85 : 
                        participant.participantType === 'PREGNANT' ? 160 : 158
      
      healthRecords.push({
        participantId: participant.id,
        recordDate,
        weight: baseWeight + (Math.random() * 10 - 5), // ±5kg variation
        height: baseHeight + (Math.random() * 10 - 5), // ±5cm variation
        headCircumference: participant.participantType === 'CHILD' ? 
          45 + (Math.random() * 5) : null,
        armCircumference: 25 + (Math.random() * 5),
        bloodPressure: participant.participantType !== 'CHILD' ? 
          `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 10)}` : null,
        hemoglobin: 12 + (Math.random() * 3),
        temperature: 36.2 + (Math.random() * 1.5),
        weightForAge: ['NORMAL', 'UNDERWEIGHT', 'OVERWEIGHT'][Math.floor(Math.random() * 3)],
        heightForAge: ['NORMAL', 'STUNTED', 'TALL'][Math.floor(Math.random() * 3)],
        weightForHeight: ['NORMAL', 'WASTED', 'OVERWEIGHT'][Math.floor(Math.random() * 3)],
        symptoms: i === 0 ? ['Batuk ringan', 'Demam', 'Nafsu makan berkurang', null][Math.floor(Math.random() * 4)] : null,
        diagnosis: i === 0 ? ['Infeksi saluran napas atas', 'Gizi kurang', 'Sehat', null][Math.floor(Math.random() * 4)] : null,
        treatment: i === 0 ? ['Vitamin C, istirahat cukup', 'Suplemen zat besi', 'Tidak perlu pengobatan', null][Math.floor(Math.random() * 4)] : null,
        notes: i === 0 ? 'Kontrol rutin bulanan' : null
      })
    }
  }

  await prisma.healthRecord.createMany({
    data: healthRecords,
    skipDuplicates: true
  })
  
  console.log(`✅ Created ${healthRecords.length} health records`)
}

async function populatePregnantWomen() {
  console.log('🤱 Populating Pregnant Women...')
  
  const posyandus = await prisma.posyandu.findMany()
  
  const pregnantWomen = [
    {
      nik: '3201234567890123',
      name: 'Siti Nurhaliza',
      age: 28,
      posyanduId: posyandus[0]?.id,
      notes: 'Kehamilan pertama, usia kandungan 6 bulan'
    },
    {
      nik: '3201234567890124',
      name: 'Dewi Sartika',
      age: 32,
      posyanduId: posyandus[1]?.id || posyandus[0]?.id,
      notes: 'Kehamilan kedua, riwayat anemia'
    },
    {
      nik: '3201234567890125',
      name: 'Rina Marlina',
      age: 25,
      posyanduId: posyandus[0]?.id,
      notes: 'Kehamilan pertama, kondisi sehat'
    },
    {
      nik: '3201234567890126',
      name: 'Maya Sari',
      age: 30,
      posyanduId: posyandus[1]?.id || posyandus[0]?.id,
      notes: 'Kehamilan ketiga, perlu monitoring ekstra'
    },
    {
      nik: '3201234567890127',
      name: 'Lestari Wulandari',
      age: 27,
      posyanduId: posyandus[0]?.id,
      notes: 'Kehamilan kedua, vegetarian'
    }
  ]

  await prisma.pregnantWoman.createMany({
    data: pregnantWomen.filter(p => p.posyanduId),
    skipDuplicates: true
  })
  
  console.log(`✅ Created ${pregnantWomen.length} pregnant women records`)
}

async function populateLactatingMothers() {
  console.log('🍼 Populating Lactating Mothers...')
  
  const posyandus = await prisma.posyandu.findMany()
  
  const lactatingMothers = [
    {
      nik: '3201234567890128',
      name: 'Indah Permatasari',
      age: 29,
      posyanduId: posyandus[0]?.id,
      notes: 'Menyusui anak pertama (3 bulan), produksi ASI cukup'
    },
    {
      nik: '3201234567890129',
      name: 'Sri Rahayu',
      age: 33,
      posyanduId: posyandus[1]?.id || posyandus[0]?.id,
      notes: 'Menyusui anak kedua (8 bulan), mulai MPASI'
    },
    {
      nik: '3201234567890130',
      name: 'Fitri Handayani',
      age: 26,
      posyanduId: posyandus[0]?.id,
      notes: 'Menyusui anak pertama (5 bulan), perlu konseling gizi'
    },
    {
      nik: '3201234567890131',
      name: 'Wati Suryani',
      age: 31,
      posyanduId: posyandus[1]?.id || posyandus[0]?.id,
      notes: 'Menyusui anak ketiga (2 bulan), berpengalaman'
    },
    {
      nik: '3201234567890132',
      name: 'Nur Azizah',
      age: 24,
      posyanduId: posyandus[0]?.id,
      notes: 'Menyusui anak pertama (6 bulan), butuh support group'
    }
  ]

  await prisma.lactatingMother.createMany({
    data: lactatingMothers.filter(l => l.posyanduId),
    skipDuplicates: true
  })
  
  console.log(`✅ Created ${lactatingMothers.length} lactating mothers records`)
}

async function populateToddlers() {
  console.log('👶 Populating Toddlers...')
  
  const posyandus = await prisma.posyandu.findMany()
  
  const toddlers = [
    {
      nik: '3201234567890133',
      name: 'Ahmad Fauzi',
      age: 2,
      gender: Gender.MALE,
      parentName: 'Budi Santoso',
      posyanduId: posyandus[0]?.id,
      notes: 'Pertumbuhan normal, aktif bermain'
    },
    {
      nik: '3201234567890134',
      name: 'Sari Dewi',
      age: 1,
      gender: Gender.FEMALE,
      parentName: 'Joni Kurniawan',
      posyanduId: posyandus[1]?.id || posyandus[0]?.id,
      notes: 'Berat badan kurang, perlu monitoring gizi'
    },
    {
      nik: '3201234567890135',
      name: 'Muhammad Rizki',
      age: 3,
      gender: Gender.MALE,
      parentName: 'Hasan Basri',
      posyanduId: posyandus[0]?.id,
      notes: 'Sudah bisa bicara lancar, perkembangan bagus'
    },
    {
      nik: '3201234567890136',
      name: 'Putri Cantika',
      age: 2,
      gender: Gender.FEMALE,
      parentName: 'Slamet Riyadi',
      posyanduId: posyandus[1]?.id || posyandus[0]?.id,
      notes: 'Alergi susu sapi, perlu alternatif protein'
    },
    {
      nik: '3201234567890137',
      name: 'Bayu Pratama',
      age: 1,
      gender: Gender.MALE,
      parentName: 'Agus Setiawan',
      posyanduId: posyandus[0]?.id,
      notes: 'Baru mulai berjalan, perkembangan motorik baik'
    }
  ]

  await prisma.toddler.createMany({
    data: toddlers.filter(t => t.posyanduId),
    skipDuplicates: true
  })
  
  console.log(`✅ Created ${toddlers.length} toddlers records`)
}

async function populateNutritionPlans() {
  console.log('🥗 Populating Nutrition Plans...')
  
  const participants = await prisma.posyanduParticipant.findMany({
    take: 8
  })
  
  const nutritionPlans = []
  
  for (const participant of participants) {
    const planTypes = [
      {
        name: 'Program Gizi Balita Sehat',
        description: 'Rencana gizi untuk balita dengan status gizi normal',
        calories: 1200,
        protein: 25,
        fat: 35,
        carbs: 150
      },
      {
        name: 'Program Pemulihan Gizi Kurang',
        description: 'Rencana gizi untuk mengatasi masalah gizi kurang',
        calories: 1500,
        protein: 35,
        fat: 40,
        carbs: 180
      },
      {
        name: 'Program Gizi Ibu Hamil',
        description: 'Rencana gizi khusus untuk ibu hamil trimester 2-3',
        calories: 2200,
        protein: 75,
        fat: 60,
        carbs: 280
      },
      {
        name: 'Program Gizi Ibu Menyusui',
        description: 'Rencana gizi untuk ibu menyusui 0-6 bulan',
        calories: 2500,
        protein: 85,
        fat: 70,
        carbs: 310
      }
    ]
    
    const selectedPlan = planTypes[Math.floor(Math.random() * planTypes.length)]
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 3))
    
    nutritionPlans.push({
      participantId: participant.id,
      planName: selectedPlan.name,
      description: selectedPlan.description,
      targetCalories: selectedPlan.calories,
      targetProtein: selectedPlan.protein,
      targetFat: selectedPlan.fat,
      targetCarbs: selectedPlan.carbs,
      dietaryRestrictions: ['Tidak ada', 'Vegetarian', 'Bebas gluten', 'Rendah garam'][Math.floor(Math.random() * 4)],
      supplementation: ['Zat besi', 'Vitamin D', 'Asam folat', 'Tidak ada'][Math.floor(Math.random() * 4)],
      startDate,
      endDate: new Date(startDate.getTime() + (90 * 24 * 60 * 60 * 1000)), // 3 months later
      status: PlanStatus.ACTIVE
    })
  }

  await prisma.nutritionPlan.createMany({
    data: nutritionPlans,
    skipDuplicates: true
  })
  
  console.log(`✅ Created ${nutritionPlans.length} nutrition plans`)
}

async function populateNutritionPlanRecipes() {
  console.log('🍽️ Populating Nutrition Plan Recipes...')
  
  const nutritionPlans = await prisma.nutritionPlan.findMany()
  const recipes = await prisma.recipe.findMany({
    take: 10
  })
  
  if (recipes.length === 0) {
    console.log('⚠️ No recipes found, skipping nutrition plan recipes')
    return
  }
  
  const planRecipes = []
  
  for (const plan of nutritionPlans) {
    // Add 3-5 recipes per nutrition plan
    const recipeCount = Math.floor(Math.random() * 3) + 3
    const selectedRecipes = recipes.sort(() => 0.5 - Math.random()).slice(0, recipeCount)
    
    for (const recipe of selectedRecipes) {
      planRecipes.push({
        nutritionPlanId: plan.id,
        recipeId: recipe.id,
        frequency: ['Daily', 'Weekly', '3x per week', '2x per week'][Math.floor(Math.random() * 4)],
        portionSize: 1 + (Math.random() * 0.5), // 1-1.5 portions
        mealTime: [MealTime.BREAKFAST, MealTime.LUNCH, MealTime.DINNER, MealTime.SNACK_MORNING][Math.floor(Math.random() * 4)],
        notes: ['Sesuaikan dengan selera anak', 'Dapat dimodifikasi sesuai kebutuhan', 'Perhatikan alergi', null][Math.floor(Math.random() * 4)]
      })
    }
  }

  await prisma.nutritionPlanRecipe.createMany({
    data: planRecipes,
    skipDuplicates: true
  })
  
  console.log(`✅ Created ${planRecipes.length} nutrition plan recipes`)
}

async function populatePosyanduActivities() {
  console.log('🎯 Populating Posyandu Activities...')
  
  const posyandus = await prisma.posyandu.findMany()
  
  const activities = []
  
  for (const posyandu of posyandus) {
    const activityTypes = [
      {
        name: 'Pemeriksaan Kesehatan Rutin',
        type: ActivityType.HEALTH_CHECK,
        description: 'Pemeriksaan kesehatan bulanan untuk balita dan ibu',
        duration: 180,
        targetParticipants: 25
      },
      {
        name: 'Penyuluhan Gizi Seimbang',
        type: ActivityType.HEALTH_EDUCATION,
        description: 'Edukasi tentang pentingnya gizi seimbang untuk keluarga',
        duration: 120,
        targetParticipants: 30
      },
      {
        name: 'Konseling Gizi',
        type: ActivityType.NUTRITION_COUNSELING,
        description: 'Konseling gizi individual untuk ibu hamil dan balita',
        duration: 90,
        targetParticipants: 20
      },
      {
        name: 'Monitoring Pertumbuhan',
        type: ActivityType.GROWTH_MONITORING,
        description: 'Pemantauan pertumbuhan anak secara berkala',
        duration: 60,
        targetParticipants: 15
      },
      {
        name: 'Imunisasi Balita',
        type: ActivityType.IMMUNIZATION,
        description: 'Program imunisasi rutin untuk balita',
        duration: 120,
        targetParticipants: 20
      }
    ]
    
    // Create activities for the last 3 months and next 2 months
    for (let monthOffset = -3; monthOffset <= 2; monthOffset++) {
      const activityDate = new Date()
      activityDate.setMonth(activityDate.getMonth() + monthOffset)
      activityDate.setDate(15) // Mid month
      
      for (const actType of activityTypes.slice(0, 3)) { // 3 activities per month
        const isCompleted = monthOffset < 0
        const actualParticipants = isCompleted ? 
          Math.floor(actType.targetParticipants * (0.7 + Math.random() * 0.3)) : null
        
        activities.push({
          posyanduId: posyandu.id,
          activityName: actType.name,
          activityType: actType.type,
          description: actType.description,
          scheduledDate: new Date(activityDate),
          actualDate: isCompleted ? new Date(activityDate) : null,
          duration: isCompleted ? actType.duration + Math.floor(Math.random() * 30 - 15) : actType.duration,
          participantCount: actualParticipants,
          targetParticipants: actType.targetParticipants,
          status: isCompleted ? ActivityStatus.COMPLETED : ActivityStatus.PLANNED,
          notes: isCompleted ? 
            ['Kegiatan berjalan lancar', 'Antusiasme peserta tinggi', 'Perlu follow up', 'Evaluasi positif'][Math.floor(Math.random() * 4)] :
            'Persiapan sedang berlangsung'
        })
      }
    }
  }

  await prisma.posyanduActivity.createMany({
    data: activities,
    skipDuplicates: true
  })
  
  console.log(`✅ Created ${activities.length} posyandu activities`)
}

async function main() {
  console.log('🚀 Starting data population for better user experience...\n')
  
  try {
    await populateHealthRecords()
    await populatePregnantWomen()
    await populateLactatingMothers()
    await populateToddlers()
    await populateNutritionPlans()
    await populateNutritionPlanRecipes()
    await populatePosyanduActivities()
    
    console.log('\n✅ All data populated successfully!')
    console.log('🎉 Application now has realistic data for better user experience')
    
  } catch (error) {
    console.error('❌ Error populating data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
