import { PrismaClient, DeliveryStatus } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedDeliveries() {
  console.log('🚚 Seeding deliveries...')

  // Get reference data
  const distributions = await prisma.distribution.findMany()
  const schools = await prisma.school.findMany()
  const vehicles = await prisma.vehicle.findMany({ where: { isActive: true } })
  const drivers = await prisma.driver.findMany({ where: { isActive: true } })

  if (distributions.length === 0 || schools.length === 0 || vehicles.length === 0 || drivers.length === 0) {
    console.log('⚠️  Required data missing. Please ensure distributions, schools, vehicles, and drivers are seeded first.')
    return
  }

  const deliveries = [
    // Week 1 deliveries (Distribution 1)
    {
      distributionId: distributions[0].id,
      schoolId: schools[0].id, // SDN Purwakarta 01
      vehicleId: vehicles[0].id,
      driverId: drivers[0].id,
      deliveryOrder: 1,
      plannedTime: new Date('2025-08-05T07:00:00Z'),
      departureTime: new Date('2025-08-05T07:00:00Z'),
      arrivalTime: new Date('2025-08-05T07:25:00Z'),
      completionTime: new Date('2025-08-05T07:35:00Z'),
      portionsDelivered: 180,
      status: DeliveryStatus.DELIVERED,
      deliveryProof: '/uploads/delivery-proof/20250805-sdn01.jpg',
      notes: 'Pengiriman lancar, diterima langsung oleh kepala sekolah.'
    },
    {
      distributionId: distributions[0].id,
      schoolId: schools[1].id, // SDN Purwakarta 02
      vehicleId: vehicles[0].id,
      driverId: drivers[0].id,
      deliveryOrder: 2,
      plannedTime: new Date('2025-08-05T08:00:00Z'),
      departureTime: new Date('2025-08-05T07:45:00Z'),
      arrivalTime: new Date('2025-08-05T08:15:00Z'),
      completionTime: new Date('2025-08-05T08:25:00Z'),
      portionsDelivered: 150,
      status: DeliveryStatus.DELIVERED,
      deliveryProof: '/uploads/delivery-proof/20250805-sdn02.jpg',
      notes: 'Pengiriman sesuai jadwal, kondisi makanan baik.'
    },
    {
      distributionId: distributions[0].id,
      schoolId: schools[2].id, // SDN Purwakarta 03
      vehicleId: vehicles[1].id,
      driverId: drivers[1].id,
      deliveryOrder: 1,
      plannedTime: new Date('2025-08-05T07:30:00Z'),
      departureTime: new Date('2025-08-05T07:30:00Z'),
      arrivalTime: new Date('2025-08-05T08:00:00Z'),
      completionTime: new Date('2025-08-05T08:10:00Z'),
      portionsDelivered: 200,
      status: DeliveryStatus.DELIVERED,
      deliveryProof: '/uploads/delivery-proof/20250805-sdn03.jpg',
      notes: 'Pengiriman berhasil, antusiasme siswa tinggi.'
    },

    // Week 2 deliveries (Distribution 2)
    {
      distributionId: distributions[1].id,
      schoolId: schools[3].id, // SDN Purwakarta 04
      vehicleId: vehicles[0].id,
      driverId: drivers[0].id,
      deliveryOrder: 1,
      plannedTime: new Date('2025-08-12T07:00:00Z'),
      departureTime: new Date('2025-08-12T07:05:00Z'),
      arrivalTime: new Date('2025-08-12T07:30:00Z'),
      completionTime: new Date('2025-08-12T07:40:00Z'),
      portionsDelivered: 175,
      status: DeliveryStatus.DELIVERED,
      deliveryProof: '/uploads/delivery-proof/20250812-sdn04.jpg',
      notes: 'Koordinasi baik dengan guru piket.'
    },
    {
      distributionId: distributions[1].id,
      schoolId: schools[4].id, // SDN Purwakarta 05
      vehicleId: vehicles[0].id,
      driverId: drivers[0].id,
      deliveryOrder: 2,
      plannedTime: new Date('2025-08-12T08:15:00Z'),
      departureTime: new Date('2025-08-12T08:00:00Z'),
      arrivalTime: new Date('2025-08-12T08:20:00Z'),
      completionTime: new Date('2025-08-12T08:30:00Z'),
      portionsDelivered: 165,
      status: DeliveryStatus.DELIVERED,
      deliveryProof: '/uploads/delivery-proof/20250812-sdn05.jpg',
      notes: 'Pengiriman tepat waktu, makanan dalam kondisi hangat.'
    },

    // Current week deliveries (in progress)
    {
      distributionId: distributions[2].id,
      schoolId: schools[5].id, // SDN Purwakarta 06
      vehicleId: vehicles[0].id,
      driverId: drivers[0].id,
      deliveryOrder: 1,
      plannedTime: new Date('2025-08-19T07:00:00Z'),
      departureTime: new Date('2025-08-19T07:00:00Z'),
      arrivalTime: new Date('2025-08-19T07:25:00Z'),
      completionTime: null,
      portionsDelivered: null,
      status: DeliveryStatus.IN_TRANSIT,
      deliveryProof: null,
      notes: 'Sedang dalam perjalanan ke sekolah.'
    },
    {
      distributionId: distributions[2].id,
      schoolId: schools[6].id, // SDN Purwakarta 07
      vehicleId: vehicles[1].id,
      driverId: drivers[1].id,
      deliveryOrder: 1,
      plannedTime: new Date('2025-08-19T07:30:00Z'),
      departureTime: null,
      arrivalTime: null,
      completionTime: null,
      portionsDelivered: null,
      status: DeliveryStatus.PENDING,
      deliveryProof: null,
      notes: 'Menunggu konfirmasi kesiapan dari sekolah.'
    },

    // Failed delivery example
    {
      distributionId: distributions[1].id,
      schoolId: schools[7].id, // SDN Purwakarta 08
      vehicleId: vehicles[2].id,
      driverId: drivers[1].id,
      deliveryOrder: 3,
      plannedTime: new Date('2025-08-12T09:00:00Z'),
      departureTime: new Date('2025-08-12T09:00:00Z'),
      arrivalTime: new Date('2025-08-12T09:30:00Z'),
      completionTime: null,
      portionsDelivered: null,
      status: DeliveryStatus.FAILED,
      deliveryProof: null,
      notes: 'Sekolah tutup mendadak karena ada acara internal. Makanan dikembalikan ke dapur.'
    }
  ]

  for (const deliveryData of deliveries) {
    await prisma.delivery.create({
      data: deliveryData
    })
  }

  const deliveryCount = await prisma.delivery.count()
  console.log(`✅ Deliveries seeded: ${deliveryCount} deliveries`)
}
