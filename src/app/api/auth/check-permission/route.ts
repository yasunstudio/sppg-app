// ============================================================================
// CHECK PERMISSIONS API (src/app/api/auth/check-permission/route.ts)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { hasPermission, hasAnyPermission, hasAllPermissions, canAccessModule } from '@/lib/permissions/database-roles'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      role, 
      permission, 
      permissions, 
      module, 
      checkType = 'single' // 'single', 'any', 'all', 'module'
    } = body
    
    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
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
        hasAccess = await hasPermission(role, permission)
        details = { permission, hasAccess }
        break

      case 'any':
        if (!permissions || !Array.isArray(permissions)) {
          return NextResponse.json(
            { error: 'Permissions array is required for any check' },
            { status: 400 }
          )
        }
        hasAccess = await hasAnyPermission(role, permissions)
        details = { permissions, hasAccess, checkType: 'any' }
        break

      case 'all':
        if (!permissions || !Array.isArray(permissions)) {
          return NextResponse.json(
            { error: 'Permissions array is required for all check' },
            { status: 400 }
          )
        }
        hasAccess = await hasAllPermissions(role, permissions)
        details = { permissions, hasAccess, checkType: 'all' }
        break

      case 'module':
        if (!module) {
          return NextResponse.json(
            { error: 'Module is required for module check' },
            { status: 400 }
          )
        }
        hasAccess = await canAccessModule(role, module)
        details = { module, hasAccess }
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
      role,
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
