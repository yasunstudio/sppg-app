import { Metadata } from 'next'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'
import { DistributionsOverview } from './components/distributions-overview'

export const metadata: Metadata = {
  title: 'Distribution Overview | SPPG Dashboard',
  description: 'Overview of distribution management and tracking'
}

export default function DistributionsOverviewPage() {
  return (
    <EnhancedPermissionGuard permission="distribution_schools.view">
      <div className="space-y-6">
        <DistributionsOverview />
      </div>
    </EnhancedPermissionGuard>
  )
}
