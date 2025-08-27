import { PrismaClient } from "./src/generated/prisma"

const prisma = new PrismaClient()

async function checkDatabaseStatus() {
  console.log("🔍 Checking database status...")
  
  try {
    // Check basic data
    const userCount = await prisma.user.count()
    const schoolCount = await prisma.school.count()
    const studentCount = await prisma.student.count()
    const menuCount = await prisma.menu.count()
    const recipeCount = await prisma.recipe.count()
    const rawMaterialCount = await prisma.rawMaterial.count()
    
    // Check comprehensive data we added
    const menuItemCount = await prisma.menuItem.count()
    const menuItemIngredientCount = await prisma.menuItemIngredient.count()
    const nutritionConsultationCount = await prisma.nutritionConsultation.count()
    const qualityCheckCount = await prisma.qualityCheck.count()
    const foodSampleCount = await prisma.foodSample.count()
    const inventoryItemCount = await prisma.inventoryItem.count()
    
    // Check Posyandu data if exists
    const posyanduCount = await prisma.posyandu.count()
    const posyanduProgramCount = await prisma.posyanduProgram.count()
    const posyanduParticipantCount = await prisma.posyanduParticipant.count()
    const healthRecordCount = await prisma.healthRecord.count()
    const nutritionPlanCount = await prisma.nutritionPlan.count()
    
    console.log("\n📊 Database Status Summary:")
    console.log("=" .repeat(50))
    
    console.log("\n🏛️  Basic Data:")
    console.log(`   Users: ${userCount}`)
    console.log(`   Schools: ${schoolCount}`)
    console.log(`   Students: ${studentCount}`)
    console.log(`   Menus: ${menuCount}`)
    console.log(`   Recipes: ${recipeCount}`)
    console.log(`   Raw Materials: ${rawMaterialCount}`)
    console.log(`   Inventory Items: ${inventoryItemCount}`)
    
    console.log("\n🍽️  Menu Management:")
    console.log(`   Menu Items: ${menuItemCount}`)
    console.log(`   Menu Item Ingredients: ${menuItemIngredientCount}`)
    
    console.log("\n💬  Nutrition & Quality:")
    console.log(`   Nutrition Consultations: ${nutritionConsultationCount}`)
    console.log(`   Quality Checks: ${qualityCheckCount}`)
    console.log(`   Food Samples: ${foodSampleCount}`)
    
    console.log("\n🏥  Posyandu Data:")
    console.log(`   Posyandus: ${posyanduCount}`)
    console.log(`   Programs: ${posyanduProgramCount}`)
    console.log(`   Participants: ${posyanduParticipantCount}`)
    console.log(`   Health Records: ${healthRecordCount}`)
    console.log(`   Nutrition Plans: ${nutritionPlanCount}`)
    
    // Check if AI Menu Planner will have enough data
    console.log("\n🤖 AI Menu Planner Readiness:")
    const readyForAI = menuCount > 0 && recipeCount > 0 && menuItemCount > 0 && rawMaterialCount > 0
    console.log(`   Status: ${readyForAI ? '✅ READY' : '❌ MISSING DATA'}`)
    
    if (readyForAI) {
      console.log("   🎉 Database has sufficient data for AI Menu Planner testing!")
    } else {
      console.log("   ⚠️  Some basic data is missing for optimal AI performance")
    }
    
    console.log("\n🐳 Docker PostgreSQL Status: ✅ CONNECTED")
    console.log("🌐 Prisma Studio: http://localhost:5556")
    
  } catch (error) {
    console.error("❌ Database connection error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabaseStatus()
