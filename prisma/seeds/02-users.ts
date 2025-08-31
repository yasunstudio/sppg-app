import { PrismaClient } from '../../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function seedUsers() {
  console.log('👥 Seeding users...')
  
  const users = [
    {
      id: 'user-super-admin',
      name: 'Super Administrator SPPG',
      username: 'super-admin',
      email: 'super.admin@sppg-purwakarta.go.id',
      password: await bcrypt.hash('SuperAdmin2025!', 10),
      phone: '+62218123456',
      address: 'Kantor SPPG Purwakarta, Jl. Veteran No. 1, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-admin',
      name: 'Administrator SPPG',
      username: 'admin',
      email: 'admin@sppg-purwakarta.go.id',
      password: await bcrypt.hash('Admin2025!', 10),
      phone: '+62218123457',
      address: 'Kantor SPPG Purwakarta, Jl. Veteran No. 1, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-nutritionist-1',
      name: 'Dr. Sari Nutrition, S.Gz',
      username: 'dr-sari',
      email: 'sari.nutrition@sppg-purwakarta.go.id',
      password: await bcrypt.hash('Nutri2025!', 10),
      phone: '+62218123458',
      address: 'Puskesmas Purwakarta Timur, Jl. Ahmad Yani No. 45, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-chef-1',
      name: 'Chef Budi Masak',
      username: 'chef-budi',
      email: 'budi.chef@sppg-purwakarta.go.id',
      password: await bcrypt.hash('Chef2025!', 10),
      phone: '+62218123459',
      address: 'Dapur Produksi SPPG, Jl. Industri No. 12, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-production-1',
      name: 'Andi Production',
      username: 'andi-prod',
      email: 'andi.production@sppg-purwakarta.go.id',
      password: await bcrypt.hash('Prod2025!', 10),
      phone: '+62218123460',
      address: 'Dapur Produksi SPPG, Jl. Industri No. 12, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-qc-1',
      name: 'QC Inspector Maya',
      username: 'qc-maya',
      email: 'maya.qc@sppg-purwakarta.go.id',
      password: await bcrypt.hash('QC2025!', 10),
      phone: '+62218123461',
      address: 'Lab Quality Control SPPG, Jl. Industri No. 12, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-warehouse-1',
      name: 'Dedi Warehouse Manager',
      username: 'dedi-warehouse',
      email: 'dedi.warehouse@sppg-purwakarta.go.id',
      password: await bcrypt.hash('Warehouse2025!', 10),
      phone: '+62218123462',
      address: 'Gudang SPPG, Jl. Logistik No. 5, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-distribution-1',
      name: 'Rina Distribution Manager',
      username: 'rina-dist',
      email: 'rina.distribution@sppg-purwakarta.go.id',
      password: await bcrypt.hash('Dist2025!', 10),
      phone: '+62218123463',
      address: 'Pusat Distribusi SPPG, Jl. Logistik No. 7, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-driver-1',
      name: 'Asep Driver',
      username: 'asep-driver',
      email: 'asep.driver@sppg-purwakarta.go.id',
      password: await bcrypt.hash('Driver2025!', 10),
      phone: '+62218123464',
      address: 'Jl. Sukamaju No. 15, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-driver-2',
      name: 'Ujang Driver',
      username: 'ujang-driver',
      email: 'ujang.driver@sppg-purwakarta.go.id',
      password: await bcrypt.hash('Driver2025!', 10),
      phone: '+62218123465',
      address: 'Jl. Merdeka No. 22, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-financial-analyst',
      name: 'Nina Financial Analyst',
      username: 'nina-finance',
      email: 'nina.finance@sppg-purwakarta.go.id',
      password: await bcrypt.hash('Finance2025!', 10),
      phone: '+62218123466',
      address: 'Kantor Keuangan SPPG, Jl. Veteran No. 1, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-operations-supervisor',
      name: 'Bapak Supervisor Operasi',
      username: 'supervisor-ops',
      email: 'supervisor.ops@sppg-purwakarta.go.id',
      password: await bcrypt.hash('SupervisorOps2025!', 10),
      phone: '+62218123467',
      address: 'Kantor Operasional SPPG, Jl. Veteran No. 1, Purwakarta',
      isActive: true,
      avatar: null
    },
    {
      id: 'user-school-admin-1',
      name: 'Ibu Kepala Sekolah SDN 1',
      username: 'kepsek-sdn1',
      email: 'kepsek.sdn1@purwakarta.go.id',
      password: await bcrypt.hash('SchoolAdmin2025!', 10),
      phone: '+62218123468',
      address: 'SDN 1 Purwakarta, Jl. Pendidikan No. 10, Purwakarta',
      isActive: true,
      avatar: null
    }
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user
    })
  }

  console.log(`✅ Created ${users.length} users`)
}

export default seedUsers
