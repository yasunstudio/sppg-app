import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server';

// prisma imported from lib;

export async function GET() {
  try {
    const feedback = await prisma.feedback.findMany({
      include: {
        school: {
          select: {
            name: true,
            address: true
          }
        },
        student: {
          select: {
            name: true,
            grade: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate feedback statistics
    const stats = {
      total: feedback.length,
      byType: feedback.reduce((acc: any, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {}),
      byRating: feedback.reduce((acc: any, item) => {
        if (item.rating) {
          acc[item.rating] = (acc[item.rating] || 0) + 1;
        }
        return acc;
      }, {}),
      averageRating: feedback.filter(f => f.rating).reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.filter(f => f.rating).length || 0
    };

    return NextResponse.json({
      success: true,
      data: feedback,
      stats,
      count: feedback.length
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      schoolId,
      studentId,
      type,
      source,
      rating,
      message,
      status = 'OPEN'
    } = body;

    const feedback = await prisma.feedback.create({
      data: {
        schoolId,
        studentId,
        type,
        source,
        rating,
        message,
        status
      },
      include: {
        school: { select: { name: true } },
        student: { 
          select: { 
            name: true,
            grade: true
          } 
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: feedback,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
