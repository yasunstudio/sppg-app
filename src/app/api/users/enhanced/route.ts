// ============================================================================
// USERS ENHANCED API ROUTE (src/app/api/users/enhanced/route.ts)
// Enhanced with Database-Driven Permission System
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

// GET: Fetch users with enhanced data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'users.view')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('includeStats') === 'true'
    const includeRoles = searchParams.get('includeRoles') === 'true'
    const includePermissions = searchParams.get('includePermissions') === 'true'
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build where condition
    const whereCondition: any = {
      AND: []
    }

    if (search) {
      whereCondition.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    if (role) {
      whereCondition.AND.push({
        roles: {
          some: {
            role: {
              name: role
            }
          }
        }
      })
    }

    if (status) {
      whereCondition.AND.push({
        isActive: status === 'active'
      })
    }

    // Remove empty AND array if no conditions
    if (whereCondition.AND.length === 0) {
      delete whereCondition.AND
    }

    // Get total count
    const totalCount = await prisma.user.count({
      where: whereCondition
    })

    // Fetch users
    const users = await prisma.user.findMany({
      where: whereCondition,
      include: {
        roles: includeRoles ? {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                color: true,
                permissions: includePermissions
              }
            }
          }
        } : false,
        _count: includeStats ? {
          select: {
            roles: true
          }
        } : false
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Enhanced data processing
    const enhancedUsers = await Promise.all(
      users.map(async (user) => {
        const enhancedUser: any = {
          ...user,
          roles: user.roles?.map((ur: any) => ur.role) || [],
          roleCount: user._count?.roles || 0
        }

        // Get user permissions if requested
        if (includePermissions) {
          const permissions = await permissionEngine.getUserPermissions(user.id)
          enhancedUser.permissions = permissions
          enhancedUser.permissionCount = permissions.length
        }

        // Add stats if requested
        if (includeStats) {
          // Here you could add more stats like login frequency, activity metrics, etc.
          enhancedUser.stats = {
            roleCount: user._count?.roles || 0,
            lastLogin: null, // Would need to add this field to User schema
            isVerified: !!user.emailVerified,
            accountAge: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
          }
        }

        // Remove internal fields
        delete enhancedUser.userRoles
        delete enhancedUser._count

        return enhancedUser
      })
    )

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        users: enhancedUsers,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    })

  } catch (error) {
    console.error('Error in GET /api/users/enhanced:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enhanced users' },
      { status: 500 }
    )
  }
}
