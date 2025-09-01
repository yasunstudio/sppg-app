'use client'

import { DistributionTracking } from '../components/distribution-tracking'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'

export default function TrackingPage() {
  return (
    <EnhancedPermissionGuard permission="distribution_schools.view">
      <DistributionTracking />
    </EnhancedPermissionGuard>
  )
}
