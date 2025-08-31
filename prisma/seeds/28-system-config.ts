// ===============================
// 28. SYSTEM CONFIGURATION
// ===============================
import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedSystemConfig() {
  console.log('⚙️ Seeding system configuration...')

  const systemConfigs = [
    // System Information
    {
      key: 'system.name',
      value: 'SPPG Purwakarta Management System',
      description: 'Nama resmi sistem manajemen SPPG Purwakarta',
      dataType: 'string'
    },

    {
      key: 'system.version',
      value: '1.0.1',
      description: 'Versi sistem saat ini',
      dataType: 'string'
    },

    {
      key: 'system.region',
      value: 'Kabupaten Purwakarta, Jawa Barat',
      description: 'Wilayah operasional SPPG',
      dataType: 'string'
    },

    {
      key: 'system.timezone',
      value: 'Asia/Jakarta',
      description: 'Zona waktu sistem',
      dataType: 'string'
    },

    {
      key: 'system.backup.enabled',
      value: 'true',
      description: 'Status fitur backup otomatis',
      dataType: 'string'
    },

    {
      key: 'system.backup.schedule',
      value: '0 2 * * *',
      description: 'Jadwal backup harian (cron format)',
      dataType: 'string'
    },

    // Operational Parameters
    {
      key: 'operation.school.count',
      value: '16',
      description: 'Jumlah sekolah yang dilayani',
      dataType: 'string'
    },

    {
      key: 'operation.daily.capacity',
      value: '4500',
      description: 'Kapasitas produksi harian maksimal (porsi)',
      dataType: 'string'
    },

    {
      key: 'operation.work.days',
      value: 'monday,tuesday,wednesday,thursday,friday',
      description: 'Hari operasional (Senin-Jumat)',
      dataType: 'string'
    },

    {
      key: 'operation.start.time',
      value: '05:00',
      description: 'Jam mulai operasional harian',
      dataType: 'string'
    },

    {
      key: 'operation.end.time',
      value: '15:00',
      description: 'Jam selesai operasional harian',
      dataType: 'string'
    },

    // Production Settings
    {
      key: 'production.batch.size.min',
      value: '400',
      description: 'Ukuran batch produksi minimum (porsi)',
      dataType: 'string'
    },

    {
      key: 'production.batch.size.max',
      value: '600',
      description: 'Ukuran batch produksi maksimum (porsi)',
      dataType: 'string'
    },

    {
      key: 'production.prep.time',
      value: '120',
      description: 'Waktu persiapan sebelum produksi (menit)',
      dataType: 'string'
    },

    {
      key: 'production.qc.required',
      value: 'true',
      description: 'Quality Control wajib untuk setiap batch',
      dataType: 'string'
    },

    {
      key: 'production.temp.hold.min',
      value: '65',
      description: 'Suhu minimum penyimpanan makanan (Celsius)',
      dataType: 'string'
    },

    {
      key: 'production.temp.serve.min',
      value: '60',
      description: 'Suhu minimum saat penyajian (Celsius)',
      dataType: 'string'
    },

    // Quality Standards
    {
      key: 'quality.shelf.life.max',
      value: '4',
      description: 'Masa simpan maksimal makanan jadi (jam)',
      dataType: 'string'
    },

    {
      key: 'quality.check.interval',
      value: '30',
      description: 'Interval pemeriksaan kualitas (menit)',
      dataType: 'string'
    },

    {
      key: 'quality.ph.range.min',
      value: '6.0',
      description: 'pH minimum makanan yang aman',
      dataType: 'string'
    },

    {
      key: 'quality.ph.range.max',
      value: '7.5',
      description: 'pH maksimum makanan yang aman',
      dataType: 'string'
    },

    // Delivery Configuration
    {
      key: 'delivery.window.start',
      value: '08:30',
      description: 'Jam mulai pengiriman ke sekolah',
      dataType: 'string'
    },

    {
      key: 'delivery.window.end',
      value: '10:30',
      description: 'Jam selesai pengiriman ke sekolah',
      dataType: 'string'
    },

    {
      key: 'delivery.route.optimization',
      value: 'true',
      description: 'Optimisasi rute pengiriman otomatis',
      dataType: 'string'
    },

    {
      key: 'delivery.tracking.enabled',
      value: 'true',
      description: 'Fitur tracking pengiriman real-time',
      dataType: 'string'
    },

    // Financial Settings
    {
      key: 'finance.budget.alert.threshold',
      value: '80',
      description: 'Persentase threshold peringatan budget (%)',
      dataType: 'string'
    },

    {
      key: 'finance.cost.per.portion.target',
      value: '8500',
      description: 'Target biaya per porsi (Rupiah)',
      dataType: 'string'
    },

    {
      key: 'finance.reporting.period',
      value: 'monthly',
      description: 'Periode pelaporan keuangan',
      dataType: 'string'
    },

    // Inventory Management
    {
      key: 'inventory.reorder.point.days',
      value: '3',
      description: 'Hari minimum stok sebelum reorder',
      dataType: 'string'
    },

    {
      key: 'inventory.safety.stock.days',
      value: '2',
      description: 'Safety stock dalam hari',
      dataType: 'string'
    },

    {
      key: 'inventory.expiry.alert.days',
      value: '2',
      description: 'Hari sebelum expired untuk alert',
      dataType: 'string'
    },

    // Notification Settings
    {
      key: 'notification.enabled',
      value: 'true',
      description: 'Status fitur notifikasi sistem',
      dataType: 'string'
    },

    {
      key: 'notification.email.enabled',
      value: 'true',
      description: 'Notifikasi via email',
      dataType: 'string'
    },

    {
      key: 'notification.sms.enabled',
      value: 'false',
      description: 'Notifikasi via SMS',
      dataType: 'string'
    },

    // Security Settings
    {
      key: 'security.session.timeout',
      value: '480',
      description: 'Timeout sesi pengguna (menit)',
      dataType: 'string'
    },

    {
      key: 'security.password.min.length',
      value: '8',
      description: 'Panjang minimum password',
      dataType: 'string'
    },

    {
      key: 'security.login.max.attempts',
      value: '5',
      description: 'Maksimal percobaan login gagal',
      dataType: 'string'
    },

    {
      key: 'security.audit.log.retention',
      value: '90',
      description: 'Retensi audit log (hari)',
      dataType: 'string'
    }
  ]

  for (const configData of systemConfigs) {
    await prisma.systemConfig.upsert({
      where: {
        key: configData.key
      },
      create: configData,
      update: {
        value: configData.value,
        description: configData.description,
        dataType: configData.dataType
      }
    })
  }

  const configCount = await prisma.systemConfig.count()
  console.log(`✅ System configuration seeded: ${configCount} settings`)
}
