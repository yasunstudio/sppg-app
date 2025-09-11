// ============================================================================
// PERMISSION VALIDATION API ROUTE (src/app/api/permissions/validate/route.ts)
// Enhanced with Database-Driven Permission System
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

// POST: Validate user permissions
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'system.config')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, permission, permissions } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate single permission
    if (permission) {
      const hasPermission = await permissionEngine.hasPermission(userId, permission)
      
      return NextResponse.json({
        success: true,
        data: {
          userId,
          permission,
          hasPermission
        }
      })
    }

    // Validate multiple permissions
    if (permissions && Array.isArray(permissions)) {
      const results = await Promise.all(
        permissions.map(async (perm: string) => {
          const hasPermission = await permissionEngine.hasPermission(userId, perm)
          return {
            permission: perm,
            hasPermission
          }
        })
      )

      return NextResponse.json({
        success: true,
        data: {
          userId,
          permissions: results,
          hasAllPermissions: results.every(r => r.hasPermission),
          hasAnyPermission: results.some(r => r.hasPermission)
        }
      })
    }

    return NextResponse.json(
      { error: 'Either permission or permissions array is required' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in POST /api/permissions/validate:', error)
    return NextResponse.json(
      { error: 'Failed to validate permissions' },
      { status: 500 }
    )
  }
}

// GET: Check current user permissions
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url)
    const permission = searchParams.get('permission')
    const permissions = searchParams.get('permissions')?.split(',')

    // Check single permission
    if (permission) {
      const hasPermission = await permissionEngine.hasPermission(session.user.id, permission)
      
      return NextResponse.json({
        success: true,
        data: {
          userId: session.user.id,
          permission,
          hasPermission
        }
      })
    }

    // Check multiple permissions
    if (permissions && permissions.length > 0) {
      const results = await Promise.all(
        permissions.map(async (perm: string) => {
          const hasPermission = await permissionEngine.hasPermission(session.user.id, perm)
          return {
            permission: perm.trim(),
            hasPermission
          }
        })
      )

      return NextResponse.json({
        success: true,
        data: {
          userId: session.user.id,
          permissions: results,
          hasAllPermissions: results.every(r => r.hasPermission),
          hasAnyPermission: results.some(r => r.hasPermission)
        }
      })
    }

    // Return all user permissions
    const userPermissions = await permissionEngine.getUserPermissions(session.user.id)
    
    return NextResponse.json({
      success: true,
      data: {
        userId: session.user.id,
        allPermissions: userPermissions
      }
    })

  } catch (error) {
    console.error('Error in GET /api/permissions/validate:', error)
    return NextResponse.json(
      { error: 'Failed to get permissions' },
      { status: 500 }
    )
  }
}
