import { PrismaClient, ProductionResourceType, ResourceStatus } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedProductionResources() {
  console.log('🏭 Seeding production resources...')

  const resources = [
    // Kitchen Equipment
    {
      name: 'Kompor Gas Industrial 4 Tungku',
      type: ProductionResourceType.EQUIPMENT,
      capacityPerHour: 200, // portions per hour
      availabilitySchedule: {
        monday: { start: '05:00', end: '15:00' },
        tuesday: { start: '05:00', end: '15:00' },
        wednesday: { start: '05:00', end: '15:00' },
        thursday: { start: '05:00', end: '15:00' },
        friday: { start: '05:00', end: '15:00' },
        saturday: { start: '06:00', end: '12:00' },
        sunday: 'off'
      },
      maintenanceSchedule: {
        daily: 'Pembersihan dan pengecekan gas',
        weekly: 'Deep cleaning dan kalibrasi',
        monthly: 'Service komprehensif'
      },
      status: ResourceStatus.AVAILABLE,
      location: 'Dapur Utama SPPG Purwakarta',
      specifications: {
        brand: 'Modena Professional',
        model: 'BH-0427',
        power: '12 kW',
        fuelType: 'LPG',
        installDate: '2025-01-15',
        warranty: '2 years'
      }
    },
    {
      name: 'Rice Cooker Jumbo 10 Liter',
      type: ProductionResourceType.EQUIPMENT,
      capacityPerHour: 150, // portions per hour
      availabilitySchedule: {
        monday: { start: '04:30', end: '14:00' },
        tuesday: { start: '04:30', end: '14:00' },
        wednesday: { start: '04:30', end: '14:00' },
        thursday: { start: '04:30', end: '14:00' },
        friday: { start: '04:30', end: '14:00' },
        saturday: { start: '05:00', end: '12:00' },
        sunday: 'off'
      },
      maintenanceSchedule: {
        daily: 'Pembersihan dalam dan luar',
        weekly: 'Descaling dan pengecekan elemen',
        monthly: 'Service motor dan thermostat'
      },
      status: ResourceStatus.AVAILABLE,
      location: 'Dapur Utama SPPG Purwakarta',
      specifications: {
        brand: 'Yong Ma',
        model: 'YMC-116',
        capacity: '10 liter',
        power: '1200W',
        installDate: '2025-02-01'
      }
    },
    {
      name: 'Deep Fryer Industrial',
      type: ProductionResourceType.EQUIPMENT,
      capacityPerHour: 100, // portions per hour
      availabilitySchedule: {
        monday: { start: '06:00', end: '14:00' },
        tuesday: { start: '06:00', end: '14:00' },
        wednesday: { start: '06:00', end: '14:00' },
        thursday: { start: '06:00', end: '14:00' },
        friday: { start: '06:00', end: '14:00' },
        saturday: { start: '07:00', end: '12:00' },
        sunday: 'maintenance'
      },
      maintenanceSchedule: {
        daily: 'Pembersihan oil filter dan temperature check',
        weekly: 'Ganti minyak dan deep cleaning',
        monthly: 'Service heating element dan safety valve'
      },
      status: ResourceStatus.AVAILABLE,
      location: 'Dapur Utama SPPG Purwakarta',
      specifications: {
        brand: 'Getra',
        model: 'GF-71',
        capacity: '7 liter oil',
        power: '3000W',
        temperatureRange: '150-190°C'
      }
    },

    // Staff Resources
    {
      name: 'Chef Utama',
      type: ProductionResourceType.STAFF,
      capacityPerHour: 300, // portions supervised per hour
      availabilitySchedule: {
        monday: { start: '05:00', end: '14:00' },
        tuesday: { start: '05:00', end: '14:00' },
        wednesday: { start: '05:00', end: '14:00' },
        thursday: { start: '05:00', end: '14:00' },
        friday: { start: '05:00', end: '14:00' },
        saturday: { start: '06:00', end: '12:00' },
        sunday: 'off'
      },
      maintenanceSchedule: {
        monthly: 'Training update dan health checkup',
        quarterly: 'Performance review',
        yearly: 'Sertifikasi food safety'
      },
      status: ResourceStatus.AVAILABLE,
      location: 'Dapur Utama SPPG Purwakarta',
      specifications: {
        name: 'Budi Santoso',
        experience: '8 years',
        certifications: ['Food Safety Manager', 'Halal Certificate', 'Nutrition Specialist'],
        specialties: ['Indonesian Cuisine', 'Mass Cooking', 'Menu Planning']
      }
    },
    {
      name: 'Asisten Chef',
      type: ProductionResourceType.STAFF,
      capacityPerHour: 200, // portions prepared per hour
      availabilitySchedule: {
        monday: { start: '05:30', end: '14:30' },
        tuesday: { start: '05:30', end: '14:30' },
        wednesday: { start: '05:30', end: '14:30' },
        thursday: { start: '05:30', end: '14:30' },
        friday: { start: '05:30', end: '14:30' },
        saturday: { start: '06:30', end: '12:30' },
        sunday: 'off'
      },
      maintenanceSchedule: {
        monthly: 'Skill development training',
        quarterly: 'Performance evaluation'
      },
      status: ResourceStatus.AVAILABLE,
      location: 'Dapur Utama SPPG Purwakarta',
      specifications: {
        name: 'Siti Rahayu',
        experience: '4 years',
        certifications: ['Food Handler Certificate', 'Basic Culinary'],
        specialties: ['Food Prep', 'Portion Control', 'Quality Assurance']
      }
    },

    // Kitchen Areas
    {
      name: 'Area Persiapan Bahan',
      type: ProductionResourceType.KITCHEN_AREA,
      capacityPerHour: 500, // portions worth of ingredients per hour
      availabilitySchedule: {
        monday: { start: '04:00', end: '16:00' },
        tuesday: { start: '04:00', end: '16:00' },
        wednesday: { start: '04:00', end: '16:00' },
        thursday: { start: '04:00', end: '16:00' },
        friday: { start: '04:00', end: '16:00' },
        saturday: { start: '05:00', end: '13:00' },
        sunday: 'cleaning'
      },
      maintenanceSchedule: {
        daily: 'Sanitasi dan pembersihan menyeluruh',
        weekly: 'Deep cleaning dan pest control',
        monthly: 'Equipment maintenance dan safety check'
      },
      status: ResourceStatus.AVAILABLE,
      location: 'Dapur Utama SPPG Purwakarta',
      specifications: {
        area: '15 m²',
        equipment: ['Chopping boards', 'Knives set', 'Vegetable slicer', 'Scale'],
        capacity: 'Prep untuk 1000 porsi/hari',
        temperature: '18-22°C',
        humidity: '50-60%'
      }
    },
    {
      name: 'Area Memasak Utama',
      type: ProductionResourceType.KITCHEN_AREA,
      capacityPerHour: 400, // portions cooked per hour
      availabilitySchedule: {
        monday: { start: '05:00', end: '15:00' },
        tuesday: { start: '05:00', end: '15:00' },
        wednesday: { start: '05:00', end: '15:00' },
        thursday: { start: '05:00', end: '15:00' },
        friday: { start: '05:00', end: '15:00' },
        saturday: { start: '06:00', end: '13:00' },
        sunday: 'maintenance'
      },
      maintenanceSchedule: {
        daily: 'Pembersihan komprehensif dan sanitasi',
        weekly: 'Deep cleaning exhaust dan flooring',
        monthly: 'Equipment calibration dan safety audit'
      },
      status: ResourceStatus.AVAILABLE,
      location: 'Dapur Utama SPPG Purwakarta',
      specifications: {
        area: '25 m²',
        equipment: ['Industrial stoves', 'Rice cookers', 'Deep fryers', 'Exhaust system'],
        capacity: 'Masak 800 porsi/hari',
        ventilation: 'Industrial exhaust 15 ACH',
        fireSupression: 'Automatic sprinkler system'
      }
    },

    // Storage Areas
    {
      name: 'Cold Storage Utama',
      type: ProductionResourceType.STORAGE,
      capacityPerHour: 1000, // portions worth of storage
      availabilitySchedule: {
        monday: { start: '00:00', end: '23:59' },
        tuesday: { start: '00:00', end: '23:59' },
        wednesday: { start: '00:00', end: '23:59' },
        thursday: { start: '00:00', end: '23:59' },
        friday: { start: '00:00', end: '23:59' },
        saturday: { start: '00:00', end: '23:59' },
        sunday: { start: '00:00', end: '23:59' }
      },
      maintenanceSchedule: {
        daily: 'Temperature monitoring dan inventory check',
        weekly: 'Defrosting dan sanitasi',
        monthly: 'Compressor service dan seal check'
      },
      status: ResourceStatus.AVAILABLE,
      location: 'Gudang SPPG Purwakarta',
      specifications: {
        capacity: '20 m³',
        temperature: '0-4°C',
        humidity: '80-85%',
        shelving: 'Stainless steel 5 levels',
        monitoring: '24/7 temperature alarm system'
      }
    }
  ]

  for (const resourceData of resources) {
    await prisma.productionResource.create({
      data: resourceData
    })
  }

  const resourceCount = await prisma.productionResource.count()
  console.log(`✅ Production resources seeded: ${resourceCount} resources (equipment, staff, areas)`)
}
