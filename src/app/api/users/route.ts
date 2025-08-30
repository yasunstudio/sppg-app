import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import type { ApiUser, ApiUserCreateInput } from "@/lib/types/api"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const include = searchParams.get("include") || ""

    const skip = (page - 1) * limit

    // Build where condition
    const where: any = {}
    
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

    // Build orderBy condition
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Get total count
    const totalCount = await prisma.user.count({ where })

    // Determine what to include based on query parameter
    const includeRoles = include.includes('roles')

    // Get users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        roles: includeRoles ? {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        } : {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    })

    // If include=roles, return full role data
    if (includeRoles) {
      return NextResponse.json({
        users: users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPreviousPage: page > 1,
        },
      })
    }

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roles[0]?.role.name || "USER",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    })
  } catch (error) {
    console.error("[USERS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    // Check if user has admin privileges
    const hasAdminRole = session?.user?.roles?.some((ur: any) => 
      ['SUPER_ADMIN', 'ADMIN'].includes(ur.role.name)
    )
    
    if (!session || !hasAdminRole) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { name, email, password, role } = body

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: "", // This should be hashed in production
        roles: {
          create: {
            role: {
              connect: {
                name: role,
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        },
        createdAt: true,
        updatedAt: true,
      },
    }) satisfies ApiUser

    return NextResponse.json(user)
  } catch (error) {
    console.error("[USERS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
