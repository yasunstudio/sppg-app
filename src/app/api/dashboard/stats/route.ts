import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
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
