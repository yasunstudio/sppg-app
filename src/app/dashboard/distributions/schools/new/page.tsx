import { Metadata } from 'next'
import { DistributionSchoolForm } from '../../components'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'

export const metadata: Metadata = {
  title: 'Create Distribution Schools | SPPG Dashboard',
  description: 'Assign schools to distribution with planned portions and route order'
}

export default function CreateDistributionSchoolsPage() {
  return (
    <EnhancedPermissionGuard permission="distribution_schools.create">
      <DistributionSchoolForm />
    </EnhancedPermissionGuard>
  )
}
