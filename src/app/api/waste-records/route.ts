import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth"
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

// prisma imported from lib;

export async function GET(request: NextRequest) {
  try {
    // Check authentication and permissions
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'waste.view');
    if (!hasPermission) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const wasteType = searchParams.get('wasteType') || 'all'
    const source = searchParams.get('source') || 'all'

    // Build where clause for filtering
    const where: any = {}
    
    if (search) {
      where.OR = [
        {
          school: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          notes: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    if (wasteType !== 'all') {
      where.wasteType = wasteType
    }

    if (source !== 'all') {
      where.source = source
    }

    // Get total count for pagination
    const totalCount = await prisma.wasteRecord.count({ where })

    // Get paginated records
    const wasteRecords = await prisma.wasteRecord.findMany({
      where,
      include: {
        school: {
          select: {
            name: true,
            address: true
          }
        }
      },
      orderBy: {
        recordDate: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    // Calculate waste statistics (for all records, not just current page)
    const allRecords = await prisma.wasteRecord.findMany({
      orderBy: {
        recordDate: 'desc'
      }
    });

    const stats = {
      total: allRecords.length,
      totalWeight: allRecords.reduce((sum, record) => sum + record.weight, 0),
      byType: allRecords.reduce((acc: any, record) => {
        acc[record.wasteType] = {
          count: (acc[record.wasteType]?.count || 0) + 1,
          weight: (acc[record.wasteType]?.weight || 0) + record.weight
        };
        return acc;
      }, {}),
      bySource: allRecords.reduce((acc: any, record) => {
        acc[record.source] = {
          count: (acc[record.source]?.count || 0) + 1,
          weight: (acc[record.source]?.weight || 0) + record.weight
        };
        return acc;
      }, {}),
      recent30Days: allRecords.filter(r => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return r.recordDate >= thirtyDaysAgo;
      }).length
    };

    return NextResponse.json({
      success: true,
      data: wasteRecords,
      stats,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching waste records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch waste records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'waste.create');
    if (!hasPermission) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      )
    }

    const body = await request.json();
    const {
      schoolId,
      wasteType,
      source,
      weight,
      notes,
      recordDate
    } = body;

    const wasteRecord = await prisma.wasteRecord.create({
      data: {
        schoolId,
        wasteType,
        source,
        weight,
        notes,
        recordDate: recordDate ? new Date(recordDate) : new Date()
      },
      include: {
        school: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      data: wasteRecord,
      message: 'Waste record created successfully'
    });
  } catch (error) {
    console.error('Error creating waste record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create waste record' },
      { status: 500 }
    );
  }
}
