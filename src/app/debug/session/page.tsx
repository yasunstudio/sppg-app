'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getDashboardRouteSync } from '@/lib/dashboard-routing'

interface SessionDebugData {
  authenticated: boolean
  user?: any
  roles?: string[]
  rawRoles?: any[]
  dashboardRoute?: string
  debug?: any
  error?: string
}

export default function SessionDebugPage() {
  const { data: session, status } = useSession()
  const [debugData, setDebugData] = useState<SessionDebugData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        const response = await fetch('/api/debug/session')
        const data = await response.json()
        setDebugData(data)
      } catch (error) {
        console.error('Error fetching debug data:', error)
        setDebugData({ 
          authenticated: false, 
          error: 'Failed to fetch debug data' 
        })
      } finally {
        setLoading(false)
      }
    }

    if (status !== 'loading') {
      fetchDebugData()
    }
  }, [status])

  const getExpectedRoute = (roles: string[]) => {
    return getDashboardRouteSync(roles)
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading session debug...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Session & Dashboard Routing Debug</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NextAuth Session */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">NextAuth Session</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
              {session && (
                <>
                  <p><strong>User ID:</strong> {session.user?.id}</p>
                  <p><strong>Email:</strong> {session.user?.email}</p>
                  <p><strong>Name:</strong> {session.user?.name}</p>
                  <p><strong>Roles:</strong> {session.user?.roles?.map((r: any) => r.role.name).join(', ') || 'None'}</p>
                </>
              )}
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600">Raw Session Data</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </details>
          </div>

          {/* Server Session Debug */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Server Session Debug</h2>
            {debugData && (
              <div className="space-y-2">
                <p><strong>Authenticated:</strong> {debugData.authenticated ? 'Yes' : 'No'}</p>
                {debugData.user && (
                  <>
                    <p><strong>User Email:</strong> {debugData.user.email}</p>
                    <p><strong>Roles:</strong> {debugData.roles?.join(', ') || 'None'}</p>
                    <p><strong>Dashboard Route:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        debugData.dashboardRoute?.includes('/financial') ? 'bg-green-100 text-green-800' :
                        debugData.dashboardRoute?.includes('/admin') ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {debugData.dashboardRoute}
                      </span>
                    </p>
                  </>
                )}
                {debugData.error && (
                  <p className="text-red-600"><strong>Error:</strong> {debugData.error}</p>
                )}
              </div>
            )}
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600">Server Debug Data</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Dashboard Routing Test */}
        {debugData?.roles && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard Routing Logic Test</h2>
            <div className="space-y-4">
              <div>
                <p><strong>Current User Roles:</strong> {debugData.roles.join(', ')}</p>
                <p><strong>Expected Dashboard Route:</strong> 
                  <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                    {getExpectedRoute(debugData.roles)}
                  </span>
                </p>
                <p><strong>Server Calculated Route:</strong> 
                  <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                    {debugData.dashboardRoute}
                  </span>
                </p>
                <p><strong>Match:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    getExpectedRoute(debugData.roles) === debugData.dashboardRoute 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {getExpectedRoute(debugData.roles) === debugData.dashboardRoute ? 'YES' : 'NO'}
                  </span>
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <button 
                  onClick={() => window.location.href = debugData.dashboardRoute || '/dashboard'}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
