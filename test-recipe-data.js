const { PrismaClient } = require('./src/generated/prisma')

const prisma = new PrismaClient()

async function testRecipeData() {
  try {
    console.log('🔍 Testing recipe data...')
    
    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: 'recipe-nasi-ayam-01' },
      include: {
        ingredients: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                unit: true,
                unitPrice: true,
              },
            },
          },
        },
      },
    })
    
    if (!recipe) {
      console.log('❌ Recipe not found')
      return
    }
    
    console.log('✅ Recipe found:', recipe.name)
    console.log('🥘 Ingredients:')
    recipe.ingredients.forEach((ing, index) => {
      console.log(`  ${index + 1}. ${ing.item?.name || 'Unknown'} - ${ing.quantity} ${ing.unit} (itemId: ${ing.itemId})`)
    })
    
    // Check items available
    const items = await prisma.item.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        category: true,
        unit: true
      }
    })
    
    console.log('\n📦 Available Items:')
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} (${item.category}) - ${item.unit} (id: ${item.id})`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRecipeData()
