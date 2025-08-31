import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedClasses() {
  console.log('🏫 Seeding classes...')
  
  // Get schools for reference
  const schools = await prisma.school.findMany({
    select: { id: true, name: true }
  })

  if (schools.length === 0) {
    console.log('⚠️ No schools found, skipping class seeding')
    return
  }

  const classes = [
    // SDN 1 Purwakarta
    {
      id: 'class-sdn1-1a',
      name: 'Kelas 1A',
      grade: 1,
      capacity: 30,
      currentCount: 28,
      teacherName: 'Ibu Sari Rahayu, S.Pd',
      notes: 'Kelas aktif dengan partisipasi tinggi',
      schoolId: schools.find(s => s.name.includes('SDN 1'))?.id || schools[0].id
    },
    {
      id: 'class-sdn1-1b',
      name: 'Kelas 1B',
      grade: 1,
      capacity: 30,
      currentCount: 29,
      teacherName: 'Ibu Rina Wulandari, S.Pd',
      notes: 'Kelas dengan siswa antusias',
      schoolId: schools.find(s => s.name.includes('SDN 1'))?.id || schools[0].id
    },
    {
      id: 'class-sdn1-2a',
      name: 'Kelas 2A',
      grade: 2,
      capacity: 32,
      currentCount: 30,
      teacherName: 'Bapak Dedi Kurniawan, S.Pd',
      notes: 'Kelas yang sudah mandiri makan',
      schoolId: schools.find(s => s.name.includes('SDN 1'))?.id || schools[0].id
    },
    {
      id: 'class-sdn1-3a',
      name: 'Kelas 3A',
      grade: 3,
      capacity: 32,
      currentCount: 31,
      teacherName: 'Ibu Maya Sari, S.Pd',
      notes: 'Kelas dengan kebiasaan makan sehat',
      schoolId: schools.find(s => s.name.includes('SDN 1'))?.id || schools[0].id
    },
    
    // SDN 2 Purwakarta
    {
      id: 'class-sdn2-1a',
      name: 'Kelas 1A',
      grade: 1,
      capacity: 28,
      currentCount: 26,
      teacherName: 'Ibu Lina Marlina, S.Pd',
      notes: 'Kelas perlu pendampingan makan',
      schoolId: schools.find(s => s.name.includes('SDN 2'))?.id || schools[1]?.id || schools[0].id
    },
    {
      id: 'class-sdn2-2a',
      name: 'Kelas 2A',
      grade: 2,
      capacity: 30,
      currentCount: 28,
      teacherName: 'Bapak Agus Santoso, S.Pd',
      notes: 'Kelas aktif dalam program gizi',
      schoolId: schools.find(s => s.name.includes('SDN 2'))?.id || schools[1]?.id || schools[0].id
    },
    {
      id: 'class-sdn2-3a',
      name: 'Kelas 3A',
      grade: 3,
      capacity: 30,
      currentCount: 29,
      teacherName: 'Ibu Fitri Handayani, S.Pd',
      notes: 'Kelas dengan partisipasi program tinggi',
      schoolId: schools.find(s => s.name.includes('SDN 2'))?.id || schools[1]?.id || schools[0].id
    },

    // SDN 3 Purwakarta
    {
      id: 'class-sdn3-1a',
      name: 'Kelas 1A',
      grade: 1,
      capacity: 25,
      currentCount: 24,
      teacherName: 'Ibu Tuti Alawiyah, S.Pd',
      notes: 'Kelas kecil dengan perhatian personal',
      schoolId: schools.find(s => s.name.includes('SDN 3'))?.id || schools[2]?.id || schools[0].id
    },
    {
      id: 'class-sdn3-2a',
      name: 'Kelas 2A',
      grade: 2,
      capacity: 28,
      currentCount: 26,
      teacherName: 'Bapak Wahyu Hidayat, S.Pd',
      notes: 'Kelas dengan program edukasi gizi',
      schoolId: schools.find(s => s.name.includes('SDN 3'))?.id || schools[2]?.id || schools[0].id
    },

    // SMPN 1 Purwakarta
    {
      id: 'class-smpn1-7a',
      name: 'Kelas 7A',
      grade: 7,
      capacity: 36,
      currentCount: 34,
      teacherName: 'Ibu Dr. Ratna Sari, M.Pd',
      notes: 'Kelas unggulan dengan program gizi khusus',
      schoolId: schools.find(s => s.name.includes('SMPN 1'))?.id || schools[3]?.id || schools[0].id
    },
    {
      id: 'class-smpn1-7b',
      name: 'Kelas 7B',
      grade: 7,
      capacity: 36,
      currentCount: 35,
      teacherName: 'Bapak Ahmad Fauzi, S.Pd',
      notes: 'Kelas dengan focus kesehatan remaja',
      schoolId: schools.find(s => s.name.includes('SMPN 1'))?.id || schools[3]?.id || schools[0].id
    },
    {
      id: 'class-smpn1-8a',
      name: 'Kelas 8A',
      grade: 8,
      capacity: 36,
      currentCount: 33,
      teacherName: 'Ibu Siti Nurhaliza, S.Pd',
      notes: 'Kelas dengan kemandirian tinggi',
      schoolId: schools.find(s => s.name.includes('SMPN 1'))?.id || schools[3]?.id || schools[0].id
    },

    // SMPN 2 Purwakarta
    {
      id: 'class-smpn2-7a',
      name: 'Kelas 7A',
      grade: 7,
      capacity: 32,
      currentCount: 30,
      teacherName: 'Ibu Eka Pratiwi, S.Pd',
      notes: 'Kelas baru dengan adaptasi program',
      schoolId: schools.find(s => s.name.includes('SMPN 2'))?.id || schools[4]?.id || schools[0].id
    },
    {
      id: 'class-smpn2-8a',
      name: 'Kelas 8A',
      grade: 8,
      capacity: 32,
      currentCount: 31,
      teacherName: 'Bapak Rudi Hermawan, S.Pd',
      notes: 'Kelas dengan program peer education',
      schoolId: schools.find(s => s.name.includes('SMPN 2'))?.id || schools[4]?.id || schools[0].id
    }
  ]

  for (const classData of classes) {
    await prisma.class.upsert({
      where: { id: classData.id },
      update: classData,
      create: classData
    })
  }

  console.log(`✅ Created ${classes.length} classes`)
}

export default seedClasses
