'use client'

import { RoutePlanning } from '../components/route-planning'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'

export default function RoutesPage() {
  return (
    <EnhancedPermissionGuard permission="distribution_schools.view">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Route Planning
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Plan and optimize delivery routes for maximum efficiency
            </p>
          </div>
          <RoutePlanning />
        </div>
      </div>
    </EnhancedPermissionGuard>
  )
}
