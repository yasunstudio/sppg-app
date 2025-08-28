import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function linkRecipeToBatch() {
  try {
    console.log('🔄 Linking recipe to batch-1...');

    // Get available recipes
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            item: true
          }
        }
      }
    });

    console.log(`📊 Found ${recipes.length} recipes`);

    if (recipes.length === 0) {
      console.log('❌ No recipes found. Creating a sample recipe...');
      
      // Create sample items if they don't exist
      const items = await Promise.all([
        prisma.item.upsert({
          where: { id: 'item-beras-putih' },
          update: {},
          create: {
            id: 'item-beras-putih',
            name: 'Beras Putih',
            category: 'STAPLE_FOOD',
            unit: 'KG',
            unitPrice: 12000
          }
        }),
        prisma.item.upsert({
          where: { id: 'item-ayam-fillet' },
          update: {},
          create: {
            id: 'item-ayam-fillet',
            name: 'Ayam Fillet',
            category: 'PROTEIN',
            unit: 'KG',
            unitPrice: 35000
          }
        }),
        prisma.item.upsert({
          where: { id: 'item-wortel' },
          update: {},
          create: {
            id: 'item-wortel',
            name: 'Wortel',
            category: 'VEGETABLES',
            unit: 'KG',
            unitPrice: 8000
          }
        }),
        prisma.item.upsert({
          where: { id: 'item-minyak-goreng' },
          update: {},
          create: {
            id: 'item-minyak-goreng',
            name: 'Minyak Goreng',
            category: 'COOKING_OIL',
            unit: 'LITER',
            unitPrice: 25000
          }
        })
      ]);

      // Create a recipe
      const recipe = await prisma.recipe.create({
        data: {
          id: 'recipe-nasi-ayam',
          name: 'Nasi Ayam Wortel',
          category: 'MAIN_COURSE',
          description: 'Nasi dengan ayam dan wortel yang bergizi',
          servingSize: 100,
          prepTime: 30,
          cookTime: 45,
          difficulty: 'EASY',
          instructions: JSON.stringify([
            'Cuci beras dan masak hingga menjadi nasi',
            'Potong ayam fillet menjadi potongan kecil',
            'Potong wortel menjadi dadu kecil',
            'Panaskan minyak dan tumis ayam hingga matang',
            'Tambahkan wortel dan tumis hingga lunak',
            'Sajikan nasi dengan tumisan ayam wortel'
          ]),
          nutritionInfo: JSON.stringify({
            calories: 350,
            protein: 25,
            carbs: 45,
            fat: 8
          }),
          ingredients: {
            create: [
              {
                itemId: 'item-beras-putih',
                quantity: 10,
                unit: 'KG',
                notes: 'Beras berkualitas baik'
              },
              {
                itemId: 'item-ayam-fillet',
                quantity: 8,
                unit: 'KG',
                notes: 'Ayam segar tanpa tulang'
              },
              {
                itemId: 'item-wortel',
                quantity: 3,
                unit: 'KG',
                notes: 'Wortel segar dipotong dadu'
              },
              {
                itemId: 'item-minyak-goreng',
                quantity: 1,
                unit: 'LITER',
                notes: 'Untuk menumis'
              }
            ]
          }
        }
      });

      console.log(`✅ Created recipe: ${recipe.name}`);

      // Link recipe to batch
      await prisma.productionBatch.update({
        where: { id: 'batch-1' },
        data: {
          recipeId: recipe.id
        }
      });

      console.log('✅ Linked recipe to batch-1');

    } else {
      // Use the first available recipe
      const recipe = recipes[0];
      
      await prisma.productionBatch.update({
        where: { id: 'batch-1' },
        data: {
          recipeId: recipe.id
        }
      });

      console.log(`✅ Linked existing recipe "${recipe.name}" to batch-1`);
    }

    console.log('🎉 Recipe linking completed successfully!');

  } catch (error) {
    console.error('❌ Error linking recipe to batch:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkRecipeToBatch();
