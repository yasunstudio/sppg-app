import { Metadata } from 'next'
import { DistributionSchoolEdit } from '../../../components'
import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'

export const metadata: Metadata = {
  title: 'Edit Distribution School | SPPG Dashboard',
  description: 'Update delivery information for school distribution'
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DistributionSchoolEditPage({ params }: PageProps) {
  const { id } = await params
  return (
    <EnhancedPermissionGuard permission="distribution_schools.edit">
      <DistributionSchoolEdit id={id} />
    </EnhancedPermissionGuard>
  )
}
