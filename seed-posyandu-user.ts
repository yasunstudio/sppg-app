import { PrismaClient } from './src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to generate realistic Indonesian names
const generateIndonesianName = () => {
  const firstNames = [
    'Siti', 'Ahmad', 'Budi', 'Sri', 'Indra', 'Dewi', 'Eko', 'Rini', 'Agus', 'Lestari',
    'Bambang', 'Nurul', 'Joko', 'Sari', 'Heri', 'Maya', 'Dedi', 'Fitri', 'Andi', 'Retno',
    'Wawan', 'Erni', 'Teguh', 'Yuni', 'Rahmat', 'Lia', 'Dian', 'Putri', 'Imam', 'Niken'
  ];
  
  const lastNames = [
    'Kusuma', 'Wijaya', 'Sari', 'Pratama', 'Handayani', 'Nugroho', 'Lestari', 'Santoso',
    'Rahayu', 'Susanto', 'Maharani', 'Setiawan', 'Permata', 'Cahyono', 'Indrawati', 'Purnomo',
    'Suharto', 'Wardani', 'Hartono', 'Safitri', 'Hidayat', 'Anggraini', 'Kurniawan', 'Astuti'
  ];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

// Helper function to generate Indonesian phone numbers
const generatePhoneNumber = () => {
  const prefixes = ['0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853', '0857', '0858'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 90000000) + 10000000;
  return `${prefix}${suffix}`;
};

// Helper function to generate NIK (Indonesian ID number)
const generateNIK = () => {
  // Format: DDMMYY + location code + sequence
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const year = String(Math.floor(Math.random() * 30) + 70).padStart(2, '0'); // 1970-1999
  const locationCode = Math.floor(Math.random() * 9000) + 1000;
  const sequence = String(Math.floor(Math.random() * 9000) + 1000);
  
  return `${day}${month}${year}${locationCode}${sequence}`;
};

// Jakarta area coordinates for realistic positioning
const jakartaAreas = [
  { name: 'Jakarta Pusat', lat: -6.1745, lng: 106.8227 },
  { name: 'Jakarta Utara', lat: -6.1384, lng: 106.8486 },
  { name: 'Jakarta Barat', lat: -6.1352, lng: 106.7663 },
  { name: 'Jakarta Selatan', lat: -6.2614, lng: 106.8106 },
  { name: 'Jakarta Timur', lat: -6.2250, lng: 106.9004 },
  { name: 'Bekasi', lat: -6.2441, lng: 107.0014 },
  { name: 'Depok', lat: -6.4025, lng: 106.7942 },
  { name: 'Tangerang', lat: -6.1783, lng: 106.6319 },
  { name: 'Bogor', lat: -6.5971, lng: 106.8060 }
];

async function seedUsers() {
  console.log('🔄 Seeding Users...');
  
  // First, create roles if they don't exist
  const roles = [
    {
      name: 'SUPER_ADMIN',
      description: 'Full system access and administration',
      permissions: ['*']
    },
    {
      name: 'ADMIN',
      description: 'Administrative access to most features',
      permissions: ['users.read', 'users.write', 'posyandu.read', 'posyandu.write', 'reports.read']
    },
    {
      name: 'POSYANDU_COORDINATOR',
      description: 'Manages posyandu operations and volunteers',
      permissions: ['posyandu.read', 'posyandu.write', 'volunteers.read', 'volunteers.write', 'programs.read', 'programs.write']
    },
    {
      name: 'HEALTH_WORKER',
      description: 'Healthcare professional with access to health data',
      permissions: ['health.read', 'health.write', 'nutrition.read', 'nutrition.write', 'participants.read', 'participants.write']
    },
    {
      name: 'VOLUNTEER',
      description: 'Posyandu volunteer with limited access',
      permissions: ['activities.read', 'participants.read', 'programs.read']
    },
    {
      name: 'NUTRITIONIST',
      description: 'Nutrition specialist with meal planning access',
      permissions: ['nutrition.read', 'nutrition.write', 'menus.read', 'menus.write', 'participants.read']
    }
  ];

  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData
    });
  }

  const allRoles = await prisma.role.findMany();
  const roleMap = new Map(allRoles.map(role => [role.name, role.id]));

  // Create system users with different roles
  const systemUsers = [
    {
      email: 'admin@sppg.id',
      username: 'admin',
      name: 'Administrator SPPG',
      phone: '021-12345678',
      address: 'Kantor Pusat SPPG, Jakarta',
      role: 'SUPER_ADMIN'
    },
    {
      email: 'koordinator@sppg.id',
      username: 'koordinator',
      name: 'Dr. Siti Nurhaliza',
      phone: '021-87654321',
      address: 'Dinas Kesehatan Jakarta',
      role: 'POSYANDU_COORDINATOR'
    },
    {
      email: 'ahligizi@sppg.id',
      username: 'ahligizi',
      name: 'Ns. Ahmad Nutritionist, M.Gizi',
      phone: '021-11223344',
      address: 'Puskesmas Jakarta Pusat',
      role: 'NUTRITIONIST'
    }
  ];

  // Create health workers
  const healthWorkers = [];
  for (let i = 1; i <= 8; i++) {
    healthWorkers.push({
      email: `nakes${i}@sppg.id`,
      username: `nakes${i}`,
      name: `${i <= 4 ? 'dr.' : 'Ns.'} ${generateIndonesianName()}`,
      phone: generatePhoneNumber(),
      address: `Puskesmas ${jakartaAreas[i % jakartaAreas.length].name}`,
      role: 'HEALTH_WORKER'
    });
  }

  // Create volunteers
  const volunteers = [];
  for (let i = 1; i <= 15; i++) {
    volunteers.push({
      email: `volunteer${i}@sppg.id`,
      username: `volunteer${i}`,
      name: generateIndonesianName(),
      phone: generatePhoneNumber(),
      address: `${jakartaAreas[i % jakartaAreas.length].name}, Jakarta`,
      role: 'VOLUNTEER'
    });
  }

  const allUsers = [...systemUsers, ...healthWorkers, ...volunteers];
  const password = await bcrypt.hash('password123', 12);

  for (const userData of allUsers) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        name: userData.name,
        password: password,
        phone: userData.phone,
        address: userData.address,
        isActive: true,
        emailVerified: new Date()
      }
    });

    // Assign role to user
    const roleId = roleMap.get(userData.role);
    if (roleId) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: roleId
        }
      });
    }

    console.log(`✅ Created user: ${userData.name} (${userData.email}) - Role: ${userData.role}`);
  }

  console.log(`✅ Successfully created ${allUsers.length} users`);
  return allUsers.length;
}

