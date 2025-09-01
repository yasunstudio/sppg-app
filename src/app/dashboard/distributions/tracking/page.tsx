'use client'

import { DistributionTracking } from '../components/distribution-tracking'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'

export default function TrackingPage() {
  return (
    <EnhancedPermissionGuard permission="distribution_schools.view">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Distribution Tracking
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor real-time delivery progress and status
            </p>
          </div>
          <DistributionTracking />
        </div>
      </div>
    </EnhancedPermissionGuard>
  )
}
