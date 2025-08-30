import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server';

// prisma imported from lib;

export async function GET() {
  try {
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
      count: configs.length
    });
  } catch (error) {
    console.error('Error fetching system configs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch system configurations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
      message: 'System configuration created successfully'
    });
  } catch (error) {
    console.error('Error creating system config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create system configuration' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
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
      message: 'System configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating system config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update system configuration' },
      { status: 500 }
    );
  }
}
