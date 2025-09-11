import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

// GET /api/schools/stats - Get school statistics
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

    // Get basic statistics
    const [
      totalStudents,
      totalClasses,
      totalSchools,
      averageStudentsPerSchool
    ] = await Promise.all([
      // Total students
      prisma.student.count(),
      
      // Total classes  
      prisma.class.count(),
      
      // Total schools
      prisma.school.count(),
      
      // Average students per school
      prisma.school.aggregate({
        _avg: {
          totalStudents: true
        }
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalClasses, 
        totalSchools,
        averageStudentsPerSchool: Math.round(averageStudentsPerSchool._avg?.totalStudents || 0)
      }
    })
  } catch (error) {
    console.error('Error fetching school stats:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch school statistics' 
      },
      { status: 500 }
    )
  }
}
