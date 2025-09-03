import { Metadata } from 'next'
import { DistributionSchoolDetail } from '../../components'
import { PermissionGuard } from '@/components/guards/permission-guard'

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
    <PermissionGuard permission="distributions.view">
      <DistributionSchoolDetail id={id} />
    </PermissionGuard>
  )
}
