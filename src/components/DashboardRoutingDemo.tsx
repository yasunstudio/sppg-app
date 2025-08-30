'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getDashboardRouteSync, requireDashboardAccess } from '@/lib/dashboard-routing'
import { getUserPermissions } from '@/lib/permissions'
import { ArrowRight, Shield, Users, BarChart3 } from 'lucide-react'

const availableRoles = [
  'SUPER_ADMIN',
  'ADMIN', 
  'FINANCIAL_ANALYST',
  'CHEF',
  'QUALITY_CONTROLLER',
  'VOLUNTEER',
  'HEALTH_WORKER',
  'NUTRITIONIST'
]

export default function DashboardRoutingDemo() {
  const [selectedRole, setSelectedRole] = useState<string>('VOLUNTEER')
  const [dashboardRoute, setDashboardRoute] = useState<string>('/dashboard/basic')
  const [userPermissions, setUserPermissions] = useState<string[]>([])

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    const route = getDashboardRouteSync([role])
    setDashboardRoute(route)
    
    const permissions = getUserPermissions([role])
    setUserPermissions(permissions)
  }

  const checkAccess = (permission: string) => {
    return userPermissions.includes(permission)
  }

  const getDashboardType = (route: string) => {
    if (route.includes('/admin')) return { type: 'Admin Dashboard', color: 'bg-red-50 text-red-700', icon: Shield }
    if (route.includes('/financial')) return { type: 'Financial Dashboard', color: 'bg-green-50 text-green-700', icon: BarChart3 }
    return { type: 'Basic Dashboard', color: 'bg-blue-50 text-blue-700', icon: Users }
  }

  const dashboardInfo = getDashboardType(dashboardRoute)
  const IconComponent = dashboardInfo.icon

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Routing System Demo</h1>
        <p className="mt-2 text-gray-600">Test how different roles are routed to appropriate dashboards</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Selection</CardTitle>
          <CardDescription>
            Select a user role to see which dashboard they would be routed to
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Role
              </label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dashboard Route
              </label>
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${dashboardInfo.color}`}>
                <IconComponent className="h-5 w-5" />
                <span className="font-medium">{dashboardInfo.type}</span>
                <ArrowRight className="h-4 w-4" />
                <code className="text-sm bg-white/50 px-2 py-1 rounded">{dashboardRoute}</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permission Analysis</CardTitle>
          <CardDescription>
            Permissions and access rights for the selected role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">User Permissions ({userPermissions.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {userPermissions.map((permission) => (
                  <Badge key={permission} variant="outline" className="mr-2 mb-2">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Dashboard Access Check</h3>
              <div className="space-y-2">
                {[
                  { permission: 'users.create', label: 'User Management' },
                  { permission: 'budget.view', label: 'Budget Access' },
                  { permission: 'finance.view', label: 'Financial Data' },
                  { permission: 'analytics.view', label: 'Analytics' },
                  { permission: 'menus.view', label: 'Menu Management' },
                  { permission: 'quality.inspect', label: 'Quality Control' }
                ].map(({ permission, label }) => (
                  <div key={permission} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{label}</span>
                    <Badge variant={checkAccess(permission) ? "default" : "secondary"}>
                      {checkAccess(permission) ? 'Allowed' : 'Denied'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Example</CardTitle>
          <CardDescription>
            How to use the dashboard routing system in your components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-800 overflow-x-auto">
{`import { getDashboardRouteSync, requireDashboardAccess } from '@/lib/dashboard-routing'

// Get appropriate dashboard for user
const userRoles = ['${selectedRole}']
const dashboardRoute = getDashboardRouteSync(userRoles)
// Result: "${dashboardRoute}"

// Check specific permissions
const canManageUsers = requireDashboardAccess(['users.create'], userRoles)
// Result: ${checkAccess('users.create')}

const canViewBudget = requireDashboardAccess(['budget.view'], userRoles)  
// Result: ${checkAccess('budget.view')}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={() => window.location.href = dashboardRoute}>
          <IconComponent className="h-4 w-4 mr-2" />
          Visit {dashboardInfo.type}
        </Button>
      </div>
    </div>
  )
}
