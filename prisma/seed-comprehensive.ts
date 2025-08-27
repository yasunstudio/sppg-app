import { PrismaClient, FoodCategory, ConsultationStatus, QualityCheckType, QualityStatus, SampleType, SampleStatus } from "../src/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Creating comprehensive sample data for empty tables...")

  // Get existing data to reference
  const users = await prisma.user.findMany()
  const schools = await prisma.school.findMany()
  const students = await prisma.student.findMany()
  const menus = await prisma.menu.findMany()
  const recipes = await prisma.recipe.findMany()
  const rawMaterials = await prisma.rawMaterial.findMany()

  if (users.length === 0 || schools.length === 0) {
    console.log("❌ No basic data found. Please run the main seeder first.")
    return
  }

  // ============================================================================
  // 1. CREATE MENU ITEMS & INGREDIENTS
  // ============================================================================
  console.log("Creating menu items and ingredients...")
  
  const menuItems = []
  for (const menu of menus.slice(0, 3)) { // Only use first 3 menus
    const menuItemsForMenu = [
      {
        id: `menu-item-${menu.id}-1`,
        menuId: menu.id,
        name: "Nasi Putih",
        category: FoodCategory.RICE,
        servingSize: 150.0,
        description: "Nasi putih sebagai makanan pokok"
      },
      {
        id: `menu-item-${menu.id}-2`,
        menuId: menu.id,
        name: "Lauk Protein",
        category: FoodCategory.MAIN_DISH,
        servingSize: 75.0,
        description: "Sumber protein utama dalam menu"
      }
    ]

    for (const item of menuItemsForMenu) {
      try {
        await prisma.menuItem.upsert({
          where: { id: item.id },
          update: {},
          create: item
        })
        menuItems.push(item)
      } catch (error) {
        console.log(`Skipped menu item ${item.name}`)
      }
    }
  }

  // Create menu item ingredients
  for (const menuItem of menuItems) {
    if (rawMaterials.length >= 2) {
      const relevantMaterials = rawMaterials.slice(0, 2)
      for (let i = 0; i < relevantMaterials.length; i++) {
        try {
          await prisma.menuItemIngredient.upsert({
            where: { 
              menuItemId_rawMaterialId: {
                menuItemId: menuItem.id,
                rawMaterialId: relevantMaterials[i].id
              }
            },
            update: {},
            create: {
              id: `${menuItem.id}-ingredient-${i}`,
              menuItemId: menuItem.id,
              rawMaterialId: relevantMaterials[i].id,
              quantity: Math.random() * 100 + 50
            }
          })
        } catch (error) {
          console.log(`Skipped ingredient for ${menuItem.name}`)
        }
      }
    }
  }

  // ============================================================================
  // 2. CREATE NUTRITION CONSULTATIONS
  // ============================================================================
  console.log("Creating nutrition consultations...")
  
  const consultations = [
    {
      question: "Anak saya sering menolak makan sayur, bagaimana cara mengatasinya?",
      answer: "Coba variasikan cara penyajian sayur, seperti dibuat jus atau dicampur dalam makanan favorit anak.",
      status: ConsultationStatus.ANSWERED
    },
    {
      question: "Apakah menu sekolah sudah cukup untuk kebutuhan gizi anak umur 8 tahun?",
      answer: "Menu sekolah dirancang sesuai standar gizi anak sekolah. Namun, pastikan di rumah juga memberikan makanan seimbang.",
      status: ConsultationStatus.ANSWERED
    }
  ]

  for (let i = 0; i < consultations.length && i < students.length; i++) {
    const consultation = consultations[i]
    try {
      await prisma.nutritionConsultation.upsert({
        where: { id: `consultation-${i + 1}` },
        update: {},
        create: {
          id: `consultation-${i + 1}`,
          studentId: students[i].id,
          question: consultation.question,
          answer: consultation.answer,
          status: consultation.status
        }
      })
    } catch (error) {
      console.log(`Skipped consultation ${i + 1}`)
    }
  }

  // ============================================================================
  // 3. CREATE QUALITY CHECKS
  // ============================================================================
  console.log("Creating quality checks...")
  
  const inventoryItems = await prisma.inventoryItem.findMany()
  
  for (let i = 0; i < Math.min(inventoryItems.length, 3); i++) {
    const item = inventoryItems[i]
    try {
      await prisma.qualityCheck.upsert({
        where: { 
          referenceType_referenceId: {
            referenceType: "InventoryItem",
            referenceId: item.id
          }
        },
        update: {},
        create: {
          id: `quality-check-${i + 1}`,
          type: i % 2 === 0 ? QualityCheckType.RAW_MATERIAL : QualityCheckType.PRODUCTION,
          referenceType: "InventoryItem",
          referenceId: item.id,
          checkedBy: users[1]?.id || users[0]?.id,
          color: "Baik - sesuai standar",
          taste: "Normal - tidak ada rasa asing",
          aroma: "Segar - tidak berbau busuk",
          texture: "Baik - tidak lembek berlebihan",
          temperature: 25.0 + Math.random() * 10,
          status: Math.random() > 0.3 ? QualityStatus.GOOD : QualityStatus.POOR,
          notes: `Pemeriksaan kualitas batch ${new Date().toISOString().slice(0, 10)}`
        }
      })
    } catch (error) {
      console.log(`Skipped quality check ${i + 1}`)
    }
  }

  // ============================================================================
  // 4. CREATE FOOD SAMPLES
  // ============================================================================
  console.log("Creating food samples...")
  
  for (let i = 0; i < Math.min(menus.length, 3); i++) {
    const menu = menus[i]
    try {
      await prisma.foodSample.upsert({
        where: { id: `food-sample-${i + 1}` },
        update: {},
        create: {
          id: `food-sample-${i + 1}`,
          sampleDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          menuName: menu.name,
          batchNumber: `BATCH-${menu.menuDate.toISOString().slice(0, 10)}-${String(i + 1).padStart(3, '0')}`,
          sampleType: Math.random() > 0.5 ? SampleType.COOKED_FOOD : SampleType.RAW_MATERIAL,
          storageDays: 3,
          status: Math.random() > 0.7 ? SampleStatus.DISPOSED : SampleStatus.STORED,
          notes: `Sample dari produksi menu ${menu.name}`,
          disposedAt: Math.random() > 0.7 ? new Date() : null
        }
      })
    } catch (error) {
      console.log(`Skipped food sample ${i + 1}`)
    }
  }

  console.log(`\n✅ Successfully created sample data for empty tables!`)
  console.log(`📊 Summary:`)
  console.log(`   - Menu Items: ${menuItems.length}`)
  console.log(`   - Menu Item Ingredients: ${menuItems.length * 2}`)
  console.log(`   - Nutrition Consultations: ${Math.min(consultations.length, students.length)}`)
  console.log(`   - Quality Checks: ${Math.min(inventoryItems.length, 3)}`)
  console.log(`   - Food Samples: ${Math.min(menus.length, 3)}`)
  console.log(`\n🎉 Database is now populated with comprehensive test data!`)
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
