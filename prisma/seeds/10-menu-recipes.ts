import { PrismaClient, RecipeCategory, RecipeDifficulty } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedMenuRecipes() {
  console.log('🍳 Seeding menu recipes for SPPG Purwakarta...')
  
  const recipes = [
    {
      id: 'recipe-nasi-ayam-01',
      name: 'Nasi Ayam Goreng SPPG',
      description: 'Nasi putih dengan ayam goreng bumbu sederhana, cocok untuk anak sekolah',
      category: RecipeCategory.MAIN_COURSE,
      servingSize: 50,
      prepTime: 15,
      cookTime: 30,
      difficulty: RecipeDifficulty.MEDIUM,
      instructions: [
        'Cuci beras hingga bersih dan tiriskan',
        'Rebus air dalam panci besar',
        'Masukkan beras, masak hingga matang (30 menit)',
        'Bersihkan ayam fillet, potong sesuai ukuran',
        'Bumbu ayam dengan bawang putih, garam secukupnya',
        'Goreng ayam hingga matang dan kecoklatan',
        'Sajikan nasi dengan ayam goreng'
      ],
      nutritionInfo: {
        calories: 420,
        protein: 25.5,
        carbohydrates: 45.0,
        fat: 12.8,
        fiber: 2.1
      },
      allergenInfo: [],
      cost: 8500.0,
      isActive: true
    },
    {
      id: 'recipe-nasi-ikan-01', 
      name: 'Nasi Ikan Bandeng Goreng',
      description: 'Nasi putih dengan ikan bandeng goreng dan sambal',
      category: RecipeCategory.MAIN_COURSE,
      servingSize: 50,
      prepTime: 20,
      cookTime: 30,
      difficulty: RecipeDifficulty.MEDIUM,
      instructions: [
        'Siapkan beras, cuci bersih dan tiriskan',
        'Masak nasi dengan rice cooker atau panci',
        'Bersihkan ikan bandeng, buang duri halus',
        'Lumuri ikan dengan bumbu (bawang putih, garam)',
        'Goreng ikan hingga kecoklatan dan matang',
        'Buat sambal: ulek bawang merah, cabai, garam',
        'Sajikan nasi dengan ikan dan sambal'
      ],
      nutritionInfo: {
        calories: 380,
        protein: 28.0,
        carbohydrates: 42.0,
        fat: 10.5,
        fiber: 2.3
      },
      allergenInfo: ['FISH'],
      cost: 9200.0,
      isActive: true
    },
    {
      id: 'recipe-nasi-telur-01',
      name: 'Nasi Telur Dadar Sayur',
      description: 'Nasi putih dengan telur dadar dan tumis sayuran hijau',
      category: RecipeCategory.MAIN_COURSE,
      servingSize: 50,
      prepTime: 10,
      cookTime: 25,
      difficulty: RecipeDifficulty.EASY,
      instructions: [
        'Masak nasi putih hingga pulen',
        'Kocok telur dalam mangkuk dengan sedikit garam',
        'Panaskan minyak dalam wajan',
        'Buat telur dadar, lipat dan potong sesuai porsi',
        'Tumis bawang putih hingga harum',
        'Masukkan sayuran (bayam/kangkung), tumis sebentar',
        'Sajikan nasi dengan telur dadar dan sayuran'
      ],
      nutritionInfo: {
        calories: 350,
        protein: 18.5,
        carbohydrates: 48.0,
        fat: 9.2,
        fiber: 3.5
      },
      allergenInfo: ['EGGS'],
      cost: 6800.0,
      isActive: true
    },
    {
      id: 'recipe-nasi-tempe-01',
      name: 'Nasi Tempe Goreng Crispy',
      description: 'Nasi putih dengan tempe goreng crispy dan lalapan',
      category: RecipeCategory.MAIN_COURSE,
      servingSize: 50,
      prepTime: 15,
      cookTime: 25,
      difficulty: RecipeDifficulty.EASY,
      instructions: [
        'Siapkan nasi putih hangat',
        'Potong tempe tipis-tipis (5mm)',
        'Bumbu tempe: bawang putih, garam, sedikit kunyit',
        'Goreng tempe hingga kecoklatan dan crispy',
        'Tumis sayuran dengan bawang putih dan garam',
        'Buat sambal sederhana dari cabai dan tomat',
        'Sajikan nasi dengan tempe goreng dan sayuran'
      ],
      nutritionInfo: {
        calories: 385,
        protein: 22.0,
        carbohydrates: 50.0,
        fat: 11.8,
        fiber: 4.2
      },
      allergenInfo: ['SOY'],
      cost: 5500.0,
      isActive: true
    },
    {
      id: 'recipe-nasi-tahu-01',
      name: 'Nasi Tahu Goreng Bumbu',
      description: 'Nasi putih dengan tahu goreng berbumbu dan sambal',
      category: RecipeCategory.MAIN_COURSE,
      servingSize: 50,
      prepTime: 10,
      cookTime: 25,
      difficulty: RecipeDifficulty.EASY,
      instructions: [
        'Masak nasi putih dengan perbandingan air 1:1.2',
        'Potong tahu menjadi kubus 2x2 cm',
        'Lumuri tahu dengan bumbu halus (bawang putih, garam)',
        'Goreng tahu hingga permukaan kecoklatan',
        'Siapkan sayuran segar (lalapan) atau tumis ringan',
        'Buat sambal kacang atau sambal tomat',
        'Sajikan selagi hangat dengan sambal'
      ],
      nutritionInfo: {
        calories: 340,
        protein: 19.8,
        carbohydrates: 45.5,
        fat: 8.9,
        fiber: 3.8
      },
      allergenInfo: ['SOY'],
      cost: 5200.0,
      isActive: true
    }
  ]
  
  try {
    for (const recipe of recipes) {
      const createdRecipe = await prisma.recipe.upsert({
        where: { id: recipe.id },
        update: {
          name: recipe.name,
          description: recipe.description,
          category: recipe.category,
          servingSize: recipe.servingSize,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          difficulty: recipe.difficulty,
          instructions: recipe.instructions,
          nutritionInfo: recipe.nutritionInfo,
          allergenInfo: recipe.allergenInfo,
          cost: recipe.cost,
          isActive: recipe.isActive
        },
        create: recipe
      })
      
      console.log(`✓ Recipe seeded: ${recipe.name} (${recipe.cookTime}min, serves ${recipe.servingSize})`)
    }
    
    console.log(`🍳 Menu recipes seeding completed! Total: ${recipes.length} recipes`)
  } catch (error) {
    console.error('❌ Error seeding menu recipes:', error)
    throw error
  }
}

export default seedMenuRecipes
