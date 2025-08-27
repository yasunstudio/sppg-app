import { PrismaClient } from "./src/generated/prisma"

const prisma = new PrismaClient()

async function checkActiveData() {
  try {
    console.log('🔍 Checking isActive fields...\n')
    
    // Check recipes
    const allRecipes = await prisma.recipe.findMany()
    const activeRecipes = await prisma.recipe.findMany({
      where: { isActive: true }
    })
    
    console.log(`👨‍🍳 Recipes:`)
    console.log(`   Total: ${allRecipes.length}`)
    console.log(`   Active: ${activeRecipes.length}`)
    
    if (allRecipes.length > 0) {
      console.log(`   Sample recipe isActive: ${allRecipes[0].isActive}`)
    }
    
    // Check items
    const allItems = await prisma.item.findMany()
    console.log(`\n📦 Items:`)
    console.log(`   Total: ${allItems.length}`)
    
    if (allItems.length > 0) {
      console.log(`   Sample item has isActive field:`, 'isActive' in allItems[0])
    }
    
    console.log('\n✅ Check complete')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkActiveData()
