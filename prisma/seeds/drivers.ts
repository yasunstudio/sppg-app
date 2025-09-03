import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedDrivers() {
  console.log('🚗 Seeding drivers...')

  const drivers = [
    {
      employeeId: 'driver-001',
      name: 'Ahmad Suryadi',
      phone: '08123456789',
      email: 'ahmad.suryadi@sppg.com',
      licenseNumber: 'B1234567890',
      licenseExpiry: new Date('2026-12-31'),
      address: 'Jl. Merdeka No. 123, Purwakarta',
      emergencyContact: 'Siti Suryadi',
      emergencyPhone: '08987654321',
      isActive: true,
      rating: 4.8,
      totalDeliveries: 45,
      notes: 'Driver senior dengan pengalaman 5 tahun. Sangat dapat diandalkan.'
    },
    {
      employeeId: 'driver-002',
      name: 'Budi Santoso',
      phone: '08234567890',
      email: 'budi.santoso@sppg.com',
      licenseNumber: 'B2345678901',
      licenseExpiry: new Date('2025-11-30'),
      address: 'Jl. Sudirman No. 456, Purwakarta',
      emergencyContact: 'Ratna Santoso',
      emergencyPhone: '08876543210',
      isActive: true,
      rating: 4.5,
      totalDeliveries: 32,
      notes: 'Driver yang handal, familiar dengan rute-rute sekolah di Purwakarta.'
    },
    {
      employeeId: 'driver-003',
      name: 'Cecep Firmansyah',
      phone: '08345678901',
      email: 'cecep.firmansyah@sppg.com',
      licenseNumber: 'B3456789012',
      licenseExpiry: new Date('2027-03-15'),
      address: 'Jl. Gatot Subroto No. 789, Purwakarta',
      emergencyContact: 'Dewi Firmansyah',
      emergencyPhone: '08765432109',
      isActive: true,
      rating: 4.7,
      totalDeliveries: 28,
      notes: 'Driver muda dengan semangat tinggi. Sangat teliti dalam penanganan makanan.'
    },
    {
      employeeId: 'driver-004',
      name: 'Dedi Kurniawan',
      phone: '08456789012',
      email: 'dedi.kurniawan@sppg.com',
      licenseNumber: 'B4567890123',
      licenseExpiry: new Date('2026-08-20'),
      address: 'Jl. Ahmad Yani No. 321, Purwakarta',
      emergencyContact: 'Eka Kurniawan',
      emergencyPhone: '08654321098',
      isActive: false,
      rating: 4.2,
      totalDeliveries: 15,
      notes: 'Sedang cuti karena SIM habis masa berlaku. Akan aktif kembali setelah perpanjangan SIM.'
    }
  ]

  try {
    for (const driverData of drivers) {
      await prisma.driver.upsert({
        where: { employeeId: driverData.employeeId },
        update: driverData,
        create: driverData
      })
    }

    console.log(`✅ Successfully seeded ${drivers.length} drivers`)
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
