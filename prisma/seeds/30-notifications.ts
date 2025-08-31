// ===============================
// 30. NOTIFICATIONS
// ===============================
import { PrismaClient, NotificationType, Priority } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedNotifications() {
  console.log('🔔 Seeding notifications...')

  // Get reference data
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' }
  })

  if (users.length === 0) {
    console.log('⚠️  No users found. Please seed users first.')
    return
  }

  const notifications = [
    // System alerts
    {
      userId: users.find(u => u.email?.includes('admin'))?.id || users[0].id,
      type: NotificationType.SYSTEM,
      priority: Priority.NORMAL,
      title: 'Sistem Backup Berhasil',
      message: 'Backup database harian telah berhasil dilakukan pada 05 Agustus 2025 pukul 02:30 WIB. Ukuran backup: 2.5GB',
      isRead: true,
      createdAt: new Date('2025-08-05T02:30:00Z')
    },

    {
      userId: users.find(u => u.email?.includes('admin'))?.id || users[0].id,
      type: NotificationType.SYSTEM,
      priority: Priority.NORMAL,
      title: 'Update Sistem Tersedia',
      message: 'Tersedia update sistem versi 1.0.1 dengan perbaikan performa dan fitur baru. Silakan jadwalkan maintenance.',
      isRead: false,
      createdAt: new Date('2025-08-29T10:00:00Z')
    },

    // Production alerts
    {
      userId: users.find(u => u.email?.includes('chef') || u.email?.includes('production'))?.id || users[1]?.id || users[0].id,
      type: NotificationType.PRODUCTION,
      priority: Priority.NORMAL,
      title: 'Batch Produksi Selesai',
      message: 'Batch PB-PWK-001-082025 (Nasi Ayam Goreng SPPG) telah selesai diproduksi. Total: 500 porsi. Status QC: LULUS',
      isRead: true,
      createdAt: new Date('2025-08-05T08:30:00Z')
    },

    {
      userId: users.find(u => u.email?.includes('chef') || u.email?.includes('production'))?.id || users[1]?.id || users[0].id,
      type: NotificationType.PRODUCTION,
      priority: Priority.HIGH,
      title: 'Jadwal Produksi Besok',
      message: 'Reminder: Produksi untuk tanggal 06 Agustus 2025 - Menu: Nasi Ikan Bandeng Goreng, Target: 480 porsi. Mulai 05:00 WIB',
      isRead: false,
      createdAt: new Date('2025-08-05T16:00:00Z')
    },

    // Quality alerts
    {
      userId: users.find(u => u.email?.includes('qc'))?.id || users[2]?.id || users[0].id,
      type: NotificationType.QUALITY_ALERT,
      priority: Priority.HIGH,
      title: 'Quality Check Diperlukan',
      message: 'Batch PB-PWK-008-082025 memerlukan pemeriksaan kualitas segera. Sudah 25 menit sejak produksi selesai.',
      isRead: false,
      createdAt: new Date('2025-08-19T09:25:00Z')
    },

    {
      userId: users.find(u => u.email?.includes('qc'))?.id || users[2]?.id || users[0].id,
      type: NotificationType.QUALITY_ALERT,
      priority: Priority.CRITICAL,
      title: 'Suhu Batch di Bawah Standar',
      message: 'PERINGATAN: Batch PB-PWK-002-082025 memiliki suhu 58.2°C (di bawah minimum 65°C). Tindakan diperlukan.',
      isRead: true,
      createdAt: new Date('2025-08-06T07:45:00Z')
    },

    // Inventory alerts
    {
      userId: users.find(u => u.email?.includes('warehouse'))?.id || users[3]?.id || users[0].id,
      type: NotificationType.INVENTORY_LOW,
      priority: Priority.HIGH,
      title: 'Stok Bahan Baku Menipis',
      message: 'Stok Beras Putih Premium tinggal 150kg (di bawah minimum 200kg). Segera lakukan pemesanan ke supplier.',
      isRead: false,
      createdAt: new Date('2025-08-30T14:30:00Z')
    },

    {
      userId: users.find(u => u.email?.includes('warehouse'))?.id || users[3]?.id || users[0].id,
      type: NotificationType.INVENTORY_LOW,
      priority: Priority.CRITICAL,
      title: 'Stok Minyak Goreng Kritis',
      message: 'KRITIS: Stok Minyak Goreng tinggal 25L (di bawah minimum 50L). Produksi besok mungkin terganggu.',
      isRead: false,
      createdAt: new Date('2025-08-30T15:45:00Z')
    },

    // Delivery notifications
    {
      userId: users.find(u => u.email?.includes('driver') || u.email?.includes('logistics'))?.id || users[4]?.id || users[0].id,
      type: NotificationType.DISTRIBUTION,
      priority: Priority.NORMAL,
      title: 'Pengiriman Berhasil',
      message: 'Pengiriman ke SDN 1 Purwakarta berhasil diselesaikan. 450 porsi diterima oleh Ibu Siti (Kepala Sekolah) pukul 09:15 WIB',
      isRead: true,
      createdAt: new Date('2025-08-05T09:15:00Z')
    },

    {
      userId: users.find(u => u.email?.includes('driver') || u.email?.includes('logistics'))?.id || users[4]?.id || users[0].id,
      type: NotificationType.DISTRIBUTION,
      priority: Priority.HIGH,
      title: 'Rute Pengiriman Hari Ini',
      message: 'Rute A hari ini: 8 sekolah, total 3,850 porsi. Estimasi waktu: 3 jam. Kendaraan: B 1234 XYZ siap berangkat.',
      isRead: false,
      createdAt: new Date('2025-08-31T07:30:00Z')
    },

    // Financial notifications
    {
      userId: users.find(u => u.email?.includes('finance'))?.id || users[5]?.id || users[0].id,
      type: NotificationType.BUDGET_ALERT,
      priority: Priority.HIGH,
      title: 'Penggunaan Budget Mendekati Limit',
      message: 'Budget Bahan Baku bulan ini sudah terpakai 78% (Rp 39,000,000 dari Rp 50,000,000). Sisa: Rp 11,000,000',
      isRead: false,
      createdAt: new Date('2025-08-28T10:00:00Z')
    },

    {
      userId: users.find(u => u.email?.includes('finance'))?.id || users[5]?.id || users[0].id,
      type: NotificationType.BUDGET_ALERT,
      priority: Priority.NORMAL,
      title: 'Laporan Keuangan Mingguan',
      message: 'Laporan keuangan minggu ke-4 Agustus 2025 siap. Total pengeluaran: Rp 45,500,000. Efisiensi: 92%',
      isRead: true,
      createdAt: new Date('2025-08-25T17:00:00Z')
    },

    // School notifications  
    {
      userId: users.find(u => u.email?.includes('school'))?.id || users[6]?.id || users[0].id,
      type: NotificationType.DISTRIBUTION,
      priority: Priority.NORMAL,
      title: 'Menu Besok: Nasi Telur Dadar Sayur',
      message: 'Menu untuk tanggal 01 September 2025: Nasi Telur Dadar Sayur dengan sayuran segar. Estimasi pengiriman: 09:30 WIB',
      isRead: false,
      createdAt: new Date('2025-08-31T16:00:00Z')
    },

    {
      userId: users.find(u => u.email?.includes('school'))?.id || users[6]?.id || users[0].id,
      type: NotificationType.FEEDBACK,
      priority: Priority.LOW,
      title: 'Feedback Menu Hari Ini',
      message: 'Terima kasih atas feedback positif untuk menu Nasi Ayam Goreng SPPG. Tingkat kepuasan: 4.5/5.0 dari 450 siswa.',
      isRead: true,
      createdAt: new Date('2025-08-05T14:30:00Z')
    }
  ]

  // Create broadcast notifications for all users (general announcements)
  const broadcastNotifications = [
    {
      type: NotificationType.SYSTEM,
      priority: Priority.NORMAL,
      title: 'Libur Nasional 17 Agustus 2025',
      message: 'Tidak ada produksi dan distribusi pada tanggal 17 Agustus 2025 (Hari Kemerdekaan RI). Operasional normal mulai 18 Agustus.',
      isRead: false,
      createdAt: new Date('2025-08-15T10:00:00Z')
    },
    {
      type: NotificationType.SYSTEM,
      priority: Priority.LOW,
      title: 'Pencapaian Target Bulanan',
      message: 'Selamat! Target layanan bulan Agustus 2025 tercapai: 15,250 siswa terlayani dari 16 sekolah. Tingkat kepuasan: 4.3/5.0',
      isRead: true,
      createdAt: new Date('2025-08-31T17:00:00Z')
    },
    {
      type: NotificationType.SYSTEM,
      priority: Priority.HIGH,
      title: 'Jadwal Maintenance Peralatan',
      message: 'Maintenance rutin peralatan produksi dijadwalkan tanggal 03 September 2025 pukul 14:00-16:00 WIB. Produksi tidak terpengaruh.',
      isRead: false,
      createdAt: new Date('2025-08-30T09:00:00Z')
    }
  ]

  // Create individual notifications
  for (const notificationData of notifications) {
    const existing = await prisma.notification.findFirst({
      where: {
        userId: notificationData.userId,
        title: notificationData.title,
        type: notificationData.type
      }
    })
    
    if (!existing) {
      await prisma.notification.create({
        data: notificationData
      })
    }
  }

  // Create broadcast notifications for all users
  for (const broadcastData of broadcastNotifications) {
    for (const user of users) {
      const existing = await prisma.notification.findFirst({
        where: {
          userId: user.id,
          title: broadcastData.title,
          type: broadcastData.type
        }
      })
      
      if (!existing) {
        await prisma.notification.create({
          data: {
            ...broadcastData,
            userId: user.id
          }
        })
      }
    }
  }

  const notificationCount = await prisma.notification.count()
  console.log(`✅ Notifications seeded: ${notificationCount} notifications`)
}
