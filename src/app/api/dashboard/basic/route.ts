import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role untuk menentukan data yang relevan
    const userWithRoles = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!userWithRoles) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userRoles = userWithRoles.roles.map(ur => ur.role.name)

    // Generate dashboard data berdasarkan role
    const dashboardData = await generateDashboardData(userRoles, session.user.id, userWithRoles.name)

    return NextResponse.json({
      success: true,
      data: dashboardData,
      userRoles,
      userName: userWithRoles.name
    })

  } catch (error) {
    console.error('Error fetching basic dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

async function generateDashboardData(roles: string[], userId: string, userName: string) {
  try {
    // Notifikasi yang belum dibaca
    const unreadNotifications = await prisma.notification.count({
      where: {
        userId: userId,
        isRead: false
      }
    })

    // Base stats
    const baseStats = {
      todayTasks: 0,
      completedTasks: 0,
      upcomingEvents: 0,
      notifications: unreadNotifications
    }

    // Data berdasarkan role - Posyandu functions removed
    if (roles.includes('CHEF') || roles.includes('KITCHEN_STAFF')) {
      return await getKitchenData(baseStats, userId, userName)
    }
    
    if (roles.includes('QUALITY_CONTROLLER')) {
      return await getQualityData(baseStats, userId, userName)
    }
    
    if (roles.includes('DELIVERY_MANAGER') || roles.includes('DRIVER')) {
      return await getDeliveryData(baseStats, userId, userName)
    }
    
    if (roles.includes('FINANCIAL_ANALYST')) {
      return await getFinancialData(baseStats, userId, userName)
    }

    // Default untuk role lain
    return await getGeneralData(baseStats, userId, userName)

  } catch (error) {
    console.error('Error in generateDashboardData:', error)
    return {
      stats: {
        todayTasks: 0,
        completedTasks: 0,
        upcomingEvents: 0,
        notifications: 0
      },
      tasks: [],
      events: []
    }
  }
}

async function getKitchenData(stats: any, userId: string, userName: string) {
  try {
    // Ambil data inventory yang real
    const inventoryItems = await prisma.inventoryItem.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        rawMaterial: true
      }
    })
    
    // Ambil production plans yang real
    const productionPlans = await prisma.productionPlan.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        menu: true
      }
    })
    
    // Ambil menus yang tersedia
    const menuCount = await prisma.menu.count()

    const tasks = []
    
    if (inventoryItems.length > 0) {
      tasks.push({
        id: 'kitchen-1',
        title: `Cek ${inventoryItems.length} item inventory`,
        priority: 'high',
        dueTime: '07:00',
        completed: false,
        type: 'inventory'
      })
    }
    
    if (productionPlans.length > 0) {
      tasks.push({
        id: 'kitchen-2',
        title: `Persiapan ${productionPlans.length} rencana produksi`,
        priority: 'high',
        dueTime: '08:30',
        completed: false,
        type: 'preparation'
      })
    }
    
    if (menuCount > 0) {
      tasks.push({
        id: 'kitchen-3',
        title: `Quality check ${menuCount} menu tersedia`,
        priority: 'medium',
        dueTime: '09:00',
        completed: true,
        type: 'quality'
      })
    }

    const events: any[] = []
    
    if (productionPlans.length > 0) {
      productionPlans.forEach((plan, idx) => {
        events.push({
          id: plan.id,
          title: `Produksi: ${plan.menu?.name || 'Menu'} (${plan.targetPortions} porsi)`,
          time: `${10 + idx}:00`,
          type: 'production',
          quantity: `${plan.targetPortions} porsi`
        })
      })
    }

    return {
      stats: {
        ...stats,
        todayTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        upcomingEvents: events.length
      },
      tasks,
      events
    }
  } catch (error) {
    console.error('Error in getKitchenData:', error)
    return getDefaultData(stats)
  }
}

