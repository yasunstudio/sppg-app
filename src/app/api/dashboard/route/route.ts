import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDashboardRoute } from '@/lib/dashboard-routing'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user roles
    const userRoles = session.user?.roles?.map((ur: any) => ur.role.name) || []
    
    // Get appropriate dashboard route using database-driven logic
    const dashboardRoute = await getDashboardRoute(userRoles)
    
    return NextResponse.json({ 
      dashboardRoute,
      userRoles,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error getting dashboard route:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
