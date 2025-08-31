import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedRoles() {
  console.log('📋 Seeding roles...')
  
  const roles = [
    {
      id: 'role-super-admin',
      name: 'SUPER_ADMIN',
      description: 'Super Administrator dengan akses penuh ke seluruh sistem SPPG Purwakarta',
      permissions: [
        // Full system access
        'users.create', 'users.view', 'users.edit', 'users.delete',
        'menus.create', 'menus.view', 'menus.edit', 'menus.approve',
        'schools.view', 'schools.manage', 'students.view', 'students.manage',
        'inventory.create', 'inventory.view', 'inventory.edit', 'suppliers.manage',
        'production.create', 'production.view', 'production.manage',
        'quality.check', 'quality.create', 'quality.edit',
        'finance.view', 'finance.manage', 'budget.create', 'budget.view', 'budget.approve',
        'transactions.create', 'transactions.view',
        'delivery.manage', 'delivery.view', 'logistics.plan', 'logistics.manage',
        'training.manage', 'compliance.audit',
        'reports.view', 'analytics.view',
        'system.config', 'audit.view',
        'feedback.view', 'feedback.respond'
      ]
    },
    {
      id: 'role-admin',
      name: 'ADMIN',
      description: 'Administrator sistem SPPG Purwakarta',
      permissions: [
        'users.create', 'users.view', 'users.edit', 'users.delete',
        'menus.view', 'menus.approve',
        'schools.view', 'schools.manage', 'students.view', 'students.manage',
        'inventory.create', 'inventory.view', 'inventory.edit', 'suppliers.manage',
        'production.view',
        'quality.create', 'quality.edit',
        'finance.view', 'finance.manage', 'budget.create', 'budget.view',
        'transactions.create', 'transactions.view',
        'delivery.view', 'training.manage',
        'reports.view', 'analytics.view',
        'system.config', 'audit.view',
        'feedback.view', 'feedback.respond'
      ]
    },
    {
      id: 'role-nutritionist',
      name: 'NUTRITIONIST',
      description: 'Ahli gizi SPPG Purwakarta untuk konsultasi dan perencanaan menu',
      permissions: [
        'menus.create', 'menus.view', 'menus.edit',
        'nutrition.consult',
        'students.view',
        'inventory.view',
        'production.view',
        'quality.check',
        'reports.view'
      ]
    },
    {
      id: 'role-chef',
      name: 'CHEF',
      description: 'Kepala koki produksi makanan SPPG Purwakarta',
      permissions: [
        'menus.create', 'menus.view', 'menus.edit',
        'inventory.create', 'inventory.view', 'inventory.edit',
        'production.create', 'production.view', 'production.manage',
        'quality.check',
        'reports.view'
      ]
    },
    {
      id: 'role-production-staff',
      name: 'PRODUCTION_STAFF',
      description: 'Staff produksi makanan SPPG Purwakarta',
      permissions: [
        'menus.view',
        'inventory.view',
        'production.view',
        'quality.check'
      ]
    },
    {
      id: 'role-qc',
      name: 'QUALITY_CONTROL',
      description: 'Quality Control untuk pemeriksaan kualitas makanan',
      permissions: [
        'menus.view',
        'inventory.view',
        'production.view',
        'quality.check', 'quality.create', 'quality.edit',
        'compliance.audit',
        'reports.view', 'audit.view',
        'feedback.view', 'feedback.respond'
      ]
    },
    {
      id: 'role-warehouse',
      name: 'WAREHOUSE_MANAGER',
      description: 'Pengelola gudang dan inventori SPPG Purwakarta',
      permissions: [
        'inventory.create', 'inventory.view', 'inventory.edit',
        'suppliers.manage',
        'production.view',
        'delivery.view',
        'reports.view'
      ]
    },
    {
      id: 'role-distribution',
      name: 'DISTRIBUTION_MANAGER',
      description: 'Pengelola distribusi dan logistik SPPG Purwakarta',
      permissions: [
        'schools.view',
        'delivery.manage', 'delivery.view',
        'logistics.plan', 'logistics.manage',
        'reports.view'
      ]
    },
    {
      id: 'role-school-admin',
      name: 'SCHOOL_ADMIN',
      description: 'Administrator sekolah di wilayah Purwakarta',
      permissions: [
        'schools.view', 'students.view', 'students.manage',
        'delivery.view',
        'feedback.view'
      ]
    },
    {
      id: 'role-driver',
      name: 'DRIVER',
      description: 'Driver pengiriman makanan ke sekolah',
      permissions: [
        'delivery.view',
        'schools.view'
      ]
    },
    {
      id: 'role-financial-analyst',
      name: 'FINANCIAL_ANALYST',
      description: 'Analis keuangan untuk pengelolaan budget dan transaksi',
      permissions: [
        'finance.view', 'budget.create', 'budget.view',
        'transactions.view',
        'reports.view', 'analytics.view'
      ]
    },
    {
      id: 'role-operations-supervisor',
      name: 'OPERATIONS_SUPERVISOR',
      description: 'Supervisor operasional untuk pengawasan kegiatan harian',
      permissions: [
        'menus.view',
        'schools.view', 'students.view',
        'inventory.view',
        'production.view',
        'quality.check',
        'delivery.view',
        'reports.view'
      ]
    },
    {
      id: 'role-viewer',
      name: 'VIEWER',
      description: 'Hanya dapat melihat data tanpa akses edit',
      permissions: [
        'menus.view',
        'schools.view',
        'inventory.view',
        'production.view',
        'delivery.view',
        'reports.view'
      ]
    }
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        description: role.description,
        permissions: role.permissions
      },
      create: role
    })
  }

  console.log(`✅ Created ${roles.length} roles`)
}

export default seedRoles
