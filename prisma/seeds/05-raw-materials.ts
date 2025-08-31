import { PrismaClient, MaterialCategory } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedRawMaterials() {
  console.log('🥕 Seeding raw materials for SPPG Purwakarta...')
  
  const rawMaterials = [
    // Beras dan karbohidrat
    {
      id: 'rm-beras-putih',
      name: 'Beras Putih Premium',
      category: MaterialCategory.GRAIN,
      unit: 'kg',
      description: 'Beras putih premium kualitas terbaik untuk makanan anak',
      caloriesPer100g: 365,
      proteinPer100g: 7.1,
      carbsPer100g: 80.0,
      fatPer100g: 0.7,
      fiberPer100g: 1.3
    },
    {
      id: 'rm-kentang',
      name: 'Kentang Segar',
      category: MaterialCategory.VEGETABLE,
      unit: 'kg',
      description: 'Kentang segar lokal untuk variasi karbohidrat',
      caloriesPer100g: 77,
      proteinPer100g: 2.0,
      carbsPer100g: 17.0,
      fatPer100g: 0.1,
      fiberPer100g: 2.2
    },
    
    // Protein hewani
    {
      id: 'rm-ayam-fillet',
      name: 'Ayam Fillet Segar',
      category: MaterialCategory.PROTEIN,
      unit: 'kg',
      description: 'Daging ayam fillet segar tanpa tulang dan kulit',
      caloriesPer100g: 165,
      proteinPer100g: 31.0,
      carbsPer100g: 0.0,
      fatPer100g: 3.6,
      fiberPer100g: 0.0
    },
    {
      id: 'rm-ikan-bandeng',
      name: 'Ikan Bandeng Segar',
      category: MaterialCategory.PROTEIN,
      unit: 'kg',
      description: 'Ikan bandeng segar dari perairan lokal',
      caloriesPer100g: 129,
      proteinPer100g: 20.0,
      carbsPer100g: 0.0,
      fatPer100g: 4.8,
      fiberPer100g: 0.0
    },
    {
      id: 'rm-telur-ayam',
      name: 'Telur Ayam Negeri',
      category: MaterialCategory.PROTEIN,
      unit: 'kg',
      description: 'Telur ayam negeri segar grade A',
      caloriesPer100g: 155,
      proteinPer100g: 13.0,
      carbsPer100g: 1.1,
      fatPer100g: 11.0,
      fiberPer100g: 0.0
    },
    
    // Protein nabati
    {
      id: 'rm-tempe',
      name: 'Tempe Segar',
      category: MaterialCategory.PROTEIN,
      unit: 'kg',
      description: 'Tempe segar dari kedelai berkualitas',
      caloriesPer100g: 193,
      proteinPer100g: 20.3,
      carbsPer100g: 7.5,
      fatPer100g: 8.8,
      fiberPer100g: 1.4
    },
    {
      id: 'rm-tahu',
      name: 'Tahu Putih',
      category: MaterialCategory.PROTEIN,
      unit: 'kg',
      description: 'Tahu putih segar dari kedelai pilihan',
      caloriesPer100g: 70,
      proteinPer100g: 8.0,
      carbsPer100g: 1.4,
      fatPer100g: 4.2,
      fiberPer100g: 0.4
    },
    
    // Sayuran
    {
      id: 'rm-bayam',
      name: 'Bayam Hijau',
      category: MaterialCategory.VEGETABLE,
      unit: 'kg',
      description: 'Bayam hijau segar kaya zat besi',
      caloriesPer100g: 23,
      proteinPer100g: 2.9,
      carbsPer100g: 3.6,
      fatPer100g: 0.4,
      fiberPer100g: 2.2
    },
    {
      id: 'rm-wortel',
      name: 'Wortel Orange',
      category: MaterialCategory.VEGETABLE,
      unit: 'kg',
      description: 'Wortel orange segar kaya vitamin A',
      caloriesPer100g: 41,
      proteinPer100g: 0.9,
      carbsPer100g: 9.6,
      fatPer100g: 0.2,
      fiberPer100g: 2.8
    },
    {
      id: 'rm-buncis',
      name: 'Buncis Muda',
      category: MaterialCategory.VEGETABLE,
      unit: 'kg',
      description: 'Buncis muda segar dan renyah',
      caloriesPer100g: 35,
      proteinPer100g: 1.8,
      carbsPer100g: 8.0,
      fatPer100g: 0.1,
      fiberPer100g: 2.7
    },
    
    // Bumbu dan pelengkap
    {
      id: 'rm-bawang-merah',
      name: 'Bawang Merah',
      category: MaterialCategory.SPICE,
      unit: 'kg',
      description: 'Bawang merah segar untuk bumbu masakan',
      caloriesPer100g: 40,
      proteinPer100g: 1.1,
      carbsPer100g: 9.3,
      fatPer100g: 0.1,
      fiberPer100g: 1.7
    },
    {
      id: 'rm-bawang-putih',
      name: 'Bawang Putih',
      category: MaterialCategory.SPICE,
      unit: 'kg',
      description: 'Bawang putih segar untuk bumbu dasar',
      caloriesPer100g: 149,
      proteinPer100g: 6.4,
      carbsPer100g: 33.1,
      fatPer100g: 0.5,
      fiberPer100g: 2.1
    },
    {
      id: 'rm-garam',
      name: 'Garam Dapur',
      category: MaterialCategory.SPICE,
      unit: 'kg',
      description: 'Garam dapur halus untuk masakan',
      caloriesPer100g: 0,
      proteinPer100g: 0.0,
      carbsPer100g: 0.0,
      fatPer100g: 0.0,
      fiberPer100g: 0.0
    },
    {
      id: 'rm-minyak-goreng',
      name: 'Minyak Goreng',
      category: MaterialCategory.OIL,
      unit: 'liter',
      description: 'Minyak goreng berkualitas untuk memasak',
      caloriesPer100g: 884,
      proteinPer100g: 0.0,
      carbsPer100g: 0.0,
      fatPer100g: 100.0,
      fiberPer100g: 0.0
    },
    {
      id: 'rm-gula-pasir',
      name: 'Gula Pasir',
      category: MaterialCategory.OTHER,
      unit: 'kg',
      description: 'Gula pasir putih untuk pemanis alami',
      caloriesPer100g: 387,
      proteinPer100g: 0.0,
      carbsPer100g: 99.8,
      fatPer100g: 0.0,
      fiberPer100g: 0.0
    }
  ]

  try {
    for (const material of rawMaterials) {
      const rawMaterial = await prisma.rawMaterial.upsert({
        where: { id: material.id },
        update: {
          name: material.name,
          category: material.category,
          unit: material.unit,
          description: material.description,
          caloriesPer100g: material.caloriesPer100g,
          proteinPer100g: material.proteinPer100g,
          carbsPer100g: material.carbsPer100g,
          fatPer100g: material.fatPer100g,
          fiberPer100g: material.fiberPer100g
        },
        create: material
      })
      
      console.log(`✓ Raw material seeded: ${rawMaterial.name} (${rawMaterial.category})`)
    }
    
    console.log(`📦 Raw materials seeding completed! Total: ${rawMaterials.length} materials`)
  } catch (error) {
    console.error('❌ Error seeding raw materials:', error)
    throw error
  }
}

export default seedRawMaterials
