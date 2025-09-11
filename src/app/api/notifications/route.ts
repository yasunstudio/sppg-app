import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
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

    // Get recent notifications from different sources
    const [
      recentUsers,
      recentSchools,
      auditLogs
    ] = await Promise.all([
      // Recent user registrations (last 24 hours)
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true
        },
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      }),
      
      // Recent school additions (last 7 days)
      prisma.school.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true
        },
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 2
      }),
      
      // Recent audit logs (if available)
      prisma.auditLog.findMany({
        select: {
          id: true,
          action: true,
          createdAt: true,
          user: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      }).catch(() => []) // Fallback if audit logs don't exist
    ])

    // Format notifications
    interface Notification {
      id: string
      title: string
      time: string
      type: string
      createdAt: Date
    }
    
    const notifications: Notification[] = []

    // Add user registration notifications
    recentUsers.forEach(user => {
      notifications.push({
        id: `user-${user.id}`,
        title: `Pengguna baru terdaftar: ${user.name}`,
        time: getTimeAgo(user.createdAt),
        type: 'user_registration',
        createdAt: user.createdAt
      })
    })

    // Add school notifications  
    recentSchools.forEach(school => {
      notifications.push({
        id: `school-${school.id}`,
        title: `Sekolah baru ditambahkan: ${school.name}`,
        time: getTimeAgo(school.createdAt),
        type: 'school_added',
        createdAt: school.createdAt
      })
    })

    // Add audit log notifications
    auditLogs.forEach(log => {
      if (log.user) {
        notifications.push({
          id: `audit-${log.id}`,
          title: `${log.action} oleh ${log.user.name}`,
          time: getTimeAgo(log.createdAt),
          type: 'audit_log',
          createdAt: log.createdAt
        })
      }
    })

    // Sort by creation time and take latest 5
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Get notification count
    const totalCount = notifications.length

    return NextResponse.json({
      notifications: notifications.slice(0, 5),
      count: totalCount
    })
  } catch (error) {
    console.error("Notifications API Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) {
    return "Baru saja"
  } else if (minutes < 60) {
    return `${minutes} menit yang lalu`
  } else if (hours < 24) {
    return `${hours} jam yang lalu`
  } else {
    return `${days} hari yang lalu`
  }
}
