import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedSuppliers() {
  console.log('🏪 Seeding suppliers for SPPG Purwakarta...')
  
  const suppliers = [
    {
      id: 'supplier-beras-nusantara',
      name: 'PT Beras Nusantara',
      contactName: 'Budi Santoso',
      phone: '0812-3456-7890',
      email: 'budi@berasnusantara.co.id',
      address: 'Jl. Raya Purwakarta No. 123, Purwakarta, Jawa Barat',
      isActive: true
    },
    {
      id: 'supplier-ayam-segar',
      name: 'CV Ayam Segar Purwakarta',
      contactName: 'Siti Rahayu',
      phone: '0813-2345-6789',
      email: 'siti@ayamsegar.com',
      address: 'Jl. Pasar Ayam No. 45, Purwakarta, Jawa Barat',
      isActive: true
    },
    {
      id: 'supplier-petani-sayur',
      name: 'Koperasi Petani Sayur Purwakarta',
      contactName: 'Ahmad Wijaya',
      phone: '0814-3456-7890',
      email: 'ahmad@petanisayur.com',
      address: 'Desa Sukamulya, Purwakarta, Jawa Barat',
      isActive: true
    },
    {
      id: 'supplier-pasar-ikan',
      name: 'Pasar Ikan Segar Purwakarta',
      contactName: 'Iman Suryadi',
      phone: '0815-4567-8901',
      email: 'iman@pasarikan.com',
      address: 'Jl. Pelabuhan No. 67, Purwakarta, Jawa Barat',
      isActive: true
    },
    {
      id: 'supplier-peternakan-telur',
      name: 'Peternakan Telur Mandiri',
      contactName: 'Dewi Lestari',
      phone: '0816-5678-9012',
      email: 'dewi@telumandiri.com',
      address: 'Jl. Peternakan No. 89, Purwakarta, Jawa Barat',
      isActive: true
    },
    {
      id: 'supplier-industri-tempe',
      name: 'Industri Tempe Tahu Barokah',
      contactName: 'Hasan Basri',
      phone: '0817-6789-0123',
      email: 'hasan@tempebarokah.com',
      address: 'Jl. Industri No. 12, Purwakarta, Jawa Barat',
      isActive: true
    },
    {
      id: 'supplier-pasar-tradisional',
      name: 'Pasar Tradisional Purwakarta',
      contactName: 'Ibu Lastri',
      phone: '0818-7890-1234',
      email: 'lastri@pasartraditional.com',
      address: 'Jl. Pasar Lama No. 34, Purwakarta, Jawa Barat',
      isActive: true
    },
    {
      id: 'supplier-distributor-minyak',
      name: 'Distributor Minyak Kemasan',
      contactName: 'Rudi Hartono',
      phone: '0819-8901-2345',
      email: 'rudi@distributorminyak.com',
      address: 'Jl. Gudang No. 56, Purwakarta, Jawa Barat',
      isActive: true
    },
    {
      id: 'supplier-toko-bumbu',
      name: 'Toko Bumbu Lengkap',
      contactName: 'Pak Surya',
      phone: '0820-9012-3456',
      email: 'surya@tokobumbu.com',
      address: 'Jl. Bumbu Dapur No. 78, Purwakarta, Jawa Barat',
      isActive: true
    },
    {
      id: 'supplier-buah-segar',
      name: 'Kebun Buah Segar Nusantara',
      phone: '0821-0123-4567',
      contactName: 'Wati Sari',
      email: 'wati@buahsegar.com',
      address: 'Jl. Kebun Raya No. 90, Purwakarta, Jawa Barat',
      isActive: true
    }
  ]

  try {
    for (const supplier of suppliers) {
      const createdSupplier = await prisma.supplier.upsert({
        where: { id: supplier.id },
        update: {
          name: supplier.name,
          contactName: supplier.contactName,
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address,
          isActive: supplier.isActive
        },
        create: supplier
      })
      
      console.log(`✓ Supplier seeded: ${createdSupplier.name} (Contact: ${createdSupplier.contactName})`)
    }
    
    console.log(`🏪 Suppliers seeding completed! Total: ${suppliers.length} suppliers`)
  } catch (error) {
    console.error('❌ Error seeding suppliers:', error)
    throw error
  }
}

export default seedSuppliers