async function seedPosyandu() {
  console.log('🔄 Seeding Posyandu...');

  // Create Posyandu data
  const posyanduData = [
    {
      name: 'Posyandu Melati',
      headName: 'Ibu Siti Rahayu',
      headPhone: generatePhoneNumber(),
      address: 'Jl. Melati No. 15, Kelurahan Menteng, Jakarta Pusat',
      notes: 'Posyandu aktif dengan program khusus stunting',
      area: jakartaAreas[0]
    },
    {
      name: 'Posyandu Mawar',
      headName: 'Ibu Dewi Lestari',
      headPhone: generatePhoneNumber(),
      address: 'Jl. Mawar No. 8, Kelurahan Kelapa Gading, Jakarta Utara',
      notes: 'Posyandu dengan fokus ibu hamil dan menyusui',
      area: jakartaAreas[1]
    },
    {
      name: 'Posyandu Anggrek',
      headName: 'Ibu Nurul Hidayati',
      headPhone: generatePhoneNumber(),
      address: 'Jl. Anggrek No. 22, Kelurahan Kebon Jeruk, Jakarta Barat',
      notes: 'Posyandu terintegrasi dengan sekolah PAUD',
      area: jakartaAreas[2]
    },
    {
      name: 'Posyandu Kenanga',
      headName: 'Ibu Maya Sari',
      headPhone: generatePhoneNumber(),
      address: 'Jl. Kenanga No. 45, Kelurahan Kebayoran Baru, Jakarta Selatan',
      notes: 'Posyandu percontohan dengan teknologi digital',
      area: jakartaAreas[3]
    },
    {
      name: 'Posyandu Cempaka',
      headName: 'Ibu Retno Wulandari',
      headPhone: generatePhoneNumber(),
      address: 'Jl. Cempaka No. 12, Kelurahan Cakung, Jakarta Timur',
      notes: 'Posyandu dengan program khusus balita gizi buruk',
      area: jakartaAreas[4]
    },
    {
      name: 'Posyandu Dahlia',
      headName: 'Ibu Fitri Handayani',
      headPhone: generatePhoneNumber(),
      address: 'Jl. Dahlia No. 30, Kelurahan Bekasi Utara, Bekasi',
      notes: 'Posyandu binaan Puskesmas Bekasi',
      area: jakartaAreas[5]
    },
    {
      name: 'Posyandu Tulip',
      headName: 'Ibu Yuni Astuti',
      headPhone: generatePhoneNumber(),
      address: 'Jl. Tulip No. 18, Kelurahan Margonda, Depok',
      notes: 'Posyandu dengan volunteer mahasiswa UI',
      area: jakartaAreas[6]
    },
    {
      name: 'Posyandu Seruni',
      headName: 'Ibu Lia Permatasari',
      headPhone: generatePhoneNumber(),
      address: 'Jl. Seruni No. 25, Kelurahan Ciledug, Tangerang',
      notes: 'Posyandu dengan program edukasi gizi ibu',
      area: jakartaAreas[7]
    },
    {
      name: 'Posyandu Flamboyan',
      headName: 'Ibu Niken Maharani',
      headPhone: generatePhoneNumber(),
      address: 'Jl. Flamboyan No. 40, Kelurahan Bogor Tengah, Bogor',
      notes: 'Posyandu terintegrasi dengan pusat kesehatan masyarakat',
      area: jakartaAreas[8]
    },
    {
      name: 'Posyandu Kamboja',
      headName: 'Ibu Indrawati Kusuma',
      headPhone: generatePhoneNumber(),
      address: 'Jl. Kamboja No. 35, Kelurahan Cempaka Putih, Jakarta Pusat',
      notes: 'Posyandu dengan program khusus lansia',
      area: jakartaAreas[0]
    }
  ];

  const createdPosyandu = [];
  for (const data of posyanduData) {
    // Add some random variation to coordinates
    const latVariation = (Math.random() - 0.5) * 0.02; // ~1km variation
    const lngVariation = (Math.random() - 0.5) * 0.02;
    
    const posyandu = await prisma.posyandu.create({
      data: {
        name: data.name,
        headName: data.headName,
        headPhone: data.headPhone,
        address: data.address,
        notes: data.notes,
        latitude: data.area.lat + latVariation,
        longitude: data.area.lng + lngVariation
      }
    });

    createdPosyandu.push(posyandu);
    console.log(`✅ Created Posyandu: ${data.name} - ${data.headName}`);
  }

  console.log(`✅ Successfully created ${createdPosyandu.length} Posyandu`);
  return createdPosyandu;
}

