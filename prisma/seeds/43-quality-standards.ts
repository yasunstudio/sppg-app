import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedQualityStandards() {
  console.log('🎯 Seeding quality standards...')

  type QualityStandardData = {
    id: string;
    name: string;
    description: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    category: 'TEMPERATURE_CONTROL' | 'VISUAL_APPEARANCE' | 'HYGIENE_STANDARDS' | 'PORTION_CONTROL' | 'NUTRITION_VALUE' | 'SAFETY_STANDARDS';
    isActive: boolean;
  }

  const qualityStandards: QualityStandardData[] = [
    // Temperature Control Standards
    {
      id: 'qs-temp-cooking',
      name: 'Suhu Memasak Minimum',
      description: 'Suhu minimum untuk memasak daging dan protein hewani lainnya untuk memastikan keamanan pangan',
      targetValue: 75.0,
      currentValue: 78.5,
      unit: '°C',
      category: 'TEMPERATURE_CONTROL',
      isActive: true
    },
    {
      id: 'qs-temp-storage-hot',
      name: 'Suhu Penyimpanan Makanan Panas',
      description: 'Suhu minimum untuk penyimpanan makanan panas sebelum distribusi',
      targetValue: 60.0,
      currentValue: 65.2,
      unit: '°C',
      category: 'TEMPERATURE_CONTROL',
      isActive: true
    },
    {
      id: 'qs-temp-storage-cold',
      name: 'Suhu Penyimpanan Dingin',
      description: 'Suhu maksimum untuk penyimpanan bahan makanan segar dan mudah rusak',
      targetValue: 4.0,
      currentValue: 3.5,
      unit: '°C',
      category: 'TEMPERATURE_CONTROL',
      isActive: true
    },
    {
      id: 'qs-temp-serving',
      name: 'Suhu Penyajian Makanan',
      description: 'Suhu ideal makanan saat disajikan kepada siswa',
      targetValue: 55.0,
      currentValue: 58.3,
      unit: '°C',
      category: 'TEMPERATURE_CONTROL',
      isActive: true
    },

    // Visual Appearance Standards
    {
      id: 'qs-visual-color-score',
      name: 'Skor Warna Makanan',
      description: 'Standar penilaian visual warna makanan (skala 1-10)',
      targetValue: 8.0,
      currentValue: 8.5,
      unit: 'skor',
      category: 'VISUAL_APPEARANCE',
      isActive: true
    },
    {
      id: 'qs-visual-texture-score',
      name: 'Skor Tekstur Makanan',
      description: 'Standar penilaian visual tekstur makanan (skala 1-10)',
      targetValue: 8.0,
      currentValue: 8.2,
      unit: 'skor',
      category: 'VISUAL_APPEARANCE',
      isActive: true
    },
    {
      id: 'qs-visual-presentation',
      name: 'Skor Presentasi Makanan',
      description: 'Standar penilaian visual presentasi dan tata letak makanan',
      targetValue: 7.5,
      currentValue: 8.1,
      unit: 'skor',
      category: 'VISUAL_APPEARANCE',
      isActive: true
    },

    // Hygiene Standards
    {
      id: 'qs-hygiene-staff-wash',
      name: 'Frekuensi Cuci Tangan Staff',
      description: 'Minimum frekuensi cuci tangan staff dapur per jam',
      targetValue: 4.0,
      currentValue: 4.5,
      unit: 'kali/jam',
      category: 'HYGIENE_STANDARDS',
      isActive: true
    },
    {
      id: 'qs-hygiene-surface-clean',
      name: 'Frekuensi Pembersihan Permukaan',
      description: 'Frekuensi pembersihan dan sanitasi permukaan kerja per hari',
      targetValue: 6.0,
      currentValue: 6.8,
      unit: 'kali/hari',
      category: 'HYGIENE_STANDARDS',
      isActive: true
    },
    {
      id: 'qs-hygiene-equipment-sanitize',
      name: 'Sanitasi Peralatan',
      description: 'Persentase peralatan yang harus disanitasi sebelum digunakan',
      targetValue: 100.0,
      currentValue: 100.0,
      unit: '%',
      category: 'HYGIENE_STANDARDS',
      isActive: true
    },

    // Portion Control Standards
    {
      id: 'qs-portion-rice',
      name: 'Porsi Nasi per Siswa',
      description: 'Standar porsi nasi yang disajikan per siswa SD',
      targetValue: 150.0,
      currentValue: 152.3,
      unit: 'gram',
      category: 'PORTION_CONTROL',
      isActive: true
    },
    {
      id: 'qs-portion-protein',
      name: 'Porsi Protein per Siswa',
      description: 'Standar porsi protein (daging/ikan/telur) per siswa',
      targetValue: 50.0,
      currentValue: 52.1,
      unit: 'gram',
      category: 'PORTION_CONTROL',
      isActive: true
    },
    {
      id: 'qs-portion-vegetable',
      name: 'Porsi Sayuran per Siswa',
      description: 'Standar porsi sayuran yang disajikan per siswa',
      targetValue: 75.0,
      currentValue: 78.4,
      unit: 'gram',
      category: 'PORTION_CONTROL',
      isActive: true
    },
    {
      id: 'qs-portion-variance',
      name: 'Toleransi Variasi Porsi',
      description: 'Maksimum variasi porsi yang diizinkan dari standar',
      targetValue: 5.0,
      currentValue: 3.8,
      unit: '%',
      category: 'PORTION_CONTROL',
      isActive: true
    },

    // Nutrition Value Standards
    {
      id: 'qs-nutrition-calories',
      name: 'Kalori per Porsi',
      description: 'Target kalori yang harus dipenuhi per porsi makanan siswa',
      targetValue: 350.0,
      currentValue: 365.2,
      unit: 'kcal',
      category: 'NUTRITION_VALUE',
      isActive: true
    },
    {
      id: 'qs-nutrition-protein',
      name: 'Protein per Porsi',
      description: 'Target protein yang harus dipenuhi per porsi makanan',
      targetValue: 15.0,
      currentValue: 16.8,
      unit: 'gram',
      category: 'NUTRITION_VALUE',
      isActive: true
    },
    {
      id: 'qs-nutrition-carbs',
      name: 'Karbohidrat per Porsi',
      description: 'Target karbohidrat yang harus dipenuhi per porsi makanan',
      targetValue: 50.0,
      currentValue: 52.3,
      unit: 'gram',
      category: 'NUTRITION_VALUE',
      isActive: true
    },
    {
      id: 'qs-nutrition-fiber',
      name: 'Serat per Porsi',
      description: 'Target serat yang harus dipenuhi per porsi makanan',
      targetValue: 5.0,
      currentValue: 5.7,
      unit: 'gram',
      category: 'NUTRITION_VALUE',
      isActive: true
    },

    // Safety Standards
    {
      id: 'qs-safety-bacterial-count',
      name: 'Jumlah Bakteri Maksimum',
      description: 'Batas maksimum jumlah bakteri per gram makanan',
      targetValue: 1000.0,
      currentValue: 650.0,
      unit: 'CFU/gram',
      category: 'SAFETY_STANDARDS',
      isActive: true
    },
    {
      id: 'qs-safety-ph-level',
      name: 'Level pH Makanan',
      description: 'Rentang pH yang aman untuk makanan yang disajikan',
      targetValue: 6.5,
      currentValue: 6.3,
      unit: 'pH',
      category: 'SAFETY_STANDARDS',
      isActive: true
    },
    {
      id: 'qs-safety-storage-time',
      name: 'Waktu Penyimpanan Maksimum',
      description: 'Maksimum waktu penyimpanan makanan matang sebelum disajikan',
      targetValue: 2.0,
      currentValue: 1.5,
      unit: 'jam',
      category: 'SAFETY_STANDARDS',
      isActive: true
    },
    {
      id: 'qs-safety-contamination-rate',
      name: 'Tingkat Kontaminasi',
      description: 'Maksimum tingkat kontaminasi yang diizinkan dalam produksi',
      targetValue: 0.1,
      currentValue: 0.05,
      unit: '%',
      category: 'SAFETY_STANDARDS',
      isActive: true
    }
  ]

  console.log(`Akan membuat ${qualityStandards.length} quality standards...`)

  // Create quality standards with upsert
  for (const standard of qualityStandards) {
    await prisma.qualityStandard.upsert({
      where: { id: standard.id },
      update: {
        name: standard.name,
        description: standard.description,
        targetValue: standard.targetValue,
        currentValue: standard.currentValue,
        unit: standard.unit,
        category: standard.category,
        isActive: standard.isActive
      },
      create: standard
    })
  }

  console.log(`✅ Created ${qualityStandards.length} quality standard records`)
}

export default seedQualityStandards
