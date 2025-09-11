import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server';

import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
// prisma imported from lib;

export async function GET() {
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

    const configs = await prisma.systemConfig.findMany({
      orderBy: {
        key: 'asc'
      }
    });

    // Group configs by category (derived from key prefix)
    const grouped = configs.reduce((acc: any, config) => {
      const category = config.key.split('.')[0];
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(config);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: configs,
      grouped,
      count: configs.length,
      message: 'Konfigurasi sistem berhasil dimuat'
    });
  } catch (error) {
    console.error('Error fetching system configs:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat konfigurasi sistem' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'system:create'
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

    const body = await request.json();
    const { key, value, description, dataType = 'string' } = body;

    const config = await prisma.systemConfig.create({
      data: {
        key,
        value,
        description,
        dataType
      }
    });

    return NextResponse.json({
      success: true,
      data: config,
      message: 'Konfigurasi sistem berhasil dibuat'
    });
  } catch (error) {
    console.error('Error creating system config:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat konfigurasi sistem' },
      { status: 500 }
    );
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
      'system:update'
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

    const body = await request.json();
    const { id, value, description } = body;

    const config = await prisma.systemConfig.update({
      where: { id },
      data: {
        value,
        description,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: config,
      message: 'Konfigurasi sistem berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating system config:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui konfigurasi sistem' },
      { status: 500 }
    );
  }
}
