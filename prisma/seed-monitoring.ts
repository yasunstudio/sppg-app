import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function seedMonitoringData() {
  console.log('🌱 Seeding monitoring data...')

  // Clear existing data in correct order (respecting foreign key constraints)
  await prisma.nutritionConsultation.deleteMany()
  await prisma.feedback.deleteMany()
  await prisma.resourceUsage.deleteMany()
  await prisma.qualityCheckpoint.deleteMany()
  await prisma.productionBatch.deleteMany()
  await prisma.productionPlan.deleteMany()
  await prisma.productionResource.deleteMany()
  await prisma.productionMetrics.deleteMany()
  await prisma.qualityStandard.deleteMany()
  await prisma.recipeIngredient.deleteMany()
  await prisma.recipe.deleteMany()
  await prisma.item.deleteMany()
  await prisma.financialTransaction.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.distributionSchool.deleteMany()
  await prisma.distribution.deleteMany()
  await prisma.delivery.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.menuItemIngredient.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.menu.deleteMany()
  await prisma.inventoryItem.deleteMany()
  await prisma.rawMaterial.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.student.deleteMany()
  await prisma.class.deleteMany()
  await prisma.school.deleteMany()
  await prisma.userRole.deleteMany()
  await prisma.role.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@sppg.com',
        name: 'Administrator SPPG',
        password: '$2b$10$hashedpassword',
        phone: '+62812345678',
        address: 'Jl. Administrasi No. 1',
        isActive: true
      }
    }),
    prisma.user.create({
      data: {
        email: 'chef@sppg.com',
        name: 'Chef Utama',
        password: '$2b$10$hashedpassword',
        phone: '+62812345679',
        address: 'Jl. Dapur No. 2',
        isActive: true
      }
    }),
    prisma.user.create({
      data: {
        email: 'qc@sppg.com',
        name: 'Quality Control Manager',
        password: '$2b$10$hashedpassword',
        phone: '+62812345680',
        address: 'Jl. Kualitas No. 3',
        isActive: true
      }
    })
  ])

  // 2. Create Roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'System Administrator',
      permissions: ['READ_ALL', 'WRITE_ALL', 'DELETE_ALL']
    }
  })

  const chefRole = await prisma.role.create({
    data: {
      name: 'CHEF',
      description: 'Head Chef',
      permissions: ['READ_PRODUCTION', 'WRITE_PRODUCTION', 'READ_QUALITY']
    }
  })

  // 3. Assign roles
  await Promise.all([
    prisma.userRole.create({
      data: { userId: users[0].id, roleId: adminRole.id }
    }),
    prisma.userRole.create({
      data: { userId: users[1].id, roleId: chefRole.id }
    }),
    prisma.userRole.create({
      data: { userId: users[2].id, roleId: chefRole.id }
    })
  ])

  // 4. Create Schools
  const schools = await Promise.all([
    prisma.school.create({
      data: {
        name: 'SDN 001 Jakarta Pusat',
        principalName: 'Dra. Siti Nurhaliza',
        principalPhone: '+62811111111',
        address: 'Jl. Merdeka No. 1, Jakarta Pusat',
        totalStudents: 450,
        latitude: -6.2088,
        longitude: 106.8456
      }
    }),
    prisma.school.create({
      data: {
        name: 'SDN 002 Jakarta Utara',
        principalName: 'Drs. Ahmad Wijaya',
        principalPhone: '+62811111112',
        address: 'Jl. Kemerdekaan No. 2, Jakarta Utara',
        totalStudents: 380,
        latitude: -6.1500,
        longitude: 106.8600
      }
    }),
    prisma.school.create({
      data: {
        name: 'SDN 003 Jakarta Selatan',
        principalName: 'Dr. Maria Christina',
        principalPhone: '+62811111113',
        address: 'Jl. Pendidikan No. 3, Jakarta Selatan',
        totalStudents: 520,
        latitude: -6.2600,
        longitude: 106.7800
      }
    })
  ])

  // 5. Create Students for each school
  for (const school of schools) {
    const studentPromises = []
    for (let i = 1; i <= 10; i++) {
      studentPromises.push(
        prisma.student.create({
          data: {
            nisn: `${school.id.slice(-4)}${i.toString().padStart(3, '0')}`,
            name: `Siswa ${i} ${school.name.split(' ')[1]}`,
            age: Math.floor(Math.random() * 5) + 6, // 6-10 years old
            gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
            grade: `${Math.floor(Math.random() * 6) + 1}`,
            parentName: `Orang Tua Siswa ${i}`,
            schoolId: school.id
          }
        })
      )
    }
    await Promise.all(studentPromises)
  }

  // 6. Create Classes for each school
  for (const school of schools) {
    for (let grade = 1; grade <= 6; grade++) {
      await prisma.class.create({
        data: {
          name: `Kelas ${grade}A`,
          grade: grade,
          capacity: 30,
          currentCount: Math.floor(Math.random() * 5) + 25, // 25-30 students
          teacherName: `Guru Kelas ${grade}A`,
          schoolId: school.id
        }
      })
    }
  }

  // 7. Create Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'PT. Sumber Protein Nusantara',
        contactName: 'Budi Santoso',
        phone: '+62821111111',
        email: 'budi@protein.com',
        address: 'Jl. Protein No. 1, Jakarta',
        isActive: true
      }
    }),
    prisma.supplier.create({
      data: {
        name: 'CV. Sayur Segar Mandiri',
        contactName: 'Sari Wulandari',
        phone: '+62821111112',
        email: 'sari@sayur.com',
        address: 'Jl. Sayuran No. 2, Bogor',
        isActive: true
      }
    }),
    prisma.supplier.create({
      data: {
        name: 'UD. Beras Berkah',
        contactName: 'Joko Widodo',
        phone: '+62821111113',
        email: 'joko@beras.com',
        address: 'Jl. Beras No. 3, Karawang',
        isActive: true
      }
    })
  ])

  // 8. Create Raw Materials
  const rawMaterials = await Promise.all([
    prisma.rawMaterial.create({
      data: {
        name: 'Beras Putih Premium',
        category: 'GRAIN',
        unit: 'kg',
        description: 'Beras putih kualitas premium untuk makanan sehat',
        caloriesPer100g: 130,
        proteinPer100g: 2.7,
        fatPer100g: 0.3,
        carbsPer100g: 28,
        fiberPer100g: 0.4
      }
    }),
    prisma.rawMaterial.create({
      data: {
        name: 'Ayam Kampung Segar',
        category: 'PROTEIN',
        unit: 'kg',
        description: 'Daging ayam kampung segar untuk protein berkualitas',
        caloriesPer100g: 239,
        proteinPer100g: 27.3,
        fatPer100g: 13.6,
        carbsPer100g: 0,
        fiberPer100g: 0
      }
    }),
    prisma.rawMaterial.create({
      data: {
        name: 'Kangkung Segar',
        category: 'VEGETABLE',
        unit: 'kg',
        description: 'Sayur kangkung segar dari petani lokal',
        caloriesPer100g: 19,
        proteinPer100g: 3,
        fatPer100g: 0.2,
        carbsPer100g: 3.1,
        fiberPer100g: 2.5
      }
    }),
    prisma.rawMaterial.create({
      data: {
        name: 'Tempe Kedelai',
        category: 'PROTEIN',
        unit: 'kg',
        description: 'Tempe kedelai segar untuk protein nabati',
        caloriesPer100g: 201,
        proteinPer100g: 20.3,
        fatPer100g: 8.8,
        carbsPer100g: 13.5,
        fiberPer100g: 9.0
      }
    }),
    prisma.rawMaterial.create({
      data: {
        name: 'Minyak Kelapa Sawit',
        category: 'OIL',
        unit: 'liter',
        description: 'Minyak goreng kelapa sawit untuk memasak',
        caloriesPer100g: 884,
        proteinPer100g: 0,
        fatPer100g: 100,
        carbsPer100g: 0,
        fiberPer100g: 0
      }
    })
  ])

  // 9. Create Inventory Items
  for (const rawMaterial of rawMaterials) {
    await prisma.inventoryItem.create({
      data: {
        rawMaterialId: rawMaterial.id,
        quantity: Math.floor(Math.random() * 500) + 100, // 100-600 units
        unitPrice: Math.floor(Math.random() * 50000) + 10000, // 10,000-60,000 per unit
        totalPrice: 0, // Will be calculated
        expiryDate: new Date(Date.now() + (Math.floor(Math.random() * 30) + 7) * 24 * 60 * 60 * 1000), // 7-37 days from now
        batchNumber: `BT${Date.now().toString().slice(-6)}`,
        supplierId: suppliers[Math.floor(Math.random() * suppliers.length)].id,
        qualityStatus: 'GOOD'
      }
    })
  }

  // Update total prices
  const inventoryItems = await prisma.inventoryItem.findMany()
  for (const item of inventoryItems) {
    await prisma.inventoryItem.update({
      where: { id: item.id },
      data: { totalPrice: item.quantity * item.unitPrice }
    })
  }

  // 10. Create Items for recipes
  const items = await Promise.all([
    prisma.item.create({
      data: {
        name: 'Beras Putih',
        category: 'STAPLE_FOOD',
        unit: 'KG',
        unitPrice: 15000,
        nutritionPer100g: { calories: 130, protein: 2.7, fat: 0.3, carbs: 28, fiber: 0.4 },
        allergens: [],
        shelfLife: 365,
        storageRequirement: 'Tempat kering dan sejuk',
        supplierId: suppliers[2].id
      }
    }),
    prisma.item.create({
      data: {
        name: 'Daging Ayam',
        category: 'PROTEIN',
        unit: 'KG',
        unitPrice: 35000,
        nutritionPer100g: { calories: 239, protein: 27.3, fat: 13.6, carbs: 0, fiber: 0 },
        allergens: [],
        shelfLife: 3,
        storageRequirement: 'Kulkas 0-4°C',
        supplierId: suppliers[0].id
      }
    }),
    prisma.item.create({
      data: {
        name: 'Kangkung',
        category: 'VEGETABLES',
        unit: 'KG',
        unitPrice: 8000,
        nutritionPer100g: { calories: 19, protein: 3, fat: 0.2, carbs: 3.1, fiber: 2.5 },
        allergens: [],
        shelfLife: 3,
        storageRequirement: 'Kulkas 4-8°C',
        supplierId: suppliers[1].id
      }
    }),
    prisma.item.create({
      data: {
        name: 'Tempe',
        category: 'PROTEIN',
        unit: 'KG',
        unitPrice: 12000,
        nutritionPer100g: { calories: 201, protein: 20.3, fat: 8.8, carbs: 13.5, fiber: 9.0 },
        allergens: ['kedelai'],
        shelfLife: 5,
        storageRequirement: 'Kulkas 4-8°C',
        supplierId: suppliers[0].id
      }
    })
  ])

  // 11. Create Recipes
  const recipes = await Promise.all([
    prisma.recipe.create({
      data: {
        name: 'Nasi Ayam Kangkung',
        description: 'Menu lengkap dengan nasi, ayam, dan sayur kangkung',
        category: 'MAIN_COURSE',
        servingSize: 100,
        prepTime: 30,
        cookTime: 45,
        difficulty: 'MEDIUM',
        instructions: {
          steps: [
            'Cuci beras dan masak menjadi nasi',
            'Potong ayam sesuai ukuran',
            'Tumis ayam hingga matang',
            'Bersihkan kangkung dan potong',
            'Tumis kangkung dengan bumbu',
            'Sajikan nasi dengan ayam dan kangkung'
          ]
        },
        nutritionInfo: {
          calories: 450,
          protein: 25,
          fat: 12,
          carbs: 55,
          fiber: 4
        },
        allergenInfo: [],
        cost: 12000
      }
    }),
    prisma.recipe.create({
      data: {
        name: 'Nasi Tempe Goreng',
        description: 'Menu ekonomis dengan nasi dan tempe goreng',
        category: 'MAIN_COURSE',
        servingSize: 100,
        prepTime: 20,
        cookTime: 30,
        difficulty: 'EASY',
        instructions: {
          steps: [
            'Masak nasi putih',
            'Potong tempe tipis-tipis',
            'Goreng tempe hingga kecoklatan',
            'Sajikan nasi dengan tempe goreng'
          ]
        },
        nutritionInfo: {
          calories: 380,
          protein: 18,
          fat: 8,
          carbs: 52,
          fiber: 6
        },
        allergenInfo: ['kedelai'],
        cost: 8000
      }
    })
  ])

  // 12. Create Recipe Ingredients
  await Promise.all([
    // Nasi Ayam Kangkung ingredients
    prisma.recipeIngredient.create({
      data: {
        recipeId: recipes[0].id,
        itemId: items[0].id, // Beras
        quantity: 80,
        unit: 'gram'
      }
    }),
    prisma.recipeIngredient.create({
      data: {
        recipeId: recipes[0].id,
        itemId: items[1].id, // Ayam
        quantity: 60,
        unit: 'gram'
      }
    }),
    prisma.recipeIngredient.create({
      data: {
        recipeId: recipes[0].id,
        itemId: items[2].id, // Kangkung
        quantity: 40,
        unit: 'gram'
      }
    }),
    // Nasi Tempe ingredients
    prisma.recipeIngredient.create({
      data: {
        recipeId: recipes[1].id,
        itemId: items[0].id, // Beras
        quantity: 80,
        unit: 'gram'
      }
    }),
    prisma.recipeIngredient.create({
      data: {
        recipeId: recipes[1].id,
        itemId: items[3].id, // Tempe
        quantity: 50,
        unit: 'gram'
      }
    })
  ])

  // 13. Create Menus
  const today = new Date()
  const menus = []
  for (let i = 0; i < 7; i++) {
    const menuDate = new Date(today)
    menuDate.setDate(today.getDate() + i)
    
    const menu = await prisma.menu.create({
      data: {
        name: `Menu ${i % 2 === 0 ? 'Nasi Ayam Kangkung' : 'Nasi Tempe Goreng'}`,
        description: `Menu sehat untuk hari ${menuDate.toLocaleDateString('id-ID')}`,
        menuDate: menuDate,
        mealType: 'LUNCH',
        targetGroup: 'STUDENT',
        totalCalories: i % 2 === 0 ? 450 : 380,
        totalProtein: i % 2 === 0 ? 25 : 18,
        totalFat: i % 2 === 0 ? 12 : 8,
        totalCarbs: i % 2 === 0 ? 55 : 52,
        totalFiber: i % 2 === 0 ? 4 : 6,
        createdById: users[1].id
      }
    })
    menus.push(menu)

    // No need to connect recipes here as they're connected through production plans
  }

  // 14. Create Drivers
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        employeeId: 'DRV001',
        name: 'Budi Santoso',
        phone: '+62813333333',
        email: 'budi.driver@sppg.com',
        licenseNumber: 'B1234567',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        address: 'Jl. Driver No. 1',
        emergencyContact: 'Siti Santoso',
        emergencyPhone: '+62813333334',
        rating: 4.8,
        totalDeliveries: 245
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'DRV002',
        name: 'Andi Wijaya',
        phone: '+62813333335',
        email: 'andi.driver@sppg.com',
        licenseNumber: 'B2345678',
        licenseExpiry: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000), // 300 days from now
        address: 'Jl. Driver No. 2',
        emergencyContact: 'Nina Wijaya',
        emergencyPhone: '+62813333336',
        rating: 4.5,
        totalDeliveries: 198
      }
    })
  ])

  // 15. Create Vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        plateNumber: 'B 1234 ABC',
        type: 'Truck Box',
        capacity: 1000,
        lastService: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        notes: 'Kondisi baik, siap operasional'
      }
    }),
    prisma.vehicle.create({
      data: {
        plateNumber: 'B 5678 DEF',
        type: 'Pick Up',
        capacity: 500,
        lastService: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        notes: 'Kondisi prima, baru servis'
      }
    })
  ])

  // 16. Create Distributions (last 7 days)
  for (let i = 0; i < 7; i++) {
    const distDate = new Date(today)
    distDate.setDate(today.getDate() - i)
    
    const distribution = await prisma.distribution.create({
      data: {
        distributionDate: distDate,
        driverId: drivers[i % 2].id,
        vehicleId: vehicles[i % 2].id,
        status: i === 0 ? 'PREPARING' : (i === 1 ? 'IN_TRANSIT' : 'COMPLETED'),
        totalPortions: Math.floor(Math.random() * 500) + 1000, // 1000-1500 portions
        estimatedDuration: 480, // 8 hours
        actualDuration: i > 1 ? Math.floor(Math.random() * 60) + 420 : null, // 7-8 hours if completed
        notes: `Distribusi untuk ${schools.length} sekolah`
      }
    })

    // Create distribution schools
    for (const school of schools) {
      await prisma.distributionSchool.create({
        data: {
          distributionId: distribution.id,
          schoolId: school.id,
          plannedPortions: Math.floor(school.totalStudents * 0.9), // 90% attendance
          actualPortions: i > 1 ? Math.floor(school.totalStudents * (0.85 + Math.random() * 0.1)) : null,
          routeOrder: schools.indexOf(school) + 1
        }
      })
    }
  }

  // 17. Create Production Resources
  const productionResources = await Promise.all([
    prisma.productionResource.create({
      data: {
        name: 'Kompor Gas Industrial',
        type: 'EQUIPMENT',
        capacityPerHour: 500,
        status: 'AVAILABLE',
        location: 'Dapur Utama A',
        specifications: {
          type: 'Gas Industrial',
          burners: 6,
          power: '50,000 BTU/hour'
        }
      }
    }),
    prisma.productionResource.create({
      data: {
        name: 'Steam Cooker',
        type: 'EQUIPMENT',
        capacityPerHour: 300,
        status: 'AVAILABLE',
        location: 'Dapur Utama B',
        specifications: {
          type: 'Steam Cooker',
          capacity: '300 portions/hour',
          power: '15 kW'
        }
      }
    }),
    prisma.productionResource.create({
      data: {
        name: 'Tim Chef A',
        type: 'STAFF',
        capacityPerHour: 200,
        status: 'AVAILABLE',
        location: 'Dapur Utama',
        specifications: {
          members: 5,
          shift: 'Pagi (06:00-14:00)',
          expertise: 'Menu utama dan sayuran'
        }
      }
    }),
    prisma.productionResource.create({
      data: {
        name: 'Tim Chef B',
        type: 'STAFF',
        capacityPerHour: 180,
        status: 'AVAILABLE',
        location: 'Dapur Utama',
        specifications: {
          members: 4,
          shift: 'Siang (10:00-18:00)',
          expertise: 'Protein dan finishing'
        }
      }
    }),
    prisma.productionResource.create({
      data: {
        name: 'Area Prep 1',
        type: 'KITCHEN_AREA',
        capacityPerHour: 400,
        status: 'AVAILABLE',
        location: 'Lantai 1 - Zona A',
        specifications: {
          size: '50 m²',
          equipment: ['Cutting boards', 'Prep tables', 'Washing stations'],
          capacity: '400 portions prep/hour'
        }
      }
    })
  ])

  // 18. Create Production Plans (last 7 days)
  for (let i = 0; i < 7; i++) {
    const planDate = new Date(today)
    planDate.setDate(today.getDate() - i)
    
    const totalPortions = Math.floor(Math.random() * 300) + 1200 // 1200-1500 portions
    
    const productionPlan = await prisma.productionPlan.create({
      data: {
        planDate: planDate,
        targetPortions: totalPortions,
        menuId: menus[i % menus.length]?.id,
        status: i === 0 ? 'PLANNED' : (i === 1 ? 'IN_PROGRESS' : 'COMPLETED'),
        plannedStartTime: new Date(planDate.getTime() + 6 * 60 * 60 * 1000), // 6 AM
        plannedEndTime: new Date(planDate.getTime() + 12 * 60 * 60 * 1000), // 12 PM
        actualStartTime: i > 0 ? new Date(planDate.getTime() + 6 * 60 * 60 * 1000 + Math.random() * 30 * 60 * 1000) : null,
        actualEndTime: i > 1 ? new Date(planDate.getTime() + 12 * 60 * 60 * 1000 + (Math.random() - 0.5) * 60 * 60 * 1000) : null,
        notes: `Produksi ${totalPortions} porsi untuk distribusi hari ini`
      }
    })

    // Create Production Batches for each recipe
    for (let batchNum = 1; batchNum <= 3; batchNum++) {
      const batchPortions = Math.floor(totalPortions / 3)
      const batch = await prisma.productionBatch.create({
        data: {
          productionPlanId: productionPlan.id,
          batchNumber: `${planDate.toISOString().slice(0, 10)}-B${batchNum}`,
          recipeId: recipes[(i + batchNum) % recipes.length].id,
          plannedQuantity: batchPortions,
          actualQuantity: i > 1 ? Math.floor(batchPortions * (0.95 + Math.random() * 0.1)) : null,
          status: i === 0 ? 'PENDING' : (i === 1 ? 'IN_PROGRESS' : 'COMPLETED'),
          startedAt: i > 0 ? new Date(planDate.getTime() + (5 + batchNum) * 60 * 60 * 1000) : null,
          completedAt: i > 1 ? new Date(planDate.getTime() + (8 + batchNum) * 60 * 60 * 1000) : null,
          qualityScore: i > 1 ? 85 + Math.random() * 15 : null, // 85-100
          temperatureLog: i > 1 ? {
            prep: '4°C',
            cooking: '85-90°C',
            final: '65°C',
            packaging: '60°C'
          } : undefined,
          notes: `Batch ${batchNum} - ${batchPortions} porsi`
        }
      })

      // Create Resource Usage for each batch
      if (i > 1) { // Only for completed batches
        await Promise.all([
          prisma.resourceUsage.create({
            data: {
              batchId: batch.id,
              resourceId: productionResources[0].id, // Kompor Gas
              startTime: new Date(planDate.getTime() + (5 + batchNum) * 60 * 60 * 1000),
              endTime: new Date(planDate.getTime() + (7 + batchNum) * 60 * 60 * 1000),
              plannedDuration: 120,
              actualDuration: 110 + Math.floor(Math.random() * 20),
              efficiency: 90 + Math.random() * 10
            }
          }),
          prisma.resourceUsage.create({
            data: {
              batchId: batch.id,
              resourceId: productionResources[2].id, // Tim Chef A
              startTime: new Date(planDate.getTime() + (5 + batchNum) * 60 * 60 * 1000),
              endTime: new Date(planDate.getTime() + (8 + batchNum) * 60 * 60 * 1000),
              plannedDuration: 180,
              actualDuration: 170 + Math.floor(Math.random() * 20),
              efficiency: 85 + Math.random() * 15
            }
          })
        ])
      }

      // Create Quality Checkpoints
      if (i > 0) { // For in-progress and completed
        await prisma.qualityCheckpoint.create({
          data: {
            productionPlanId: productionPlan.id,
            batchId: batch.id,
            checkpointType: 'Temperature Check',
            checkedAt: new Date(planDate.getTime() + (6 + batchNum) * 60 * 60 * 1000),
            checkedBy: users[2].id,
            status: 'PASS',
            temperature: 65 + Math.random() * 25, // 65-90°C
            visualInspection: 'Warna dan tekstur sesuai standar',
            tasteTest: i > 1 ? 'Rasa dan aroma baik' : null,
            textureEvaluation: 'Tekstur sesuai dengan resep',
            metrics: {
              hygiene_score: 95 + Math.random() * 5,
              portion_consistency: 90 + Math.random() * 10,
              temperature_compliance: 95 + Math.random() * 5
            },
            notes: `Quality check batch ${batchNum} - semua parameter dalam standar`
          }
        })
      }
    }
  }

  // 19. Create Production Metrics (last 30 days)
  for (let i = 0; i < 30; i++) {
    const metricsDate = new Date(today)
    metricsDate.setDate(today.getDate() - i)
    
    const targetProd = 1200 + Math.floor(Math.random() * 400) // 1200-1600
    const actualProd = Math.floor(targetProd * (0.9 + Math.random() * 0.15)) // 90-105% of target
    
    await prisma.productionMetrics.create({
      data: {
        date: metricsDate,
        totalProduction: actualProd,
        targetProduction: targetProd,
        efficiency: (actualProd / targetProd) * 100,
        qualityScore: 85 + Math.random() * 15, // 85-100
        wastageAmount: Math.random() * 20 + 5, // 5-25 kg
        costPerPortion: 8000 + Math.random() * 4000, // 8000-12000 rupiah
        energyUsage: 150 + Math.random() * 50, // 150-200 kWh
        waterUsage: 2000 + Math.random() * 1000, // 2000-3000 liters
        laborHours: 40 + Math.random() * 20, // 40-60 hours
        equipmentUptime: 85 + Math.random() * 15 // 85-100%
      }
    })
  }

  // 20. Create Quality Standards
  await Promise.all([
    prisma.qualityStandard.create({
      data: {
        name: 'Suhu Makanan Saat Penyajian',
        description: 'Suhu minimum makanan saat disajikan',
        targetValue: 65,
        currentValue: 68.5,
        unit: '°C',
        category: 'TEMPERATURE_CONTROL'
      }
    }),
    prisma.qualityStandard.create({
      data: {
        name: 'Kebersihan Area Produksi',
        description: 'Score kebersihan area produksi (1-100)',
        targetValue: 95,
        currentValue: 97.2,
        unit: 'Score',
        category: 'HYGIENE_STANDARDS'
      }
    }),
    prisma.qualityStandard.create({
      data: {
        name: 'Konsistensi Porsi',
        description: 'Tingkat konsistensi ukuran porsi makanan',
        targetValue: 90,
        currentValue: 92.8,
        unit: '%',
        category: 'PORTION_CONTROL'
      }
    }),
    prisma.qualityStandard.create({
      data: {
        name: 'Kandungan Protein per Porsi',
        description: 'Kandungan protein minimum per porsi',
        targetValue: 20,
        currentValue: 23.5,
        unit: 'gram',
        category: 'NUTRITION_VALUE'
      }
    }),
    prisma.qualityStandard.create({
      data: {
        name: 'Tingkat Kepuasan Rasa',
        description: 'Survey kepuasan terhadap rasa makanan',
        targetValue: 80,
        currentValue: 87.3,
        unit: '%',
        category: 'VISUAL_APPEARANCE'
      }
    })
  ])

  // 21. Create Financial Transactions (last 30 days)
  const categories = ['RAW_MATERIALS', 'TRANSPORTATION', 'UTILITIES', 'SALARIES', 'EQUIPMENT', 'MAINTENANCE'] as const
  
  for (let i = 0; i < 60; i++) { // More transactions for realistic data
    const transDate = new Date(today)
    transDate.setDate(today.getDate() - Math.floor(i / 2))
    
    const category = categories[Math.floor(Math.random() * categories.length)]
    const isIncome = Math.random() < 0.1 // 10% chance of income
    
    let amount: number
    let description: string
    
    switch (category) {
      case 'RAW_MATERIALS':
        amount = 2000000 + Math.random() * 8000000 // 2-10 million
        description = 'Pembelian bahan baku untuk produksi'
        break
      case 'TRANSPORTATION':
        amount = 500000 + Math.random() * 2000000 // 0.5-2.5 million
        description = 'Biaya transportasi dan distribusi'
        break
      case 'UTILITIES':
        amount = 1000000 + Math.random() * 3000000 // 1-4 million
        description = 'Listrik, air, dan gas'
        break
      case 'SALARIES':
        amount = 5000000 + Math.random() * 10000000 // 5-15 million
        description = 'Gaji karyawan dan tunjangan'
        break
      case 'EQUIPMENT':
        amount = 3000000 + Math.random() * 20000000 // 3-23 million
        description = 'Pembelian dan upgrade peralatan'
        break
      case 'MAINTENANCE':
        amount = 500000 + Math.random() * 2500000 // 0.5-3 million
        description = 'Maintenance peralatan dan fasilitas'
        break
      default:
        amount = 1000000
        description = 'Transaksi lain-lain'
    }

    if (isIncome) {
      amount = 50000000 + Math.random() * 100000000 // 50-150 million for income
      description = 'Penerimaan dana program makanan sehat'
    }

    await prisma.financialTransaction.create({
      data: {
        type: isIncome ? 'INCOME' : 'EXPENSE',
        category: category,
        amount: amount,
        description: description,
        budgetPeriod: `${transDate.getFullYear()}-${(transDate.getMonth() + 1).toString().padStart(2, '0')}`,
        createdAt: transDate
      }
    })
  }

  // 22. Create Budget allocations
  const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`
  const nextMonth = `${today.getFullYear()}-${(today.getMonth() + 2).toString().padStart(2, '0')}`

  for (const category of categories) {
    let allocated: number
    
    switch (category) {
      case 'RAW_MATERIALS': allocated = 150000000; break // 150 million
      case 'TRANSPORTATION': allocated = 50000000; break // 50 million
      case 'UTILITIES': allocated = 30000000; break // 30 million
      case 'SALARIES': allocated = 200000000; break // 200 million
      case 'EQUIPMENT': allocated = 100000000; break // 100 million
      case 'MAINTENANCE': allocated = 25000000; break // 25 million
      default: allocated = 10000000 // 10 million
    }

    // Current month budget
    const spent = allocated * (0.6 + Math.random() * 0.3) // 60-90% spent
    await prisma.budget.create({
      data: {
        period: currentMonth,
        category: category,
        allocated: allocated,
        spent: spent,
        remaining: allocated - spent
      }
    })

    // Next month budget
    await prisma.budget.create({
      data: {
        period: nextMonth,
        category: category,
        allocated: allocated * 1.05, // 5% increase
        spent: 0,
        remaining: allocated * 1.05
      }
    })
  }

  console.log('✅ Monitoring data seeded successfully!')
  console.log(`Created:
  - ${users.length} users
  - ${schools.length} schools with ${schools.length * 10} students
  - ${suppliers.length} suppliers
  - ${rawMaterials.length} raw materials with inventory
  - ${items.length} items and ${recipes.length} recipes
  - 7 days of menus and production plans
  - 7 days of distributions
  - 30 days of production metrics
  - 60 financial transactions
  - ${categories.length * 2} budget entries
  - 5 quality standards
  - ${productionResources.length} production resources`)
}

seedMonitoringData()
  .catch((e) => {
    console.error('Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
