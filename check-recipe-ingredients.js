const { PrismaClient } = require('./src/generated/prisma');

async function checkRecipeIngredients() {
  const prisma = new PrismaClient();
  
  try {
    // Check recipe ingredients count
    const recipeIngredientsCount = await prisma.recipeIngredient.count();
    console.log(`Total RecipeIngredient records: ${recipeIngredientsCount}`);
    
    // Get first few records to verify
    const recipeIngredients = await prisma.recipeIngredient.findMany({
      take: 5,
      include: {
        recipe: {
          select: { name: true }
        },
        item: {
          select: { name: true }
        }
      }
    });
    
    console.log('\nFirst 5 RecipeIngredient records:');
    recipeIngredients.forEach((ri, index) => {
      console.log(`${index + 1}. ${ri.recipe.name} -> ${ri.item.name} (${ri.quantity} ${ri.unit})`);
    });
    
  } catch (error) {
    console.error('Error checking recipe ingredients:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecipeIngredients();
