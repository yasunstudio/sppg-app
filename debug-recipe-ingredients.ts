import { PrismaClient } from "./src/generated/prisma"

const prisma = new PrismaClient()

async function checkRecipeIngredients() {
  try {
    console.log('🔍 Checking Recipe Ingredients...\n')
    
    const recipes = await prisma.recipe.findMany({
      where: { isActive: true },
      include: {
        ingredients: {
          include: {
            item: true
          }
        }
      }
    })
    
    console.log(`👨‍🍳 Active Recipes: ${recipes.length}`)
    
    recipes.forEach((recipe, index) => {
      console.log(`\n${index + 1}. ${recipe.name}`)
      console.log(`   Ingredients: ${recipe.ingredients.length}`)
      
      recipe.ingredients.forEach(ingredient => {
        console.log(`     - ${ingredient.item.name}: ${ingredient.quantity} ${ingredient.unit}`)
        console.log(`       Nutrition per 100g:`, ingredient.item.nutritionPer100g)
      })
    })
    
    console.log('\n✅ Check complete')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkRecipeIngredients()
