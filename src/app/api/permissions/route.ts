// ============================================================================
// PERMISSIONS API ROUTE (src/app/api/permissions/route.ts)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getAllPermissions, getRolePermissions } from '@/lib/permissions/database-roles'
import { auth } from '@/lib/auth'

// GET: Fetch permissions
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const all = searchParams.get('all')
    
    if (all === 'true') {
      // Get all roles and build permission map for dynamic permissions
      const { prisma } = await import('@/lib/prisma')
      
      const roles = await prisma.role.findMany({
        select: {
          name: true,
          permissions: true
        }
      })

      // Build reverse mapping: permission -> roles
      const permissionMap: Record<string, string[]> = {}
      
      roles.forEach(role => {
        role.permissions.forEach(permission => {
          if (!permissionMap[permission]) {
            permissionMap[permission] = []
          }
          if (!permissionMap[permission].includes(role.name)) {
            permissionMap[permission].push(role.name)
          }
        })
      })
      
      return NextResponse.json({
        success: true,
        data: permissionMap
      })
    } else if (role) {
      // Get permissions for specific role
      const permissions = await getRolePermissions(role)
      
      return NextResponse.json({
        success: true,
        data: permissions,
        role: role
      })
    } else {
      // Get all available permissions
      const allPermissions = await getAllPermissions()
      
      return NextResponse.json({
        success: true,
        data: allPermissions,
        total: allPermissions.length
      })
    }
  } catch (error) {
    console.error('Error in GET /api/permissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    )
  }
}
