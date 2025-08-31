import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedSchools() {
  console.log('🏫 Seeding schools in Purwakarta...')
  
  const schools = [
    {
      id: 'school-sdn-001',
      name: 'SDN Purwakarta 001',
      principalName: 'Ibu Siti Aminah, S.Pd',
      principalPhone: '+62264123001',
      address: 'Jl. Pendidikan No. 12, Purwakarta Kota, Sindangkasih, Purwakarta 41115',
      totalStudents: 420,
      notes: 'Sekolah unggulan di pusat kota Purwakarta dengan fasilitas lengkap',
      latitude: -6.5441,
      longitude: 107.4441
    },
    {
      id: 'school-sdn-002',
      name: 'SDN Purwakarta 002',
      principalName: 'Bapak Ahmad Subagja, S.Pd',
      principalPhone: '+62264123002',
      address: 'Jl. Veteran No. 45, Purwakarta Kota, Nagri Kaler, Purwakarta 41115',
      totalStudents: 380,
      notes: 'Sekolah dengan program lingkungan yang baik',
      latitude: -6.5445,
      longitude: 107.4445
    },
    {
      id: 'school-sdn-003',
      name: 'SDN Campaka 001',
      principalName: 'Ibu Dewi Sartika, S.Pd',
      principalPhone: '+62264123003',
      address: 'Jl. Raya Campaka No. 78, Campaka, Purwakarta 41181',
      totalStudents: 350,
      notes: 'Sekolah di daerah Campaka dengan akses mudah',
      latitude: -6.5850,
      longitude: 107.4950
    },
    {
      id: 'school-sdn-004',
      name: 'SDN Jatiluhur 001',
      principalName: 'Bapak Dedi Mulyadi, S.Pd',
      principalPhone: '+62264123004',
      address: 'Jl. Ir. H. Djuanda No. 156, Jatiluhur, Purwakarta 41152',
      totalStudents: 290,
      notes: 'Sekolah dekat dengan waduk Jatiluhur',
      latitude: -6.5200,
      longitude: 107.3800
    },
    {
      id: 'school-sdn-005',
      name: 'SDN Sukatani 001',
      principalName: 'Ibu Ratna Sari, S.Pd',
      principalPhone: '+62264123005',
      address: 'Jl. Sukatani Raya No. 23, Sukatani, Purwakarta 41167',
      totalStudents: 315,
      notes: 'Sekolah di daerah Sukatani dengan lingkungan asri',
      latitude: -6.5600,
      longitude: 107.4600
    },
    {
      id: 'school-sdn-006',
      name: 'SDN Babakancikao 001',
      principalName: 'Bapak Ujang Sutisna, S.Pd',
      principalPhone: '+62264123006',
      address: 'Jl. Raya Babakancikao No. 67, Babakancikao, Purwakarta 41174',
      totalStudents: 275,
      notes: 'Sekolah di kecamatan Babakancikao',
      latitude: -6.5300,
      longitude: 107.4300
    },
    {
      id: 'school-sdn-007',
      name: 'SDN Plered 001',
      principalName: 'Ibu Neneng Kurniawati, S.Pd',
      principalPhone: '+62264123007',
      address: 'Jl. Plered Raya No. 89, Plered, Purwakarta 41162',
      totalStudents: 340,
      notes: 'Sekolah di daerah Plered dengan program inovasi',
      latitude: -6.5100,
      longitude: 107.4100
    },
    {
      id: 'school-sdn-008',
      name: 'SDN Wanayasa 001',
      principalName: 'Bapak Asep Saepudin, S.Pd',
      principalPhone: '+62264123008',
      address: 'Jl. Wanayasa No. 34, Wanayasa, Purwakarta 41175',
      totalStudents: 260,
      notes: 'Sekolah di kecamatan Wanayasa',
      latitude: -6.5400,
      longitude: 107.4400
    }
  ]

  for (const school of schools) {
    await prisma.school.upsert({
      where: { id: school.id },
      update: school,
      create: school
    })
  }

  console.log(`✅ Created ${schools.length} schools in Purwakarta`)
}

export default seedSchools
