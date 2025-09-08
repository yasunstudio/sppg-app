import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedVehicles() {
  console.log('🚛 Seeding vehicles...')

  const vehicles = [
    {
      plateNumber: 'B 1234 PKT',
      type: 'TRUCK',
      capacity: 500, // kg capacity
      brand: 'Isuzu',
      model: 'Elf',
      year: 2022,
      fuelType: 'DIESEL',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-15'),
      nextService: new Date('2025-11-15'),
      mileage: 15000.5,
      insuranceExpiry: new Date('2026-12-31'),
      registrationExpiry: new Date('2026-06-30'),
      notes: 'Vehicle utama untuk distribusi sekolah. Kondisi prima.'
    },
    {
      plateNumber: 'B 5678 PKT',
      type: 'TRUCK',
      capacity: 300,
      brand: 'Mitsubishi',
      model: 'Colt Diesel',
      year: 2021,
      fuelType: 'DIESEL',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-10'),
      nextService: new Date('2025-11-10'),
      mileage: 22000.0,
      insuranceExpiry: new Date('2026-10-15'),
      registrationExpiry: new Date('2026-05-20'),
      notes: 'Vehicle untuk distribusi area terpencil dan cadangan.'
    },
    {
      plateNumber: 'B 9012 PKT',
      type: 'VAN',
      capacity: 200,
      brand: 'Toyota',
      model: 'Hiace',
      year: 2020,
      fuelType: 'GASOLINE',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-20'),
      nextService: new Date('2025-11-20'),
      mileage: 35000.0,
      insuranceExpiry: new Date('2026-08-30'),
      registrationExpiry: new Date('2026-04-15'),
      notes: 'Vehicle backup untuk distribusi darurat.'
    },
    {
      plateNumber: 'B 3456 PKT',
      type: 'MOTORCYCLE',
      capacity: 50,
      brand: 'Honda',
      model: 'Vario 150',
      year: 2023,
      fuelType: 'GASOLINE',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-25'),
      nextService: new Date('2025-10-25'),
      mileage: 5000.0,
      insuranceExpiry: new Date('2026-12-25'),
      registrationExpiry: new Date('2026-08-10'),
      notes: 'Motor untuk pengiriman sample dan dokumen.'
    },
    {
      plateNumber: 'B 7890 PKT',
      type: 'PICKUP',
      capacity: 450,
      brand: 'Toyota',
      model: 'Hilux',
      year: 2019,
      fuelType: 'DIESEL',
      status: 'MAINTENANCE',
      isActive: false,
      lastService: new Date('2025-07-30'),
      nextService: new Date('2025-09-15'),
      mileage: 48000.0,
      insuranceExpiry: new Date('2026-11-20'),
      registrationExpiry: new Date('2026-07-05'),
      notes: 'Sedang dalam perbaikan mesin. Estimasi selesai awal September.'
    }
  ]

  for (const vehicleData of vehicles) {
    await prisma.vehicle.upsert({
      where: { plateNumber: vehicleData.plateNumber },
      update: vehicleData,
      create: vehicleData
    })
  }

  const vehicleCount = await prisma.vehicle.count()
  console.log(`✅ Vehicles seeded: ${vehicleCount} vehicles`)
}
