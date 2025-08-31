// ============================================================================
// PERMISSION VALIDATION API (src/app/api/permissions/validate/route.ts)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { permissionManager, validatePermissions } from '@/lib/permissions/dynamic-permissions'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only SUPER_ADMIN can validate permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || []
    if (!userRoles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate permissions
    const validation = await validatePermissions()
    const stats = await permissionManager.getStats()

    return NextResponse.json({
      validation,
      stats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Permission validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only SUPER_ADMIN can refresh permissions
    const userRoles = session.user.roles?.map(r => r.role.name) || []
    if (!userRoles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'refresh':
        await permissionManager.forceRefresh()
        return NextResponse.json({ 
          success: true, 
          message: 'Permissions refreshed successfully' 
        })

      case 'validate':
        const validation = await validatePermissions()
        return NextResponse.json({ validation })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Permission management error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