async function seedPosyanduPrograms(posyanduList: any[]) {
  console.log('🔄 Seeding Posyandu Programs...');

  const programTypes = [
    'MATERNAL_HEALTH',
    'CHILD_NUTRITION', 
    'IMMUNIZATION',
    'FAMILY_PLANNING',
    'HEALTH_EDUCATION',
    'GROWTH_MONITORING',
    'NUTRITION_COUNSELING'
  ] as const;

  let totalPrograms = 0;

  for (const posyandu of posyanduList) {
    // Create 2-3 programs per posyandu
    const numPrograms = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < numPrograms; i++) {
      const programType = programTypes[Math.floor(Math.random() * programTypes.length)];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6)); // Start 0-6 months ago
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + Math.floor(Math.random() * 12) + 6); // Run for 6-18 months

      const program = await prisma.posyanduProgram.create({
        data: {
          posyanduId: posyandu.id,
          name: getProgramName(programType, i + 1),
          description: getProgramDescription(programType),
          programType: programType,
          targetBeneficiaries: Math.floor(Math.random() * 80) + 20, // 20-100 beneficiaries
          startDate: startDate,
          endDate: endDate,
          status: Math.random() > 0.8 ? 'COMPLETED' : 'ACTIVE',
          budget: Math.floor(Math.random() * 50000000) + 10000000 // 10-60 million rupiah
        }
      });

      totalPrograms++;
    }
  }

  console.log(`✅ Successfully created ${totalPrograms} Posyandu programs`);
}

function getProgramName(type: string, index: number): string {
  const names = {
    'MATERNAL_HEALTH': [
      'Program Kesehatan Ibu Hamil',
      'Kelas Ibu Sehat',
      'Pemeriksaan Kehamilan Rutin'
    ],
    'CHILD_NUTRITION': [
      'Program Gizi Anak',
      'Edukasi Gizi Balita',
      'Perbaikan Gizi Anak'
    ],
    'IMMUNIZATION': [
      'Program Imunisasi Lengkap',
      'Catch-up Immunization',
      'Vaksinasi COVID-19 Anak'
    ],
    'FAMILY_PLANNING': [
      'KB Aktif Posyandu',
      'Konseling Keluarga Berencana',
      'Program KB Pasca Melahirkan'
    ],
    'HEALTH_EDUCATION': [
      'Penyuluhan Kesehatan',
      'Edukasi Hidup Sehat',
      'Promosi Kesehatan Masyarakat'
    ],
    'GROWTH_MONITORING': [
      'Pantau Tumbuh Kembang',
      'Program KMS Digital',
      'Monitoring Berat-Tinggi Balita'
    ],
    'NUTRITION_COUNSELING': [
      'Konseling Gizi Individual',
      'Konsultasi Gizi Keluarga',
      'Terapi Gizi Khusus'
    ]
  };
  
  const typeNames = names[type as keyof typeof names] || ['Program Kesehatan'];
  return typeNames[index % typeNames.length];
}

