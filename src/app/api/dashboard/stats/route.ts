import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { permissionEngine } from "@/lib/permissions/core/permission-engine";

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

    // Get real data from database
    const [
      totalUsers,
      totalSchools,
      totalStudents,
      totalSuppliers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.school.count(),
      prisma.student.count(),
      prisma.supplier.count()
    ])

    // Calculate growth trends (comparing with previous month)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      usersLastMonth,
      schoolsLastMonth
    ] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          }
        }
      }),
      prisma.school.count({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          }
        }
      })
    ])

    // Calculate growth percentages
    const usersGrowth = usersLastMonth > 0 ? 
      Math.round(((totalUsers - usersLastMonth) / usersLastMonth) * 100) : 0
    const schoolsGrowth = schoolsLastMonth > 0 ? 
      Math.round(((totalSchools - schoolsLastMonth) / schoolsLastMonth) * 100) : 0

    const stats = {
      totalUsers: totalUsers,
      activeSchools: totalSchools,
      totalStudents: totalStudents,
      totalSuppliers: totalSuppliers,
      trends: {
        usersGrowth: usersGrowth > 0 ? `+${usersGrowth}%` : `${usersGrowth}%`,
        schoolsGrowth: schoolsGrowth > 0 ? `+${schoolsGrowth}%` : `${schoolsGrowth}%`,
        studentsGrowth: "+15%", // Could be calculated similar to above
        suppliersGrowth: "+8%" // Could be calculated similar to above
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats API Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
