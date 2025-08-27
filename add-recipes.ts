import { PrismaClient, RecipeCategory, RecipeDifficulty } from "./src/generated/prisma"

const prisma = new PrismaClient()

async function addMoreRecipes() {
  console.log("🍽️ Adding more recipes for AI Menu Planner...")

  // Get existing items
  const items = await prisma.item.findMany()
  const rice = items.find(item => item.name.includes('Beras'))
  const chicken = items.find(item => item.name.includes('Ayam'))
  const beef = items.find(item => item.name.includes('Sapi'))
  const fish = items.find(item => item.name.includes('Ikan'))
  const tofu = items.find(item => item.name.includes('Tahu'))
  const tempe = items.find(item => item.name.includes('Tempe'))
  const carrot = items.find(item => item.name.includes('Wortel'))
  const spinach = items.find(item => item.name.includes('Bayam'))
  const kangkung = items.find(item => item.name.includes('Kangkung'))
  const cabbage = items.find(item => item.name.includes('Kol'))
  const potato = items.find(item => item.name.includes('Kentang'))
  const egg = items.find(item => item.name.includes('Telur'))

  // Create more diverse recipes
  const recipes = [
    {
      id: "recipe-2",
      name: "Nasi Ikan Bumbu Kuning",
      description: "Nasi dengan ikan segar dan bumbu kuning kaya rempah",
      category: RecipeCategory.MAIN_COURSE,
      servingSize: 100,
      prepTime: 25,
      cookTime: 40,
      difficulty: RecipeDifficulty.MEDIUM,
      instructions: {
        steps: [
          "Rebus nasi hingga pulen",
          "Bersihkan ikan dan potong sesuai ukuran",
          "Haluskan bumbu kuning (kunyit, bawang, jahe)",
          "Tumis bumbu hingga harum",
          "Masak ikan dengan bumbu kuning",
          "Sajikan nasi dengan ikan bumbu kuning"
        ]
      },
      nutritionInfo: {
        calories: 380,
        protein: 28,
        fat: 12,
        carbs: 42,
        fiber: 2.5
      },
      allergenInfo: [],
      cost: 9200,
      ingredients: [
        { itemId: rice?.id, quantity: 15, unit: "kg", notes: "Nasi sebagai karbohidrat utama" },
        { itemId: fish?.id, quantity: 10, unit: "kg", notes: "Ikan nila segar" }
      ]
    },
    {
      id: "recipe-3", 
      name: "Nasi Daging Sayur Bayam",
      description: "Menu bergizi nasi dengan daging sapi dan sayur bayam",
      category: RecipeCategory.MAIN_COURSE,
      servingSize: 100,
      prepTime: 35,
      cookTime: 60,
      difficulty: RecipeDifficulty.HARD,
      instructions: {
        steps: [
          "Masak nasi putih hingga matang",
          "Potong daging sapi kecil-kecil",
          "Rebus daging hingga empuk",
          "Cuci bersih bayam dan potong",
          "Tumis bayam dengan bumbu",
          "Sajikan nasi dengan daging dan sayur bayam"
        ]
      },
      nutritionInfo: {
        calories: 420,
        protein: 32,
        fat: 15,
        carbs: 48,
        fiber: 4.5
      },
      allergenInfo: [],
      cost: 12500,
      ingredients: [
        { itemId: rice?.id, quantity: 15, unit: "kg", notes: "Nasi putih" },
        { itemId: beef?.id, quantity: 8, unit: "kg", notes: "Daging sapi segar" },
        { itemId: spinach?.id, quantity: 6, unit: "kg", notes: "Bayam hijau segar" }
      ]
    },
    {
      id: "recipe-4",
      name: "Nasi Tempe Sayur Kangkung", 
      description: "Menu ekonomis nasi dengan tempe goreng dan tumis kangkung",
      category: RecipeCategory.MAIN_COURSE,
      servingSize: 100,
      prepTime: 20,
      cookTime: 30,
      difficulty: RecipeDifficulty.EASY,
      instructions: {
        steps: [
          "Masak nasi putih",
          "Potong tempe dan goreng hingga kecoklatan",
          "Cuci bersih kangkung",
          "Tumis kangkung dengan bumbu sederhana",
          "Sajikan nasi dengan tempe dan kangkung"
        ]
      },
      nutritionInfo: {
        calories: 360,
        protein: 18,
        fat: 14,
        carbs: 48,
        fiber: 6
      },
      allergenInfo: [],
      cost: 6800,
      ingredients: [
        { itemId: rice?.id, quantity: 15, unit: "kg", notes: "Nasi putih" },
        { itemId: tempe?.id, quantity: 5, unit: "kg", notes: "Tempe kedelai" },
        { itemId: kangkung?.id, quantity: 7, unit: "kg", notes: "Kangkung segar" }
      ]
    },
    {
      id: "recipe-5",
      name: "Nasi Tahu Sayur Kol",
      description: "Menu sehat nasi dengan tahu dan sayur kol rebus", 
      category: RecipeCategory.MAIN_COURSE,
      servingSize: 100,
      prepTime: 18,
      cookTime: 25,
      difficulty: RecipeDifficulty.EASY,
      instructions: {
        steps: [
          "Masak nasi hingga matang",
          "Potong tahu dan goreng setengah matang",
          "Rebus kol hingga empuk",
          "Beri bumbu sederhana pada kol",
          "Sajikan nasi dengan tahu dan sayur kol"
        ]
      },
      nutritionInfo: {
        calories: 340,
        protein: 16,
        fat: 11,
        carbs: 46,
        fiber: 4
      },
      allergenInfo: [],
      cost: 5500,
      ingredients: [
        { itemId: rice?.id, quantity: 15, unit: "kg", notes: "Nasi putih" },
        { itemId: tofu?.id, quantity: 6, unit: "kg", notes: "Tahu putih" },
        { itemId: cabbage?.id, quantity: 8, unit: "kg", notes: "Kol/kubis segar" }
      ]
    },
    {
      id: "recipe-6",
      name: "Nasi Telur Dadar Kentang",
      description: "Menu sederhana nasi dengan telur dadar dan kentang rebus",
      category: RecipeCategory.MAIN_COURSE, 
      servingSize: 100,
      prepTime: 15,
      cookTime: 25,
      difficulty: RecipeDifficulty.EASY,
      instructions: {
        steps: [
          "Masak nasi putih",
          "Kocok telur dan buat dadar",
          "Rebus kentang hingga empuk",
          "Potong kentang sesuai ukuran",
          "Sajikan nasi dengan telur dadar dan kentang"
        ]
      },
      nutritionInfo: {
        calories: 385,
        protein: 22,
        fat: 13,
        carbs: 52,
        fiber: 3.2
      },
      allergenInfo: ["eggs"],
      cost: 7200,
      ingredients: [
        { itemId: rice?.id, quantity: 15, unit: "kg", notes: "Nasi putih" },
        { itemId: egg?.id, quantity: 150, unit: "pcs", notes: "Telur ayam segar" },
        { itemId: potato?.id, quantity: 8, unit: "kg", notes: "Kentang" }
      ]
    }
  ]

  // Create recipes
  for (const recipe of recipes) {
    await prisma.recipe.upsert({
      where: { id: recipe.id },
      update: {},
      create: {
        id: recipe.id,
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
        isActive: true
      }
    })

    // Create recipe ingredients
    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ingredient = recipe.ingredients[i]
      if (ingredient.itemId) {
        await prisma.recipeIngredient.upsert({
          where: { id: `${recipe.id}-ingredient-${i + 1}` },
          update: {},
          create: {
            id: `${recipe.id}-ingredient-${i + 1}`,
            recipeId: recipe.id,
            itemId: ingredient.itemId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            notes: ingredient.notes
          }
        })
      }
    }

    console.log(`✅ Created recipe: ${recipe.name}`)
  }

  console.log("🎉 Additional recipes created successfully!")
}

addMoreRecipes()
  .catch((e) => {
    console.error("❌ Error creating recipes:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