function getProgramDescription(type: string): string {
  const descriptions = {
    'MATERNAL_HEALTH': 'Program kesehatan khusus untuk ibu hamil meliputi pemeriksaan rutin, konseling kesehatan, dan persiapan persalinan.',
    'CHILD_NUTRITION': 'Program perbaikan gizi anak dan balita untuk mencegah stunting, gizi buruk, dan meningkatkan status gizi.',
    'IMMUNIZATION': 'Program imunisasi lengkap sesuai jadwal untuk memberikan perlindungan optimal terhadap penyakit menular.',
    'FAMILY_PLANNING': 'Program keluarga berencana untuk membantu pasangan dalam merencanakan kehamilan dan jarak kelahiran yang sehat.',
    'HEALTH_EDUCATION': 'Program edukasi dan penyuluhan kesehatan untuk meningkatkan pengetahuan masyarakat tentang hidup sehat.',
    'GROWTH_MONITORING': 'Program monitoring pertumbuhan dan perkembangan balita melalui pengukuran antropometri rutin.',
    'NUTRITION_COUNSELING': 'Program konseling gizi individual dan keluarga untuk mengatasi masalah gizi spesifik.'
  };
  
  return descriptions[type as keyof typeof descriptions] || 'Program kesehatan masyarakat untuk meningkatkan kualitas hidup keluarga.';
}

async function seedPosyanduVolunteers(posyanduList: any[]) {
  console.log('🔄 Seeding Posyandu Volunteers...');

  const volunteerRoles = ['CADRE_COORDINATOR', 'HEALTH_CADRE', 'NUTRITION_CADRE', 'DATA_RECORDER', 'COMMUNITY_MOBILIZER', 'TRAINING_COORDINATOR'] as const;
  const specializations = [
    'Gizi Balita',
    'Kesehatan Ibu dan Anak',
    'Imunisasi',
    'KB dan Reproduksi',
    'Konseling Keluarga',
    'Pendidikan Kesehatan',
    'Pengobatan Tradisional',
    'Kesehatan Mental'
  ];

  // Get volunteer users
  const volunteerUsers = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            name: 'VOLUNTEER'
          }
        }
      }
    }
  });

  let totalVolunteers = 0;
  let userIndex = 0;

  for (const posyandu of posyanduList) {
    // Create 3-5 volunteers per posyandu
    const numVolunteers = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < numVolunteers; i++) {
      const role = volunteerRoles[Math.floor(Math.random() * volunteerRoles.length)];
      const specialization = specializations[Math.floor(Math.random() * specializations.length)];
      
      // Assign user if available
      const user = userIndex < volunteerUsers.length ? volunteerUsers[userIndex] : null;
      if (user) userIndex++;

      const joinDate = new Date();
      joinDate.setMonth(joinDate.getMonth() - Math.floor(Math.random() * 24)); // Joined 0-24 months ago

      const volunteer = await prisma.posyanduVolunteer.create({
        data: {
          posyanduId: posyandu.id,
          userId: user?.id,
          name: user?.name || generateIndonesianName(),
          phone: user?.phone || generatePhoneNumber(),
          email: user?.email,
          address: user?.address || `${posyandu.address}, RT ${Math.floor(Math.random() * 20) + 1}/RW ${Math.floor(Math.random() * 10) + 1}`,
          role: role,
          specialization: specialization,
          trainingStatus: Math.random() > 0.3 ? 'ADVANCED' : Math.random() > 0.6 ? 'INTERMEDIATE' : 'BASIC',
          activeStatus: Math.random() > 0.1, // 90% active
          joinDate: joinDate
        }
      });

      totalVolunteers++;
    }
  }

  console.log(`✅ Successfully created ${totalVolunteers} Posyandu volunteers`);
}

