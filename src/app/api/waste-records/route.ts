import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server';

// prisma imported from lib;

export async function GET() {
  try {
    const wasteRecords = await prisma.wasteRecord.findMany({
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
      }
    });

    // Calculate waste statistics
    const stats = {
      total: wasteRecords.length,
      totalWeight: wasteRecords.reduce((sum, record) => sum + record.weight, 0),
      byType: wasteRecords.reduce((acc: any, record) => {
        acc[record.wasteType] = {
          count: (acc[record.wasteType]?.count || 0) + 1,
          weight: (acc[record.wasteType]?.weight || 0) + record.weight
        };
        return acc;
      }, {}),
      bySource: wasteRecords.reduce((acc: any, record) => {
        acc[record.source] = {
          count: (acc[record.source]?.count || 0) + 1,
          weight: (acc[record.source]?.weight || 0) + record.weight
        };
        return acc;
      }, {}),
      recent30Days: wasteRecords.filter(r => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return r.recordDate >= thirtyDaysAgo;
      }).length
    };

    return NextResponse.json({
      success: true,
      data: wasteRecords,
      stats,
      count: wasteRecords.length
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
