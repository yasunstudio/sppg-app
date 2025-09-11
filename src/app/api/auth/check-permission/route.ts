// ============================================================================
// CHECK PERMISSIONS API (src/app/api/auth/check-permission/route.ts)
// Enhanced with Database-Driven Permission System
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { permissionEngine } from '@/lib/permissions/core/permission-engine'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(
      session.user.id,
      'resource:create'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      userId,
      permission, 
      permissions, 
      module, 
      checkType = 'single' // 'single', 'any', 'all', 'module'
    } = body
    
    // Use current user ID if not provided
    const targetUserId = userId || session.user.id
    
    if (!targetUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let hasAccess = false
    let details = {}

    switch (checkType) {
      case 'single':
        if (!permission) {
          return NextResponse.json(
            { error: 'Permission is required for single check' },
            { status: 400 }
          )
        }
        hasAccess = await permissionEngine.hasPermission(targetUserId, permission)
        details = { permission, hasAccess }
        break

      case 'any':
        if (!permissions || !Array.isArray(permissions)) {
          return NextResponse.json(
            { error: 'Permissions array is required for any check' },
            { status: 400 }
          )
        }
        hasAccess = await permissionEngine.hasAnyPermission(targetUserId, permissions)
        details = { permissions, hasAccess, checkType: 'any' }
        break

      case 'all':
        if (!permissions || !Array.isArray(permissions)) {
          return NextResponse.json(
            { error: 'Permissions array is required for all check' },
            { status: 400 }
          )
        }
        hasAccess = await permissionEngine.hasAllPermissions(targetUserId, permissions)
        details = { permissions, hasAccess, checkType: 'all' }
        break

      case 'module':
        if (!module) {
          return NextResponse.json(
            { error: 'Module is required for module check' },
            { status: 400 }
          )
        }
        // For module access, check common module permissions
        const modulePermissions = [`${module}.view`, `${module}.access`]
        hasAccess = await permissionEngine.hasAnyPermission(targetUserId, modulePermissions)
        details = { module, hasAccess, modulePermissions }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid check type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      hasAccess,
      userId: targetUserId,
      details
    })

  } catch (error) {
    console.error('Error in POST /api/auth/check-permission:', error)
    return NextResponse.json(
      { error: 'Failed to check permission' },
      { status: 500 }
    )
  }
}
