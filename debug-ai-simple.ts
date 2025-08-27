import { PrismaClient } from "./src/generated/prisma"

const prisma = new PrismaClient()

async function debugAIData() {
  try {
    console.log('🔍 Debugging AI Menu Planner Data...\n')
    
    // Check recipes
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: true
      }
    })
    console.log('👨‍🍳 Recipes:', recipes.length)
    
    // Check schools
    const schools = await prisma.school.findMany()
    console.log('🏫 Schools:', schools.length)
    
    // Check items  
    const items = await prisma.item.findMany()
    console.log('📦 Items:', items.length)
    
    // Check menu items
    const menuItems = await prisma.menuItem.findMany()
    console.log('🍽️ Menu Items:', menuItems.length)
    
    console.log('\n✅ Debug complete')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugAIData()
