'use client'

import { Shield, Users, Settings, Key } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RoleStats {
  total: number
  active: number
  systemRoles: number
  customRoles: number
}

interface RoleStatsCardsProps {
  stats: RoleStats
  loading?: boolean
}

export function RoleStatsCards({ stats, loading }: RoleStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="dark:bg-gray-800/50 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded dark:bg-gray-600" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded dark:bg-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded dark:bg-gray-600" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="dark:bg-gray-800/50 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-gray-200">Total Role</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-gray-100">{stats.total}</div>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-gray-800/50 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-gray-200">Role Aktif</CardTitle>
          <div className="h-4 w-4 rounded-full bg-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-gray-100">{stats.active}</div>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-gray-800/50 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-gray-200">System Role</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-gray-100">{stats.systemRoles}</div>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-gray-800/50 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-gray-200">Custom Role</CardTitle>
          <Key className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-gray-100">{stats.customRoles}</div>
        </CardContent>
      </Card>
    </div>
  )
}
