import { Metadata } from 'next'
import { DistributionSchoolForm } from '../../components'
import { PermissionGuard } from '@/components/guards/permission-guard'

export const metadata: Metadata = {
  title: 'Create Distribution Schools | SPPG Dashboard',
  description: 'Assign schools to distribution with planned portions and route order'
}

export default function CreateDistributionSchoolsPage() {
  return (
    <PermissionGuard permission="distributions.create">
      <DistributionSchoolForm />
    </PermissionGuard>
  )
}
