import { PrismaClient, Gender } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedStudents() {
  console.log('👶 Seeding students for SPPG Purwakarta...')
  
  const students = [
    // SDN Purwakarta Kota 1 (school-sdn-purwakarta-001)
    {
      id: 'student-sdn01-001',
      nisn: '0017031501',
      name: 'Andi Pratama',
      age: 8,
      gender: Gender.MALE,
      grade: '2A',
      parentName: 'Budi Pratama',
      schoolId: 'school-sdn-purwakarta-001',
      notes: null
    },
    {
      id: 'student-sdn01-002',
      nisn: '0017072201',
      name: 'Sari Dewi',
      age: 8,
      gender: Gender.FEMALE,
      grade: '2A',
      parentName: 'Siti Dewi',
      schoolId: 'school-sdn-purwakarta-001',
      notes: null
    },
    {
      id: 'student-sdn01-003',
      nisn: '0016110801',
      name: 'Budi Santoso',
      age: 9,
      gender: Gender.MALE,
      grade: '3B',
      parentName: 'Ahmad Santoso',
      schoolId: 'school-sdn-purwakarta-001',
      notes: 'Perlu perhatian khusus untuk nutrisi'
    },
    {
      id: 'student-sdn01-004',
      nisn: '0017013001',
      name: 'Lina Kusuma',
      age: 8,
      gender: Gender.FEMALE,
      grade: '2B',
      parentName: 'Rina Kusuma',
      schoolId: 'school-sdn-purwakarta-001',
      notes: 'Alergi kacang tanah'
    },
    {
      id: 'student-sdn01-005',
      nisn: '0017051201',
      name: 'Rudi Hermawan',
      age: 8,
      gender: Gender.MALE,
      grade: '2A',
      parentName: 'Joko Hermawan',
      schoolId: 'school-sdn-purwakarta-001',
      notes: null
    },
    
    // SDN Nagri Kaler (school-sdn-purwakarta-002)  
    {
      id: 'student-sdn02-001',
      nisn: '0017041802',
      name: 'Maya Sari',
      age: 8,
      gender: Gender.FEMALE,
      grade: '2A',
      parentName: 'Dewi Sari',
      schoolId: 'school-sdn-purwakarta-002',
      notes: null
    },
    {
      id: 'student-sdn02-002',
      nisn: '0016120502',
      name: 'Doni Kusuma',
      age: 9,
      gender: Gender.MALE,
      grade: '3A',
      parentName: 'Eko Kusuma',
      schoolId: 'school-sdn-purwakarta-002',
      notes: 'Program perbaikan nutrisi'
    },
    {
      id: 'student-sdn02-003',
      nisn: '0017081002',
      name: 'Fitri Rahayu',
      age: 8,
      gender: Gender.FEMALE,
      grade: '2B',
      parentName: 'Siti Rahayu',
      schoolId: 'school-sdn-purwakarta-002',
      notes: 'Alergi udang'
    },
    {
      id: 'student-sdn02-004',
      nisn: '0017022802',
      name: 'Agus Priyanto',
      age: 8,
      gender: Gender.MALE,
      grade: '2A',
      parentName: 'Bambang Priyanto',
      schoolId: 'school-sdn-purwakarta-002',
      notes: null
    },
    {
      id: 'student-sdn02-005',
      nisn: '0017061402',
      name: 'Rina Permata',
      age: 8,
      gender: Gender.FEMALE,
      grade: '2B',
      parentName: 'Lina Permata',
      schoolId: 'school-sdn-purwakarta-002',
      notes: 'Pantau berat badan'
    },
    
    // SDN Munjul (school-sdn-purwakarta-003)
    {
      id: 'student-sdn03-001',
      nisn: '0017090303',
      name: 'Hendra Wijaya',
      age: 8,
      gender: Gender.MALE,
      grade: '2A',
      parentName: 'Dedi Wijaya',
      schoolId: 'school-sdn-purwakarta-003',
      notes: null
    },
    {
      id: 'student-sdn03-002',
      nisn: '0016101703',
      name: 'Desi Ayu',
      age: 9,
      gender: Gender.FEMALE,
      grade: '3A',
      parentName: 'Maya Ayu',
      schoolId: 'school-sdn-purwakarta-003',
      notes: 'Program peningkatan gizi'
    },
    {
      id: 'student-sdn03-003',
      nisn: '0017042503',
      name: 'Rio Pratama',
      age: 8,
      gender: Gender.MALE,
      grade: '2B',
      parentName: 'Joko Pratama',
      schoolId: 'school-sdn-purwakarta-003',
      notes: 'Alergi telur'
    },
    {
      id: 'student-sdn03-004',
      nisn: '0017072903',
      name: 'Sinta Maharani',
      age: 8,
      gender: Gender.FEMALE,
      grade: '2A',
      parentName: 'Dewi Maharani',
      schoolId: 'school-sdn-purwakarta-003',
      notes: null
    },
    {
      id: 'student-sdn03-005',
      nisn: '0017031203',
      name: 'Arief Nugraha',
      age: 8,
      gender: Gender.MALE,
      grade: '2B',
      parentName: 'Bambang Nugraha',
      schoolId: 'school-sdn-purwakarta-003',
      notes: null
    },
    
    // SDN Campaka 1 (school-sdn-campaka-001)
    {
      id: 'student-sdn04-001',
      nisn: '0017053004',
      name: 'Wahyu Firmansyah',
      age: 8,
      gender: Gender.MALE,
      grade: '2A',
      parentName: 'Andi Firmansyah',
      schoolId: 'school-sdn-campaka-001',
      notes: null
    },
    {
      id: 'student-sdn04-002',
      nisn: '0016081704',
      name: 'Tika Andriani',
      age: 9,
      gender: Gender.FEMALE,
      grade: '3A',
      parentName: 'Lilis Andriani',
      schoolId: 'school-sdn-campaka-001',
      notes: 'Program literasi tambahan'
    },
    {
      id: 'student-sdn04-003',
      nisn: '0017110404',
      name: 'Bayu Setiawan',
      age: 8,
      gender: Gender.MALE,
      grade: '2B',
      parentName: 'Agus Setiawan',
      schoolId: 'school-sdn-campaka-001',
      notes: 'Alergi ikan laut'
    },
    {
      id: 'student-sdn04-004',
      nisn: '0017020904',
      name: 'Indira Sari',
      age: 8,
      gender: Gender.FEMALE,
      grade: '2A',
      parentName: 'Rina Sari',
      schoolId: 'school-sdn-campaka-001',
      notes: null
    },
    {
      id: 'student-sdn04-005',
      nisn: '0017061504',
      name: 'Fajar Ramadhan',
      age: 8,
      gender: Gender.MALE,
      grade: '2B',
      parentName: 'Dedi Ramadhan',
      schoolId: 'school-sdn-campaka-001',
      notes: 'Program olahraga khusus'
    },
    
    // Tambahan siswa untuk berbagai sekolah baru di Purwakarta
    {
      id: 'student-jatiluhur-001',
      nisn: '0017050501',
      name: 'Ahmad Fauzi',
      age: 8,
      gender: Gender.MALE,
      grade: '2A',
      parentName: 'Budi Fauzi',
      schoolId: 'school-sdn-jatiluhur-001',
      notes: null
    },
    {
      id: 'student-jatiluhur-002',
      nisn: '0017081201',
      name: 'Siti Nurhaliza',
      age: 8,
      gender: Gender.FEMALE,
      grade: '2B',
      parentName: 'Dewi Nurhaliza',
      schoolId: 'school-sdn-jatiluhur-001',
      notes: 'Program pemberdayaan literasi'
    },
    {
      id: 'student-plered-001',
      nisn: '0017062301',
      name: 'Rizki Pratama',
      age: 9,
      gender: Gender.MALE,
      grade: '3A',
      parentName: 'Dedi Pratama',
      schoolId: 'school-sdn-plered-001',
      notes: null
    },
    {
      id: 'student-plered-002',
      nisn: '0017041801',
      name: 'Anisa Putri',
      age: 8,
      gender: Gender.FEMALE,
      grade: '2A',
      parentName: 'Rina Putri',
      schoolId: 'school-sdn-plered-001',
      notes: 'Alergi susu sapi'
    },
    {
      id: 'student-sukatani-001',
      nisn: '0017093001',
      name: 'Bagas Setiawan',
      age: 8,
      gender: Gender.MALE,
      grade: '2B',
      parentName: 'Agus Setiawan',
      schoolId: 'school-sdn-sukatani-001',
      notes: null
    }
  ]

  try {
    for (const student of students) {
      const createdStudent = await prisma.student.upsert({
        where: { id: student.id },
        update: {
          nisn: student.nisn,
          name: student.name,
          age: student.age,
          gender: student.gender,
          grade: student.grade,
          parentName: student.parentName,
          notes: student.notes
        },
        create: student
      })
      
      console.log(`✓ Student seeded: ${createdStudent.name} (${createdStudent.gender}, Grade: ${createdStudent.grade})`)
    }
    
    console.log(`👶 Students seeding completed! Total: ${students.length} students`)
  } catch (error) {
    console.error('❌ Error seeding students:', error)
    throw error
  }
}

export default seedStudents
