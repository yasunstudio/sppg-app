import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const roleId = searchParams.get("roleId")
    const userId = searchParams.get("userId")

    // Build where clause
    const where: any = {
      ...(roleId && { roleId }),
      ...(userId && { userId })
    }

    const [userRoles, total] = await Promise.all([
      prisma.userRole.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          role: {
            select: {
              id: true,
              name: true,
              description: true,
              permissions: true
            }
          }
        },
        orderBy: { assignedAt: "desc" },
        take: limit,
        skip: offset
      }),
      prisma.userRole.count({ where })
    ])

    // Calculate stats
    const allUserRoles = await prisma.userRole.findMany({
      include: {
        user: true,
        role: true
      }
    })

    const stats = {
      total: allUserRoles.length,
      active: allUserRoles.length, // All user roles are considered active in this schema
      inactive: 0,
      rolesCount: new Set(allUserRoles.map(ur => ur.roleId)).size,
      usersCount: new Set(allUserRoles.map(ur => ur.userId)).size,
      recent30Days: allUserRoles.filter(ur => {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return new Date(ur.assignedAt) >= thirtyDaysAgo
      }).length,
      roleBreakdown: Object.entries(
        allUserRoles.reduce((acc: Record<string, number>, userRole) => {
          const roleName = userRole.role?.name || 'Unknown'
          acc[roleName] = (acc[roleName] || 0) + 1
          return acc
        }, {})
      ).map(([role, count]) => ({
        role,
        count,
        percentage: parseFloat(((count / allUserRoles.length) * 100).toFixed(1))
      }))
    }

    return NextResponse.json({
      success: true,
      data: userRoles,
      stats,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        hasMore: offset + limit < total,
        itemsPerPage: limit
      }
    })

  } catch (error) {
    console.error("Error fetching user roles:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch user roles",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      userId,
      roleId
    } = body

    // Validate required fields
    if (!userId || !roleId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: userId, roleId"
        },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: "User not found"
        },
        { status: 404 }
      )
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    })

    if (!role) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Role not found"
        },
        { status: 404 }
      )
    }

    // Check if user already has this role
    const existingUserRole = await prisma.userRole.findFirst({
      where: {
        userId,
        roleId
      }
    })

    if (existingUserRole) {
      return NextResponse.json(
        { 
          success: false, 
          error: "User already has this role assigned"
        },
        { status: 409 }
      )
    }

    const userRole = await prisma.userRole.create({
      data: {
        userId,
        roleId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: userRole,
      message: "User role assigned successfully"
    })

  } catch (error) {
    console.error("Error creating user role:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to assign user role",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