async function seedPosyanduParticipants(posyanduList: any[]) {
  console.log('🔄 Seeding Posyandu Participants...');

  const participantTypes = ['TODDLER', 'PREGNANT', 'LACTATING', 'ELDERLY', 'CHILD'] as const;
  const nutritionStatuses = ['NORMAL', 'UNDERWEIGHT', 'OVERWEIGHT', 'STUNTED', 'WASTED', 'SEVERE_MALNUTRITION'] as const;
  const genders = ['MALE', 'FEMALE'] as const;

  let totalParticipants = 0;

  for (const posyandu of posyanduList) {
    // Create 30-60 participants per posyandu
    const numParticipants = Math.floor(Math.random() * 31) + 30;
    
    for (let i = 0; i < numParticipants; i++) {
      const participantType = participantTypes[Math.floor(Math.random() * participantTypes.length)];
      const gender = genders[Math.floor(Math.random() * genders.length)];
      
      // Generate age based on participant type
      let dateOfBirth = new Date();
      switch (participantType) {
        case 'TODDLER':
          dateOfBirth.setFullYear(dateOfBirth.getFullYear() - Math.floor(Math.random() * 5)); // 0-5 years
          break;
        case 'CHILD':
          dateOfBirth.setFullYear(dateOfBirth.getFullYear() - (Math.floor(Math.random() * 10) + 5)); // 5-15 years
          break;
        case 'PREGNANT':
          dateOfBirth.setFullYear(dateOfBirth.getFullYear() - (Math.floor(Math.random() * 20) + 18)); // 18-38 years
          break;
        case 'LACTATING':
          dateOfBirth.setFullYear(dateOfBirth.getFullYear() - (Math.floor(Math.random() * 15) + 20)); // 20-35 years
          break;
        case 'ELDERLY':
          dateOfBirth.setFullYear(dateOfBirth.getFullYear() - (Math.floor(Math.random() * 20) + 60)); // 60-80 years
          break;
      }

      const participant = await prisma.posyanduParticipant.create({
        data: {
          posyanduId: posyandu.id,
          name: generateIndonesianName(),
          nik: generateNIK(),
          dateOfBirth: dateOfBirth,
          gender: gender,
          address: `${posyandu.address}, RT ${Math.floor(Math.random() * 20) + 1}/RW ${Math.floor(Math.random() * 10) + 1}`,
          phoneNumber: Math.random() > 0.3 ? generatePhoneNumber() : null,
          participantType: participantType,
          currentWeight: participantType === 'TODDLER' ? 
            Math.floor(Math.random() * 20) + 8 : // 8-28 kg for toddlers
            Math.floor(Math.random() * 40) + 45, // 45-85 kg for adults
          currentHeight: participantType === 'TODDLER' ?
            Math.floor(Math.random() * 50) + 70 : // 70-120 cm for toddlers
            Math.floor(Math.random() * 30) + 150, // 150-180 cm for adults
          nutritionStatus: nutritionStatuses[Math.floor(Math.random() * nutritionStatuses.length)],
          healthCondition: Math.random() > 0.7 ? getRandomHealthCondition() : null,
          allergies: Math.random() > 0.8 ? getRandomAllergy() : null
        }
      });

      totalParticipants++;
    }
  }

  console.log(`✅ Successfully created ${totalParticipants} Posyandu participants`);
}

function getRandomHealthCondition(): string {
  const conditions = [
    'Diabetes',
    'Hipertensi',
    'Anemia',
    'ISPA',
    'Diare',
    'Demam',
    'Batuk Pilek',
    'Gangguan Pencernaan',
    'Alergi Makanan',
    'Kurang Gizi'
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
}

function getRandomAllergy(): string {
  const allergies = [
    'Susu Sapi',
    'Telur',
    'Kacang Tanah',
    'Ikan Laut',
    'Udang',
    'Gandum',
    'Kedelai',
    'Debu',
    'Bulu Kucing',
    'Obat Tertentu'
  ];
  return allergies[Math.floor(Math.random() * allergies.length)];
}

async function main() {
  try {
    console.log('🚀 Starting Posyandu and User seeding...');
    
    // Seed Users first
    const userCount = await seedUsers();
    
    // Seed Posyandu
    const posyanduList = await seedPosyandu();
    
    // Seed related Posyandu data
    await seedPosyanduPrograms(posyanduList);
    await seedPosyanduVolunteers(posyanduList);
    await seedPosyanduParticipants(posyanduList);
    
    console.log('\n🎉 Posyandu and User seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Posyandu: ${posyanduList.length}`);
    console.log(`   - Programs: Created for all Posyandu`);
    console.log(`   - Volunteers: Created for all Posyandu`);
    console.log(`   - Participants: Created for all Posyandu`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
