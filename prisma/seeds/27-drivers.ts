import { PrismaClient, LicenseType } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedDrivers() {
  console.log('🚗 Seeding drivers...')

  const drivers = [
    {
      employeeId: 'DRV-001',
      name: 'Ahmad Suryadi',
      phone: '08123456789',
      email: 'ahmad.suryadi@sppg.com',
      licenseNumber: 'B1234567890',
      licenseType: LicenseType.SIM_B1, // Untuk truck distribusi makanan
      licenseExpiry: new Date('2026-12-31'),
      address: 'Jl. Merdeka No. 123, Purwakarta',
      emergencyContact: 'Siti Suryadi',
      emergencyPhone: '08987654321',
      isActive: true,
      notes: 'Driver senior dengan pengalaman 5 tahun. Sangat dapat diandalkan.'
    },
    {
      employeeId: 'DRV-002',
      name: 'Budi Santoso',
      phone: '08234567890',
      email: 'budi.santoso@sppg.com',
      licenseNumber: 'B2345678901',
      licenseType: LicenseType.SIM_B1, // Untuk truck distribusi
      licenseExpiry: new Date('2025-11-30'),
      address: 'Jl. Sudirman No. 456, Purwakarta',
      emergencyContact: 'Ratna Santoso',
      emergencyPhone: '08876543210',
      isActive: true,
      notes: 'Driver yang handal, familiar dengan rute-rute sekolah di Purwakarta.'
    },
    {
      employeeId: 'DRV-003',
      name: 'Cecep Firmansyah',
      phone: '08345678901',
      email: 'cecep.firmansyah@sppg.com',
      licenseNumber: 'B3456789012',
      licenseType: LicenseType.SIM_A, // Untuk van kecil
      licenseExpiry: new Date('2027-03-15'),
      address: 'Jl. Gatot Subroto No. 789, Purwakarta',
      emergencyContact: 'Dewi Firmansyah',
      emergencyPhone: '08765432109',
      isActive: true,
      notes: 'Driver muda dengan semangat tinggi. Sangat teliti dalam penanganan makanan.'
    },
    {
      employeeId: 'DRV-004',
      name: 'Dedi Kurniawan',
      phone: '08456789012',
      email: 'dedi.kurniawan@sppg.com',
      licenseNumber: 'B4567890123',
      licenseType: LicenseType.SIM_A, // Untuk mobil pickup
      licenseExpiry: new Date('2026-08-20'),
      address: 'Jl. Ahmad Yani No. 321, Purwakarta',
      emergencyContact: 'Eka Kurniawan',
      emergencyPhone: '08654321098',
      isActive: false,
      notes: 'Sedang cuti karena SIM habis masa berlaku. Akan aktif kembali setelah perpanjangan SIM.'
    },
    {
      employeeId: 'DRV-005',
      name: 'Eko Prasetyo',
      phone: '08567890123',
      email: 'eko.prasetyo@sppg.com',
      licenseNumber: 'B5678901234',
      licenseType: LicenseType.SIM_B1, // Untuk truck besar
      licenseExpiry: new Date('2026-06-10'),
      address: 'Jl. Diponegoro No. 654, Purwakarta',
      emergencyContact: 'Fitri Prasetyo',
      emergencyPhone: '08543210987',
      isActive: true,
      notes: 'Driver berpengalaman dalam menangani distribusi ke sekolah-sekolah terpencil.'
    },
    {
      employeeId: 'DRV-006',
      name: 'Fajar Ramadhan',
      phone: '08678901234',
      email: 'fajar.ramadhan@sppg.com',
      licenseNumber: 'B6789012345',
      licenseType: LicenseType.SIM_A, // Untuk van
      licenseExpiry: new Date('2025-09-25'),
      address: 'Jl. Kartini No. 987, Purwakarta',
      emergencyContact: 'Gita Ramadhan',
      emergencyPhone: '08432109876',
      isActive: true,
      notes: 'Driver yang sangat tepat waktu dan disiplin dalam mengantarkan makanan.'
    },
    {
      employeeId: 'DRV-007',
      name: 'Gunawan Setiawan',
      phone: '08789012345',
      email: 'gunawan.setiawan@sppg.com',
      licenseNumber: 'B7890123456',
      licenseExpiry: new Date('2027-01-12'),
      address: 'Jl. Veteran No. 147, Purwakarta',
      emergencyContact: 'Hani Setiawan',
      emergencyPhone: '08321098765',
      isActive: true,
      notes: 'Memiliki sertifikat keamanan pangan dan sangat memperhatikan kebersihan.'
    },
    {
      employeeId: 'DRV-008',
      name: 'Hendra Wijaya',
      phone: '08890123456',
      email: 'hendra.wijaya@sppg.com',
      licenseNumber: 'B8901234567',
      licenseExpiry: new Date('2026-04-30'),
      address: 'Jl. Pahlawan No. 258, Purwakarta',
      emergencyContact: 'Indah Wijaya',
      emergencyPhone: '08210987654',
      isActive: true,
      notes: 'Driver baru yang sudah menunjukkan dedikasi tinggi dalam bekerja.'
    },
    {
      employeeId: 'DRV-009',
      name: 'Irwan Budiman',
      phone: '08901234567',
      email: 'irwan.budiman@sppg.com',
      licenseNumber: 'B9012345678',
      licenseExpiry: new Date('2025-12-18'),
      address: 'Jl. Proklamasi No. 369, Purwakarta',
      emergencyContact: 'Jeni Budiman',
      emergencyPhone: '08109876543',
      isActive: true,
      notes: 'Sangat mengenal wilayah Purwakarta dan sekitarnya dengan baik.'
    },
    {
      employeeId: 'DRV-010',
      name: 'Joko Susilo',
      phone: '08012345678',
      email: 'joko.susilo@sppg.com',
      licenseNumber: 'B0123456789',
      licenseExpiry: new Date('2026-10-05'),
      address: 'Jl. Kemerdekaan No. 741, Purwakarta',
      emergencyContact: 'Karina Susilo',
      emergencyPhone: '08098765432',
      isActive: false,
      notes: 'Sedang dalam masa pelatihan ulang untuk peningkatan kualitas layanan.'
    },
    {
      employeeId: 'DRV-011',
      name: 'Kurnia Hidayat',
      phone: '08123456780',
      email: 'kurnia.hidayat@sppg.com',
      licenseNumber: 'B1234567801',
      licenseExpiry: new Date('2027-07-22'),
      address: 'Jl. Pancasila No. 852, Purwakarta',
      emergencyContact: 'Lina Hidayat',
      emergencyPhone: '08987654320',
      isActive: true,
      notes: 'Driver yang komunikatif dan selalu memberikan laporan detail setiap pengiriman.'
    },
    {
      employeeId: 'DRV-012',
      name: 'Muhammad Rizki',
      phone: '08234567801',
      email: 'muhammad.rizki@sppg.com',
      licenseNumber: 'B2345678012',
      licenseExpiry: new Date('2026-02-14'),
      address: 'Jl. Garuda No. 963, Purwakarta',
      emergencyContact: 'Maya Rizki',
      emergencyPhone: '08876543201',
      isActive: true,
      notes: 'Memiliki kemampuan problem solving yang baik ketika menghadapi kendala di lapangan.'
    },
    {
      employeeId: 'DRV-013',
      name: 'Nugroho Adi',
      phone: '08345678012',
      email: 'nugroho.adi@sppg.com',
      licenseNumber: 'B3456780123',
      licenseExpiry: new Date('2025-05-08'),
      address: 'Jl. Bhineka No. 159, Purwakarta',
      emergencyContact: 'Nina Adi',
      emergencyPhone: '08765432012',
      isActive: true,
      notes: 'Driver yang sangat peduli dengan kualitas makanan dan selalu memastikan suhu tetap terjaga.'
    },
    {
      employeeId: 'DRV-014',
      name: 'Oksana Pratama',
      phone: '08456780123',
      email: 'oksana.pratama@sppg.com',
      licenseNumber: 'B4567801234',
      licenseExpiry: new Date('2026-11-16'),
      address: 'Jl. Nusantara No. 753, Purwakarta',
      emergencyContact: 'Prima Pratama',
      emergencyPhone: '08654320123',
      isActive: true,
      notes: 'Driver wanita pertama di SPPG dengan performa sangat baik dan professional.'
    },
    {
      employeeId: 'DRV-015',
      name: 'Putra Mahendra',
      phone: '08567801234',
      email: 'putra.mahendra@sppg.com',
      licenseNumber: 'B5678012345',
      licenseExpiry: new Date('2027-09-03'),
      address: 'Jl. Bhinneka Tunggal Ika No. 486, Purwakarta',
      emergencyContact: 'Qori Mahendra',
      emergencyPhone: '08543201234',
      isActive: true,
      notes: 'Driver terbaru yang menunjukkan antusiasme tinggi dan cepat beradaptasi dengan sistem.'
    }
  ]

  try {
    // Clear existing drivers to avoid conflicts
    await prisma.driver.deleteMany({})
    console.log('🗑️ Cleared existing drivers')

    // Create new drivers
    for (const driverData of drivers) {
      await prisma.driver.create({
        data: driverData
      })
    }

    console.log(`✅ Successfully seeded ${drivers.length} drivers`)
    
    // Update totalDeliveries based on actual delivery data (will be calculated after deliveries are seeded)
    console.log('📊 Total deliveries will be calculated after delivery data is seeded')
    
  } catch (error) {
    console.error('❌ Error seeding drivers:', error)
    throw error
  }
}

if (require.main === module) {
  seedDrivers()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
