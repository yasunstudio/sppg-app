import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server';

// prisma imported from lib;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entity) where.entity = entity;

    const [auditLogs, total] = await Promise.all([
      prisma.auditLog.findMany({
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
      }),
      prisma.auditLog.count({ where })
    ]);

    // Activity statistics
    const stats = {
      total,
      byAction: await prisma.auditLog.groupBy({
        by: ['action'],
        _count: {
          id: true
        },
        where
      }),
      byEntity: await prisma.auditLog.groupBy({
        by: ['entity'],
        _count: {
          id: true
        },
        where
      }),
      recentActivity: auditLogs.slice(0, 10)
    };

    return NextResponse.json({
      success: true,
      data: auditLogs,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      action,
      entity,
      entityId,
      oldValues,
      newValues,
      ipAddress,
      userAgent
    } = body;

    const auditLog = await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        oldValues,
        newValues,
        ipAddress,
        userAgent
      },
      include: {
        user: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      data: auditLog,
      message: 'Audit log created successfully'
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
