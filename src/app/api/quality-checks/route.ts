import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { QualityCheckType, QualityStatus } from '@/generated/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') as QualityCheckType | null;
    const status = searchParams.get('status') as QualityStatus | null;
    const referenceType = searchParams.get('referenceType') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { referenceId: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { checkedBy: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (referenceType) {
      where.referenceType = { contains: referenceType, mode: 'insensitive' };
    }

    // Get quality checks with pagination
    const [qualityChecks, totalCount] = await Promise.all([
      prisma.qualityCheck.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.qualityCheck.count({ where })
    ]);

    // Get statistics
    const stats = await prisma.qualityCheck.groupBy({
      by: ['status'],
      _count: {
        _all: true
      }
    });

    const statusDistribution = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count._all;
      return acc;
    }, {} as Record<string, number>);

    // Get type distribution
    const typeStats = await prisma.qualityCheck.groupBy({
      by: ['type'],
      _count: {
        _all: true
      }
    });

    const typeDistribution = typeStats.reduce((acc, stat) => {
      acc[stat.type] = stat._count._all;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      data: qualityChecks,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      stats: {
        statusDistribution,
        typeDistribution,
        totalChecks: totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching quality checks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quality checks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      type,
      referenceType,
      referenceId,
      checkedBy,
      color,
      taste,
      aroma,
      texture,
      temperature,
      status = 'PENDING',
      notes
    } = body;

    // Validate required fields
    if (!type || !referenceType || !referenceId) {
      return NextResponse.json(
        { error: 'Type, reference type, and reference ID are required' },
        { status: 400 }
      );
    }

    // Validate enums
    if (!Object.values(QualityCheckType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid quality check type' },
        { status: 400 }
      );
    }

    if (!Object.values(QualityStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid quality status' },
        { status: 400 }
      );
    }

    // Check if quality check already exists for this reference
    const existingCheck = await prisma.qualityCheck.findUnique({
      where: {
        referenceType_referenceId: {
          referenceType,
          referenceId
        }
      }
    });

    if (existingCheck) {
      return NextResponse.json(
        { error: 'Quality check already exists for this reference' },
        { status: 400 }
      );
    }

    const qualityCheck = await prisma.qualityCheck.create({
      data: {
        type,
        referenceType,
        referenceId,
        checkedBy,
        color,
        taste,
        aroma,
        texture,
        temperature: temperature ? parseFloat(temperature) : null,
        status,
        notes
      }
    });

    return NextResponse.json({
      data: qualityCheck,
      message: 'Quality check created successfully'
    });
  } catch (error) {
    console.error('Error creating quality check:', error);
    return NextResponse.json(
      { error: 'Failed to create quality check' },
      { status: 500 }
    );
  }
}
