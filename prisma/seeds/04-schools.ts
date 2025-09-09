import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedSchools() {
  console.log('🏫 Seeding schools in Kabupaten Purwakarta...')
  
  const schools = [
    // Kecamatan Purwakarta (Pusat Kota)
    {
      id: 'school-sdn-purwakarta-001',
      name: 'SDN Purwakarta Kota 1',
      principalName: 'Ibu Siti Nurjanah, S.Pd, M.Pd',
      principalPhone: '+62264201001',
      address: 'Jl. Veteran No. 15, Sindangkasih, Purwakarta 41115',
      totalStudents: 456,
      notes: 'Sekolah unggulan di pusat kota dengan fasilitas lengkap dan program digitalisasi',
      latitude: -6.5441,
      longitude: 107.4441
    },
    {
      id: 'school-sdn-purwakarta-002',
      name: 'SDN Nagri Kaler',
      principalName: 'Bapak Ahmad Fauzi, S.Pd',
      principalPhone: '+62264201002',
      address: 'Jl. Siliwangi No. 78, Nagri Kaler, Purwakarta 41115',
      totalStudents: 398,
      notes: 'Sekolah dengan program adiwiyata dan lingkungan hijau',
      latitude: -6.5445,
      longitude: 107.4445
    },
    {
      id: 'school-sdn-purwakarta-003',
      name: 'SDN Munjul',
      principalName: 'Ibu Dewi Marlina, S.Pd',
      principalPhone: '+62264201003',
      address: 'Jl. Raya Munjul No. 123, Munjul, Purwakarta 41116',
      totalStudents: 342,
      notes: 'Sekolah di area strategis dengan akses transportasi mudah',
      latitude: -6.5350,
      longitude: 107.4350
    },

    // Kecamatan Campaka
    {
      id: 'school-sdn-campaka-001',
      name: 'SDN Campaka 1',
      principalName: 'Bapak Endang Supriadi, S.Pd',
      principalPhone: '+62264202001',
      address: 'Jl. Raya Campaka No. 56, Campaka, Purwakarta 41181',
      totalStudents: 378,
      notes: 'Sekolah di kecamatan Campaka dengan program literasi yang kuat',
      latitude: -6.5850,
      longitude: 107.4950
    },
    {
      id: 'school-sdn-campaka-002',
      name: 'SDN Bojong Kulur',
      principalName: 'Ibu Rina Kurniasih, S.Pd',
      principalPhone: '+62264202002',
      address: 'Jl. Bojong Kulur No. 89, Bojong, Campaka, Purwakarta 41181',
      totalStudents: 312,
      notes: 'Sekolah di desa Bojong dengan program pertanian organik',
      latitude: -6.5920,
      longitude: 107.5020
    },

    // Kecamatan Jatiluhur
    {
      id: 'school-sdn-jatiluhur-001',
      name: 'SDN Jatiluhur 1',
      principalName: 'Bapak Dedi Kurniawan, S.Pd, M.M',
      principalPhone: '+62264203001',
      address: 'Jl. Ir. H. Djuanda No. 234, Jatiluhur, Purwakarta 41152',
      totalStudents: 289,
      notes: 'Sekolah dekat waduk Jatiluhur dengan program wisata edukasi',
      latitude: -6.5200,
      longitude: 107.3800
    },
    {
      id: 'school-sdn-jatiluhur-002',
      name: 'SDN Karangjaya',
      principalName: 'Ibu Yuli Rahayu, S.Pd',
      principalPhone: '+62264203002',
      address: 'Jl. Karangjaya No. 45, Karangjaya, Jatiluhur, Purwakarta 41152',
      totalStudents: 256,
      notes: 'Sekolah di desa wisata dengan program ekowisata',
      latitude: -6.5150,
      longitude: 107.3750
    },

    // Kecamatan Plered
    {
      id: 'school-sdn-plered-001',
      name: 'SDN Plered 1',
      principalName: 'Bapak Cecep Suherman, S.Pd',
      principalPhone: '+62264204001',
      address: 'Jl. Raya Plered No. 167, Plered, Purwakarta 41162',
      totalStudents: 423,
      notes: 'Sekolah besar di kecamatan Plered dengan program STEAM education',
      latitude: -6.5100,
      longitude: 107.4100
    },
    {
      id: 'school-sdn-plered-002',
      name: 'SDN Cigadung',
      principalName: 'Ibu Sari Wulandari, S.Pd',
      principalPhone: '+62264204002',
      address: 'Jl. Cigadung Raya No. 78, Cigadung, Plered, Purwakarta 41162',
      totalStudents: 334,
      notes: 'Sekolah dengan program kewirausahaan dan UMKM siswa',
      latitude: -6.5050,
      longitude: 107.4050
    },

    // Kecamatan Sukatani
    {
      id: 'school-sdn-sukatani-001',
      name: 'SDN Sukatani 1',
      principalName: 'Ibu Ratna Dewi, S.Pd',
      principalPhone: '+62264205001',
      address: 'Jl. Sukatani Raya No. 92, Sukatani, Purwakarta 41167',
      totalStudents: 367,
      notes: 'Sekolah di area perkebunan dengan program agribisnis',
      latitude: -6.5600,
      longitude: 107.4600
    },
    {
      id: 'school-sdn-sukatani-002',
      name: 'SDN Cilalawi',
      principalName: 'Bapak Yayat Sudrajat, S.Pd',
      principalPhone: '+62264205002',
      address: 'Jl. Cilalawi No. 134, Cilalawi, Sukatani, Purwakarta 41167',
      totalStudents: 298,
      notes: 'Sekolah di daerah pegunungan dengan akses transportasi terbatas',
      latitude: -6.5750,
      longitude: 107.4750
    },

    // Kecamatan Babakancikao
    {
      id: 'school-sdn-babakancikao-001',
      name: 'SDN Babakancikao 1',
      principalName: 'Bapak Ujang Sutisna, S.Pd',
      principalPhone: '+62264206001',
      address: 'Jl. Raya Babakancikao No. 201, Babakancikao, Purwakarta 41174',
      totalStudents: 278,
      notes: 'Sekolah di kecamatan Babakancikao dengan program kesenian daerah',
      latitude: -6.5300,
      longitude: 107.4300
    },

    // Kecamatan Wanayasa
    {
      id: 'school-sdn-wanayasa-001',
      name: 'SDN Wanayasa 1',
      principalName: 'Ibu Neneng Komariah, S.Pd',
      principalPhone: '+62264207001',
      address: 'Jl. Wanayasa Raya No. 65, Wanayasa, Purwakarta 41175',
      totalStudents: 245,
      notes: 'Sekolah di area rural dengan program pemberdayaan masyarakat',
      latitude: -6.5400,
      longitude: 107.4400
    },

    // Kecamatan Sukasari
    {
      id: 'school-sdn-sukasari-001',
      name: 'SDN Sukasari 1',
      principalName: 'Bapak Asep Saepudin, S.Pd',
      principalPhone: '+62264208001',
      address: 'Jl. Sukasari No. 87, Sukasari, Purwakarta 41172',
      totalStudents: 289,
      notes: 'Sekolah di kecamatan Sukasari dengan program teknologi tepat guna',
      latitude: -6.5650,
      longitude: 107.4150
    },

    // Kecamatan Bojong (Area Perbatasan)
    {
      id: 'school-sdn-bojong-001',
      name: 'SDN Bojong 1',
      principalName: 'Ibu Cucu Rohayati, S.Pd',
      principalPhone: '+62264209001',
      address: 'Jl. Raya Bojong No. 156, Bojong, Purwakarta 41173',
      totalStudents: 267,
      notes: 'Sekolah di area perbatasan dengan Subang, program olahraga unggulan',
      latitude: -6.5800,
      longitude: 107.3900
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
