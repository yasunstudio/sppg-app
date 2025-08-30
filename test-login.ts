/**
 * Test login credentials dan debug session
 */

import { signIn, getSession } from 'next-auth/react'
import { getDashboardRoute } from '@/lib/dashboard-routing'

async function testFinancialLogin() {
  console.log('🧪 Testing Financial Analyst Login')
  
  try {
    // Test login dengan financial analyst credentials
    console.log('1. Attempting login...')
    const result = await signIn('credentials', {
      email: 'finance2@sppg.com',
      password: 'password123', // Assuming default password
      redirect: false
    })
    
    console.log('2. Login result:', result)
    
    if (result?.error) {
      console.log('❌ Login failed:', result.error)
      return
    }
    
    // Get session setelah login
    console.log('3. Getting session...')
    const session = await getSession()
    console.log('4. Session data:', {
      session: session,
      user: session?.user,
      roles: session?.user?.roles
    })
    
    if (session?.user?.roles) {
      const userRoles = session.user.roles.map((ur: any) => ur.role.name)
      console.log('5. User roles:', userRoles)
      
      const dashboardRoute = getDashboardRoute(userRoles)
      console.log('6. Dashboard route:', dashboardRoute)
      
      console.log('✅ Test completed successfully')
      return dashboardRoute
    } else {
      console.log('❌ No roles found in session')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Export untuk digunakan di browser console
if (typeof window !== 'undefined') {
  (window as any).testFinancialLogin = testFinancialLogin
}

export { testFinancialLogin }
