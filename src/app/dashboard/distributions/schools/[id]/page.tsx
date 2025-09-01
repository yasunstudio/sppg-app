import { Metadata } from 'next'
import { DistributionSchoolDetail } from '../../components'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'

export const metadata: Metadata = {
  title: 'Distribution School Details | SPPG Dashboard',
  description: 'View and update school distribution information'
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DistributionSchoolDetailPage({ params }: PageProps) {
  const { id } = await params
  return (
    <EnhancedPermissionGuard permission="distribution_schools.view">
      <DistributionSchoolDetail id={id} />
    </EnhancedPermissionGuard>
  )
}
