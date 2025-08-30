import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { hasPermission } from "@/lib/permissions"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || []
    if (!hasPermission(userRoles, 'users.view')) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || ""
    const status = searchParams.get("status") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const include = searchParams.get("include") || ""

    const skip = (page - 1) * limit

    // Build where condition
    const where: any = {
      deletedAt: null // Exclude soft deleted users
    }
    
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ]
    }

    if (role) {
      where.roles = {
        some: {
          role: {
            name: role,
          },
        },
      }
    }

    if (status) {
      switch (status) {
        case "active":
          where.isActive = true
          break
        case "inactive":
          where.isActive = false
          break
        case "verified":
          where.emailVerified = { not: null }
          break
        case "unverified":
          where.emailVerified = null
          break
      }
    }

    // Build include based on query
    const includeOptions: any = {
      roles: {
        include: {
          role: true
        }
      },
      _count: {
        select: {
          roles: true
        }
      }
    }

    if (include.includes("profile")) {
      includeOptions.profile = true
    }

    if (include.includes("posyandus")) {
      includeOptions.posyandus = {
        select: {
          id: true,
          name: true
        }
      }
    }

    // Get total count
    const totalCount = await prisma.user.count({ where })

    // Get users
    const users = await prisma.user.findMany({
      where,
      include: includeOptions,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

    // Transform users data to include status field
    const transformedUsers = users.map(user => ({
      ...user,
      status: user.isActive ? 'ACTIVE' : 'INACTIVE',
      role: (user.roles as any)[0]?.role?.name || 'VOLUNTEER' // Get first role name
    }))

    // Get stats
    const [
      totalUsers,
      activeUsers,
      verifiedUsers,
      recentSignups
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null, isActive: true } }),
      prisma.user.count({ where: { deletedAt: null, emailVerified: { not: null } } }),
      prisma.user.count({
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ])

    // Get role distribution
    const roleStats = await prisma.role.findMany({
      include: {
        users: {
          select: {
            userId: true
          }
        }
      }
    })

    const byRole = roleStats.reduce((acc: Record<string, number>, role: any) => {
      acc[role.name] = role.users.length
      return acc
    }, {})

    const stats = {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      verified: verifiedUsers,
      unverified: totalUsers - verifiedUsers,
      byRole,
      recentSignups
    }

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      limit,
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPreviousPage: page > 1,
    }

    return NextResponse.json({
      users: transformedUsers,
      pagination,
      stats
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || []
    if (!hasPermission(userRoles, 'users.create')) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await request.json()
    const { name, email, password, roles, phone, address } = body

    // Validate required fields
    if (!name || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new NextResponse("User already exists", { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        isActive: true,
        emailVerified: new Date(), // Auto-verify for admin-created users
      }
    })

    // Assign roles if provided
    if (roles && Array.isArray(roles)) {
      const roleAssignments = roles.map((roleId: string) => ({
        userId: user.id,
        roleId,
      }))

      await prisma.userRole.createMany({
        data: roleAssignments
      })
    }

    // Fetch created user with roles
    const createdUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            role: true
          }
        },
        _count: {
          select: {
            roles: true
          }
        }
      }
    })

    return NextResponse.json(createdUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
