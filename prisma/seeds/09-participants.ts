import { PrismaClient, Gender } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedStudents() {
  console.log('👶 Seeding students for SPPG Purwakarta...')
  
  const students = [
    // SDN Purwakarta 001  
    {
      id: 'student-sdn01-001',
      nisn: '0017031501',
      name: 'Andi Pratama',
      age: 8,
      gender: Gender.MALE,
      grade: '2A',
      parentName: 'Budi Pratama',
      schoolId: 'school-sdn-001',
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
      schoolId: 'school-sdn-001',
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
      schoolId: 'school-sdn-001',
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
      schoolId: 'school-sdn-001',
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
      schoolId: 'school-sdn-001',
      notes: null
    },
    
    // SDN Purwakarta 002
    {
      id: 'student-sdn02-001',
      nisn: '0017041802',
      name: 'Maya Sari',
      age: 8,
      gender: Gender.FEMALE,
      grade: '2A',
      parentName: 'Dewi Sari',
      schoolId: 'school-sdn-002',
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
      schoolId: 'school-sdn-002',
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
      schoolId: 'school-sdn-002',
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
      schoolId: 'school-sdn-002',
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
      schoolId: 'school-sdn-002',
      notes: 'Pantau berat badan'
    },
    
    // SDN Campaka 001 (rebranded from Purwakarta 03)
    {
      id: 'student-sdn03-001',
      nisn: '0017090303',
      name: 'Hendra Wijaya',
      age: 8,
      gender: Gender.MALE,
      grade: '2A',
      parentName: 'Dedi Wijaya',
      schoolId: 'school-sdn-003',
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
      schoolId: 'school-sdn-003',
      notes: 'Program peningkatan gizi'
    },
    {
      id: 'student-sdn03-003',
      nisn: '0017042503',
      name: 'Rio Pratama',
      age: 8,
      gender: Gender.MALE,
      grade: '2B',
      parentName: 'Rudi Pratama',
      schoolId: 'school-sdn-003',
      notes: 'Alergi telur'
    },
    {
      id: 'student-sdn03-004',
      nisn: '0017070903',
      name: 'Intan Sari',
      age: 8,
      gender: Gender.FEMALE,
      grade: '2A',
      parentName: 'Nina Sari',
      schoolId: 'school-sdn-003',
      notes: null
    },
    {
      id: 'student-sdn03-005',
      nisn: '0017011503',
      name: 'Bayu Kusuma',
      age: 8,
      gender: Gender.MALE,
      grade: '2B',
      parentName: 'Adi Kusuma',
      schoolId: 'school-sdn-003',
      notes: 'Konsultasi gizi rutin'
    },
    
    // SDN Jatiluhur 001 (rebranded from SMP)
    {
      id: 'student-smp01-001',
      nisn: '0011052001',
      name: 'Andra Saputra',
      age: 14,
      gender: Gender.MALE,
      grade: '8A',
      parentName: 'Hendra Saputra',
      schoolId: 'school-sdn-004',
      notes: null
    },
    {
      id: 'student-smp01-002',
      nisn: '0011081201',
      name: 'Putri Maharani',
      age: 14,
      gender: Gender.FEMALE,
      grade: '8A',
      parentName: 'Sari Maharani',
      schoolId: 'school-sdn-004',
      notes: null
    },
    {
      id: 'student-smp01-003',
      nisn: '0011030701',
      name: 'Farhan Alamsyah',
      age: 14,
      gender: Gender.MALE,
      grade: '8B',
      parentName: 'Irfan Alamsyah',
      schoolId: 'school-sdn-004',
      notes: 'Alergi ikan laut, program peningkatan BB'
    },
    {
      id: 'student-smp01-004',
      nisn: '0011112501',
      name: 'Azzahra Nadine',
      age: 14,
      gender: Gender.FEMALE,
      grade: '8A',
      parentName: 'Fitri Nadine',
      schoolId: 'school-sdn-004',
      notes: null
    },
    {
      id: 'student-smp01-005',
      nisn: '0011061801',
      name: 'Raka Pradana',
      age: 14,
      gender: Gender.MALE,
      grade: '8B',
      parentName: 'Eko Pradana',
      schoolId: 'school-sdn-004',
      notes: 'Kontrol berat badan'
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
