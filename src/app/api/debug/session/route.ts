/**
 * Test API endpoint to check session and dashboard routing
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDashboardRoute } from '@/lib/dashboard-routing'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ 
        authenticated: false, 
        message: 'No session found' 
      })
    }
    
    const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []
    const dashboardRoute = getDashboardRoute(userRoles)
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      roles: userRoles,
      rawRoles: session.user.roles,
      dashboardRoute: dashboardRoute,
      debug: {
        sessionExists: !!session,
        userExists: !!session.user,
        rolesExists: !!session.user.roles,
        rolesLength: session.user.roles?.length || 0,
        rolesStructure: session.user.roles
      }
    })
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to get session', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
