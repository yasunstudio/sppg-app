import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

import { auth } from "@/lib/auth";
import { permissionEngine } from "@/lib/permissions/core/permission-engine";
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'users:read'
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

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const isActive = searchParams.get("isActive")
    const role = searchParams.get("role")
    const search = searchParams.get("search")

    // Build where clause
    const where: any = {
      ...(isActive !== null && { isActive: isActive === "true" }),
      deletedAt: null
    }

    // Add search functionality
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    }

    // Add role filter
    if (role) {
      where.roles = {
        some: {
          role: {
            name: role
          }
        }
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          roles: {
            include: {
              role: true
            }
          },
          _count: {
            select: {
              auditLogs: true,
              notifications: true,
              orderedPurchases: true,
              receivedPurchases: true
            }
          }
        },
        orderBy: { name: "asc" },
        take: limit,
        skip: offset
      }),
      prisma.user.count({ where })
    ])

    // Calculate stats
    const allUsers = await prisma.user.findMany({
      where: { deletedAt: null },
      include: {
        roles: {
          include: {
            role: true
          }
        },
        _count: {
          select: {
            auditLogs: true,
            notifications: true,
            orderedPurchases: true,
            receivedPurchases: true
          }
        }
      }
    })

    const stats = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => u.isActive).length,
      inactiveUsers: allUsers.filter(u => !u.isActive).length,
      verifiedUsers: allUsers.filter(u => u.emailVerified).length,
      totalOrders: allUsers.reduce((sum, u) => sum + (u._count?.orderedPurchases || 0), 0),
      totalAuditLogs: allUsers.reduce((sum, u) => sum + (u._count?.auditLogs || 0), 0),
      roleBreakdown: Object.entries(
        allUsers.reduce((acc: Record<string, number>, user) => {
          user.roles.forEach(userRole => {
            const roleName = userRole.role.name
            acc[roleName] = (acc[roleName] || 0) + 1
          })
          return acc
        }, {})
      ).map(([role, count]) => ({
        role,
        count,
        percentage: parseFloat(((count / allUsers.length) * 100).toFixed(1))
      }))
    }

    return NextResponse.json({
      success: true,
      data: users,
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
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch users",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
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
      'users:create'
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

    const body = await request.json()
    
    const {
      email,
      fullName,
      password,
      phone,
      isActive = true,
      roleIds = []
    } = body

    // Validate required fields
    if (!email || !fullName || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: email, fullName, password"
        },
        { status: 400 }
      )
    }

    // Hash password (you should use bcrypt or similar)
    // For now, storing plain password - this should be hashed in production
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: fullName.trim(), // Map fullName to name in database
        password, // Should be hashed
        phone: phone || null,
        isActive
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    // Add roles if provided
    if (roleIds && roleIds.length > 0) {
      await prisma.userRole.createMany({
        data: roleIds.map((roleId: string) => ({
          userId: user.id,
          roleId: roleId
        }))
      })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: "User created successfully"
    })

  } catch (error) {
    console.error("Error creating user:", error)
    
    // Handle duplicate email/username
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Email or username already exists",
          details: "A user with this email or username is already registered"
        },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
