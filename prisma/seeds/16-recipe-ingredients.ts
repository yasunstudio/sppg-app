import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedRecipeIngredients() {
  console.log('🥘 Seeding recipe ingredients...')

  // Get reference data
  const recipes = await prisma.recipe.findMany()
  const items = await prisma.item.findMany()

  if (recipes.length === 0 || items.length === 0) {
    console.log('⚠️  Recipes or items not found. Please seed recipes and items first.')
    return
  }

  // Helper function to find item by name
  const findItem = (name: string) => items.find(item => item.name.includes(name))

  const recipeIngredients = [
    // Nasi Ayam Gurih (Recipe 1)
    {
      recipeId: recipes[0].id, // Nasi Ayam Gurih
      itemId: findItem('Beras')?.id || '',
      quantity: 300,
      unit: 'gram',
      notes: 'Beras premium dicuci bersih sebelum dimasak'
    },
    {
      recipeId: recipes[0].id,
      itemId: findItem('Daging Ayam')?.id || '',
      quantity: 150,
      unit: 'gram',
      notes: 'Daging ayam fillet dipotong dadu kecil'
    },
    {
      recipeId: recipes[0].id,
      itemId: findItem('Minyak')?.id || '',
      quantity: 20,
      unit: 'ml',
      notes: 'Untuk menumis bumbu dan ayam'
    },
    {
      recipeId: recipes[0].id,
      itemId: findItem('Garam')?.id || '',
      quantity: 5,
      unit: 'gram',
      notes: 'Garam secukupnya untuk rasa'
    },

    // Nasi Ikan Bumbu (Recipe 2)
    {
      recipeId: recipes[1].id, // Nasi Ikan Bumbu
      itemId: findItem('Beras')?.id || '',
      quantity: 300,
      unit: 'gram',
      notes: 'Beras premium untuk nasi putih'
    },
    {
      recipeId: recipes[1].id,
      itemId: findItem('Ikan Lele')?.id || '',
      quantity: 120,
      unit: 'gram',
      notes: 'Ikan lele segar dibersihkan dan dipotong'
    },
    {
      recipeId: recipes[1].id,
      itemId: findItem('Minyak')?.id || '',
      quantity: 25,
      unit: 'ml',
      notes: 'Untuk menggoreng ikan'
    },
    {
      recipeId: recipes[1].id,
      itemId: findItem('Garam')?.id || '',
      quantity: 4,
      unit: 'gram',
      notes: 'Bumbu dasar'
    },

    // Nasi Telur Dadar (Recipe 3)
    {
      recipeId: recipes[2].id, // Nasi Telur Dadar
      itemId: findItem('Beras')?.id || '',
      quantity: 300,
      unit: 'gram',
      notes: 'Nasi putih sebagai makanan pokok'
    },
    {
      recipeId: recipes[2].id,
      itemId: findItem('Telur')?.id || '',
      quantity: 100,
      unit: 'gram',
      notes: 'Setara 2 butir telur ayam ukuran sedang'
    },
    {
      recipeId: recipes[2].id,
      itemId: findItem('Minyak')?.id || '',
      quantity: 15,
      unit: 'ml',
      notes: 'Untuk membuat telur dadar'
    },
    {
      recipeId: recipes[2].id,
      itemId: findItem('Garam')?.id || '',
      quantity: 3,
      unit: 'gram',
      notes: 'Bumbu telur dadar'
    },

    // Nasi Sayur Bayam (Recipe 4)
    {
      recipeId: recipes[3].id, // Nasi Sayur Bayam
      itemId: findItem('Beras')?.id || '',
      quantity: 300,
      unit: 'gram',
      notes: 'Nasi putih pulen'
    },
    {
      recipeId: recipes[3].id,
      itemId: findItem('Bayam')?.id || '',
      quantity: 200,
      unit: 'gram',
      notes: 'Bayam hijau segar dicuci bersih'
    },
    {
      recipeId: recipes[3].id,
      itemId: findItem('Wortel')?.id || '',
      quantity: 80,
      unit: 'gram',
      notes: 'Wortel baby dipotong dadu kecil'
    },
    {
      recipeId: recipes[3].id,
      itemId: findItem('Minyak')?.id || '',
      quantity: 10,
      unit: 'ml',
      notes: 'Untuk menumis sayuran'
    },
    {
      recipeId: recipes[3].id,
      itemId: findItem('Garam')?.id || '',
      quantity: 4,
      unit: 'gram',
      notes: 'Bumbu sayuran'
    },

    // Nasi Tempe Goreng (Recipe 5)
    {
      recipeId: recipes[4].id, // Nasi Tempe Goreng
      itemId: findItem('Beras')?.id || '',
      quantity: 300,
      unit: 'gram',
      notes: 'Nasi putih hangat'
    },
    {
      recipeId: recipes[4].id,
      itemId: findItem('Minyak')?.id || '',
      quantity: 30,
      unit: 'ml',
      notes: 'Untuk menggoreng tempe dan menumis'
    },
    {
      recipeId: recipes[4].id,
      itemId: findItem('Garam')?.id || '',
      quantity: 5,
      unit: 'gram',
      notes: 'Bumbu tempe dan sayuran'
    }
  ]

  // Filter out ingredients where items are not found
  const validIngredients = recipeIngredients.filter(ingredient => 
    ingredient.itemId !== ''
  )

  for (const ingredientData of validIngredients) {
    await prisma.recipeIngredient.create({
      data: ingredientData
    })
  }

  const ingredientCount = await prisma.recipeIngredient.count()
  console.log(`✅ Recipe ingredients seeded: ${ingredientCount} recipe-item relationships`)
}
