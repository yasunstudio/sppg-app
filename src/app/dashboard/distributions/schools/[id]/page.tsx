import { Metadata } from 'next'
import { DistributionSchoolDetail } from '../../components'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'

export const metadata: Metadata = {
  title: 'Distribution School Details | SPPG Dashboard',
  description: 'View and update school distribution information'
}

interface PageProps {
  params: {
    id: string
  }
}

export default function DistributionSchoolDetailPage({ params }: PageProps) {
  return (
    <EnhancedPermissionGuard permission="distribution_schools.view">
      <DistributionSchoolDetail id={params.id} />
    </EnhancedPermissionGuard>
  )
}