async function getQualityData(stats: any, userId: string, userName: string) {
  try {
    // Ambil quality checkpoints yang real untuk user ini
    const userCheckpoints = await prisma.qualityCheckpoint.findMany({
      where: {
        checkedBy: userId
      },
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Ambil semua quality checks yang tersedia
    const qualityChecks = await prisma.qualityCheck.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Ambil total quality standards
    const qualityStandards = await prisma.qualityStandard.count()

    const tasks: any[] = []
    
    if (userCheckpoints.length > 0) {
      tasks.push({
        id: 'quality-1',
        title: `Review ${userCheckpoints.length} quality checkpoint saya`,
        priority: 'high',
        dueTime: '09:00',
        completed: false,
        type: 'checkpoint'
      })
    }
    
    if (qualityChecks.length > 0) {
      tasks.push({
        id: 'quality-2',
        title: `Periksa ${qualityChecks.length} quality check terbaru`,
        priority: 'high',
        dueTime: '11:00',
        completed: false,
        type: 'inspection'
      })
    }
    
    if (qualityStandards > 0) {
      tasks.push({
        id: 'quality-3',
        title: `Update ${qualityStandards} standar kualitas`,
        priority: 'medium',
        dueTime: '13:00',
        completed: true,
        type: 'standards'
      })
    }

    const events: any[] = []
    
    if (userCheckpoints.length > 0) {
      userCheckpoints.slice(0, 3).forEach((checkpoint, idx) => {
        events.push({
          id: checkpoint.id,
          title: `QC Checkpoint: ${checkpoint.checkpointType}`,
          time: `${14 + idx}:00`,
          type: 'quality',
          checkpoint: checkpoint.checkpointType
        })
      })
    }

    return {
      stats: {
        ...stats,
        todayTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        upcomingEvents: events.length
      },
      tasks,
      events
    }
  } catch (error) {
    console.error('Error in getQualityData:', error)
    return getDefaultData(stats)
  }
}

async function getDeliveryData(stats: any, userId: string, userName: string) {
  try {
    // Ambil data delivery yang real
    const deliveries = await prisma.delivery.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        school: true
      }
    })
    
    // Ambil schools yang aktif
    const schools = await prisma.school.findMany({
      take: 3,
      orderBy: {
        totalStudents: 'desc'
      }
    })
    
    // Ambil total deliveries pending
    const pendingDeliveries = await prisma.delivery.count({
      where: {
        status: 'PENDING'
      }
    })

    const tasks: any[] = []
    
    if (deliveries.length > 0) {
      tasks.push({
        id: 'delivery-1',
        title: `Koordinasi ${deliveries.length} pengiriman`,
        priority: 'high',
        dueTime: '06:00',
        completed: false,
        type: 'coordination'
      })
    }
    
    if (pendingDeliveries > 0) {
      tasks.push({
        id: 'delivery-2',
        title: `Proses ${pendingDeliveries} delivery pending`,
        priority: 'high',
        dueTime: '07:30',
        completed: false,
        type: 'processing'
      })
    }
    
    if (schools.length > 0) {
      tasks.push({
        id: 'delivery-3',
        title: `Update status ${schools.length} sekolah prioritas`,
        priority: 'medium',
        dueTime: '10:00',
        completed: true,
        type: 'update'
      })
    }

    const events: any[] = []
    
    if (deliveries.length > 0) {
      deliveries.slice(0, 3).forEach((delivery, idx) => {
        events.push({
          id: delivery.id,
          title: `Pengiriman ke ${delivery.school?.name || 'Sekolah'}`,
          time: `${11 + idx}:00`,
          type: 'delivery',
          location: delivery.school?.address || 'Alamat sekolah',
          quantity: `${delivery.portionsDelivered || 0} porsi`
        })
      })
    }

    return {
      stats: {
        ...stats,
        todayTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        upcomingEvents: events.length
      },
      tasks,
      events
    }
  } catch (error) {
    console.error('Error in getDeliveryData:', error)
    return getDefaultData(stats)
  }
}

