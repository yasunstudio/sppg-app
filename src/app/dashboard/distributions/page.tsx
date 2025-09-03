import { Metadata } from 'next'
import { PermissionGuard } from '@/components/guards/permission-guard'
import { DistributionsOverview } from './components/distributions-overview'

export const metadata: Metadata = {
  title: 'Distribution Overview | SPPG Dashboard',
  description: 'Overview of distribution management and tracking'
}

export default function DistributionsOverviewPage() {
  return (
    <PermissionGuard permission="distributions.view">
      <div className="space-y-6">
        <DistributionsOverview />
      </div>
    </PermissionGuard>
  )
}
