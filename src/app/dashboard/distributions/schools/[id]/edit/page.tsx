import { Metadata } from 'next'
import { DistributionSchoolEdit } from '../../../components'
import { PermissionGuard } from '@/components/guards/permission-guard'

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
    <PermissionGuard permission="distributions.edit">
      <DistributionSchoolEdit id={id} />
    </PermissionGuard>
  )
}
