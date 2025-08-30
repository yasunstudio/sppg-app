import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server';

// prisma imported from lib;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const notifications = await prisma.notification.findMany({
      where: userId ? { userId } : {},
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
      take: 50
    });

    // Group by priority for dashboard
    const grouped = {
      critical: notifications.filter(n => n.priority === 'CRITICAL'),
      high: notifications.filter(n => n.priority === 'HIGH'),
      normal: notifications.filter(n => n.priority === 'NORMAL'),
      low: notifications.filter(n => n.priority === 'LOW')
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return NextResponse.json({
      success: true,
      data: notifications,
      grouped,
      unreadCount,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    
    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isRead } = body;

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead }
    });

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
