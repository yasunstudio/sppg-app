/**
 * Simple test page to verify dashboard routing without login complexity
 */

'use client'

import { useState } from 'react'
import { getDashboardRouteSync } from '@/lib/dashboard-routing'

export default function SimpleRoutingTest() {
  const [testResult, setTestResult] = useState<string>('')

  const testRoles = [
    { name: 'FINANCIAL_ANALYST', expected: '/dashboard/financial' },
    { name: 'SUPER_ADMIN', expected: '/dashboard/admin' },
    { name: 'ADMIN', expected: '/dashboard/admin' },
    { name: 'CHEF', expected: '/dashboard/basic' },
    { name: 'VOLUNTEER', expected: '/dashboard/basic' },
  ]

  const runTest = () => {
    const results: string[] = []
    
    testRoles.forEach((test) => {
      const actualRoute = getDashboardRouteSync([test.name])
      const passed = actualRoute === test.expected
      results.push(`${test.name}: ${actualRoute} ${passed ? '✅' : '❌ Expected: ' + test.expected}`)
    })
    
    setTestResult(results.join('\n'))
  }

  const testSpecificRole = (roleName: string) => {
    const route = getDashboardRouteSync([roleName])
    setTestResult(`Role ${roleName} → ${route}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Routing Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Test</h2>
          <button 
            onClick={runTest}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Run All Tests
          </button>
          
          {testResult && (
            <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-line">
              {testResult}
            </pre>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Individual Role Tests</h2>
          <div className="grid grid-cols-2 gap-4">
            {testRoles.map((test) => (
              <button
                key={test.name}
                onClick={() => testSpecificRole(test.name)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
              >
                Test {test.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Expected Routes</h2>
          <ul className="space-y-2 text-sm">
            <li><strong>FINANCIAL_ANALYST:</strong> /dashboard/financial</li>
            <li><strong>SUPER_ADMIN/ADMIN:</strong> /dashboard/admin</li>
            <li><strong>Others:</strong> /dashboard/basic</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
