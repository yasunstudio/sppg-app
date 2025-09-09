import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedVehicles() {
  console.log('🚛 Seeding vehicles for Kabupaten Purwakarta...')

  const vehicles = [
    // Truck Utama untuk Distribusi Besar
    {
      plateNumber: 'T 1001 PWK',
      type: 'TRUCK',
      capacity: 1200, // kg capacity
      brand: 'Hino',
      model: 'Dutro 130 HD',
      year: 2023,
      fuelType: 'DIESEL',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-20'),
      nextService: new Date('2025-11-20'),
      mileage: 8500.0,
      insuranceExpiry: new Date('2026-12-31'),
      registrationExpiry: new Date('2026-07-15'),
      notes: 'Truck utama untuk distribusi ke sekolah-sekolah di Purwakarta Timur dan Sekitar Kota'
    },
    {
      plateNumber: 'T 1002 PWK',
      type: 'TRUCK',
      capacity: 1000,
      brand: 'Isuzu',
      model: 'Elf NMR 71',
      year: 2022,
      fuelType: 'DIESEL',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-15'),
      nextService: new Date('2025-11-15'),
      mileage: 15200.0,
      insuranceExpiry: new Date('2026-11-30'),
      registrationExpiry: new Date('2026-06-20'),
      notes: 'Untuk distribusi wilayah Babakancikao, Jatiluhur, dan Purwakarta Barat'
    },
    {
      plateNumber: 'T 1003 PWK',
      type: 'TRUCK',
      capacity: 800,
      brand: 'Mitsubishi',
      model: 'Colt Diesel FE 74',
      year: 2021,
      fuelType: 'DIESEL',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-10'),
      nextService: new Date('2025-11-10'),
      mileage: 22800.0,
      insuranceExpiry: new Date('2026-10-25'),
      registrationExpiry: new Date('2026-05-18'),
      notes: 'Distribusi ke Bojong, Campaka, dan Sukasari'
    },
    {
      plateNumber: 'T 1004 PWK',
      type: 'TRUCK',
      capacity: 1500,
      brand: 'Hino',
      model: 'Ranger FC',
      year: 2024,
      fuelType: 'DIESEL',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-09-01'),
      nextService: new Date('2025-12-01'),
      mileage: 3200.0,
      insuranceExpiry: new Date('2027-01-15'),
      registrationExpiry: new Date('2027-02-10'),
      notes: 'Truck terbaru untuk distribusi volume besar ke Kecamatan Plered dan Sukatani'
    },
    
    // Pickup untuk Area Sulit Akses
    {
      plateNumber: 'T 2001 PWK',
      type: 'PICKUP',
      capacity: 600,
      brand: 'Toyota',
      model: 'Hilux Double Cabin',
      year: 2022,
      fuelType: 'DIESEL',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-25'),
      nextService: new Date('2025-11-25'),
      mileage: 18500.0,
      insuranceExpiry: new Date('2026-12-20'),
      registrationExpiry: new Date('2026-08-05'),
      notes: 'Untuk akses ke daerah pegunungan Pondoksalam dan area rural Wanayasa'
    },
    {
      plateNumber: 'T 2002 PWK',
      type: 'PICKUP',
      capacity: 550,
      brand: 'Isuzu',
      model: 'D-Max Rodeo',
      year: 2021,
      fuelType: 'DIESEL',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-12'),
      nextService: new Date('2025-11-12'),
      mileage: 25600.0,
      insuranceExpiry: new Date('2026-09-30'),
      registrationExpiry: new Date('2026-04-22'),
      notes: 'Distribusi ke sekolah-sekolah di Kiarapedes dan Tegalwaru'
    },
    {
      plateNumber: 'T 2003 PWK',
      type: 'PICKUP',
      capacity: 500,
      brand: 'Mitsubishi',
      model: 'Triton',
      year: 2020,
      fuelType: 'DIESEL',
      status: 'MAINTENANCE',
      isActive: false,
      lastService: new Date('2025-07-28'),
      nextService: new Date('2025-09-10'),
      mileage: 38200.0,
      insuranceExpiry: new Date('2026-08-15'),
      registrationExpiry: new Date('2026-03-12'),
      notes: 'Sedang maintenance rutin transmission. Estimasi selesai mid September'
    },

    // Van untuk Distribusi Sedang
    {
      plateNumber: 'T 3001 PWK',
      type: 'VAN',
      capacity: 400,
      brand: 'Daihatsu',
      model: 'Gran Max Blind Van',
      year: 2023,
      fuelType: 'GASOLINE',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-30'),
      nextService: new Date('2025-11-30'),
      mileage: 6800.0,
      insuranceExpiry: new Date('2027-01-20'),
      registrationExpiry: new Date('2026-12-08'),
      notes: 'Untuk distribusi ke TK dan PAUD di area Kota Purwakarta'
    },
    {
      plateNumber: 'T 3002 PWK',
      type: 'VAN',
      capacity: 350,
      brand: 'Suzuki',
      model: 'APV Blind Van',
      year: 2022,
      fuelType: 'GASOLINE',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-18'),
      nextService: new Date('2025-11-18'),
      mileage: 14200.0,
      insuranceExpiry: new Date('2026-11-10'),
      registrationExpiry: new Date('2026-06-15'),
      notes: 'Backup distribusi dan pengiriman khusus ke Darangdan dan Pasawahan'
    },
    {
      plateNumber: 'T 3003 PWK',
      type: 'VAN',
      capacity: 300,
      brand: 'Toyota',
      model: 'Avanza Blind Van',
      year: 2021,
      fuelType: 'GASOLINE',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-05'),
      nextService: new Date('2025-11-05'),
      mileage: 28400.0,
      insuranceExpiry: new Date('2026-09-18'),
      registrationExpiry: new Date('2026-04-08'),
      notes: 'Distribusi cepat untuk area dekat dan pengiriman mendadak'
    },

    // Kendaraan Khusus
    {
      plateNumber: 'T 4001 PWK',
      type: 'REFRIGERATED_TRUCK',
      capacity: 800,
      brand: 'Hino',
      model: 'Dutro Box Pendingin',
      year: 2023,
      fuelType: 'DIESEL',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-09-02'),
      nextService: new Date('2025-12-02'),
      mileage: 4600.0,
      insuranceExpiry: new Date('2027-02-28'),
      registrationExpiry: new Date('2026-11-25'),
      notes: 'Truck berpendingin untuk distribusi makanan segar dan produk dairy'
    },
    {
      plateNumber: 'T 5001 PWK',
      type: 'MOTORCYCLE',
      capacity: 25,
      brand: 'Honda',
      model: 'Vario 160',
      year: 2023,
      fuelType: 'GASOLINE',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-28'),
      nextService: new Date('2025-10-28'),
      mileage: 4200.0,
      insuranceExpiry: new Date('2026-12-15'),
      registrationExpiry: new Date('2026-09-20'),
      notes: 'Untuk pengiriman dokumen, sample makanan, dan inspeksi cepat'
    },
    {
      plateNumber: 'T 5002 PWK',
      type: 'MOTORCYCLE',
      capacity: 30,
      brand: 'Yamaha',
      model: 'Freego S',
      year: 2022,
      fuelType: 'GASOLINE',
      status: 'ACTIVE',
      isActive: true,
      lastService: new Date('2025-08-22'),
      nextService: new Date('2025-10-22'),
      mileage: 8900.0,
      insuranceExpiry: new Date('2026-10-30'),
      registrationExpiry: new Date('2026-07-12'),
      notes: 'Motor backup untuk koordinator lapangan dan supervisi'
    },

    // Kendaraan Reserve/Backup
    {
      plateNumber: 'T 6001 PWK',
      type: 'PICKUP',
      capacity: 450,
      brand: 'Ford',
      model: 'Ranger',
      year: 2019,
      fuelType: 'DIESEL',
      status: 'RESERVE',
      isActive: false,
      lastService: new Date('2025-07-15'),
      nextService: new Date('2025-10-15'),
      mileage: 45800.0,
      insuranceExpiry: new Date('2026-06-30'),
      registrationExpiry: new Date('2026-02-28'),
      notes: 'Kendaraan cadangan untuk emergency dan peak season'
    },
    {
      plateNumber: 'T 6002 PWK',
      type: 'VAN',
      capacity: 280,
      brand: 'Daihatsu',
      model: 'Luxio',
      year: 2018,
      fuelType: 'GASOLINE',
      status: 'MAINTENANCE',
      isActive: false,
      lastService: new Date('2025-08-01'),
      nextService: new Date('2025-09-15'),
      mileage: 52300.0,
      insuranceExpiry: new Date('2026-05-20'),
      registrationExpiry: new Date('2026-01-18'),
      notes: 'Dalam maintenance berkala. Akan digunakan saat musim hujan untuk backup'
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
