import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedVehicles() {
  console.log('🚛 Seeding vehicles...')

  const vehicles = [
    {
      plateNumber: 'B 1234 PKT',
      type: 'Pickup Truck',
      capacity: 500, // kg capacity
      isActive: true,
      lastService: new Date('2025-08-15'),
      notes: 'Vehicle utama untuk distribusi sekolah. Kondisi prima.'
    },
    {
      plateNumber: 'B 5678 PKT',
      type: 'Mini Truck',
      capacity: 300,
      isActive: true,
      lastService: new Date('2025-08-10'),
      notes: 'Vehicle untuk distribusi area terpencil dan cadangan.'
    },
    {
      plateNumber: 'B 9012 PKT',
      type: 'Van',
      capacity: 200,
      isActive: true,
      lastService: new Date('2025-08-20'),
      notes: 'Vehicle backup untuk distribusi darurat.'
    },
    {
      plateNumber: 'B 3456 PKT',
      type: 'Motorcycle',
      capacity: 50,
      isActive: true,
      lastService: new Date('2025-08-25'),
      notes: 'Motor untuk pengiriman sample dan dokumen.'
    },
    {
      plateNumber: 'B 7890 PKT',
      type: 'Pickup Truck',
      capacity: 450,
      isActive: false,
      lastService: new Date('2025-07-30'),
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
