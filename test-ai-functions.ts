import { PrismaClient } from "./src/generated/prisma"

const prisma = new PrismaClient()

// Copy the same functions from the AI Menu Planner API
async function getAvailableRecipes() {
  const recipes = await prisma.recipe.findMany({
    where: {
      isActive: true
    },
    include: {
      ingredients: {
        include: {
          item: true
        }
      }
    }
  })

  // Calculate nutritional info for each recipe
  return recipes.map(recipe => ({
    ...recipe,
    calculatedNutrition: calculateRecipeNutrition(recipe.ingredients),
    estimatedCost: calculateRecipeCost(recipe.ingredients),
    complexity: calculateRecipeComplexity(recipe),
    preparationTime: recipe.prepTime + recipe.cookTime
  }))
}

// Calculate nutritional information for a recipe
function calculateRecipeNutrition(ingredients: any[]) {
  let totalCalories = 0
  let totalProtein = 0
  let totalFat = 0
  let totalCarbs = 0
  let totalFiber = 0

  ingredients.forEach(ingredient => {
    const nutrition = ingredient.item.nutritionPer100g || {}
    const quantity = ingredient.quantity / 100 // Convert to per 100g

    totalCalories += (nutrition.calories || 0) * quantity
    totalProtein += (nutrition.protein || 0) * quantity
    totalFat += (nutrition.fat || 0) * quantity
    totalCarbs += (nutrition.carbohydrates || 0) * quantity
    totalFiber += (nutrition.fiber || 0) * quantity
  })

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
    carbohydrates: Math.round(totalCarbs * 10) / 10,
    fiber: Math.round(totalFiber * 10) / 10
  }
}

// Calculate estimated cost for a recipe
function calculateRecipeCost(ingredients: any[]) {
  return ingredients.reduce((total, ingredient) => {
    const cost = ingredient.item.price || 0
    const quantity = ingredient.quantity / 1000 // Convert to kg if needed
    return total + (cost * quantity)
  }, 0)
}

// Calculate recipe complexity
function calculateRecipeComplexity(recipe: any) {
  const ingredientCount = recipe.ingredients.length
  const prepTime = recipe.prepTime || 0
  const cookTime = recipe.cookTime || 0
  
  // Simple complexity scoring
  let complexity = 1 // base complexity
  
  if (ingredientCount > 3) complexity += 1
  if (prepTime + cookTime > 60) complexity += 1
  if (recipe.difficulty === 'HARD') complexity += 2
  else if (recipe.difficulty === 'MEDIUM') complexity += 1
  
  return Math.min(complexity, 5) // max 5
}

async function testAIFunctions() {
  try {
    console.log('🔍 Testing AI Menu Planner Functions...\n')
    
    const availableRecipes = await getAvailableRecipes()
    
    console.log(`👨‍🍳 Available Recipes: ${availableRecipes.length}`)
    
    availableRecipes.forEach((recipe, index) => {
      console.log(`\n${index + 1}. ${recipe.name}`)
      console.log(`   Calculated Nutrition:`, recipe.calculatedNutrition)
      console.log(`   Estimated Cost: Rp ${recipe.estimatedCost.toLocaleString()}`)
      console.log(`   Complexity: ${recipe.complexity}/5`)
      console.log(`   Preparation Time: ${recipe.preparationTime} minutes`)
    })
    
    console.log('\n✅ Test complete')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAIFunctions()
