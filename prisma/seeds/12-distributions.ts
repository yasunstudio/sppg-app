import { PrismaClient, DistributionStatus } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedDistributions() {
  console.log('🚚 Seeding distributions for SPPG Purwakarta August 2025...')
  
  // Get schools for distribution targets
  const schools = await prisma.school.findMany({
    select: { id: true, name: true }
  })
  
  // First create some drivers if they don't exist
  const drivers = [
    {
      id: 'driver-001',
      employeeId: 'DRV-001-2025',
      name: 'Asep Sukandar',
      phone: '0812-3456-7890',
      email: 'asep.driver@sppg.com',
      licenseNumber: 'SIM-A-123456789',
      licenseExpiry: new Date('2027-12-31'),
      address: 'Jl. Veteran No. 15, Purwakarta',
      emergencyContact: 'Siti Sukandar',
      emergencyPhone: '0813-4567-8901',
      isActive: true,
      rating: 4.8,
      totalDeliveries: 45
    },
    {
      id: 'driver-002',
      employeeId: 'DRV-002-2025',
      name: 'Ujang Sutrisno',
      phone: '0813-4567-8901',
      email: 'ujang.driver@sppg.com',
      licenseNumber: 'SIM-A-987654321',
      licenseExpiry: new Date('2026-10-15'),
      address: 'Jl. Sudirman No. 8, Purwakarta',
      emergencyContact: 'Dewi Sutrisno',
      emergencyPhone: '0814-5678-9012',
      isActive: true,
      rating: 4.9,
      totalDeliveries: 52
    }
  ]
  
  // Create drivers
  for (const driver of drivers) {
    await prisma.driver.upsert({
      where: { id: driver.id },
      update: driver,
      create: driver
    })
  }
  
  const distributions = [
    // Week 1 August 2025
    {
      id: 'dist-001-20250805',
      distributionDate: new Date('2025-08-05T08:00:00Z'),
      driverId: 'driver-001',
      status: DistributionStatus.COMPLETED,
      totalPortions: 500,
      notes: 'Distribusi pertama minggu ke-1, semua sekolah terlayani dengan baik',
      estimatedDuration: 180, // 3 hours in minutes
      actualDuration: 175
    },
    {
      id: 'dist-002-20250806',
      distributionDate: new Date('2025-08-06T08:00:00Z'),
      driverId: 'driver-002',
      status: DistributionStatus.COMPLETED,
      totalPortions: 480,
      notes: 'Hari kedua, kondisi cuaca mendukung, distribusi lancar',
      estimatedDuration: 180,
      actualDuration: 185
    },
    {
      id: 'dist-003-20250807',
      distributionDate: new Date('2025-08-07T08:00:00Z'),
      driverId: 'driver-001',
      status: DistributionStatus.COMPLETED,
      totalPortions: 520,
      notes: 'Target distribusi tercapai 100%, tidak ada kendala',
      estimatedDuration: 180,
      actualDuration: 170
    },
    {
      id: 'dist-004-20250808',
      distributionDate: new Date('2025-08-08T08:00:00Z'),
      driverId: 'driver-002',
      status: DistributionStatus.COMPLETED,
      totalPortions: 450,
      notes: 'Distribusi tempe berjalan sesuai jadwal, respon positif dari sekolah',
      estimatedDuration: 180,
      actualDuration: 165
    },
    {
      id: 'dist-005-20250809',
      distributionDate: new Date('2025-08-09T08:00:00Z'),
      driverId: 'driver-001',
      status: DistributionStatus.COMPLETED,
      totalPortions: 460,
      notes: 'Akhir minggu pertama, evaluasi distribusi sangat positif',
      estimatedDuration: 180,
      actualDuration: 175
    },
    
    // Week 2 August 2025
    {
      id: 'dist-006-20250812',
      distributionDate: new Date('2025-08-12T08:00:00Z'),
      driverId: 'driver-002',
      status: DistributionStatus.COMPLETED,
      totalPortions: 520,
      notes: 'Minggu kedua dimulai dengan baik, koordinasi antar sekolah lancar',
      estimatedDuration: 180,
      actualDuration: 190
    },
    {
      id: 'dist-007-20250813',
      distributionDate: new Date('2025-08-13T08:00:00Z'),
      driverId: 'driver-001',
      status: DistributionStatus.COMPLETED,
      totalPortions: 500,
      notes: 'Distribusi ikan bandeng, feedback sangat baik dari siswa',
      estimatedDuration: 180,
      actualDuration: 195
    },
    
    // Week 3 August 2025 - Some in progress
    {
      id: 'dist-008-20250819',
      distributionDate: new Date('2025-08-19T08:00:00Z'),
      driverId: 'driver-002',
      status: DistributionStatus.IN_TRANSIT,
      totalPortions: 540,
      notes: 'Sedang dalam perjalanan ke sekolah-sekolah target',
      estimatedDuration: 180,
      actualDuration: null
    },
    {
      id: 'dist-009-20250820',
      distributionDate: new Date('2025-08-20T08:00:00Z'),
      driverId: 'driver-001',
      status: DistributionStatus.PREPARING,
      totalPortions: 470,
      notes: 'Dijadwalkan untuk besok, kendaraan dan driver sudah siap',
      estimatedDuration: 180,
      actualDuration: null
    },
    {
      id: 'dist-010-20250821',
      distributionDate: new Date('2025-08-21T08:00:00Z'),
      driverId: 'driver-002',
      status: DistributionStatus.PREPARING,
      totalPortions: 480,
      notes: 'Planning untuk Rabu, koordinasi dengan sekolah sudah dilakukan',
      estimatedDuration: 180,
      actualDuration: null
    }
  ]
  
  try {
    // Create distributions
    for (const distribution of distributions) {
      await prisma.distribution.upsert({
        where: { id: distribution.id },
        update: distribution,
        create: distribution
      })
      
      const statusIcon = distribution.status === DistributionStatus.COMPLETED ? '✅' : 
                        distribution.status === DistributionStatus.IN_TRANSIT ? '🚛' : '📅'
      
      console.log(`${statusIcon} Distribution seeded: ${distribution.id} (${distribution.status}, Portions: ${distribution.totalPortions})`)
    }
    
    // Create school-specific distribution records for first 5 distributions  
    if (schools.length > 0) {
      const schoolDistributions: {
        id: string
        distributionId: string
        schoolId: string
        plannedPortions: number
        actualPortions: number
        routeOrder: number
      }[] = []
      const completedDistributions = distributions.filter(d => d.status === DistributionStatus.COMPLETED).slice(0, 5)
      
      for (let i = 0; i < completedDistributions.length; i++) {
        const dist = completedDistributions[i]
        for (let j = 0; j < Math.min(3, schools.length); j++) {
          const school = schools[j]
          const portionsForSchool = Math.floor(dist.totalPortions / Math.min(3, schools.length))
          
          // Check if this combination already exists in our array
          const existingEntry = schoolDistributions.find(sd => 
            sd.distributionId === dist.id && sd.schoolId === school.id
          )
          
          if (!existingEntry) {
            schoolDistributions.push({
              id: `school-dist-${i+1}-${j+1}-2025`,
              distributionId: dist.id,
              schoolId: school.id,
              plannedPortions: portionsForSchool,
              actualPortions: portionsForSchool - Math.floor(Math.random() * 5), // Small variation
              routeOrder: j + 1
            })
          }
        }
      }
      
      for (const schoolDist of schoolDistributions) {
        await prisma.distributionSchool.upsert({
          where: { 
            distributionId_schoolId: {
              distributionId: schoolDist.distributionId,
              schoolId: schoolDist.schoolId
            }
          },
          update: {
            plannedPortions: schoolDist.plannedPortions,
            actualPortions: schoolDist.actualPortions,
            routeOrder: schoolDist.routeOrder
          },
          create: schoolDist
        })
      }
      
      console.log(`🏫 Created ${schoolDistributions.length} school distribution records`)
    }
    
    console.log(`🚚 Distributions seeding completed! Total: ${distributions.length} distributions`)
  } catch (error) {
    console.error('❌ Error seeding distributions:', error)
    throw error
  }
}

export default seedDistributions
