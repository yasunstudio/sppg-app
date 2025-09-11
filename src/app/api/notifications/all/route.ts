import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth"
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const priority = searchParams.get('priority') 
    const isRead = searchParams.get('isRead')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build where clause
    const where: any = {}
    if (type && type !== 'all') where.type = type
    if (priority && priority !== 'all') where.priority = priority
    if (isRead && isRead !== 'all') where.isRead = isRead === 'true'

    // For now, return mock data since Notification model might not be implemented yet
    // This will be replaced with actual Prisma query when model is ready
    const mockNotifications = [
      {
        id: "1",
        title: "Stok Bahan Baku Menipis",
        message: "Stok beras di gudang tinggal 15kg, perlu segera diisi ulang untuk produksi besok.",
        type: "INVENTORY_LOW",
        priority: "HIGH",
        isRead: false,
        actionUrl: "/dashboard/inventory",
        createdAt: new Date().toISOString(),
        userId: session.user.id
      },
      {
        id: "2", 
        title: "Kualitas Produksi Menurun",
        message: "Batch produksi #2024-001 mendapat rating kualitas di bawah standar (6.5/10).",
        type: "QUALITY_ALERT",
        priority: "CRITICAL",
        isRead: false,
        actionUrl: "/dashboard/quality",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        userId: session.user.id
      },
      {
        id: "3",
        title: "Pengiriman Selesai",
        message: "Pengiriman ke 15 sekolah telah berhasil diselesaikan dengan total 1,250 porsi.",
        type: "DISTRIBUTION",
        priority: "NORMAL",
        isRead: true,
        actionUrl: "/dashboard/delivery-tracking",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        userId: session.user.id
      },
      {
        id: "4",
        title: "Anggaran Bulanan Terlampaui",
        message: "Pengeluaran bulan ini telah mencapai 105% dari budget yang dialokasikan.",
        type: "BUDGET_ALERT",
        priority: "HIGH",
        isRead: false,
        actionUrl: "/dashboard/financial",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        userId: session.user.id
      },
      {
        id: "5",
        title: "Feedback Baru dari Sekolah",
        message: "SDN Mekar Jaya memberikan feedback positif untuk menu hari ini (rating: 4.5/5).",
        type: "FEEDBACK",
        priority: "LOW",
        isRead: true,
        actionUrl: "/dashboard/feedback",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        userId: session.user.id
      }
    ]

    // Apply filters to mock data
    let filteredNotifications = mockNotifications
    if (type && type !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.type === type)
    }
    if (priority && priority !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.priority === priority)
    }
    if (isRead && isRead !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.isRead === (isRead === 'true'))
    }

    const total = filteredNotifications.length
    const offset = (page - 1) * limit
    const paginatedNotifications = filteredNotifications.slice(offset, offset + limit)

    return NextResponse.json({
      notifications: paginatedNotifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        total: mockNotifications.length,
        unread: mockNotifications.filter(n => !n.isRead).length,
        byType: mockNotifications.reduce((acc, n) => {
          acc[n.type] = (acc[n.type] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        byPriority: mockNotifications.reduce((acc, n) => {
          acc[n.priority] = (acc[n.priority] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    })

    /*
    // Actual Prisma implementation (uncomment when Notification model is ready)
    const notifications = await prisma.notification.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.notification.count({ where })

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    */
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
export async function PATCH(request: NextRequest) {
  try {
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'notifications:update'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    
    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { isRead } = body

    // Mock implementation - replace with actual Prisma update when model is ready
    return NextResponse.json({
      success: true,
      message: 'Notification updated successfully'
    })

    /*
    // Actual Prisma implementation (uncomment when Notification model is ready)
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead }
    })

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification updated successfully'
    })
    */
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
