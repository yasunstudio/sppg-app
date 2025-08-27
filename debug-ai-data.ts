import {    // Check recipes
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: true
      }
    })
    console.log('👨‍🍳 Recipes:', recipes.length)
    
    if (recipes.length > 0) {
      console.log('   Sample Recipe:', recipes[0].name)
      console.log('   Recipe Ingredients:', recipes[0].ingredients.length)
    }t } from "./src/generated/prisma"

const prisma = new PrismaClient()

async function debugAIData() {
  console.log('🔍 Debugging AI Menu Planner data...')
  
  try {
        // Check recipes
    const recipes = await prisma.recipe.findMany({
      include: {
        recipeItems: true
      }
    })
    console.log('�‍🍳 Recipes:', recipes.length)
    
    if (recipes.length > 0) {
      console.log('   Sample Recipe:', recipes[0].name)
      console.log('   Recipe Items:', recipes[0].recipeItems.length)
    }
    
    // Check schools
    const schools = await prisma.school.findMany({
      include: {
        students: true,
        classes: true
      }
    })
    console.log('🏫 Schools:', schools.length)
    
    if (schools.length > 0) {
      console.log('   Sample School:', schools[0].name)
      console.log('   Total Students (from field):', schools[0].totalStudents)
    }
    
    // Check items
    const items = await prisma.item.findMany()
    console.log('📦 Items:', items.length)
    
    // Check raw materials
    const rawMaterials = await prisma.rawMaterial.findMany()
    console.log('🥕 Raw Materials:', rawMaterials.length)
    
    // Check menu items
    const menuItems = await prisma.menuItem.findMany({
      include: {
        ingredients: {
          include: {
            rawMaterial: true
          }
        }
      }
    })
    console.log('🍽️ Menu Items:', menuItems.length)
    
    if (menuItems.length > 0) {
      console.log('   Sample Menu Item:', menuItems[0].name)
      console.log('   Menu Item Ingredients:', menuItems[0].ingredients.length)
    }
    
    console.log('\n🔍 Potential Issues:')
    if (recipes.length === 0) console.log('❌ No active recipes found')
    if (schools.length === 0) console.log('❌ No active schools found')
    if (items.length === 0) console.log('❌ No active items found')
    
    console.log('\n✅ Debug completed!')
    
  } catch (error) {
    console.error('❌ Debug error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugAIData()
