import { Metadata } from 'next'
import { DistributionSchoolEdit } from '../../../components'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'

export const metadata: Metadata = {
  title: 'Edit Distribution School | SPPG Dashboard',
  description: 'Update delivery information for school distribution'
}

interface PageProps {
  params: {
    id: string
  }
}

export default function DistributionSchoolEditPage({ params }: PageProps) {
  return (
    <EnhancedPermissionGuard permission="distribution_schools.edit">
      <DistributionSchoolEdit id={params.id} />
    </EnhancedPermissionGuard>
  )
}