async function getFinancialData(stats: any, userId: string, userName: string) {
  try {
    // Ambil financial transactions yang real
    const recentTransactions = await prisma.financialTransaction.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Ambil total amount hari ini
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const todayTransactions = await prisma.financialTransaction.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    const tasks: any[] = []
    
    if (recentTransactions.length > 0) {
      tasks.push({
        id: 'financial-1',
        title: `Review ${recentTransactions.length} transaksi terbaru`,
        priority: 'high',
        dueTime: '09:00',
        completed: false,
        type: 'review'
      })
    }
    
    if (todayTransactions.length > 0) {
      tasks.push({
        id: 'financial-2',
        title: `Proses ${todayTransactions.length} transaksi hari ini`,
        priority: 'medium',
        dueTime: '15:00',
        completed: false,
        type: 'processing'
      })
    }
    
    const totalToday = todayTransactions.reduce((sum, t) => sum + t.amount, 0)
    if (totalToday > 0) {
      tasks.push({
        id: 'financial-3',
        title: `Rekap transaksi: Rp ${totalToday.toLocaleString('id-ID')}`,
        priority: 'low',
        dueTime: '16:30',
        completed: true,
        type: 'reporting'
      })
    }

    const events: any[] = []
    
    if (recentTransactions.length > 0) {
      recentTransactions.slice(0, 2).forEach((transaction, idx) => {
        events.push({
          id: transaction.id,
          title: `${transaction.type}: ${transaction.description}`,
          time: `${10 + (idx * 4)}:00`,
          type: 'financial',
          amount: `Rp ${transaction.amount.toLocaleString('id-ID')}`
        })
      })
    }

    return {
      stats: {
        ...stats,
        todayTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        upcomingEvents: events.length
      },
      tasks,
      events
    }
  } catch (error) {
    console.error('Error in getFinancialData:', error)
    return getDefaultData(stats)
  }
}

async function getGeneralData(stats: any, userId: string, userName: string) {
  try {
    // Ambil data real dari database untuk welcome message yang lebih spesifik
    const userWithRole = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true
      }
    })
    
    const totalUsers = await prisma.user.count()
    const todayUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })

    const tasks = [
      {
        id: 'general-1',
        title: `Selamat datang, ${userName}!`,
        priority: 'low',
        dueTime: '09:00',
        completed: false,
        type: 'welcome'
      },
      {
        id: 'general-2',
        title: `Sistem memiliki ${totalUsers} pengguna terdaftar`,
        priority: 'medium',
        dueTime: '10:00',
        completed: true,
        type: 'info'
      }
    ]
    
    if (todayUsers > 0) {
      tasks.push({
        id: 'general-3',
        title: `${todayUsers} pengguna baru hari ini`,
        priority: 'low',
        dueTime: '16:00',
        completed: false,
        type: 'notification'
      })
    }

    const events = [
      {
        id: 'event-1',
        title: 'Akses fitur sistem SPPG',
        time: '11:00',
        type: 'system'
      }
    ]
    
    if (userWithRole?.phone && userWithRole?.address) {
      events.push({
        id: 'event-2',
        title: 'Profil telah lengkap',
        time: '14:00',
        type: 'profile'
      })
    } else {
      events.push({
        id: 'event-2',
        title: 'Lengkapi profil pengguna',
        time: '14:00',
        type: 'profile'
      })
    }

    return {
      stats: {
        ...stats,
        todayTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        upcomingEvents: events.length
      },
      tasks,
      events
    }
  } catch (error) {
    console.error('Error in getGeneralData:', error)
    return getDefaultData(stats)
  }
}

function getDefaultData(stats: any) {
  return {
    stats: {
      ...stats,
      todayTasks: 0,
      completedTasks: 0,
      upcomingEvents: 0
    },
    tasks: [],
    events: []
  }
}
